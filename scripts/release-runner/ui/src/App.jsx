import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertBanner,
  Button,
  ConfirmPublishDialog,
  EmptyState,
  LogPanel,
  MetaPill,
  PhaseGroup,
  PhaseProgress,
  PublishBoundary,
  StartReleaseDialog,
  StatusBadge,
  StepRow,
} from './components.jsx';

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

function isFinished(step) {
  return step.status === 'done' || step.status === 'skipped';
}

/** Show step note only when it is not already present in the live log. */
function distinctStepNote(note, logLines, isCurrent) {
  if (!note?.trim()) {
    return null;
  }
  const text = note.trim();
  if (!isCurrent || !logLines?.length) {
    return text;
  }
  const blob = logLines.join('\n');
  if (blob.includes(text)) {
    return null;
  }
  for (const line of logLines) {
    const trimmed = line.trim();
    if (trimmed === text || trimmed === `Error: ${text}` || trimmed.endsWith(text)) {
      return null;
    }
  }
  return text;
}

function groupByPhase(steps, currentStepId) {
  const groups = [];
  let current = null;
  for (const step of steps || []) {
    const phase = step.phase || 'Steps';
    if (!current || current.name !== phase) {
      current = { name: phase, steps: [] };
      groups.push(current);
    }
    current.steps.push(step);
  }
  return groups.map((g, i) => ({
    key: `${i}-${g.name}`,
    ...g,
    total: g.steps.length,
    done: g.steps.filter(isFinished).length,
    current: g.steps.some((s) => s.id === currentStepId),
  }));
}

/** CLI form of the current step's action, shown under the panel. */
function cliHint(step) {
  if (step.type === 'confirm') {
    return `run --confirm ${step.id}`;
  }
  if (step.type === 'manual') {
    return `complete ${step.id}`;
  }
  return `run --until ${step.id}`;
}

