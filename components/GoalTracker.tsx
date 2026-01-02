
import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (title: string, period: 'weekly' | 'monthly', target: number) => void;
  onUpdateProgress: (id: string, increment: number) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onUpdateProgress, onDeleteGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [target, setTarget] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddGoal(title, period, target);
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[36px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600">
            <i className="fa-solid fa-bullseye text-sm"></i>
          </div>
          Hedef Takibi
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-[10px] font-black text-brand-600 hover:bg-brand-500 hover:text-white transition-all uppercase tracking-widest"
        >
          {isAdding ? 'İPTAL' : 'YENİ HEDEF'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-10 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">HEDEF BAŞLIĞI</label>
            <input 
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: 10 Kitap Oku"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PERİYOT</label>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none cursor-pointer"
              >
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            <div className="w-24 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">HEDEF</label>
              <input 
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-95 transition-all">
            HEDEFİ KAYDET
          </button>
        </form>
      )}

      <div className="space-y-8">
        {goals.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
               <i className="fa-solid fa-flag text-lg"></i>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Henüz bir hedef yok</p>
          </div>
        )}
        {goals.map(goal => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="group relative">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 pr-4">
                  <h4 className={`text-sm font-black truncate ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                    {goal.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                      {goal.period === 'weekly' ? 'Haftalık' : 'Aylık'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {goal.current} / {goal.target} Tamamlandı
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => onUpdateProgress(goal.id, 1)}
                    disabled={goal.completed}
                    className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-brand-50"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
              
              <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${goal.completed ? 'bg-emerald-500' : 'bg-brand-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {goal.completed && (
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-in zoom-in duration-500">
                  <i className="fa-solid fa-check text-[10px]"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;
