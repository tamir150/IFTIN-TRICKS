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
          // Normalize question field names if they differ from JSON schema
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
        await examService.saveQuizResult(
          user.uid, 
          id, 
          correctCount, 
          exam.questions.length, 
          exam.title
        );
        triggerNotification(`Exam Finished! Score: ${correctCount}/${exam.questions.length}. Results saved.`, 'success');
      } catch (error) {
        console.error(error);
        triggerNotification("Results could not be synced to cloud.", "error");
      }
    } else {
      triggerNotification(`Exam Finished! Score: ${correctCount}/${exam.questions.length}.`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading Exam Engine...</p>
      </div>
    );
  }

  if (quizFinished) {
    return <Results exam={exam} selectedAnswers={selectedAnswers} onBack={() => navigate('/exams')} />;
  }

  const currentQuestion = exam.questions[currentQuestionIdx];
  const totalQuestions = exam.questions.length;
  const progress = ((Object.keys(selectedAnswers).length) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => confirm("Exit exam? Progress will not be saved.") && navigate('/exams')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-slate-900 leading-none">{exam.title}</h2>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{exam.subject}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm font-black transition-colors ${quizDurationLeft < 300 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(quizDurationLeft)}
            </div>
            
            <button 
              onClick={() => setShowPalette(!showPalette)}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all sm:hidden"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            <button 
              onClick={() => confirm("Finish and submit your exam?") && handleFinish()}
              className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              Finish Exam
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Question {currentQuestionIdx + 1} of {totalQuestions}</span>
              <button 
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${flaggedQuestions[currentQuestion.id] ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
              >
                <Flag className={`w-3 h-3 ${flaggedQuestions[currentQuestion.id] ? 'fill-rose-600' : ''}`} />
                {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-10 leading-relaxed">
              {currentQuestion.text}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === oIdx;
                return (
                  <button 
                    key={oIdx} 
                    onClick={() => selectOption(currentQuestion.id, oIdx)}
                    className={`group w-full p-5 rounded-2xl border-2 text-left text-sm transition-all flex items-center justify-between gap-4 ${isSelected ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 animate-scaleUp"><Check className="w-4 h-4" /></div>}
                  </button>
                );
              })}
            </div>

            {selectedAnswers[currentQuestion.id] !== undefined && (
              <button 
                onClick={() => clearAnswer(currentQuestion.id)}
                className="mt-6 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1 mx-auto"
              >
                <X className="w-3 h-3" />
                Clear Answer
              </button>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button 
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <div className="flex gap-2">
              {currentQuestionIdx < totalQuestions - 1 ? (
                <button 
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => confirm("Finish and submit your exam?") && handleFinish()}
                  className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  Finish Exam
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:col-span-4 transition-transform duration-300 ${showPalette ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="h-full bg-white lg:bg-transparent lg:border-0 border-l border-slate-200 shadow-2xl lg:shadow-none p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h4 className="font-black text-slate-900">Question Palette</h4>
              <button onClick={() => setShowPalette(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hidden lg:block mb-6">
              <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                Navigation
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = idx === currentQuestionIdx;
                  
                  let stateClass = 'bg-slate-50 text-slate-400 border-slate-100';
                  if (isCurrent) stateClass = 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-100 ring-offset-1';
                  else if (isFlagged) stateClass = 'bg-rose-50 text-rose-600 border-rose-200';
                  else if (isAnswered) stateClass = 'bg-indigo-50 text-indigo-600 border-indigo-100';

                  return (
                    <button 
                      key={idx}
                      onClick={() => { setCurrentQuestionIdx(idx); setShowPalette(false); }}
                      className={`aspect-square rounded-xl border-2 text-[10px] font-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative ${stateClass}`}
                    >
                      {idx + 1}
                      {isFlagged && !isCurrent && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-indigo-50 border border-indigo-100 rounded-sm"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-rose-50 border border-rose-200 rounded-sm"></div>
                  <span>Flagged</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 hidden lg:block">
              <h5 className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Need Help?</h5>
              <p className="text-sm font-medium leading-relaxed mb-4">Don't rush! You have plenty of time. Focus on accuracy over speed.</p>
              <button 
                onClick={() => confirm("Finish exam?") && handleFinish()}
                className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
