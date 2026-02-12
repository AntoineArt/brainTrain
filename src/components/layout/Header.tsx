'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = 'BrainTrain', showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 glass border-b border-border/40 z-40 px-4 py-2.5">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-muted hover:text-foreground transition-colors touch-manipulation cursor-pointer"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold flex-1">
          {!showBack ? (
            <Link href="/" className="accent-text hover:opacity-80 transition-opacity tracking-tight">
              {title}
            </Link>
          ) : (
            <span className="tracking-tight">{title}</span>
          )}
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
