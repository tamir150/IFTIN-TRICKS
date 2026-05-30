import React from 'react';
import { BookOpen, Calculator, Beaker, Atom, Globe, Brain, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Exams = ({ user, onOpenAuth, triggerNotification }) => {
  const navigate = useNavigate();

  const subjects = [
    { name: 'Maths', icon: <Calculator className="w-8 h-8" />, color: 'from-blue-500 to-indigo-600', description: 'Calculus, Algebra, Geometry' },
    { name: 'Physics', icon: <Atom className="w-8 h-8" />, color: 'from-indigo-500 to-purple-600', description: 'Mechanics, Electromagnetism, Optics' },
    { name: 'Chemistry', icon: <Beaker className="w-8 h-8" />, color: 'from-purple-500 to-pink-600', description: 'Organic, Inorganic, Physical Chemistry' },
    { name: 'Biology', icon: <Globe className="w-8 h-8" />, color: 'from-emerald-500 to-teal-600', description: 'Genetics, Physiology, Ecology' },
    { name: 'English', icon: <BookOpen className="w-8 h-8" />, color: 'from-amber-500 to-orange-600', description: 'Grammar, Vocabulary, Reading' },
    { name: 'Aptitude', icon: <Brain className="w-8 h-8" />, color: 'from-rose-500 to-red-600', description: 'Logic, Reasoning, Quantitative' },
  ];

  const handleSubjectSelect = (subjectName) => {
    if (!user) {
      onOpenAuth();
      triggerNotification("Please sign in to access practice materials", "info");
      return;
    }
    navigate(`/exams/${subjectName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="mb-12 text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Practice Portal</h1>
        <p className="text-slate-500 text-lg font-medium">Select a subject to explore historical entrance examinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => handleSubjectSelect(subject.name)}
            className="group relative flex flex-col items-start p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-2 text-left overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.color} opacity-[0.03] rounded-bl-[5rem] group-hover:opacity-[0.07] transition-opacity`}></div>
            
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100 transform group-hover:scale-110 transition-transform duration-500`}>
              {subject.icon}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">{subject.name}</h3>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                {subject.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-black text-indigo-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                View Past Exams
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom Progress Indicator (Subtle) */}
            <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-indigo-500 to-violet-600 group-hover:w-full transition-all duration-500"></div>
          </button>
        ))}
      </div>

      {/* Stats/Info Section */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 p-10 bg-indigo-900 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="space-y-2 relative z-10">
          <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Total Questions</p>
          <h4 className="text-4xl font-black">2,500+</h4>
          <p className="text-indigo-200/60 text-sm">Sourced from official papers</p>
        </div>
        <div className="space-y-2 relative z-10">
          <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Past Papers</p>
          <h4 className="text-4xl font-black">50+</h4>
          <p className="text-indigo-200/60 text-sm">Covering years 2013-2024</p>
        </div>
        <div className="space-y-2 relative z-10">
          <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Active Students</p>
          <h4 className="text-4xl font-black">15.2k</h4>
          <p className="text-indigo-200/60 text-sm">Preparing for success together</p>
        </div>
      </div>
    </div>
  );
};
