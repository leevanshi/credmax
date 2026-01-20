import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AddCard } from './pages/AddCard';
import { Recommendation } from './pages/Recommendation';
import { Analytics } from './pages/Analytics';
import { Rewards } from './pages/Rewards';
import { Transactions } from './pages/Transactions';
import { CardComparison } from './pages/CardComparison';
import { Trends } from './pages/Trends';
import { Optimizer } from './pages/Optimizer';
import { Toaster } from './components/ui/sonner';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center">
        <div className="text-white font-dmsans">Loading...</div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user && showAuth) {
    return <Auth onClose={() => setShowAuth(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'add-card':
        return <AddCard onNavigate={setCurrentPage} />;
      case 'recommendation':
        return <Recommendation onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics onNavigate={setCurrentPage} />;
      case 'rewards':
        return <Rewards onNavigate={setCurrentPage} />;
      case 'transactions':
        return <Transactions onNavigate={setCurrentPage} />;
      case 'comparison':
        return <CardComparison onNavigate={setCurrentPage} />;
      case 'trends':
        return <Trends onNavigate={setCurrentPage} />;
      case 'optimizer':
        return <Optimizer onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
