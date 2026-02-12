'use client';

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:brightness-90',
  secondary:
    'bg-surface-light text-foreground border border-border hover:border-primary/30 hover:bg-surface active:bg-surface-light',
  ghost: 'text-muted hover:text-foreground hover:bg-surface-light/60',
  success:
    'bg-success text-white shadow-md shadow-success/20 hover:brightness-110 active:brightness-90',
  error:
    'bg-error text-white shadow-md shadow-error/20 hover:brightness-110 active:brightness-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
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
        transition-all duration-150 touch-manipulation cursor-pointer
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
