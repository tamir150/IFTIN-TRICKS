import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, BookOpen, Clock, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchExams } from '../services/examService';

export const Exams = ({ user, onOpenAuth, triggerNotification }) => {
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      const data = await fetchExams();
      setExams(data);
    };
    loadExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || exam.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleStartExam = (exam) => {
    if (!user) {
      onOpenAuth();
      triggerNotification("Please sign in or register to access the Practice Board", "info");
      return;
    }
    if (exam.status === 'Locked') {
      triggerNotification("This premium unit test is locked. Earn more points to unlock!", "error");
      return;
    }
    navigate(`/quiz/${exam.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Practice Exams</h1>
        <p className="mt-2 text-slate-500 text-lg">Choose from our comprehensive collection of past exams to test your knowledge</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        <div className="lg:col-span-8 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past exams..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div className="lg:col-span-4 relative">
          <label className="absolute -top-2.5 left-4 px-1.5 bg-slate-50 text-[11px] font-bold text-indigo-600 tracking-wider">Subject</label>
          <button onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-left text-slate-700 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <span className="font-medium text-sm">{selectedSubject}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${subjectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {subjectDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
              {['All Subjects', 'English', 'Mathematics', 'Physics', 'Biology', 'Aptitude'].map((subject) => (
                <button
                  key={subject}
                  onClick={() => { setSelectedSubject(subject); setSubjectDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedSubject === subject ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {subject}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => {
            const isAttempted = exam.status === 'Attempted';
            return (
              <div key={exam.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-stretch text-left">
                <div className="p-6 md:w-32 flex items-center justify-center text-white relative bg-gradient-to-br from-indigo-500 to-violet-600">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Past Exam</span>
                      <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-md">{exam.badgeText}</span>
                      {isAttempted && <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Attempted</span>}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">{exam.title}</h3>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-slate-400" />{exam.questionsCount} Questions</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" />{exam.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleStartExam(exam)} className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${isAttempted ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                      {isAttempted ? 'Re-attempt' : 'Start Practicing'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-700">No exams match your search filters</p>
            <button onClick={() => { setSearchQuery(''); setSelectedSubject('All Subjects'); }} className="mt-4 text-sm text-indigo-600 font-bold hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};
