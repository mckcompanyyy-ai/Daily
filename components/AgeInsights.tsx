
import React from 'react';

interface AgeInsightsProps {
  birthDate: string;
}

const AgeInsights: React.FC<AgeInsightsProps> = ({ birthDate }) => {
  const calculateAge = (date: string) => {
    const today = new Date();
    const birth = new Date(date);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthDate);

  const getInsight = (age: number) => {
    if (age < 20) return {
      title: "Gençlik Enerjisi",
      text: "Bu yaşlarda edineceğin disiplin, gelecekteki en büyük varlığın olacak. Keşfetmeye ve öğrenmeye odaklan!",
      icon: "fa-seedling"
    };
    if (age < 30) return {
      title: "Kariyer İnşası",
      text: "20'li yaşlar hayatının temellerini atma dönemidir. Rutinlerine sadık kalmak seni akranlarından bir adım öne çıkarır.",
      icon: "fa-rocket"
    };
    if (age < 45) return {
      title: "Denge Dönemi",
      text: "Kariyer, aile ve kişisel gelişim arasında denge kurmak ustalık gerektirir. Bugünün planı, yarının huzurudur.",
      icon: "fa-scale-balanced"
    };
    return {
      title: "Tecrübe ve Verimlilik",
      text: "Hayat tecrübenle artık neyin önemli olduğunu biliyorsun. Odaklanmış çalışma seansları senin en güçlü silahın.",
      icon: "fa-gem"
    };
  };

  const insight = getInsight(age);

  return (
    <div className="bg-brand-500 text-white p-6 rounded-[32px] shadow-lg shadow-brand-500/20 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          <i className={`fa-solid ${insight.icon}`}></i>
        </div>
        <div>
          <h4 className="font-black text-sm uppercase tracking-widest mb-1">{insight.title}</h4>
          <p className="text-sm font-medium leading-relaxed opacity-90 italic">
            "{insight.text}"
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">
            <i className="fa-solid fa-cake-candles"></i>
            {age} Yaş Analizi
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeInsights;
