import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ItemsPage } from './components/ItemsPage';
import { DashboardPage } from './components/DashboardPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ItemDetailsPage } from './components/ItemDetailsPage';
import { LendPage } from './components/LendPage';
import { CartPage } from './components/CartPage';
import { RentalProgressPage } from './components/RentalProgressPage';
import { mockItems } from './components/mockData';
import { Toaster } from 'sonner';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { EditItemPage } from './components/EditItemPage';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails' | 'lend' | 'rentalProgress' | 'cart' | 'profile' | 'settings' | 'editItem';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [items, setItems] = useState(mockItems);

  React.useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) setIsLoggedIn(true);
    } catch {}
    // Apply saved theme and sync with OS when set to system
    const applyTheme = () => {
      let pref: string | null = null;
      try { pref = localStorage.getItem('theme'); } catch {}
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const shouldDark = pref === 'dark' || (pref === 'system' || !pref) && mql.matches;
      document.documentElement.classList.toggle('dark', !!shouldDark);
      return mql;
    };
    const mql = applyTheme();
    const onOsTheme = () => {
      let pref: string | null = null;
      try { pref = localStorage.getItem('theme'); } catch {}
      if (pref === 'system' || !pref) applyTheme();
    };
    try { mql.addEventListener('change', onOsTheme); } catch { mql.addListener(onOsTheme); }
    const onLogout = () => {
      setIsLoggedIn(false);
      setCurrentPage('home');
    };
    window.addEventListener('auth-logout', onLogout as EventListener);
    return () => {
      window.removeEventListener('auth-logout', onLogout as EventListener);
      try { mql.removeEventListener('change', onOsTheme); } catch { mql.removeListener(onOsTheme); }
    };
  }, []);

  const handleSuccessfulAuth = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'items':
        return <ItemsPage items={items} onNavigate={setCurrentPage} onOpenItem={(id) => { setSelectedItemId(id); setCurrentPage('itemDetails'); }} />;
      case 'itemDetails':
        return <ItemDetailsPage itemId={selectedItemId} onBack={() => setCurrentPage('items')} onNavigate={setCurrentPage} />;
      case 'rentalProgress':
        return <RentalProgressPage rentalId={selectedRentalId} onBack={() => setCurrentPage('dashboard')} />;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      case 'lend':
        if (!isLoggedIn) return <HomePage onNavigate={setCurrentPage} />;
        return <LendPage onBack={() => setCurrentPage('items')} onAddItem={(newItem) => { setItems((prev: any[]) => [newItem, ...prev]); setCurrentPage('items'); }} />;
      case 'editItem':
        if (!selectedItemId) return <HomePage onNavigate={setCurrentPage} />;
        return <EditItemPage itemId={selectedItemId} onDone={(goTo) => setCurrentPage(goTo)} />;
      case 'dashboard':
        return <DashboardPage onNavigate={(p: Page) => {
          setCurrentPage(p);
        }} onOpenRental={(id) => setSelectedRentalId(id)} />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onSuccess={handleSuccessfulAuth} />;
      case 'signup':
        return <SignUpPage onNavigate={setCurrentPage} onSuccess={handleSuccessfulAuth} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background theme-anim">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage('home');
          try { localStorage.removeItem('auth_token'); } catch {}
        }}
      />
      <main id="main" role="main">
        {(!isLoggedIn && (currentPage === 'dashboard' || currentPage === 'profile' || currentPage === 'settings' || currentPage === 'lend' || currentPage === 'editItem')) ? (
          <LoginPage onNavigate={setCurrentPage} onSuccess={handleSuccessfulAuth} />
        ) : renderPage()}
      </main>
      <Toaster richColors position="top-right" />
      <Footer />
    </div>
  );
}