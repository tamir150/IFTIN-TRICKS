import React from 'react';
import { Award } from 'lucide-react';
import { LEADERBOARD_DATA } from '../services/mockData';

export const Leaderboard = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn">
      <div className="text-center mb-10">
        <Award className="w-16 h-16 text-indigo-600 mx-auto mb-2" />
        <h1 className="text-4xl font-extrabold text-slate-900">IFTIN TRICKS Leaderboard</h1>
        <p className="mt-2 text-slate-500">Compete with student peers from across the nation & track your standing</p>
      </div>

      {user && (
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">{user.name.charAt(0)}</div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Your Standing</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.grade}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="block text-xl font-black text-indigo-900">{user.score}</span>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Score</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-black text-indigo-900">{user.completedExamsCount}</span>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Attempted</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {LEADERBOARD_DATA.map((student) => (
            <div key={student.rank} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center ${student.rank === 1 ? 'bg-amber-100 text-amber-800 font-black' : student.rank === 2 ? 'bg-slate-200 text-slate-800' : student.rank === 3 ? 'bg-amber-50 text-amber-700' : 'text-slate-500'}`}>#{student.rank}</span>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center">{student.avatar}</div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900">{student.name}</h4>
                  <p className="text-xs text-slate-500">{student.grade}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <span className="block font-bold text-slate-900">{student.score} PTS</span>
                  <span className="text-[10px] text-slate-400 font-medium block">{student.examsAttempted} exams</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