export default function App() {
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState(null);

  const refresh = useCallback(async () => {
    const data = await apiGet('/api/status');
    setStatus(data);
  }, []);

  useEffect(() => {
    refresh();
    // Poll faster while a command runs so `running` moves from step to step.
    const id = setInterval(refresh, busy ? 1000 : 4000);
    return () => clearInterval(id);
  }, [refresh, busy]);

  useEffect(() => {
    const es = new EventSource('/api/events');
    es.onmessage = (ev) => {
      try {
        const { line } = JSON.parse(ev.data);
        setLog((prev) => [...prev, line.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '').replace(/\n$/, '')]);
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, []);

  const release = status?.release;
  const steps = status?.steps || [];
  const currentStepId = status?.currentStepId;
  const groups = useMemo(() => groupByPhase(steps, currentStepId), [steps, currentStepId]);
  const currentStep = steps.find((s) => s.id === currentStepId);
  const version = status?.effectiveVersion || release?.version;
  const firstPublishId = steps.find((s) => s.publish)?.id;

  useEffect(() => {
    if (currentStepId) {
      setExpandedStepId(currentStepId);
    }
  }, [currentStepId]);

  const runAction = async (sub, args = [], body = {}) => {
    if (sub === 'run') {
      setLog([]);
    }
    setBusy(true);
    try {
      await apiPost(`/api/${sub}`, { args, ...body });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const stepActions = (step) => {
    if (!step || step.id !== currentStepId) {
      return null;
    }
    if (step.status === 'running') {
      return (
        <Button variant="primary" size="sm" icon="spinner" disabled>
          Running…
        </Button>
      );
    }
    if (step.type === 'auto') {
      return (
        <Button variant="primary" size="sm" icon="play" disabled={busy} onClick={() => runAction('run', [])}>
          {step.status === 'failed' ? 'Run again' : 'Run'}
        </Button>
      );
    }
    if (step.type === 'confirm' && step.publish) {
      return (
        <Button variant="publish" size="sm" icon="lock" disabled={busy} onClick={() => setConfirmOpen(true)}>
          Publish…
        </Button>
      );
    }
    if (step.type === 'confirm') {
      return (
        <Button
          variant="primary"
          size="sm"
          icon="check"
          disabled={busy}
          onClick={() => runAction('run', ['--confirm', step.id])}
        >
          Confirm
        </Button>
      );
    }
    return (
      <>
        <Button variant="primary" size="sm" icon="check" disabled={busy} onClick={() => runAction('complete', [step.id])}>
          Done
        </Button>
        {step.id !== 'github_auth' && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => runAction('skip', [step.id])}>
            Skip
          </Button>
        )}
      </>
    );
  };

  const detectedEdition = status?.detectedEdition ?? 'free';
  const isRunning = steps.some((s) => s.status === 'running');

  return (
    <div className="rr-screen">
      <header className="rr-header">
        <div className="rr-header__top">
          <div>
            <h1 className="rr-header__title">Release Runner</h1>
            <p className="rr-header__sub">Local release checklist for this plugin clone</p>
          </div>
          {release && (
            <div className="rr-header__pills">
              <MetaPill label="Version" value={version} tone="accent" mono />
              <MetaPill label="Edition" value={release.edition} />
              {release.urgency === 'security' && <MetaPill label="Urgency" value="security" tone="alert" />}
              <MetaPill label="Branch" value={release.branchName} mono />
              {release.prerelease?.channel && (
                <MetaPill label="Package" value={`${release.prerelease.channel}.${release.prerelease.n}`} mono />
              )}
              {status.ghAccount && <MetaPill label="GitHub" value={status.ghAccount} />}
            </div>
          )}
        </div>

        {release && steps.length > 0 && <PhaseProgress phases={groups} />}

        {release?.urgency === 'security' && (
          <AlertBanner tone="security" title="Security release">
            Keep essential checks. Translations may be skipped; do not disclose vulnerability details until it is
            published.
          </AlertBanner>
        )}

        {release && (
          <div className="rr-header__bar">
            <div className="rr-header__next">
              {currentStep ? (
                <>
                  <StatusBadge status={currentStep.status} />
                  <span>
                    Next: <strong>{currentStep.label}</strong>
                  </span>
                </>
              ) : (
                <span>All steps complete.</span>
              )}
            </div>
            <div className="rr-row">
              <Button variant="ghost" size="sm" disabled={busy} onClick={() => runAction('reset', [], { yes: true })}>
                Reset state
              </Button>
            </div>
          </div>
        )}
      </header>

      {status && !release && (
        <EmptyState
          action={
            <Button variant="primary" onClick={() => setStartOpen(true)}>
              Start release
            </Button>
          }
          hint={
            <>
              Or from the terminal: <span className="rr-code">composer deploy -- start 4.11.0</span>
            </>
          }
        >
          Start a versioned release for this working copy. Edition is read from{' '}
          <span className="rr-code">composer.json</span> ({detectedEdition}).
        </EmptyState>
      )}

      {release && (
        <div className="rr-steps">
          {groups.map((group) => (
            <PhaseGroup key={group.key} name={group.name} done={group.done} total={group.total}>
              {group.steps.map((step) => {
                const isCurrent = step.id === currentStepId;
                const hasLogOutput = isCurrent && log.length > 0;
                return (
                  <React.Fragment key={step.id}>
                    {step.id === firstPublishId && <PublishBoundary />}
                    <StepRow
                      label={step.label}
                      type={step.type}
                      status={step.status}
                      guide={step.instructions || step.message}
                      note={hasLogOutput ? null : distinctStepNote(step.note, log, isCurrent)}
                      hasLogOutput={hasLogOutput}
                      current={isCurrent}
                      open={expandedStepId === step.id}
                      onOpenChange={(next) => setExpandedStepId(next ? step.id : null)}
                      actions={stepActions(step)}
                      busy={busy}
                      cli={isCurrent ? cliHint(step) : null}
                      onReopen={isCurrent ? () => runAction('reopen', [step.id]) : null}
                      log={isCurrent ? <LogPanel lines={log} live={isRunning} /> : null}
                    />
                  </React.Fragment>
                );
              })}
            </PhaseGroup>
          ))}
        </div>
      )}

      <StartReleaseDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        edition={detectedEdition}
        busy={busy}
        onStart={async ({ version: v, urgency, channel }) => {
          const args = [v, '--urgency', urgency];
          if (channel !== 'none') {
            args.push('--channel', channel);
          }
          await runAction('start', args);
          setStartOpen(false);
        }}
      />

      <ConfirmPublishDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        step={currentStep}
        version={version}
        busy={busy}
        onConfirm={async () => {
          setConfirmOpen(false);
          await runAction('run', ['--confirm', currentStep.id]);
        }}
      />
    </div>
  );
}
