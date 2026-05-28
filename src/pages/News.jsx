import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';

export const News = ({ triggerNotification }) => {
  const articles = [
    {
      title: "How to Ace the 2026 National College Matriculation Exams",
      date: "May 18, 2026",
      category: "Exam Prep Tips",
      summary: "Expert breakdown of crucial structural sections, weight of subjects, timing heuristics, and psychological hacks to enhance focus."
    },
    {
      title: "A Comprehensive Guide to Grade 12 Advanced Biology and Aptitude Units",
      date: "April 29, 2026",
      category: "Academic Support",
      summary: "Deep-dive analysis of cell calculations, genetic sequences, and mathematical patterns designed for immediate matriculation prep."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn">
      <div className="text-center mb-12">
        <Newspaper className="w-16 h-16 text-indigo-600 mx-auto mb-2" />
        <h1 className="text-4xl font-extrabold text-slate-900">IFTIN TRICKS News</h1>
        <p className="mt-2 text-slate-500">Stay up to date with fresh academic news, tips, and guidelines</p>
      </div>

      <div className="space-y-6 text-left">
        {articles.map((article, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">{article.category}</span>
              <span className="text-xs text-slate-400 font-medium">• {article.date}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{article.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{article.summary}</p>
            <button onClick={() => triggerNotification("Full articles will be available soon!", "info")} className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1">
              Read full article <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
