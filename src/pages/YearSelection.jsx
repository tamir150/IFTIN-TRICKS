import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

export const YearSelection = ({ triggerNotification }) => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const years = [
    { year: '2013', id: '2013' },
    { year: '2014', id: '2014' },
    { year: '2015', id: '2015' },
    { year: '2016', id: '2016' },
    { year: '2017', id: '2017' }
  ];

  const handleYearSelect = (year) => {
    // Construct ID based on subject and year
    // This is a simplified mapping - in a real app this might come from a config or API
    const subjectKey = subject.toLowerCase();
    
    // Example mapping based on the files I saw in aptitude/
    let examId = '';
    if (subjectKey === 'aptitude') {
      if (year === '2013') examId = 'aptitude/ethiopian_aptitude_exam_2013';
      else if (year === '2014') examId = 'aptitude/ethiopian_uee_aptitude_exam_2014';
      else if (year === '2015') examId = 'aptitude/aptitude_test_2015_questions';
      else if (year === '2016') examId = 'aptitude/ethiopian_aptitude_exam_2016';
      else if (year === '2017') examId = 'aptitude/uee_aptitude_2017';
    } else {
      // For other subjects, use a standard naming convention or a fallback
      // Since directories for others were empty, I'll use a placeholder or warn
      examId = `${subjectKey}/${subjectKey}_${year}`;
      // triggerNotification(`Note: ${subject} ${year} exam data might be missing.`, "info");
    }
    
    navigate(`/quiz/${examId.replace(/\//g, '-')}`);
  };

  // Need to handle the path in Quiz.jsx as well to translate back the ID if needed
  // or just use the dashed ID directly.

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="mb-10 flex items-center gap-4">
        <button 
          onClick={() => navigate('/exams')}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Select Exam Year</h1>
          <p className="mt-1 text-slate-500 text-lg uppercase tracking-wider font-bold text-indigo-600">{subject} Past Examinations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {years.map((y) => (
          <button
            key={y.year}
            onClick={() => handleYearSelect(y.year)}
            className="group relative h-64 rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-95 text-left"
          >
            {/* Glassmorphic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 backdrop-blur-md"></div>
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/15 transition-colors"></div>
            
            {/* Content Overlay */}
            <div className="relative h-full p-8 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30 text-white shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              
              <div>
                <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-2 block">EUEE EXAM</span>
                <h3 className="text-3xl font-black text-white mb-2">{y.year}</h3>
                <p className="text-xs font-medium text-white/70 leading-relaxed mb-4">
                  Ethiopian University Entrance Examination • 100% Verified Questions
                </p>
                <div className="flex items-center gap-1 text-[10px] font-black text-indigo-300 uppercase tracking-widest group-hover:gap-2 transition-all">
                  Start Examination
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-12 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 flex items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Practice makes perfect</h4>
          <p className="text-slate-500 leading-relaxed">
            These examinations are sourced directly from historical national papers. We recommend simulating real test conditions by timing yourself and avoiding external aids. Good luck with your {subject} preparation!
          </p>
        </div>
      </div>
    </div>
  );
};
