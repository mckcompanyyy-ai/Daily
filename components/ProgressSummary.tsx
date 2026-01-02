
import React from 'react';

interface ProgressSummaryProps {
  completedPercent: number;
  taskCount: number;
  completedCount: number;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ completedPercent, taskCount, completedCount }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completedPercent / 100) * circumference;

  const getEncouragement = () => {
    if (taskCount === 0) return "Harika bir güne başla!";
    if (completedPercent === 0) return "Hadi plan yapalım!";
    if (completedPercent < 34) return "İyi bir başlangıç!";
    if (completedPercent < 67) return "Harika gidiyorsun!";
    if (completedPercent < 100) return "Neredeyse başardın!";
    return "Mükemmel bir gün!";
  };

  const getDayPartText = () => {
    if (taskCount === 0) return "Bugün için henüz bir hedef belirlemedin. Plan yaparak güne ivme kazandırabilirsin.";
    if (completedPercent === 0) return "Günün henüz başındasın, listendeki ilk görevi tamamlamak için harika bir an!";
    if (completedPercent < 34) return "Günün ilk bölümünü başarıyla tamamladın, enerjini korumaya devam et.";
    if (completedPercent < 67) return "Günün yarısını verimli bir şekilde geride bıraktın. Odaklanmaya devam!";
    if (completedPercent < 100) return "Günün büyük kısmını bitirdin, hedeflerine ulaşmana çok az kaldı!";
    return "Tebrikler! Bugün kendine verdiğin tüm sözleri tuttun ve harika bir iş çıkardın.";
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 md:p-10 rounded-[48px] flex flex-col sm:flex-row items-center gap-8 md:gap-12 border border-white/20 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Progress Circle - Flex shrink zero to prevent squishing */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%" cy="50%" r={radius}
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth="10"
          />
          <circle
            cx="50%" cy="50%" r={radius}
            className="stroke-brand-500 fill-none transition-all duration-1000"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
            %{completedPercent}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">BAŞARI</span>
        </div>
      </div>
      
      {/* Text Section - Flex-1 to occupy remaining space with min-w-0 for ellipsis support if needed */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 truncate">
          {getEncouragement()}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium leading-relaxed">
          {getDayPartText()}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-6 justify-center sm:justify-start">
           <div className="px-5 py-2.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-brand-100 dark:border-brand-800/50">
             {completedCount} / {taskCount} GÖREV TAMAMLANDI
           </div>
           <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
           <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">GÜNLÜK ÖZET</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
