import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-2xl border border-border p-4
        ${hoverable ? 'transition-all duration-200 hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
