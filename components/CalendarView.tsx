
import React from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const date = new Date();
  const month = date.toLocaleString('tr-TR', { month: 'long' });
  const year = date.getFullYear();
  
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, date.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

  const weekDays = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: adjustedFirstDay }, (_, i) => i);

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">{month} {year}</h3>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white/5 rounded-lg"><i className="fa-solid fa-chevron-left"></i></button>
           <button className="p-2 hover:bg-white/5 rounded-lg"><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {paddingDays.map(p => <div key={`p-${p}`} className="h-24 opacity-0"></div>)}
        {calendarDays.map(d => {
          const isToday = d === date.getDate();
          return (
            <div 
              key={d} 
              className={`h-24 glass rounded-2xl p-2 transition-all hover:border-brand-500/50 flex flex-col ${isToday ? 'ring-2 ring-brand-500 bg-brand-500/5' : ''}`}
            >
              <span className={`text-xs font-bold ${isToday ? 'text-brand-500' : 'text-slate-500'}`}>{d}</span>
              {isToday && tasks.length > 0 && (
                <div className="mt-auto space-y-1">
                  {tasks.slice(0, 2).map(t => (
                    <div key={t.id} className={`text-[8px] truncate px-1 rounded ${t.completed ? 'bg-emerald-500/20 text-emerald-400 line-through' : 'bg-brand-500/20 text-brand-400'}`}>
                      {t.title}
                    </div>
                  ))}
                  {tasks.length > 2 && <div className="text-[8px] text-slate-500 pl-1">+{tasks.length - 2} daha</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
