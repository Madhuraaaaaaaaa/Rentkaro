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

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails' | 'lend' | 'rentalProgress' | 'cart';

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
      case 'dashboard':
        return <DashboardPage onNavigate={(p: Page) => {
          if (p === 'rentalProgress') { setSelectedRentalId('mock'); }
          setCurrentPage(p);
        }} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onSuccess={handleSuccessfulAuth} />;
      case 'signup':
        return <SignUpPage onNavigate={setCurrentPage} onSuccess={handleSuccessfulAuth} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage('home');
        }}
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}