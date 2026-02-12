interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  glow?: boolean;
}

export function ProgressBar({ value, color, className = '', glow }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = color ?? 'var(--primary)';

  return (
    <div className={`h-1.5 rounded-full bg-border/50 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${clampedValue}%`,
          backgroundColor: barColor,
          boxShadow: glow ? `0 0 8px ${barColor}` : undefined,
        }}
      />
    </div>
  );
}
