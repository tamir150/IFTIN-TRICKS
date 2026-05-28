import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = ({ onSignIn, onOpenAuth }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Your Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1 mb-8">Sign in to track your progress and access premium exams</p>
        
        <button 
          onClick={onOpenAuth}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-md active:scale-95"
        >
          Click here to Login / Sign Up
        </button>
        
        <p className="text-slate-400 text-xs mt-6">By continuing, you agree to our terms of learning and automated progression tracking.</p>
      </div>
    </div>
  );
};
