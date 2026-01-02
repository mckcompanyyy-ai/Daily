
import React from 'react';
import { Task, Habit } from '../types';

interface BadgesSectionProps {
  tasks: Task[];
  habits: Habit[];
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ tasks, habits }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const maxStreak = Math.max(0, ...habits.map(h => h.streak));

  const badges = [
    { id: '1', name: 'İlk Adım', desc: 'Bir görevi tamamladın', icon: 'fa-shoe-prints', color: 'text-blue-500', earned: completedTasks >= 1 },
    { id: '2', name: 'Üretken', desc: '5 görevi tamamladın', icon: 'fa-bolt', color: 'text-yellow-500', earned: completedTasks >= 5 },
    { id: '3', name: 'Düzenli', desc: '3 alışkanlık kazandın', icon: 'fa-calendar-check', color: 'text-emerald-500', earned: completedHabits >= 3 },
    { id: '4', name: 'İstikrar', desc: '7 günlük seri yaptın', icon: 'fa-fire', color: 'text-orange-600', earned: maxStreak >= 7 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[36px] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600">
          <i className="fa-solid fa-medal text-[10px]"></i>
        </div>
        Başarı Rozetleri
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={`group relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-500 border ${badge.earned ? 'bg-brand-50/30 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/20 shadow-sm' : 'opacity-30 grayscale border-slate-100 dark:border-slate-800'}`}
          >
            <i className={`fa-solid ${badge.icon} text-xl mb-2 ${badge.earned ? badge.color : 'text-slate-500'}`}></i>
            <span className={`text-[10px] font-black uppercase tracking-widest text-center ${badge.earned ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>{badge.name}</span>
            
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 bg-slate-900 text-white text-[10px] p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none z-50 shadow-xl border border-white/10">
              <span className="font-bold block mb-1">{badge.name}</span>
              {badge.desc}
            </div>
            {badge.earned && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;
