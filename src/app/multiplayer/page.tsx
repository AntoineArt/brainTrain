'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useTranslation } from '@/hooks/useTranslation';
import { getItem, setItem } from '@/lib/storage';
import { NameEntry } from '@/components/multiplayer/NameEntry';
import { JoinDialog } from '@/components/multiplayer/JoinDialog';

const STORAGE_MP_ID = 'bt_mp_id';
const STORAGE_MP_NAME = 'bt_mp_name';

function getOrCreateClientId(): string {
  let id = getItem<string>(STORAGE_MP_ID);
  if (!id) {
    id = crypto.randomUUID();
    setItem(STORAGE_MP_ID, id);
  }
  return id;
}

export default function MultiplayerPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const createLobby = useMutation(api.lobbies.createLobby);
  const joinLobby = useMutation(api.lobbies.joinLobby);

  const storedName = getItem<string>(STORAGE_MP_NAME) ?? '';
  const [mode, setMode] = useState<'menu' | 'name-create' | 'name-join' | 'join'>('menu');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (name: string) => {
    setItem(STORAGE_MP_NAME, name);
    const clientId = getOrCreateClientId();
    try {
      setLoading(true);
      const { code } = await createLobby({ name, clientId });
      router.push(`/multiplayer/lobby/${code}`);
    } catch {
      setLoading(false);
    }
  };

  const handleJoin = async (code: string) => {
    const name = getItem<string>(STORAGE_MP_NAME) ?? '';
    if (!name) return;
    const clientId = getOrCreateClientId();
    try {
      setLoading(true);
      setJoinError(null);
      const result = await joinLobby({ code, name, clientId });
      router.push(`/multiplayer/lobby/${result.code}`);
    } catch (err) {
      setLoading(false);
      setJoinError(err instanceof Error ? err.message : t('multi.joinError'));
    }
  };

  // If no name stored, ask for name first
  if (mode === 'name-create') {
    return (
      <div className="flex flex-col gap-6 px-4 py-8 max-w-sm mx-auto">
        <button
          onClick={() => setMode('menu')}
          className="text-muted hover:text-foreground transition-colors self-start touch-manipulation cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <NameEntry initialName={storedName} onSubmit={handleCreate} />
      </div>
    );
  }

  if (mode === 'name-join') {
    return (
      <div className="flex flex-col gap-6 px-4 py-8 max-w-sm mx-auto">
        <button
          onClick={() => setMode('menu')}
          className="text-muted hover:text-foreground transition-colors self-start touch-manipulation cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <NameEntry
          initialName={storedName}
          onSubmit={(name) => {
            setItem(STORAGE_MP_NAME, name);
            setMode('join');
          }}
        />
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="flex flex-col gap-6 px-4 py-8 max-w-sm mx-auto">
        <button
          onClick={() => setMode('menu')}
          className="text-muted hover:text-foreground transition-colors self-start touch-manipulation cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <JoinDialog onJoin={handleJoin} error={joinError} loading={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-1">
          {t('multi.title')}
        </h1>
        <p className="text-sm text-muted">{t('multi.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* Create lobby */}
        <button
          onClick={() => storedName ? handleCreate(storedName) : setMode('name-create')}
          disabled={loading}
          className="flex items-center gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all touch-manipulation cursor-pointer group"
        >
          <span className="text-3xl">👥</span>
          <div className="text-left flex-1">
            <p className="font-bold text-lg group-hover:text-primary transition-colors">
              {t('multi.createLobby')}
            </p>
            <p className="text-sm text-muted">{t('multi.createDescription')}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Join lobby */}
        <button
          onClick={() => storedName ? setMode('join') : setMode('name-join')}
          disabled={loading}
          className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-all touch-manipulation cursor-pointer group"
        >
          <span className="text-3xl">🔗</span>
          <div className="text-left flex-1">
            <p className="font-bold text-lg group-hover:text-secondary transition-colors">
              {t('multi.joinLobby')}
            </p>
            <p className="text-sm text-muted">{t('multi.joinDescription')}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Change name link */}
      {storedName && (
        <button
          onClick={() => setMode('name-create')}
          className="text-xs text-muted hover:text-foreground transition-colors touch-manipulation cursor-pointer"
        >
          {t('multi.changeName')} ({storedName})
        </button>
      )}
    </div>
  );
}
