import React from 'react';
import { Button } from './ui/button';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'lend' | 'cart' | 'profile' | 'settings';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isLoggedIn, onLogout }: HeaderProps) {
  const [cartCount, setCartCount] = React.useState<number>(0);
  React.useEffect(() => {
    const update = () => {
      try { setCartCount(JSON.parse(localStorage.getItem('cart') || '[]').length); } catch { setCartCount(0); }
    };
    update();
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);
  const linkBase = 'transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-md px-2 py-1';
  const activeClass = 'text-emerald-600 underline-offset-4';
  const inactiveClass = 'text-muted-foreground hover:text-emerald-600';
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Rentkaro
          </button>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`${linkBase} ${currentPage === 'home' ? activeClass : inactiveClass}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('items')}
              className={`${linkBase} ${currentPage === 'items' ? activeClass : inactiveClass}`}
            >
              Browse Items
            </button>
            <button
              onClick={() => (isLoggedIn ? onNavigate('lend') : onNavigate('login'))}
              className={`${linkBase} ${currentPage === 'lend' ? activeClass : inactiveClass}`}
            >
              Lend
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className={`${linkBase} relative ${currentPage === 'cart' ? activeClass : inactiveClass}`}
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
              )}
            </button>
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`${linkBase} ${currentPage === 'dashboard' ? activeClass : inactiveClass}`}
              >
                My Dashboard
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Log In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                onClick={() => onNavigate('signup')}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => onNavigate('profile')} className={`${linkBase} ${currentPage === 'profile' ? activeClass : inactiveClass}`}>Profile</button>
              <button onClick={() => onNavigate('settings')} className={`${linkBase} ${currentPage === 'settings' ? activeClass : inactiveClass}`}>Settings</button>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}