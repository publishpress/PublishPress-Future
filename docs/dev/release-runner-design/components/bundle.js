/* @ds-bundle: {"format":4,"namespace":"RR","components":[{"name":"Button"},{"name":"StatusBadge"},{"name":"StepTypeTag"},{"name":"MetaPill"},{"name":"PhaseProgress"},{"name":"AlertBanner"},{"name":"ReleaseHeader"},{"name":"ThemeToggle"},{"name":"PhaseGroup"},{"name":"StepRow"},{"name":"PublishBoundary"},{"name":"LogPanel"},{"name":"StartReleaseDialog"},{"name":"ConfirmPublishDialog"},{"name":"EmptyState"},{"name":"ReleaseScreen"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  /* —— Icons: 16px grid, 2px stroke, currentColor —— */
  var PATHS = {
    check: 'M3.5 8.5l3 3 6-7',
    x: 'M4 4l8 8M12 4l-8 8',
    skip: 'M3 8h8M8 5l3 3-3 3M13 4v8',
    dot: 'M8 8h.01',
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
    github: 'M6 13c-3 1-3-1.5-4-2m8 3.5v-2.2c0-.7.1-1-.4-1.5 1.7-.2 3.4-.8 3.4-3.6a2.8 2.8 0 0 0-.8-2 2.6 2.6 0 0 0 0-2s-.6-.2-2.1.8a7 7 0 0 0-3.8 0C4.8 2.9 4.2 3.1 4.2 3.1a2.6 2.6 0 0 0 0 2 2.8 2.8 0 0 0-.8 2c0 2.8 1.7 3.4 3.4 3.6-.4.4-.4.8-.4 1.5V15'
  };

  function Icon(props) {
    if (props.name === 'spinner') {
      return h('svg', { className: cx('rr-icon rr-spin', props.className), viewBox: '0 0 16 16', 'aria-hidden': true },
        h('path', { d: 'M8 2a6 6 0 1 0 6 6', opacity: 1 }));
    }
    if (props.name === 'dot') {
      return h('svg', { className: cx('rr-icon', props.className), viewBox: '0 0 16 16', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 3, fill: 'currentColor', stroke: 'none' }));
    }
    return h('svg', { className: cx('rr-icon', props.className), viewBox: '0 0 16 16', 'aria-hidden': true },
      h('path', { d: PATHS[props.name] || PATHS.dot }));
  }

  /* —— Button —— */
  function Button(props) {
    var variant = props.variant || 'secondary';
    var rest = Object.assign({}, props);
    delete rest.variant; delete rest.icon; delete rest.size; delete rest.className; delete rest.children;
    if (variant === 'link') {
      return h('button', Object.assign({ type: 'button' }, rest, { className: cx('rr-link', props.className) }), props.children);
    }
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('rr-btn', 'rr-btn--' + variant, props.size === 'sm' && 'rr-btn--sm', props.className)
    }), props.icon ? h(Icon, { name: props.icon }) : null, props.children);
  }

  /* —— Status —— */
  var STATUS = {
    pending: { label: 'Pending', icon: 'dot' },
    running: { label: 'Running', icon: 'spinner' },
    waiting: { label: 'Needs you', icon: 'hand' },
    done: { label: 'Done', icon: 'check' },
    skipped: { label: 'Skipped', icon: 'skip' },
    failed: { label: 'Failed', icon: 'x' }
  };

  function StatusBadge(props) {
    var key = STATUS[props.status] ? props.status : 'pending';
    var s = STATUS[key];
    return h('span', { className: 'rr-badge rr-badge--' + key }, h(Icon, { name: s.icon }), props.label || s.label);
  }

  var TYPES = {
    auto: { label: 'Auto', icon: 'terminal', title: 'Runs on its own' },
    manual: { label: 'Manual', icon: 'hand', title: 'You do this, then mark it done' },
    confirm: { label: 'Confirm', icon: 'lock', title: 'Publishes. Needs an explicit confirm' }
  };

  function StepTypeTag(props) {
    var t = TYPES[props.type] || TYPES.auto;
    return h('span', { className: 'rr-type rr-type--' + (props.type || 'auto'), title: t.title }, h(Icon, { name: t.icon }), t.label);
  }

  function MetaPill(props) {
    return h('span', { className: cx('rr-pill', props.tone && 'rr-pill--' + props.tone) },
      h('span', { className: 'rr-pill__label' }, props.label),
      h('span', { className: cx('rr-pill__value', props.mono && 'rr-pill__value--mono') }, props.value));
  }

  /* —— Progress, one segment per phase —— */
  function PhaseProgress(props) {
    var phases = props.phases || [];
    var done = 0, total = 0;
    phases.forEach(function (p) { done += p.done; total += p.total; });
    var current = phases.filter(function (p) { return p.current; })[0];
    return h('div', { className: 'rr-progress' },
      h('div', { className: 'rr-progress__row' },
        h('span', { className: 'rr-eyebrow' }, 'Progress'),
        h('span', { className: 'rr-progress__value' }, done + ' / ' + total + ' steps')),
      h('div', { className: 'rr-progress__track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done },
        phases.map(function (p) {
          return h('div', {
            key: p.name, title: p.name + ': ' + p.done + '/' + p.total,
            className: cx('rr-progress__seg', p.current && 'rr-progress__seg--current'),
            style: { flexGrow: p.total }
          }, h('div', { className: 'rr-progress__fill', style: { width: (p.total ? Math.round(p.done / p.total * 100) : 0) + '%' } }));
        })),
      current ? h('p', { className: 'rr-progress__legend' }, 'Now in ', h('strong', null, current.name)) : null);
  }

  /* —— Alert —— */
  var ALERT_ICON = { security: 'shield', failed: 'x', waiting: 'hand' };
  function AlertBanner(props) {
    var tone = props.tone || 'security';
    return h('div', { className: 'rr-alert rr-alert--' + tone, role: tone === 'failed' ? 'alert' : 'status' },
      h(Icon, { name: ALERT_ICON[tone] || 'alert' }),
      h('div', null, props.title ? h('span', { className: 'rr-alert__title' }, props.title) : null, props.children));
  }

  /* —— Theme toggle: flips <html data-theme>; onChange(theme) saves it (the app posts to /api/ui-prefs) —— */
  function ThemeToggle(props) {
    var s = useState(function () { return document.documentElement.getAttribute('data-theme') || 'light'; });
    var next = s[0] === 'dark' ? 'light' : 'dark';
    return h(Button, { variant: 'ghost', size: 'sm', icon: s[0] === 'dark' ? 'sun' : 'moon', className: 'rr-theme-toggle',
      'aria-label': 'Switch to ' + next + ' theme', title: 'Switch to ' + next + ' theme',
      onClick: function () {
        document.documentElement.setAttribute('data-theme', next);
        s[1](next);
        if (props && props.onChange) props.onChange(next);
      } });
  }

  /* —— Header —— */
  function ReleaseHeader(props) {
    var r = props.release || {};
    return h('header', { className: 'rr-header' },
      h('div', { className: 'rr-header__top' },
        h('div', null,
          h('h1', { className: 'rr-header__title' }, 'Release Runner'),
          h('p', { className: 'rr-header__sub' }, props.subtitle || 'Local release checklist for this plugin clone')),
        h('div', { className: 'rr-header__end' },
        props.release ? h('div', { className: 'rr-header__pills' },
          h(MetaPill, { label: 'Version', value: r.version, tone: 'accent', mono: true }),
          h(MetaPill, { label: 'Edition', value: r.edition }),
          r.urgency === 'security' ? h(MetaPill, { label: 'Urgency', value: 'security', tone: 'alert' }) : null,
          h(MetaPill, { label: 'Branch', value: r.branch, mono: true }),
          r.prerelease ? h(MetaPill, { label: 'Package', value: r.prerelease, mono: true }) : null,
          r.gh ? h(MetaPill, { label: 'GitHub', value: r.gh }) : null) : null,
        h(ThemeToggle))),
      props.phases ? h(PhaseProgress, { phases: props.phases }) : null,
      r.urgency === 'security' ? h(AlertBanner, { tone: 'security', title: 'Security release' },
        'Keep essential checks. Translations may be skipped; do not disclose vulnerability details until it is published.') : null,
      props.next || props.actions ? h('div', { className: 'rr-header__bar' },
        h('div', { className: 'rr-header__next' }, props.next || null),
        h('div', { className: 'rr-row' }, props.actions)) : null);
  }

  /* —— Steps —— */
  /* The current step carries its actions in the row and its guide, log and footer in the expanded body. */
  function StepRow(props) {
    var st = STATUS[props.status] ? props.status : 'pending';
    var controlled = typeof props.open === 'boolean';
    var s = useState(!!props.defaultOpen);
    var open = controlled ? props.open : s[0];
    var toggle = function () { if (props.onOpenChange) props.onOpenChange(!open); if (!controlled) s[1](!open); };
    var cur = !!props.current;
    var hasBody = !!(props.guide || props.note || props.children || (cur && (props.log || props.onReopen)));
    var showBadge = cur || st === 'failed' || st === 'waiting' || st === 'running';
    return h('li', null, h('div', { className: cx('rr-step', 'rr-step--' + st, cur && 'rr-step--current') },
      h('div', { className: 'rr-step__row' },
        h('button', { type: 'button', className: 'rr-step__trigger', 'aria-expanded': hasBody ? open : undefined, 'aria-current': cur ? 'step' : undefined, onClick: hasBody ? toggle : undefined },
          h('span', { className: 'rr-step__dot rr-badge--' + st }, h(Icon, { name: STATUS[st].icon })),
          h('span', { className: 'rr-step__label' }, props.label),
          h('span', { className: 'rr-step__meta' },
            h(StepTypeTag, { type: props.type }),
            showBadge ? h(StatusBadge, { status: st }) : h('span', { className: 'rr-sr' }, STATUS[st].label))),
        cur && props.actions ? h('div', { className: 'rr-step__actions' }, props.actions) : null,
        hasBody ? h('button', { type: 'button', className: 'rr-step__toggle', tabIndex: -1, 'aria-hidden': true, 'data-state': open ? 'open' : 'closed', onClick: toggle },
          h(Icon, { name: 'chevron', className: 'rr-step__chev' })) : null),
      hasBody && open ? h('div', { className: 'rr-step__body' },
        props.guide ? h('p', { className: 'rr-step__guide' }, props.guide) : null,
        props.children || null,
        props.note ? h('div', { className: 'rr-step__note' }, 'Note: ' + props.note) : null,
        cur ? props.log || null : null,
        cur && props.onReopen ? h('div', { className: 'rr-step__foot' },
          h(Button, { variant: 'link', disabled: props.busy, onClick: props.onReopen }, 'Reopen from here'),
          props.cli ? h('span', { className: 'rr-step__time' }, props.cli) : null) : null) : null));
  }

  function PhaseGroup(props) {
    return h('section', { className: 'rr-phase' },
      h('div', { className: 'rr-phase__head' },
        h('h2', { className: 'rr-eyebrow' }, props.name),
        props.total != null ? h('span', { className: 'rr-phase__count' }, (props.done || 0) + ' / ' + props.total) : null),
      h('ul', { className: 'rr-phase__list' }, props.children));
  }

  function PublishBoundary(props) {
    return h('div', { className: 'rr-boundary', role: 'separator' },
      h('span', { className: 'rr-boundary__label' }, h(Icon, { name: 'lock' }),
        props.label || 'Publish boundary',
        h('span', { className: 'rr-boundary__hint' }, props.hint || '· steps below change master and go public')));
  }

  /* —— Log —— */
  function LogPanel(props) {
    var lines = props.lines || [];
    return h('div', { className: 'rr-log' },
      h('div', { className: 'rr-log__bar' },
        h('span', null, props.title || 'Output'),
        props.live ? h('span', { className: 'rr-log__live' }, 'Live') : null),
      h('pre', { className: 'rr-log__body', style: { maxHeight: props.maxHeight || 280 }, 'aria-live': props.live ? 'polite' : undefined },
        lines.length ? lines.map(function (l, i) {
          var line = typeof l === 'string' ? { text: l } : l;
          return h('span', { key: i, className: cx('rr-log__line', line.kind && 'rr-log__line--' + line.kind) }, line.text);
        }) : h('span', { className: 'rr-log__placeholder' }, props.placeholder || 'Waiting for log output…')));
  }

  /* —— Dialogs (rendered in place; wrap with Radix Dialog in the app) —— */
  var SEMVER = /^\d+\.\d+\.\d+(-(beta|rc)\.\d+)?$/;

  function StartReleaseDialog(props) {
    var v = useState(props.version || '');
    var u = useState(props.urgency || 'standard');
    var c = useState(props.channel || 'beta');
    var valid = SEMVER.test(v[0]);
    var touched = v[0].length > 0;
    var dialog = h('div', { className: 'rr-dialog', role: 'dialog', 'aria-labelledby': 'rr-start-title' },
      h('div', null,
        h('h2', { className: 'rr-dialog__title', id: 'rr-start-title' }, 'Start release'),
        h('p', { className: 'rr-dialog__desc' }, 'Creates local runner state only. No git changes until you run steps.')),
      h('label', { className: 'rr-field' },
        h('span', { className: 'rr-field__label' }, 'Version'),
        h('input', { className: 'rr-input rr-input--mono', value: v[0], placeholder: '4.11.0', autoComplete: 'off', 'aria-invalid': touched && !valid ? 'true' : undefined, onChange: function (e) { v[1](e.target.value); } }),
        h('span', { className: cx('rr-field__hint', touched && !valid && 'rr-field__hint--error') },
          touched && !valid ? 'Use MAJOR.MINOR.PATCH, e.g. 4.11.0. No "v" prefix.' : 'Branch will be release-' + (v[0] || '<version>'))),
      h('div', { className: 'rr-field' },
        h('span', { className: 'rr-field__label' }, 'Urgency'),
        h('div', { className: 'rr-seg', role: 'group', 'aria-label': 'Urgency' },
          ['standard', 'security'].map(function (k) { return h('button', { key: k, type: 'button', 'aria-pressed': u[0] === k, onClick: function () { u[1](k); } }, k === 'standard' ? 'Standard' : 'Security'); }))),
      h('div', { className: 'rr-field' },
        h('span', { className: 'rr-field__label' }, 'First package channel'),
        h('div', { className: 'rr-seg', role: 'group', 'aria-label': 'Channel' },
          ['beta', 'rc'].map(function (k) { return h('button', { key: k, type: 'button', 'aria-pressed': c[0] === k, onClick: function () { c[1](k); } }, k); }))),
      h('p', { className: 'rr-static' }, 'Edition: ', h('strong', null, props.edition || 'free'), ' · read from composer.json'),
      h('div', { className: 'rr-dialog__foot' },
        h(Button, { variant: 'ghost', onClick: props.onCancel }, 'Cancel'),
        h(Button, { variant: 'primary', disabled: !valid, onClick: function () { if (props.onStart) props.onStart({ version: v[0], urgency: u[0], channel: c[0] }); } }, 'Start')));
    return props.inline === false ? dialog : h('div', { className: 'rr-scrim' }, dialog);
  }

  function ConfirmPublishDialog(props) {
    var t = useState('');
    var ok = t[0] === props.version;
    var dialog = h('div', { className: 'rr-dialog', role: 'alertdialog', 'aria-labelledby': 'rr-confirm-title' },
      h('div', null,
        h('h2', { className: 'rr-dialog__title', id: 'rr-confirm-title' }, props.title || 'Create GitHub release'),
        h('p', { className: 'rr-dialog__desc' }, props.description || 'Tags master and triggers the deploy workflow. This cannot be undone from the runner.')),
      props.command ? h('code', { className: 'rr-panel__cmd' }, props.command) : null,
      h('label', { className: 'rr-field' },
        h('span', { className: 'rr-field__label' }, 'Type ', h('span', { className: 'rr-code' }, props.version), ' to confirm'),
        h('input', { className: 'rr-input rr-input--mono', value: t[0], autoComplete: 'off', onChange: function (e) { t[1](e.target.value); } })),
      h('div', { className: 'rr-dialog__foot' },
        h(Button, { variant: 'ghost', onClick: props.onCancel }, 'Cancel'),
        h(Button, { variant: 'publish', icon: 'lock', disabled: !ok, onClick: props.onConfirm }, props.confirmLabel || 'Publish ' + props.version)));
    return props.inline === false ? dialog : h('div', { className: 'rr-scrim' }, dialog);
  }

  function EmptyState(props) {
    return h('section', { className: 'rr-empty' },
      h('h2', { className: 'rr-empty__title' }, props.title || 'No release in progress'),
      h('p', { className: 'rr-empty__copy' }, props.children),
      props.action || null,
      props.hint ? h('p', { className: 'rr-empty__hint' }, props.hint) : null,
      props.archived ? h('div', { className: 'rr-empty__resume' }, props.archived) : null);
  }

  /* —— Showcase screen —— */
  function ReleaseScreen(props) {
    var steps = props.steps;
    var current = steps.filter(function (s) { return s.id === props.currentId; })[0];
    var groups = [];
    steps.forEach(function (s) {
      var g = groups[groups.length - 1];
      if (!g || g.name !== s.phase) { g = { name: s.phase, steps: [] }; groups.push(g); }
      g.steps.push(s);
    });
    var openState = useState(props.currentId);
    var boundaryDone = false;
    var phases = groups.map(function (g) {
      return { name: g.name, total: g.steps.length, current: g.steps.some(function (s) { return s.id === props.currentId; }),
        done: g.steps.filter(function (s) { return s.status === 'done' || s.status === 'skipped'; }).length };
    });
    var cliHint = function (st) { return (st.type === 'confirm' ? 'run --confirm ' : st.type === 'manual' ? 'complete ' : 'run --until ') + st.id; };
    var actionsFor = function (st) {
      if (st.type === 'confirm') return h(Button, { variant: 'publish', size: 'sm', icon: 'lock' }, 'Publish…');
      if (st.type === 'manual') return [h(Button, { key: 'd', variant: 'primary', size: 'sm', icon: 'check' }, 'Done'), h(Button, { key: 's', variant: 'ghost', size: 'sm' }, 'Skip')];
      return h(Button, { variant: 'primary', size: 'sm', icon: 'play' }, st.status === 'failed' ? 'Run again' : 'Run');
    };
    return h('div', { className: 'rr-screen' },
      h(ReleaseHeader, { release: props.release, phases: phases,
        next: current ? [h(StatusBadge, { key: 'b', status: current.status }), h('span', { key: 't' }, 'Next: ', h('strong', null, current.label))] : null,
        actions: [h(Button, { key: 'reset', variant: 'ghost', size: 'sm' }, 'Reset state')] }),
      h('div', { className: 'rr-steps' }, groups.map(function (g, gi) {
        var rows = [];
        g.steps.forEach(function (st) {
          if (st.type === 'confirm' && !boundaryDone) {
            boundaryDone = true;
            rows.push(h('li', { key: 'boundary', role: 'presentation' }, h(PublishBoundary)));
          }
          var cur = st.id === props.currentId;
          rows.push(h(StepRow, { key: st.id, label: st.label, status: st.status, type: st.type, note: st.note, guide: st.instructions, current: cur,
            open: openState[0] === st.id, onOpenChange: function (o) { openState[1](o ? st.id : null); },
            actions: cur ? actionsFor(st) : null, cli: cur ? cliHint(st) : null, onReopen: cur ? function () {} : null,
            log: cur ? h(LogPanel, { lines: props.log, live: st.status === 'running' }) : null }));
        });
        return h(PhaseGroup, { key: g.name, name: g.name, done: phases[gi].done, total: phases[gi].total }, rows);
      })));
  }

  window.RR = Object.assign(window.RR || {}, {
    Icon: Icon, Button: Button, StatusBadge: StatusBadge, StepTypeTag: StepTypeTag, MetaPill: MetaPill,
    PhaseProgress: PhaseProgress, AlertBanner: AlertBanner, ReleaseHeader: ReleaseHeader, ThemeToggle: ThemeToggle, PhaseGroup: PhaseGroup,
    StepRow: StepRow, PublishBoundary: PublishBoundary, LogPanel: LogPanel,
    StartReleaseDialog: StartReleaseDialog, ConfirmPublishDialog: ConfirmPublishDialog, EmptyState: EmptyState,
    ReleaseScreen: ReleaseScreen
  });
})();
