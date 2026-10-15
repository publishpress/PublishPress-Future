import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

async function apiGet(path) {
  const res = await fetch(path);
  return res.json();
}

async function apiPost(path, body = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

function groupByPhase(steps) {
  const groups = [];
  let current = null;
  for (const step of steps || []) {
    const phase = step.phase || 'Steps';
    if (!current || current.phase !== phase) {
      current = { phase, steps: [] };
      groups.push(current);
    }
    current.steps.push(step);
  }
  return groups;
}

function stepProgress(steps) {
  if (!steps.length) {
    return { done: 0, total: 0, pct: 0 };
  }
  const done = steps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
  return { done, total: steps.length, pct: Math.round((done / steps.length) * 100) };
}

/**
 * @param {string} status
 * @param {boolean} isCurrent
 */
function ChecklistMarker({ status, isCurrent }) {
  const key = (status || 'pending').toLowerCase();
  if (key === 'done') {
    return <span className="checklist-marker checklist-marker--done" aria-hidden="true">✓</span>;
  }
  if (key === 'skipped') {
    return <span className="checklist-marker checklist-marker--skipped" aria-hidden="true">–</span>;
  }
  if (key === 'failed') {
    return <span className="checklist-marker checklist-marker--failed" aria-hidden="true">!</span>;
  }
  if (isCurrent) {
    return <span className="checklist-marker checklist-marker--current" aria-hidden="true" />;
  }
  return <span className="checklist-marker checklist-marker--pending" aria-hidden="true" />;
}

export default function App() {
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState('');
  const [busy, setBusy] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [startVersion, setStartVersion] = useState('');
  const [selectedStepId, setSelectedStepId] = useState(null);
  const pipelineBusyRef = useRef(false);

  const refresh = useCallback(async () => {
    const data = await apiGet('/api/status');
    setStatus(data);
  }, []);

  const syncDeployLog = useCallback(async () => {
    const data = await apiGet('/api/log');
    if (data.log) {
      setLog(data.log);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const es = new EventSource('/api/events');
    es.onmessage = (ev) => {
      try {
        const { line } = JSON.parse(ev.data);
        setLog((prev) => prev + line);
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, []);

  const release = status?.release;
  const steps = status?.steps || [];
  const currentStepId = status?.currentStepId;
  const groups = useMemo(() => groupByPhase(steps), [steps]);
  const progress = useMemo(() => stepProgress(steps), [steps]);
  const currentStep = steps.find((s) => s.id === currentStepId);
  const detailStepId = selectedStepId ?? currentStepId;
  const detailStep = steps.find((s) => s.id === detailStepId);
  const isViewingActiveStep = detailStep && currentStepId && detailStep.id === currentStepId;

  useEffect(() => {
    if (currentStepId) {
      setSelectedStepId(currentStepId);
    }
  }, [currentStepId]);

  useEffect(() => {
    if (release && !busy) {
      syncDeployLog();
    }
  }, [release, currentStepId, busy, syncDeployLog]);

  const runPipeline = useCallback(
    async (args = []) => {
      if (pipelineBusyRef.current) {
        return;
      }
      pipelineBusyRef.current = true;
      setLog('');
      setBusy(true);
      try {
        await apiPost('/api/run', { args });
        await refresh();
        await syncDeployLog();
      } finally {
        setBusy(false);
        pipelineBusyRef.current = false;
      }
    },
    [refresh, syncDeployLog]
  );

  const runAction = async (sub, args = [], body = {}) => {
    const clearsLog = ['start', 'complete', 'skip', 'reopen', 'run'].includes(sub);
    if (clearsLog) {
      setLog('');
    }
    setBusy(true);
    try {
      const res = await apiPost(`/api/${sub}`, { args, ...body });
      if (res.error) {
        setLog((prev) => (prev ? `${prev}\n${res.error}\n` : `${res.error}\n`));
      }
      await refresh();
      await syncDeployLog();
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!release || busy || pipelineBusyRef.current) {
      return;
    }
    const step = steps.find((s) => s.id === currentStepId);
    if (!step || step.type !== 'auto' || step.status !== 'pending') {
      return;
    }
    runPipeline([]);
  }, [release, currentStepId, busy, steps, runPipeline]);

  const activeStepActions = () => {
    if (!release || !currentStep || !isViewingActiveStep) {
      return null;
    }
    if (currentStep.type === 'auto') {
      if (currentStep.status === 'failed') {
        return (
          <button type="button" className="btn btn--primary" disabled={busy} onClick={() => runPipeline([])}>
            Retry step
          </button>
        );
      }
      if (busy) {
        return <p className="detail-panel__running">Running automated steps…</p>;
      }
      return <p className="detail-panel__running">Starting automated steps…</p>;
    }
    if (currentStep.type === 'confirm') {
      return (
        <button
          type="button"
          className="btn btn--primary"
          disabled={busy}
          onClick={() => runAction('run', ['--confirm', currentStep.id])}
        >
          Confirm and continue
        </button>
      );
    }
    return (
      <div className="btn-group">
        <button
          type="button"
          className="btn btn--primary"
          disabled={busy}
          onClick={() => runAction('complete', [currentStep.id])}
        >
          Mark done
        </button>
        {currentStep.id !== 'github_auth' && (
          <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => runAction('skip', [currentStep.id])}>
            Skip
          </button>
        )}
      </div>
    );
  };

  const detectedEdition = status?.detectedEdition ?? 'free';

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__top">
          <div className="site-header__brand">
            <h1 className="site-header__title">Release Runner</h1>
            <p className="site-header__subtitle">Local release checklist for this plugin clone</p>
          </div>
          {release && (
            <div className="meta-pills">
              <span className="meta-pill meta-pill--accent">
                <span className="meta-pill__label">Version</span>
                v{status.effectiveVersion || release.version}
              </span>
              <span className="meta-pill">
                <span className="meta-pill__label">Edition</span>
                {release.edition}
              </span>
              {release.urgency !== 'standard' && (
                <span className="meta-pill">
                  <span className="meta-pill__label">Urgency</span>
                  {release.urgency}
                </span>
              )}
              <span className="meta-pill">
                <span className="meta-pill__label">Branch</span>
                {release.branchName}
              </span>
              {release.prerelease?.channel && (
                <span className="meta-pill">
                  <span className="meta-pill__label">Prerelease</span>
                  {release.prerelease.channel}.{release.prerelease.n}
                </span>
              )}
              {status.ghAccount && (
                <span className="meta-pill">
                  <span className="meta-pill__label">GitHub</span>
                  {status.ghAccount}
                </span>
              )}
            </div>
          )}
        </div>

        {release && progress.total > 0 && (
          <div className="progress-block">
            <div className="progress-block__row">
              <span className="progress-block__label">Progress</span>
              <span className="progress-block__value">
                {progress.done} / {progress.total} steps
              </span>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={progress.pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar__fill" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>
        )}

        {release?.urgency === 'security' && (
          <div className="alert-banner alert-banner--security" role="alert">
            <div className="alert-banner__title">Security release</div>
            Prioritize essential checks; skip only when you accept the risk.
          </div>
        )}

        <div className="header-toolbar">
          {!release && (
            <button type="button" className="btn btn--primary" onClick={() => setStartOpen(true)}>
              Start release
            </button>
          )}
          {release && (
            <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => runAction('reset', [], { yes: true })}>
              Reset state
            </button>
          )}
        </div>
      </header>

      {!release && (
        <section className="empty-state">
          <h2 className="empty-state__title">No release in progress</h2>
          <p className="empty-state__copy">
            Start a versioned release for this working copy. Edition is read from <code>composer.json</code> ({detectedEdition}).
          </p>
          <button type="button" className="btn btn--primary" onClick={() => setStartOpen(true)}>
            Start release
          </button>
          <p className="empty-state__hint">
            Or from the terminal: <code>composer deploy -- start 4.11.0</code>
          </p>
        </section>
      )}

      {release && (
        <div className="release-layout">
          <nav className="step-sidebar" aria-label="Release steps">
            {groups.map((group) => (
              <section key={group.phase} className="phase-block">
                <h2 className="phase-block__title">{group.phase}</h2>
                <ul className="step-checklist">
                  {group.steps.map((step) => {
                    const isCurrent = step.id === currentStepId;
                    const isSelected = step.id === detailStepId;
                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          className={`checklist-item${isSelected ? ' checklist-item--selected' : ''}${isCurrent ? ' checklist-item--current' : ''}`}
                          onClick={() => setSelectedStepId(step.id)}
                        >
                          <ChecklistMarker status={step.status} isCurrent={isCurrent && step.status === 'pending'} />
                          <span className="checklist-item__label">{step.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>

          <aside className="detail-panel">
            {detailStep ? (
              <>
                <p className="detail-panel__eyebrow">
                  {isViewingActiveStep ? 'Current step' : 'Step detail'}
                  {!isViewingActiveStep && currentStep && (
                    <button type="button" className="link-btn detail-panel__jump" onClick={() => setSelectedStepId(currentStepId)}>
                      Go to current
                    </button>
                  )}
                </p>
                <h2 className="detail-panel__title">{detailStep.label}</h2>
                <p className="detail-panel__status">
                  Status: <strong>{detailStep.status}</strong>
                </p>
                {detailStep.status === 'failed' && detailStep.note && (
                  <pre className="detail-panel__message detail-panel__message--error">{detailStep.note}</pre>
                )}
                {detailStep.instructions && (
                  <pre className="detail-panel__instructions">{detailStep.instructions}</pre>
                )}
                {detailStep.message && <pre className="detail-panel__message">{detailStep.message}</pre>}
                {isViewingActiveStep && <div className="detail-panel__actions">{activeStepActions()}</div>}
                {isViewingActiveStep && (
                  <p className="detail-panel__reopen">
                    <button
                      type="button"
                      className="link-btn"
                      disabled={busy}
                      onClick={() => runAction('reopen', [currentStep.id])}
                    >
                      Reopen from here
                    </button>
                  </p>
                )}
                {isViewingActiveStep ? (
                  <>
                    <p className="detail-panel__log-label">Output</p>
                    <div className={`log-panel${log ? '' : ' log-panel--placeholder'}`}>
                      {log || 'Waiting for log output…'}
                    </div>
                  </>
                ) : (
                  <p className="detail-panel__log-hint">Live output is shown on the current step.</p>
                )}
              </>
            ) : (
              <p className="detail-panel__empty">All steps complete.</p>
            )}
          </aside>
        </div>
      )}

      <Dialog.Root open={startOpen} onOpenChange={setStartOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Start release</Dialog.Title>
            <Dialog.Description className="dialog-description">
              Creates local runner state only — no git changes until you run steps.
            </Dialog.Description>
            <div className="dialog-form">
              <label className="form-field">
                <span className="form-field__label">Version</span>
                <input
                  className="form-field__input"
                  value={startVersion}
                  onChange={(e) => setStartVersion(e.target.value)}
                  placeholder="4.11.0"
                  autoComplete="off"
                />
              </label>
              <p className="form-field__static">
                Edition: <strong>{detectedEdition}</strong> (from composer.json)
              </p>
            </div>
            <div className="btn-group btn-group--end">
              <Dialog.Close asChild>
                <button type="button" className="btn btn--ghost">Cancel</button>
              </Dialog.Close>
              <button
                type="button"
                className="btn btn--primary"
                disabled={!startVersion.trim() || busy}
                onClick={async () => {
                  await runAction('start', [startVersion.trim()]);
                  setStartOpen(false);
                  setStartVersion('');
                }}
              >
                Start
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
