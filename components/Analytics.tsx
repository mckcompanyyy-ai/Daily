
import React from 'react';
import { Task, Habit, TaskCategory } from '../types';

interface AnalyticsProps {
  tasks: Task[];
  habits: Habit[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks, habits }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  const categoryStats = Object.values(TaskCategory).map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category === cat).length,
    completed: tasks.filter(t => t.category === cat && t.completed).length
  }));

  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          Performans Analizi
          <i className="fa-solid fa-chart-line text-brand-500/40"></i>
        </h2>
        <p className="text-sm text-slate-400 font-medium mt-1">Gelişimini ve verimliliğini takip et</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[36px] text-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
          <div className="text-4xl font-black text-brand-500 mb-2">%{completionRate}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Genel Başarı Oranı</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[36px] text-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
          <div className="text-4xl font-black text-emerald-500 mb-2">{completedTasks}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Tamamlanan Görev</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[36px] text-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
          <div className="text-4xl font-black text-orange-500 mb-2">
            {Math.max(0, ...habits.map(h => h.streak))}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">En Uzun Seri</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[44px] border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2">
          <i className="fa-solid fa-shapes text-brand-500"></i>
          Kategori Dağılımı
        </h3>
        <div className="space-y-8">
          {categoryStats.filter(s => s.count > 0).map(stat => (
            <div key={stat.name} className="group">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="font-bold text-slate-700 dark:text-slate-300">{stat.name}</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.completed} / {stat.count} Tamamlandı</span>
              </div>
              <div className="w-full h-3 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                <div 
                  className="h-full bg-brand-500 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{ width: `${stat.count > 0 ? (stat.completed / stat.count) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-10">
              <i className="fa-solid fa-inbox text-slate-200 text-4xl mb-4 block"></i>
              <p className="text-slate-400 font-medium italic">Analiz edilecek veri henüz bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
