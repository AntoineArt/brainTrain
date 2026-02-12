'use client';

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
  secondary: 'bg-surface text-foreground border border-border hover:bg-background active:bg-background',
  ghost: 'text-muted hover:text-foreground hover:bg-surface',
  success: 'bg-success text-white hover:opacity-90',
  error: 'bg-error text-white hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3.5 text-lg',
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
        inline-flex items-center justify-center rounded-xl font-medium
        transition-all duration-200 touch-manipulation cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        min-h-12
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
