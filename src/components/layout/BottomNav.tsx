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

  if (pathname.startsWith('/jeux/') && pathname !== '/jeux') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 z-50 pb-[env(safe-area-inset-bottom)]">
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
                flex-1 flex flex-col items-center py-2 gap-0.5 relative
                transition-colors duration-200 touch-manipulation
                ${isActive ? 'text-primary' : 'text-muted hover:text-foreground'}
              `}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
              )}
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
