
import React, { useState, useEffect } from 'react';
import Timeline from './components/Timeline';
import HabitGrid from './components/HabitGrid';
import SimpleTaskEntry from './components/SimpleTaskEntry';
import MotivationQuote from './components/MotivationQuote';
import CalendarView from './components/CalendarView';
import BadgesSection from './components/BadgesSection';
import ProgressSummary from './components/ProgressSummary';
import Analytics from './components/Analytics';
import Onboarding from './components/Onboarding';
import AgeInsights from './components/AgeInsights';
import GoalTracker from './components/GoalTracker';
import SettingsModal from './components/SettingsModal';
import ThemeSwitcher, { AppTheme } from './components/ThemeSwitcher';
import { Task, Habit, TaskCategory, User, Goal } from './types';
import { generateSummary } from './services/geminiService';

const BACKGROUNDS = {
  day: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80',
  night: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80'
};

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Sabah Suyu', streak: 12, completedToday: false, icon: 'fa-glass-water' },
  { id: '2', name: 'Kitap Oku', streak: 5, completedToday: false, icon: 'fa-book-open' },
  { id: '3', name: 'Meditasyon', streak: 8, completedToday: false, icon: 'fa-om' },
  { id: '4', name: 'Egzersiz', streak: 2, completedToday: false, icon: 'fa-dumbbell' },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Günü Planla', startTime: '08:00', durationMinutes: 15, category: TaskCategory.PERSONAL, completed: true },
  { id: '2', title: 'Ekip Toplantısı', startTime: '10:00', durationMinutes: 45, category: TaskCategory.WORK, completed: false },
  { id: '3', title: 'Derin Odaklanma', startTime: '11:00', durationMinutes: 120, category: TaskCategory.WORK, completed: false },
  { id: '4', title: 'Akşam Yürüyüşü', startTime: '18:30', durationMinutes: 30, category: TaskCategory.FITNESS, completed: false },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<AppTheme>('emerald');
  const [view, setView] = useState<'plan' | 'calendar' | 'analytics' | 'habits'>('plan');
  const [usageStreak, setUsageStreak] = useState(1);
  const [celebrationGoal, setCelebrationGoal] = useState<Goal | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('gunluk_plan_user');
    const savedGoals = localStorage.getItem('gunluk_plan_goals');
    const savedStreak = localStorage.getItem('gunluk_plan_streak');
    const savedTheme = localStorage.getItem('gunluk_plan_theme');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedStreak) setUsageStreak(parseInt(savedStreak));
    if (savedTheme) setTheme(savedTheme as AppTheme);
  }, []);

  const handleOnboardingComplete = (userData: User) => {
    setUser(userData);
    localStorage.setItem('gunluk_plan_user', JSON.stringify(userData));
    localStorage.setItem('gunluk_plan_streak', "1");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('gunluk_plan_user', JSON.stringify(updatedUser));
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('gunluk_plan_theme', newTheme);
  };

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('gunluk_plan_goals', JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const addTask = (title: string, startTime: string, duration: number = 30, category: TaskCategory = TaskCategory.PERSONAL) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      startTime,
      durationMinutes: duration,
      category,
      completed: false
    };
    setTasks(prev => [...prev, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const updateTaskTitle = (id: string, newTitle: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  
  const moveTask = (taskId: string, newHour: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const minutes = t.startTime.includes(':') ? t.startTime.split(':')[1] : '00';
        return { ...t, startTime: `${newHour}:${minutes}` };
      }
      return t;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = !h.completedToday;
        return { ...h, completedToday: completed, streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    }));
  };

  const addGoal = (title: string, period: 'weekly' | 'monthly', target: number) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      period,
      target,
      current: 0,
      completed: false
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (id: string, increment: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newCurrent = g.current + increment;
        const justCompleted = newCurrent >= g.target && !g.completed;
        if (justCompleted) setCelebrationGoal({ ...g, current: newCurrent, completed: true });
        return { ...g, current: newCurrent, completed: newCurrent >= g.target };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const handleFinishDay = async () => {
    if (tasks.length === 0) return;
    setIsProcessing(true);
    try {
      const text = await generateSummary(tasks);
      setSummary(text || "Harika bir günü geride bıraktın!");
      setShowSummaryModal(true);
      if (tasks.every(t => t.completed)) {
        const newStreak = usageStreak + 1;
        setUsageStreak(newStreak);
        localStorage.setItem('gunluk_plan_streak', newStreak.toString());
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const addHabitToTimeline = (habit: Habit, hour: string) => {
    addTask(habit.name, `${hour}:00`, 15, TaskCategory.PERSONAL);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "İyi Geceler";
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "Tünaydın";
    return "İyi Akşamlar";
  };

  if (!user || !user.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Mode-Based Background */}
      <div 
        className="app-bg" 
        style={{ 
          backgroundImage: `url(${isDarkMode ? BACKGROUNDS.night : BACKGROUNDS.day})`,
          opacity: isDarkMode ? 0.35 : 0.45
        }}
      />

      <div className="px-4 pt-8 pb-20 max-w-7xl mx-auto transition-all duration-300 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-5 group animate-in slide-in-from-left-4 duration-700">
            <div 
              onClick={() => setShowSettings(true)}
              className="relative w-16 h-16 md:w-20 md:h-20 rounded-[30px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl cursor-pointer group-hover:scale-105 transition-all group/pfp"
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white text-2xl font-black">
                  {user.firstName[0]}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/pfp:opacity-100 flex items-center justify-center transition-opacity">
                <i className="fa-solid fa-camera text-white text-xl"></i>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {getGreeting()}, <span className="text-gradient">{user.firstName} 👋</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 mt-1">
                <i className="fa-regular fa-calendar-days text-brand-500"></i>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-[32px] flex items-center gap-4 border border-white dark:border-slate-800 shadow-xl flex-1 md:flex-none">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xl relative">
                <i className={`fa-solid fa-fire ${usageStreak > 3 ? 'animate-bounce' : 'animate-pulse'}`}></i>
              </div>
              <div className="min-w-max">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">SERİ</div>
                <div className="text-xl font-black text-slate-800 dark:text-white tabular-nums">{usageStreak} Gün</div>
              </div>
            </div>
            
            <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-14 h-14 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[28px] shadow-xl border border-white dark:border-slate-800 text-brand-600 transition-all hover:scale-110 active:scale-95 shrink-0"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
            </button>
          </div>
        </header>

        {/* Desktop and Tablet Tabs */}
        <div className="flex justify-center mb-10 sticky top-6 z-40">
          <nav className="inline-flex p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] border border-white dark:border-slate-800 shadow-2xl">
            {[
              { id: 'plan', label: 'Program', icon: 'fa-calendar-day' },
              { id: 'habits', label: 'Alışkanlıklar', icon: 'fa-star' },
              { id: 'calendar', label: 'Takvim', icon: 'fa-calendar-alt' },
              { id: 'analytics', label: 'Analiz', icon: 'fa-chart-pie' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`flex items-center gap-2 px-4 md:px-7 py-3 md:py-4 rounded-[26px] text-xs md:text-sm font-black transition-all duration-300 ${
                  view === tab.id 
                  ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/30' 
                  : 'text-slate-500 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                <i className={`fa-solid ${tab.icon} ${view === tab.id ? 'animate-float' : ''}`}></i>
                <span className="hidden sm:inline uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 page-transition">
          <div className="lg:col-span-8 space-y-8 lg:space-y-12 order-1">
            <ProgressSummary 
              completedPercent={progressPercent} 
              taskCount={tasks.length} 
              completedCount={completedCount} 
            />
            
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-[48px] shadow-2xl border border-white dark:border-slate-800 overflow-hidden">
              <div className="p-6 md:p-12">
                {view === 'plan' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-4">
                        Günlük Plan
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
                          <i className="fa-solid fa-clipboard-list text-sm"></i>
                        </div>
                      </h2>
                      <button 
                        onClick={handleFinishDay} 
                        disabled={tasks.length === 0}
                        className="w-full md:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-500/30 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                      >
                        GÜNÜ KAPAT <i className="fa-solid fa-flag-checkered"></i>
                      </button>
                    </div>
                    
                    <Timeline 
                      tasks={tasks} 
                      wakeUpTime="07:00" 
                      bedTime="23:00" 
                      onToggleTask={toggleTask} 
                      onMoveTask={moveTask} 
                      onDeleteTask={deleteTask} 
                      onUpdateTitle={updateTaskTitle} 
                      onAddHabitAtHour={addHabitToTimeline} 
                    />
                  </div>
                )}
                {view === 'habits' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl md:text-3xl font-black mb-10 text-slate-800 dark:text-white">Alışkanlıklarım</h2>
                    <HabitGrid 
                      habits={habits} 
                      onToggleHabit={toggleHabit} 
                      onAddToSchedule={(h) => addHabitToTimeline(h, new Date().getHours().toString().padStart(2, '0'))}
                      onDeleteHabit={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
                      onAddHabit={(name, icon) => setHabits(prev => [...prev, { id: Date.now().toString(), name, streak: 0, completedToday: false, icon }])}
                    />
                  </div>
                )}
                {view === 'calendar' && <CalendarView tasks={tasks} />}
                {view === 'analytics' && <Analytics tasks={tasks} habits={habits} />}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8 order-2">
            <SimpleTaskEntry onAddTask={(title, time) => addTask(title, time)} isProcessing={isProcessing} />
            
            <GoalTracker 
              goals={goals} 
              onAddGoal={addGoal} 
              onUpdateProgress={updateGoalProgress} 
              onDeleteGoal={deleteGoal} 
            />
            
            <AgeInsights birthDate={user.birthDate} />
            
            <BadgesSection tasks={tasks} habits={habits} />
            
            <div className="animate-pulse-soft">
              <MotivationQuote />
            </div>
          </aside>
        </div>
      </div>

      {/* Celebration & Modals */}
      {showSettings && (
        <SettingsModal 
          user={user} 
          onUpdateUser={handleUpdateUser} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {celebrationGoal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-brand-500/20 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-12 rounded-[50px] shadow-3xl border border-brand-500/20 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/30 rounded-[36px] flex items-center justify-center mx-auto mb-8 text-brand-600 animate-float">
              <i className="fa-solid fa-trophy text-5xl"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Tebrikler!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium italic text-lg leading-relaxed">
              "{celebrationGoal.title}" hedefine ulaştın. Harika iş çıkardın!
            </p>
            <button 
              onClick={() => setCelebrationGoal(null)} 
              className="w-full py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-500/30 transition-all active:scale-95"
            >
              MÜKEMMEL!
            </button>
          </div>
        </div>
      )}

      {showSummaryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full p-12 rounded-[50px] shadow-3xl relative overflow-hidden border border-brand-500/20 animate-in slide-in-from-bottom-8 duration-500">
             <div className="absolute top-0 left-0 w-full h-3 bg-brand-500"></div>
             <div className="mb-10 flex items-center justify-between">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white">Günün Özeti</h2>
               <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600">
                 <i className="fa-solid fa-wand-sparkles"></i>
               </div>
             </div>
             <div className="text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed italic bg-brand-50/50 dark:bg-slate-800/50 p-10 rounded-[40px] border border-brand-100 dark:border-slate-700 text-xl font-medium shadow-inner">
               {summary}
             </div>
             <div className="mt-12">
               <button 
                onClick={() => setShowSummaryModal(false)} 
                className="w-full py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-500/30 transition-all active:scale-95"
               >
                 YARINA HAZIRIM
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
