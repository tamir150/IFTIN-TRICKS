import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, Check, ArrowLeft, ArrowRight, LayoutGrid, ChevronRight, X } from 'lucide-react';
import { formatTime } from '../utils/timeFormat';
import { examService } from '../services/examService';
import { useQuiz } from '../hooks/useQuiz';
import { Results } from './Results';

export const Quiz = ({ user, triggerNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getExamById(id);
        if (data) {
          // Normalize question field names
          const normalizedQuestions = data.questions.map((q, idx) => ({
            ...q,
            id: q.id !== undefined ? q.id : idx,
            text: q.question || q.text,
            answer: q.answer !== undefined ? q.answer : q.correct
          }));
          setExam({ ...data, questions: normalizedQuestions });
        } else {
          navigate('/exams');
        }
      } catch (error) {
        console.error("Failed to load exam", error);
        triggerNotification("Could not load exam data.", "error");
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [id, navigate, triggerNotification]);

  const handleAutoSubmit = async () => {
    triggerNotification("Time's up! Auto-submitting...", "info");
    await handleFinish();
  };

  const {
    currentQuestionIdx,
    setCurrentQuestionIdx,
    selectedAnswers,
    flaggedQuestions,
    quizFinished,
    quizDurationLeft,
    selectOption,
    clearAnswer,
    toggleFlag,
    finishQuiz
  } = useQuiz(exam, handleAutoSubmit);

  const handleFinish = async () => {
    const correctCount = finishQuiz();
    if (user) {
      try {
        await examService.saveQuizResult(user.uid, id, correctCount, exam.questions.length, exam.title);
        triggerNotification(`Exam Finished! Score: ${correctCount}/${exam.questions.length}. Results saved.`, 'success');
      } catch (error) {
        triggerNotification("Results could not be synced.", "error");
      }
    } else {
      triggerNotification(`Exam Finished! Score: ${correctCount}/${exam.questions.length}.`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Initializing Exam Engine...</p>
      </div>
    );
  }

  if (quizFinished) {
    return <Results exam={exam} selectedAnswers={selectedAnswers} onBack={() => navigate('/exams')} />;
  }

  const currentQuestion = exam.questions[currentQuestionIdx];
  const totalQuestions = exam.questions.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. THE HEADER BAR */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => confirm("Exit exam? Progress will be lost.") && navigate('/exams')}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-none mb-1">{exam.title}</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{exam.subject} • ENTRANCE PREPARATION</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl font-mono text-sm font-black shadow-inner transition-all ${quizDurationLeft < 300 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(quizDurationLeft)}
            </div>
            
            <button 
              onClick={() => confirm("Finalize and submit your examination?") && handleFinish()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
            >
              Finish Exam
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE CENTRAL LAYOUT SPLIT */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 items-start">
        
        {/* LEFT SIDE / MAIN WORKSPACE (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* THE MISSING METRIC PANEL */}
          <div className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Question <span className="text-indigo-600">{currentQuestionIdx + 1}</span> of {totalQuestions}
            </span>
            <button 
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${flaggedQuestions[currentQuestion.id] ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100'}`}
            >
              <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQuestion.id] ? 'fill-rose-600' : ''}`} />
              {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
            </button>
          </div>

          {/* THE QUESTION BLOCK */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-12 relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed mb-12">
              {currentQuestion.text}
            </h3>

            {/* THE OPTION RATIOS */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <button 
                    key={idx} 
                    onClick={() => selectOption(currentQuestion.id, idx)}
                    className={`group w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-6 ${isSelected ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-50' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-base font-medium ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-600'}`}>{option}</span>
                    </div>
                    {isSelected && <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white animate-scaleUp"><Check className="w-3.5 h-3.5" /></div>}
                  </button>
                );
              })}
            </div>

            {selectedAnswers[currentQuestion.id] !== undefined && (
              <button 
                onClick={() => clearAnswer(currentQuestion.id)}
                className="mt-10 mx-auto flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest"
              >
                <X className="w-3 h-3" />
                Clear Answer
              </button>
            )}
          </div>

          {/* WORKSPACE NAVIGATION */}
          <div className="flex items-center justify-between pt-4">
            <button 
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button 
              onClick={() => currentQuestionIdx < totalQuestions - 1 ? setCurrentQuestionIdx(prev => prev + 1) : handleFinish()}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${currentQuestionIdx < totalQuestions - 1 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}
            >
              {currentQuestionIdx < totalQuestions - 1 ? 'Next Question' : 'Submit Exam'}
              {currentQuestionIdx < totalQuestions - 1 ? <ArrowRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE / NAVIGATION HUD (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              Navigation Matrix
            </h4>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2.5">
              {exam.questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];
                const isCurrent = idx === currentQuestionIdx;
                
                let btnClass = 'bg-slate-50 text-slate-400 border-slate-100';
                if (isCurrent) btnClass = 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 z-10';
                else if (isFlagged) btnClass = 'bg-rose-50 text-rose-600 border-rose-200';
                else if (isAnswered) btnClass = 'bg-indigo-50 text-indigo-600 border-indigo-100';

                return (
                  <button 
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`aspect-square rounded-xl border-2 text-[10px] font-black transition-all hover:scale-110 active:scale-90 flex items-center justify-center relative ${btnClass}`}
                  >
                    {idx + 1}
                    {isFlagged && !isCurrent && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>}
                  </button>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-3 h-3 bg-indigo-600 rounded-md"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-3 h-3 bg-indigo-50 border border-indigo-100 rounded-md"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-3 h-3 bg-rose-50 border border-rose-200 rounded-md"></div>
                <span>Flagged</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-3 h-3 bg-slate-50 border border-slate-100 rounded-md"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>

          {/* HELP CARD */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h5 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-3">Expert Insight</h5>
            <p className="text-sm font-medium leading-relaxed opacity-90 mb-6 italic">
              "Focus on the questions you know first. Use the Flag feature to mark complex problems for later review."
            </p>
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>

        </div>
      </main>
    </div>
  );
};
