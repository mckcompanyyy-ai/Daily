
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitGridProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddToSchedule: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: (name: string, icon: string) => void;
}

const HabitGrid: React.FC<HabitGridProps> = ({ habits, onToggleHabit, onAddToSchedule, onDeleteHabit, onAddHabit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const handleCreate = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName, 'fa-star'); // Varsayılan ikon
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      {habits.map((habit) => (
        <div
          key={habit.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('habit', JSON.stringify(habit));
          }}
          className={`bg-white dark:bg-slate-800/50 p-5 rounded-[28px] border-2 flex flex-col items-center justify-center transition-all duration-300 relative group cursor-grab active:cursor-grabbing ${habit.completedToday ? 'border-brand-500 shadow-lg shadow-brand-500/10' : 'border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600'}`}
        >
          {/* Aksiyon butonları */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToSchedule(habit); }}
              className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all shadow-sm"
              title="Programa Ekle"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteHabit(habit.id); }}
              className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              title="Sil"
            >
              <i className="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>

          <div 
            onClick={() => onToggleHabit(habit.id)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-xl cursor-pointer transition-all ${habit.completedToday ? 'bg-brand-500 text-white rotate-12' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
          >
            <i className={`fa-solid ${habit.icon}`}></i>
          </div>
          
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 text-center truncate w-full px-1">{habit.name}</span>
          
          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <i className="fa-solid fa-fire text-orange-500"></i>
            {habit.streak} gün
          </div>
        </div>
      ))}

      {/* Alışkanlık Ekle Butonu/Formu */}
      {isAdding ? (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-[28px] border-2 border-brand-500 flex flex-col items-center gap-3 animate-in zoom-in duration-300">
          <input 
            autoFocus
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Alışkanlık adı..."
            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          <div className="flex gap-2 w-full">
            <button onClick={handleCreate} className="flex-1 bg-brand-500 text-white text-[10px] font-black py-2 rounded-xl shadow-md shadow-brand-500/10">Ekle</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 text-[10px] font-black py-2 rounded-xl">İptal</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 rounded-[28px] flex flex-col items-center justify-center hover:border-brand-500/50 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all text-slate-400 hover:text-brand-600"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2">
            <i className="fa-solid fa-plus"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Yeni Ekle</span>
        </button>
      )}
    </div>
  );
};

export default HabitGrid;
