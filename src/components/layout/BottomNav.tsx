'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: '🏠' },
  { href: '/jeux', label: 'Jeux', icon: '🎮' },
  { href: '/resultats', label: 'Stats', icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav when playing a game
  if (pathname.startsWith('/jeux/') && pathname !== '/jeux') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="max-w-3xl mx-auto flex">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center py-2 gap-0.5
                transition-colors duration-200 touch-manipulation
                ${isActive ? 'text-primary' : 'text-muted'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
