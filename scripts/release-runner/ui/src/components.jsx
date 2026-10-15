import React, { useEffect, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';

/* Components from the Release Runner design system; class names match its bundle.css. */

function cx(...names) {
  return names.filter(Boolean).join(' ');
}

const PATHS = {
  check: 'M3.5 8.5l3 3 6-7',
  x: 'M4 4l8 8M12 4l-8 8',
  skip: 'M3 8h8M8 5l3 3-3 3M13 4v8',
  hand: 'M5.5 8V3.5a1 1 0 0 1 2 0V7m0-3.5v-.5a1 1 0 0 1 2 0V7m0-3a1 1 0 0 1 2 0v3.5m0-2a1 1 0 0 1 2 0V10a4.5 4.5 0 0 1-4.5 4.5h-.5a4 4 0 0 1-3.2-1.6L3 10.2a1 1 0 0 1 1.5-1.3l1 1',
  lock: 'M4 7.5h8v6H4zM5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5',
  terminal: 'M3 4.5l3.5 3.5L3 11.5M8 12h5',
  play: 'M5 3.5v9l7-4.5z',
  chevron: 'M6 4l4 4-4 4',
  alert: 'M8 2.5l6 11H2zM8 7v3M8 12h.01',
  shield: 'M8 2l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6V4z',
  reopen: 'M3 8a5 5 0 1 0 1.5-3.5M3 2.5V5h2.5',
  sun: 'M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1',
  moon: 'M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z',
  stop: 'M5.5 5.5h5v5h-5z',
};

export function Icon({ name, className }) {
  const cls = cx('rr-icon', name === 'spinner' && 'rr-spin', className);
  if (name === 'spinner') {
    return (
      <svg className={cls} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 2a6 6 0 1 0 6 6" />
      </svg>
    );
  }
  if (name === 'dot') {
    return (
      <svg className={cls} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 16 16" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const Button = React.forwardRef(function Button(
  { variant = 'secondary', size, icon, className, children, ...rest },
  ref
) {
  if (variant === 'link') {
    return (
      <button ref={ref} type="button" {...rest} className={cx('rr-link', className)}>
        {children}
      </button>
    );
  }
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={cx('rr-btn', `rr-btn--${variant}`, size === 'sm' && 'rr-btn--sm', className)}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
});

const STATUS = {
  pending: { label: 'Pending', icon: 'dot' },
  running: { label: 'Running', icon: 'spinner' },
  waiting: { label: 'Needs you', icon: 'hand' },
  done: { label: 'Done', icon: 'check' },
  skipped: { label: 'Skipped', icon: 'skip' },
  failed: { label: 'Failed', icon: 'x' },
};

function statusKey(status) {
  return STATUS[status] ? status : 'pending';
}

export function StatusBadge({ status }) {
  const key = statusKey(status);
  return (
    <span className={`rr-badge rr-badge--${key}`}>
      <Icon name={STATUS[key].icon} />
      {STATUS[key].label}
    </span>
  );
}

const TYPES = {
  auto: { label: 'Auto', icon: 'terminal', title: 'Runs on its own' },
  manual: { label: 'Manual', icon: 'hand', title: 'You do this, then mark it done' },
  confirm: { label: 'Confirm', icon: 'lock', title: 'Needs your explicit confirm' },
};

export function StepTypeTag({ type }) {
  const t = TYPES[type] || TYPES.auto;
  return (
    <span className={`rr-type rr-type--${type || 'auto'}`} title={t.title}>
      <Icon name={t.icon} />
      {t.label}
    </span>
  );
}

export function EditionBadge({ product }) {
  if (product !== 'free' && product !== 'pro') {
    return null;
  }
  return (
    <span className={cx('rr-edition-badge', `rr-edition-badge--${product}`)} aria-label={`${product} plugin`}>
      {product}
    </span>
  );
}

export function MetaPill({ label, value, tone, mono, product }) {
  return (
    <span className={cx('rr-pill', tone && `rr-pill--${tone}`)}>
      <span className="rr-pill__label">{label}</span>
      {product && <EditionBadge product={product} />}
      <span className={cx('rr-pill__value', mono && 'rr-pill__value--mono')}>{value}</span>
    </span>
  );
}

export function PhaseProgress({ phases }) {
  let done = 0;
  let total = 0;
  for (const p of phases) {
    done += p.done;
    total += p.total;
  }
  const current = phases.find((p) => p.current);
  return (
    <div className="rr-progress">
      <div className="rr-progress__row">
        <span className="rr-eyebrow">Progress</span>
        <span className="rr-progress__value">
          {done} / {total} steps
        </span>
      </div>
      <div className="rr-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
        {phases.map((p) => (
          <div
            key={p.key || p.name}
            title={`${p.name}: ${p.done}/${p.total}`}
            className={cx('rr-progress__seg', p.current && 'rr-progress__seg--current')}
            style={{ flexGrow: p.total }}
          >
            <div className="rr-progress__fill" style={{ width: `${p.total ? Math.round((p.done / p.total) * 100) : 0}%` }} />
          </div>
        ))}
      </div>
      {current && (
        <p className="rr-progress__legend">
          Now in <strong>{current.name}</strong>
        </p>
      )}
    </div>
  );
}

const ALERT_ICON = { security: 'shield', failed: 'x', waiting: 'hand' };

export function AlertBanner({ tone = 'security', title, children }) {
  return (
    <div className={`rr-alert rr-alert--${tone}`} role={tone === 'failed' ? 'alert' : 'status'}>
      <Icon name={ALERT_ICON[tone] || 'alert'} />
      <div>
        {title && <span className="rr-alert__title">{title}</span>}
        {children}
      </div>
    </div>
  );
}

export function PhaseGroup({ name, done, total, children }) {
  return (
    <section className="rr-phase">
      <div className="rr-phase__head">
        <h2 className="rr-eyebrow">{name}</h2>
        {total != null && (
          <span className="rr-phase__count">
            {done || 0} / {total}
          </span>
        )}
      </div>
      <ul className="rr-phase__list">{children}</ul>
    </section>
  );
}

export function StepRow({
  label,
  type,
  status,
  current,
  note,
  guide,
  open,
  onOpenChange,
  actions,
  log,
  onReopen,
  cli,
  busy,
  hasLogOutput,
}) {
  const key = statusKey(status);
  const hasBody = Boolean(guide || (!hasLogOutput && note) || log || (current && onReopen));
  const showBadge = current || key === 'failed' || key === 'waiting' || key === 'running';
  const canExpand = hasBody || (current && onReopen);
  return (
    <li>
      <Collapsible.Root
        open={canExpand && open}
        onOpenChange={onOpenChange}
        className={cx('rr-step', `rr-step--${key}`, current && 'rr-step--current')}
      >
        <div className="rr-step__row">
          <Collapsible.Trigger asChild disabled={!canExpand}>
            <button
              type="button"
              className="rr-step__trigger"
              aria-current={current ? 'step' : undefined}
              aria-expanded={canExpand ? open : undefined}
            >
              <span className={`rr-step__dot rr-badge--${key}`}>
                <Icon name={STATUS[key].icon} />
              </span>
              <span className="rr-step__label">{label}</span>
              <span className="rr-step__meta">
                <StepTypeTag type={type} />
                {showBadge ? <StatusBadge status={key} /> : <span className="rr-sr">{STATUS[key].label}</span>}
              </span>
            </button>
          </Collapsible.Trigger>
          {current && actions && <div className="rr-step__actions">{actions}</div>}
          {canExpand && (
            // Pointer shortcut for the same toggle; the labelled trigger above is the accessible control.
            <Collapsible.Trigger asChild>
              <button type="button" className="rr-step__toggle" tabIndex={-1} aria-hidden="true">
                <Icon name="chevron" className="rr-step__chev" />
              </button>
            </Collapsible.Trigger>
          )}
        </div>
        <Collapsible.Content className="rr-step__body">
          {guide && <p className="rr-step__guide">{guide}</p>}
          {!hasLogOutput && note && (
            <div className={cx('rr-step__note', key === 'done' && 'rr-step__note--result')}>
              {key === 'failed' ? 'Note: ' : ''}
              {note}
            </div>
          )}
          {log}
          {current && onReopen && (
            <div className="rr-step__foot">
              <Button variant="link" disabled={busy} onClick={onReopen}>
                Reopen from here
              </Button>
              {cli && <span className="rr-step__time">{cli}</span>}
            </div>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  );
}

export function PublishBoundary() {
  return (
    <li role="presentation">
      <div className="rr-boundary" role="separator">
        <span className="rr-boundary__label">
          <Icon name="lock" />
          Publish boundary
          <span className="rr-boundary__hint">· steps below change master and go public</span>
        </span>
      </div>
    </li>
  );
}

/**
 * @param {string} text
 * @returns {'cmd'|'ok'|'warn'|'err'|'meta'|undefined}
 */
export function logLineKind(text) {
  if (text.startsWith('$ ')) {
    return 'cmd';
  }
  if (text.startsWith('▶ ')) {
    return 'meta';
  }
  if (/^(error|fatal)\b|\b(failed|exception)\b/i.test(text)) {
    return 'err';
  }
  if (/^warn(ing)?\b|\bWARN\b/i.test(text)) {
    return 'warn';
  }
  if (/^(✓|✔|ok\b)|\b(passed|success(fully)?)\b/i.test(text)) {
    return 'ok';
  }
  return undefined;
}

export function LogPanel({ lines, live, maxHeight = 280, placeholder = 'Waiting for log output…' }) {
  const ref = React.useRef(null);
  const stick = React.useRef(true);
  React.useEffect(() => {
    const el = ref.current;
    if (el && stick.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);
  return (
    <div className="rr-log">
      <div className="rr-log__bar">
        <span>Output</span>
        {live && <span className="rr-log__live">Live</span>}
      </div>
      <pre
        ref={ref}
        className="rr-log__body"
        style={{ maxHeight }}
        aria-live={live ? 'polite' : undefined}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        }}
      >
        {lines.length ? (
          lines.map((text, i) => (
            <span key={i} className={cx('rr-log__line', logLineKind(text) && `rr-log__line--${logLineKind(text)}`)}>
              {text}
            </span>
          ))
        ) : (
          <span className="rr-log__placeholder">{placeholder}</span>
        )}
      </pre>
    </div>
  );
}

const BASE_VERSION = /^\d+\.\d+\.\d+$/;

function Segmented({ label, value, options, onChange }) {
  return (
    <div className="rr-field">
      <span className="rr-field__label">{label}</span>
      <div className="rr-seg" role="group" aria-label={label}>
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function PresetPicker({ label, value, onChange, presetIds, presetMeta }) {
  return (
    <div className="rr-field">
      <span className="rr-field__label">{label}</span>
      <div className="rr-seg" role="group" aria-label={label}>
        {presetIds.map((id) => (
          <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}>
            {presetMeta[id]?.label || id}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StartReleaseDialog({
  open,
  onOpenChange,
  runnerPresets = [],
  presetMeta = {},
  defaultPreset = '',
  busy,
  onStart,
}) {
  const [version, setVersion] = useState('');
  const [urgency, setUrgency] = useState('standard');
  const [preset, setPreset] = useState(defaultPreset);
  const [prereleaseChannel, setPrereleaseChannel] = useState('beta');

  useEffect(() => {
    if (defaultPreset) {
      setPreset(defaultPreset);
    }
  }, [defaultPreset, open]);

  const meta = presetMeta[preset] || {};
  const channels = meta.channels || [];
  const value = version.trim();
  const valid = BASE_VERSION.test(value);
  const invalid = value.length > 0 && !valid;
  const presetLabel = (id) => presetMeta[id]?.label || id;

  useEffect(() => {
    if (channels.length > 0 && !channels.includes(prereleaseChannel)) {
      setPrereleaseChannel(channels[0]);
    }
  }, [preset, channels.join(','), prereleaseChannel]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="rr-overlay" />
        <Dialog.Content className="rr-dialog-pos">
          <form
            className="rr-dialog"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!valid || busy) {
                return;
              }
              await onStart({
                version: value,
                urgency,
                preset,
                prereleaseChannel: channels.length > 0 ? prereleaseChannel : null,
              });
              setVersion('');
            }}
          >
            <div>
              <Dialog.Title className="rr-dialog__title">Start release</Dialog.Title>
              <Dialog.Description className="rr-dialog__desc">
                Creates local runner state only. No git changes until you run steps.
              </Dialog.Description>
            </div>
            <label className="rr-field">
              <span className="rr-field__label">Version</span>
              <div className="rr-input-wrap">
                <input
                  className="rr-input rr-input--mono rr-input--with-suffix"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="4.11.0"
                  autoComplete="off"
                  aria-invalid={invalid ? 'true' : undefined}
                />
                <EditionBadge product={meta.product} />
              </div>
              <span className={cx('rr-field__hint', invalid && 'rr-field__hint--error')}>
                {invalid
                  ? meta.versionRule === 'prerelease'
                    ? 'Base MAJOR.MINOR.PATCH only (e.g. 4.11.0). Beta/rc suffix comes from preset.'
                    : 'Use MAJOR.MINOR.PATCH, e.g. 4.11.0. No "v" prefix or -beta/-rc suffix.'
                  : `Branch will be release-${value || '<version>'}`}
              </span>
            </label>
            {runnerPresets.length === 1 && (
              <p className="rr-static">
                Preset: <strong>{presetLabel(runnerPresets[0])}</strong>
              </p>
            )}
            {runnerPresets.length > 1 && (
              <PresetPicker
                label="Preset"
                value={preset}
                onChange={setPreset}
                presetIds={runnerPresets}
                presetMeta={presetMeta}
              />
            )}
            {channels.length > 1 && (
              <Segmented
                label="Prerelease channel"
                value={prereleaseChannel}
                onChange={setPrereleaseChannel}
                options={channels.map((c) => [c, c])}
              />
            )}
            <Segmented
              label="Urgency"
              value={urgency}
              onChange={setUrgency}
              options={[
                ['standard', 'Standard'],
                ['security', 'Security'],
              ]}
            />
            <div className="rr-dialog__foot">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="primary" type="submit" disabled={!valid || busy}>
                Start
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmPublishDialog({ open, onOpenChange, step, version, busy, onConfirm }) {
  const [typed, setTyped] = useState('');
  const ok = typed.trim() === version;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setTyped('');
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="rr-overlay" />
        <Dialog.Content className="rr-dialog-pos" role="alertdialog">
          <form
            className="rr-dialog"
            onSubmit={async (e) => {
              e.preventDefault();
              if (ok && !busy) {
                setTyped('');
                await onConfirm();
              }
            }}
          >
            <div>
              <Dialog.Title className="rr-dialog__title">{step?.label}</Dialog.Title>
              <Dialog.Description className="rr-dialog__desc">
                This step changes master or publishes the release. It cannot be undone from the runner.
              </Dialog.Description>
            </div>
            {step?.message && <p className="rr-panel__text">{step.message}</p>}
            {step?.command && <code className="rr-panel__cmd">{step.command}</code>}
            <label className="rr-field">
              <span className="rr-field__label">
                Type <span className="rr-code">{version}</span> to confirm
              </span>
              <input
                className="rr-input rr-input--mono"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
              />
            </label>
            <div className="rr-dialog__foot">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="publish" icon="lock" type="submit" disabled={!ok || busy}>
                Publish {version}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EmptyState({ action, hint, children }) {
  return (
    <section className="rr-empty">
      <h2 className="rr-empty__title">No release in progress</h2>
      <p className="rr-empty__copy">{children}</p>
      {action}
      {hint && <p className="rr-empty__hint">{hint}</p>}
    </section>
  );
}

/**
 * Header button that switches between the light and dark themes.
 * `onChange(theme)` persists the choice (the app saves it in dev-workspace-cache).
 */
export function ThemeToggle({ onChange }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const next = theme === 'dark' ? 'light' : 'dark';
  const toggle = () => {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    onChange?.(next);
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      icon={theme === 'dark' ? 'sun' : 'moon'}
      className="rr-theme-toggle"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      onClick={toggle}
    />
  );
}
