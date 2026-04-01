'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface NameEntryProps {
  initialName?: string;
  onSubmit: (name: string) => void;
}

export function NameEntry({ initialName = '', onSubmit }: NameEntryProps) {
  const [name, setName] = useState(initialName);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-muted">
        {t('multi.yourName')}
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 20))}
        placeholder={t('multi.namePlaceholder')}
        className="w-full px-4 py-3 rounded-xl bg-surface border border-border/40 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
        maxLength={20}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) onSubmit(name.trim());
        }}
      />
      <button
        onClick={() => name.trim() && onSubmit(name.trim())}
        disabled={!name.trim()}
        className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-white disabled:opacity-40 transition-all touch-manipulation cursor-pointer"
      >
        {t('multi.continue')}
      </button>
    </div>
  );
}
