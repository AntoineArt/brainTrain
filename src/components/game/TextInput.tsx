'use client';

import { useEffect, useRef } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function TextInput({ value, onChange, onSubmit, placeholder = 'Tape ta réponse…', maxLength = 30, disabled = false }: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim().length > 0) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 pb-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full text-center px-4 py-3 bg-surface-light border-2 border-border rounded-xl
          font-bold text-lg transition-all duration-150
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:opacity-40 disabled:cursor-not-allowed
          placeholder:text-muted/40 placeholder:font-normal"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || value.trim().length === 0}
        className="w-full h-12 mt-2 rounded-xl font-bold text-base
          bg-primary text-white shadow-md shadow-primary/20
          transition-all duration-100 touch-manipulation cursor-pointer active:scale-[0.97]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
      >
        Valider
      </button>
    </div>
  );
}
