import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
}

export function Card({ hoverable, glow, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-2xl border border-border p-4
        ${hoverable ? 'transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-primary/15 border-primary/30' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
