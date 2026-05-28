import React from 'react';
import { GraduationCap, ArrowRight, BarChart2, CheckCircle, TrendingUp, ChevronRight, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const Home = ({ onStartPracticing, onViewLeaderboard, onExplorePortal }) => {
  const { isInstallable, installPWA } = usePWA();

  return (
    <div className="animate-fadeIn">
      {/* HERO ZONE */}
      <div className="relative bg-gradient-to-b from-indigo-900 via-indigo-950 to-indigo-900 text-white overflow-hidden py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md">
              <GraduationCap className="w-4 h-4" />
              <span>Your Path to Success</span>
            </div>
            
            {isInstallable && (
              <button 
                onClick={installPWA}
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold animate-pulse hover:bg-emerald-500/30 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                Install for better experience
              </button>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-50 to-indigo-100">
              Master Your <br className="hidden sm:block" />
              Entrance Exams
            </h1>
            <p className="text-lg text-indigo-200 font-light max-w-lg leading-relaxed">
              Practice with real exam questions, compete on leaderboards, and track your progress. Join thousands of students achieving their academic dreams with IFTIN TRICKS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={onStartPracticing} className="bg-white text-indigo-950 hover:bg-indigo-50 px-8 py-4 rounded-xl text-base font-bold shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-95">
                Start Practicing
                <ArrowRight className="w-5 h-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onViewLeaderboard} className="border border-indigo-400/50 hover:bg-white/5 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2">
                View Leaderboard
              </button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-indigo-800/20 rounded-3xl p-8 border border-white/10 backdrop-blur-lg flex flex-col justify-between aspect-square relative shadow-2xl group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-center opacity-70 mb-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/40"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/40"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/40"></span>
                </div>
                <div className="h-4 w-32 bg-indigo-500/20 rounded-md"></div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="w-40 h-40 rounded-full bg-indigo-600/30 border border-indigo-400/20 flex items-center justify-center text-white/90 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-24 h-24 stroke-[1.2] text-indigo-200" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <div className="h-5 w-48 bg-white/20 rounded-md mx-auto"></div>
                <div className="h-3.5 w-32 bg-indigo-400/20 rounded-md mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SELECTION CARD FEATURES */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Why Choose IFTIN TRICKS?</h2>
            <p className="mt-4 text-lg text-slate-500">Everything you need to study, evaluate, and excel in your upcoming past examinations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6"><BarChart2 className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Practice Exams</h3>
              <p className="text-slate-500 leading-relaxed">Access hundreds of past exams tailored to your curriculum and learning needs.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6"><CheckCircle className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Results</h3>
              <p className="text-slate-500 leading-relaxed">Get immediate feedback on your answers with detailed explanations.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6"><TrendingUp className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Progress Tracking</h3>
              <p className="text-slate-500 leading-relaxed">Monitor your improvement over time with detailed analytics and insights.</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <button onClick={onExplorePortal} className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-6 py-3 rounded-2xl transition-all">
              Explore Practice Portal
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
