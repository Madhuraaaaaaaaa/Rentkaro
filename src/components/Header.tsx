import React from 'react';
import { Button } from './ui/button';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isLoggedIn, onLogout }: HeaderProps) {
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
              className={`transition-colors hover:text-emerald-600 ${
                currentPage === 'home' ? 'text-emerald-600' : 'text-muted-foreground'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('items')}
              className={`transition-colors hover:text-emerald-600 ${
                currentPage === 'items' ? 'text-emerald-600' : 'text-muted-foreground'
              }`}
            >
              Browse Items
            </button>
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors hover:text-emerald-600 ${
                  currentPage === 'dashboard' ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
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
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}