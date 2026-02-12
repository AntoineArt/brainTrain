'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = 'BrainTrain', showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 bg-surface/80 backdrop-blur-sm border-b border-border z-40 px-4 py-3">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-muted hover:text-foreground transition-colors touch-manipulation cursor-pointer"
            aria-label="Retour"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold">
          {!showBack ? (
            <Link href="/" className="hover:text-primary transition-colors">
              {title}
            </Link>
          ) : (
            title
          )}
        </h1>
      </div>
    </header>
  );
}
