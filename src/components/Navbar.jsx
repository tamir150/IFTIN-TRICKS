import React from 'react';
import { BookOpen, Award, Newspaper, LogOut, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { usePWA } from '../hooks/usePWA';

export const Navbar = ({ user, onSignOut, onOpenAuth }) => {
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'landing';
  const { isInstallable, installPWA } = usePWA();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            I
          </div>
          <div className="text-left">
            <span className="block text-lg font-bold text-slate-900 tracking-tight leading-none">IFTIN TRICKS</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Mastery Suite</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/exams" 
            className={`flex items-center gap-2 font-medium text-sm transition-colors py-1 border-b-2 ${
              currentPage === 'exams' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Exams
          </Link>
          <Link 
            to="/leaderboard" 
            className={`flex items-center gap-2 font-medium text-sm transition-colors py-1 border-b-2 ${
              currentPage === 'leaderboard' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            Leaderboard
          </Link>
          <Link 
            to="/news" 
            className={`flex items-center gap-2 font-medium text-sm transition-colors py-1 border-b-2 ${
              currentPage === 'news' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            News
          </Link>
        </nav>

        {/* User Profile / Login Area */}
        <div className="flex items-center gap-3">
          {isInstallable && (
            <button 
              onClick={installPWA}
              className="hidden sm:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="block text-sm font-semibold text-slate-800">{user.name}</span>
                <span className="block text-xs text-indigo-600 font-bold">{user.score} PTS • {user.grade}</span>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md border-2 border-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {user.name.charAt(0)}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 hidden group-hover:block hover:block transition-all z-50">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-xs text-slate-400">Signed in</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{user.phone}</p>
                  </div>
                  <Link 
                    to="/exams" 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    My Dashboard
                  </Link>
                  <button 
                    onClick={onSignOut} 
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
