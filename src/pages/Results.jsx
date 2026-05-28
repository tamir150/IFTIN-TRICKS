import React from 'react';
import { Award, Flag, Check, ArrowLeft, Info, HelpCircle } from 'lucide-react';

export const Results = ({ exam, selectedAnswers, onBack }) => {
  // Calculate score
  const correctCount = exam.questions.reduce((acc, q, idx) => {
    const questionKey = q.id !== undefined ? q.id : idx;
    const answer = q.answer !== undefined ? q.answer : q.correct;
    return acc + (selectedAnswers[questionKey] === answer ? 1 : 0);
  }, 0);
  
  const totalQuestions = exam.questions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const pointsEarned = correctCount * 10; // 10 points per correct answer

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header Result Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white rounded-[2rem] p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-4">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Exam Completed!</h2>
          <p className="text-indigo-100 text-sm mb-8 opacity-80">Excellent work on completing the {exam.title}.</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto bg-black/20 backdrop-blur-sm p-5 rounded-2xl">
            <div className="text-center">
              <span className="block text-2xl font-black text-white">{correctCount}/{totalQuestions}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Score</span>
            </div>
            <div className="text-center border-x border-white/10">
              <span className="block text-2xl font-black text-amber-300">{accuracy}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Accuracy</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-emerald-400">+{pointsEarned}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Answer Review
          </h3>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </button>
        </div>

        {exam.questions.map((q, idx) => {
          const questionKey = q.id !== undefined ? q.id : idx;
          const chosenIdx = selectedAnswers[questionKey];
          const correctIdx = q.answer !== undefined ? q.answer : q.correct;
          const isCorrect = chosenIdx === correctIdx;
          
          return (
            <div key={idx} className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className={`p-4 sm:p-6 border-l-4 ${isCorrect ? 'border-emerald-500' : 'border-rose-500'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {idx + 1}</span>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {isCorrect ? 'Correct' : chosenIdx === undefined ? 'Unanswered' : 'Incorrect'}
                  </div>
                </div>
                
                <h4 className="text-base font-bold text-slate-900 mb-6 leading-relaxed">{q.question || q.text}</h4>
                
                <div className="space-y-3 mb-6">
                  {q.options.map((option, oIdx) => {
                    const isSelected = chosenIdx === oIdx;
                    const isRightAnswer = correctIdx === oIdx;
                    
                    let bgClass = 'bg-slate-50 border-slate-200 text-slate-600';
                    let icon = null;
                    
                    if (isRightAnswer) {
                      bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold ring-1 ring-emerald-500/20';
                      icon = <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
                    } else if (isSelected && !isRightAnswer) {
                      bgClass = 'bg-rose-50 border-rose-200 text-rose-900 ring-1 ring-rose-500/20';
                    }

                    return (
                      <div key={oIdx} className={`p-4 rounded-xl border text-sm flex items-center justify-between transition-all ${bgClass}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center ${isRightAnswer ? 'bg-emerald-500 text-white' : isSelected ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
                    <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Explanation</span>
                      <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center pb-10">
        <button 
          onClick={onBack}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-3 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Finish Review & Go Back
        </button>
      </div>
    </div>
  );
};
