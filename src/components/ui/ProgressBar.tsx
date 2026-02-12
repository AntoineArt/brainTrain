interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
}

export function ProgressBar({ value, color, className = '' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = color ?? 'var(--primary)';

  return (
    <div className={`h-1.5 rounded-full bg-border/40 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${clampedValue}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  );
}
