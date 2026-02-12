'use client';

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:brightness-95',
  secondary:
    'bg-surface-light text-foreground border border-border hover:bg-border/30 hover:border-primary/40 active:bg-border/40',
  ghost: 'text-muted hover:text-foreground hover:bg-surface-light',
  success:
    'bg-gradient-to-r from-success to-emerald-400 text-white shadow-lg shadow-success/25 hover:shadow-xl hover:shadow-success/30 hover:brightness-110',
  error:
    'bg-gradient-to-r from-error to-rose-400 text-white shadow-lg shadow-error/25 hover:shadow-xl hover:shadow-error/30 hover:brightness-110',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-200 touch-manipulation cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.97]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
