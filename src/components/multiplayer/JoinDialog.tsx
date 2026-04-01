'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface JoinDialogProps {
  onJoin: (code: string) => void;
  error?: string | null;
  loading?: boolean;
}

export function JoinDialog({ onJoin, error, loading }: JoinDialogProps) {
  const [code, setCode] = useState('');
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    setCode(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-semibold text-muted">
        {t('multi.enterCode')}
      </label>
      <input
        type="text"
        value={code}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="ABC123"
        className="w-full px-4 py-4 rounded-xl bg-surface border border-border/40 text-foreground text-center text-2xl font-mono tracking-[0.3em] uppercase placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
        maxLength={6}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && code.length === 6) onJoin(code);
        }}
      />
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
      <button
        onClick={() => code.length === 6 && onJoin(code)}
        disabled={code.length !== 6 || loading}
        className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-white disabled:opacity-40 transition-all touch-manipulation cursor-pointer"
      >
        {loading ? '...' : t('multi.join')}
      </button>
    </div>
  );
}
