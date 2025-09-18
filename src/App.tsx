import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ItemsPage } from './components/ItemsPage';
import { DashboardPage } from './components/DashboardPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSuccessfulAuth = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'items':
        return <ItemsPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
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