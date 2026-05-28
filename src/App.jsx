import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Exams } from './pages/Exams';
import { Quiz } from './pages/Quiz';
import { Leaderboard } from './pages/Leaderboard';
import { News } from './pages/News';
import { Login } from './pages/Login';

// Hooks
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('signup');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Auto-close notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSignOut = async () => {
    try {
      await logout();
      triggerNotification("Logged out successfully.");
      navigate('/');
    } catch (error) {
      triggerNotification("Error signing out.", "error");
    }
  };

  const openAuth = (tab = 'signin') => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200">
      
      {/* GLOBAL NOTIFICATION COMPONENT */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all transform duration-300 translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 
          notification.type === 'error' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Navbar user={user} onSignOut={handleSignOut} onOpenAuth={() => openAuth('signin')} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <Home 
              onStartPracticing={() => user ? navigate('/exams') : openAuth('signup')} 
              onViewLeaderboard={() => navigate('/leaderboard')}
              onExplorePortal={() => navigate('/exams')}
            />
          } />
          
          <Route path="/exams" element={
            <ProtectedRoute>
              <Exams user={user} onOpenAuth={() => openAuth('signin')} triggerNotification={triggerNotification} />
            </ProtectedRoute>
          } />
          
          <Route path="/quiz/:id" element={
            <ProtectedRoute>
              <Quiz user={user} triggerNotification={triggerNotification} />
            </ProtectedRoute>
          } />
          
          <Route path="/leaderboard" element={<Leaderboard user={user} />} />
          <Route path="/news" element={<News triggerNotification={triggerNotification} />} />
          <Route path="/login" element={<Login onOpenAuth={() => openAuth('signin')} />} />
        </Routes>
      </main>

      <Footer triggerNotification={triggerNotification} />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialTab={authTab}
        triggerNotification={triggerNotification}
      />

    </div>
  );
}
