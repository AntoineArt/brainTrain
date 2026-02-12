import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-2xl border border-border p-4 shadow-sm
        ${hoverable ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
