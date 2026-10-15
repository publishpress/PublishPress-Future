import type * as React from 'react';

export type StepStatus = 'pending' | 'running' | 'waiting' | 'done' | 'skipped' | 'failed';
export type StepType = 'auto' | 'manual' | 'confirm';
export type IconName = 'check' | 'x' | 'skip' | 'dot' | 'spinner' | 'hand' | 'lock' | 'terminal' | 'play' | 'chevron' | 'alert' | 'shield' | 'reopen' | 'github' | 'sun' | 'moon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'publish' | 'link';
  size?: 'sm';
  icon?: IconName;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface StatusBadgeProps { status: StepStatus; label?: string }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;

export interface StepTypeTagProps { type: StepType }
export declare function StepTypeTag(props: StepTypeTagProps): React.ReactElement;

export interface MetaPillProps { label: string; value: React.ReactNode; tone?: 'accent' | 'alert'; mono?: boolean }
export declare function MetaPill(props: MetaPillProps): React.ReactElement;

export interface Phase { name: string; done: number; total: number; current?: boolean }
export interface PhaseProgressProps { phases: Phase[] }
export declare function PhaseProgress(props: PhaseProgressProps): React.ReactElement;

export interface AlertBannerProps { tone?: 'security' | 'waiting' | 'failed'; title?: string; children?: React.ReactNode }
export declare function AlertBanner(props: AlertBannerProps): React.ReactElement;

export interface ReleaseInfo { version: string; edition: string; branch: string; prerelease?: string; gh?: string; urgency: 'standard' | 'security' }
export interface ReleaseHeaderProps { release?: ReleaseInfo; phases?: Phase[]; subtitle?: string; next?: React.ReactNode; actions?: React.ReactNode }
export declare function ReleaseHeader(props: ReleaseHeaderProps): React.ReactElement;

export interface ThemeToggleProps { onChange?: (theme: 'light' | 'dark') => void }
export declare function ThemeToggle(props: ThemeToggleProps): React.ReactElement;

export interface PhaseGroupProps { name: string; done?: number; total?: number; children?: React.ReactNode }
export declare function PhaseGroup(props: PhaseGroupProps): React.ReactElement;

export interface StepRowProps {
  label: string; type: StepType; status: StepStatus; current?: boolean; guide?: string; note?: string;
  /** Current step only: buttons rendered in the row, before the chevron. */
  actions?: React.ReactNode;
  /** Current step only: a LogPanel, shown in the expanded body. */
  log?: React.ReactNode;
  onReopen?: () => void; cli?: string; busy?: boolean;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode;
}
export declare function StepRow(props: StepRowProps): React.ReactElement;

export interface PublishBoundaryProps { label?: string; hint?: string }
export declare function PublishBoundary(props: PublishBoundaryProps): React.ReactElement;

export interface LogLine { kind?: 'cmd' | 'ok' | 'warn' | 'err' | 'meta'; text: string }
export interface LogPanelProps { lines?: Array<string | LogLine>; live?: boolean; maxHeight?: number; title?: string; placeholder?: string }
export declare function LogPanel(props: LogPanelProps): React.ReactElement;

export interface CurrentStep { phase?: string; label: string; type: StepType; status: StepStatus; instructions?: string; command?: string; message?: string }
export interface PresetMeta { label: string; versionRule: 'stable' | 'prerelease'; channels?: Array<'beta' | 'rc'> }
export interface StartReleaseDialogProps {
  runnerPresets?: string[]; presetMeta?: Record<string, PresetMeta>; defaultPreset?: string;
  version?: string; urgency?: 'standard' | 'security'; inline?: boolean;
  onStart?: (v: { version: string; urgency: string; preset: string; prereleaseChannel: string | null }) => void; onCancel?: () => void;
}
export declare function StartReleaseDialog(props: StartReleaseDialogProps): React.ReactElement;

export interface ConfirmPublishDialogProps {
  version: string; title?: string; description?: string; command?: string; confirmLabel?: string; inline?: boolean;
  onConfirm?: () => void; onCancel?: () => void;
}
export declare function ConfirmPublishDialog(props: ConfirmPublishDialogProps): React.ReactElement;

export interface EmptyStateProps { title?: string; children?: React.ReactNode; action?: React.ReactNode; hint?: React.ReactNode; archived?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

export interface ReleaseScreenProps { release: ReleaseInfo; steps: Array<CurrentStep & { id: string; time?: string; note?: string }>; currentId: string; log?: LogLine[] }
export declare function ReleaseScreen(props: ReleaseScreenProps): React.ReactElement;
