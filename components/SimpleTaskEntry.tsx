
import React, { useState } from 'react';

interface SimpleTaskEntryProps {
  onAddTask: (title: string, startTime: string) => void;
  isProcessing: boolean;
}

const SimpleTaskEntry: React.FC<SimpleTaskEntryProps> = ({ onAddTask, isProcessing }) => {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    
    const timeToUse = taskTime || `${(new Date().getHours() + 1).toString().padStart(2, '0')}:00`;
    onAddTask(taskName, timeToUse);
    setTaskName('');
    setTaskTime('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[36px] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600">
          <i className="fa-solid fa-plus text-xs"></i>
        </div>
        Yeni Görev Planla
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Neler yapacaksın bugün?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !taskName.trim()}
            className="px-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-brand-500/20 active:scale-95"
          >
            {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleTaskEntry;
