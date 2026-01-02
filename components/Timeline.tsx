
import React, { useState } from 'react';
import { Task, TaskCategory, Habit } from '../types';

interface TimelineProps {
  tasks: Task[];
  wakeUpTime: string;
  bedTime: string;
  onToggleTask: (id: string) => void;
  onMoveTask: (taskId: string, newHour: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onAddHabitAtHour: (habit: Habit, hour: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  tasks, 
  onToggleTask, 
  onMoveTask, 
  onDeleteTask, 
  onUpdateTitle, 
  onAddHabitAtHour 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const sections = [
    { title: 'Sabah Rutini', range: [5, 11], icon: 'fa-sun', color: 'text-orange-400' },
    { title: 'Öğle Programı', range: [12, 17], icon: 'fa-cloud-sun', color: 'text-brand-500' },
    { title: 'Akşam Akışı', range: [18, 23], icon: 'fa-moon', color: 'text-indigo-400' },
    { title: 'Gece Rutini', range: [0, 4], icon: 'fa-stars', color: 'text-slate-400' }
  ];

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.WORK: return 'bg-brand-500';
      case TaskCategory.PERSONAL: return 'bg-blue-500';
      case TaskCategory.FITNESS: return 'bg-rose-500';
      case TaskCategory.LEARNING: return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const handleStartEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdateTitle(id, editValue);
    }
    setEditingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-brand-50');
    if (document.body.classList.contains('dark')) {
      e.currentTarget.classList.add('bg-slate-800/40');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-brand-50');
    e.currentTarget.classList.remove('bg-slate-800/40');
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    handleDragLeave(e);
    
    const taskId = e.dataTransfer.getData('taskId');
    const habitData = e.dataTransfer.getData('habit');
    const hourStr = hour.toString().padStart(2, '0');

    if (taskId) {
      onMoveTask(taskId, hourStr);
    } else if (habitData) {
      try {
        const habit = JSON.parse(habitData) as Habit;
        onAddHabitAtHour(habit, hourStr);
      } catch (err) {
        console.error("Failed to parse habit", err);
      }
    }
  };

  return (
    <div className="space-y-10">
      {sections.map((section) => {
        const hoursInSection = Array.from(
          { length: section.range[1] - section.range[0] + 1 },
          (_, i) => section.range[0] + i
        );

        const tasksInSection = tasks.filter(t => {
          const hour = parseInt(t.startTime.split(':')[0]);
          return hour >= section.range[0] && hour <= section.range[1];
        });

        if (tasksInSection.length === 0 && section.title === 'Gece Rutini') return null;

        return (
          <div key={section.title} className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700`}>
                <i className={`fa-solid ${section.icon} ${section.color} text-lg`}></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{section.title}</h3>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-4"></div>
            </div>

            <div className="space-y-2">
              {hoursInSection.map(hour => {
                const hourTasks = tasks.filter(t => t.startTime.startsWith(hour.toString().padStart(2, '0')));
                const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

                return (
                  <div 
                    key={hour}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, hour)}
                    className="group relative flex gap-4 p-2 rounded-2xl transition-all duration-300"
                  >
                    <div className="w-12 pt-4 text-[11px] font-bold text-slate-400 tabular-nums">
                      {timeLabel}
                    </div>

                    <div className="flex-1 space-y-2 min-h-[44px] flex flex-col justify-center">
                      {hourTasks.map(task => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                          onClick={() => onToggleTask(task.id)}
                          onDoubleClick={(e) => handleStartEdit(task, e)}
                          className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border shadow-sm group/item ${
                            task.completed 
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700 opacity-60' 
                            : 'bg-white dark:bg-slate-800 border-white dark:border-slate-700 hover:border-brand-500/30 hover:shadow-md'
                          }`}
                        >
                          <div 
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              task.completed 
                              ? 'bg-brand-500 border-brand-500' 
                              : 'border-slate-200 dark:border-slate-600 group-hover/item:border-brand-400'
                            }`}
                          >
                            {task.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                          </div>

                          <div className="flex-1">
                            {editingId === task.id ? (
                              <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleSaveEdit(task.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold p-0"
                              />
                            ) : (
                              <h4 className={`text-sm font-semibold transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                                {task.title}
                              </h4>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.startTime}</span>
                              <div className={`w-1 h-1 rounded-full ${getCategoryColor(task.category)}`}></div>
                              <span className="text-[10px] font-medium text-slate-400">{task.durationMinutes} dk</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                            className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      ))}
                      {hourTasks.length === 0 && (
                        <div className="h-px bg-slate-100 dark:bg-slate-800/50 w-full group-hover:bg-brand-100 dark:group-hover:bg-slate-700 transition-colors"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
