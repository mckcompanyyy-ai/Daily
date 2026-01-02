
import React, { useState, useEffect } from 'react';
import { getDailyQuote } from '../services/geminiService';

const MotivationQuote: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const result = await getDailyQuote();
        setQuote(result || '"Dünü değiştiremezsin ama bugünü harika yapabilirsin." - Anonim');
      } catch (error) {
        console.error("Alıntı getirilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <i className="fa-solid fa-quote-right text-4xl text-brand-500"></i>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
          <i className="fa-solid fa-lightbulb text-xs"></i>
        </div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Günün İlhamı</h4>
      </div>
      {loading ? (
        <div className="py-4 space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3 animate-pulse"></div>
        </div>
      ) : (
        <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base italic font-medium leading-relaxed">
          {quote}
        </p>
      )}
    </div>
  );
};

export default MotivationQuote;
