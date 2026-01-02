
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && birthDate) {
      onComplete({
        firstName,
        lastName,
        birthDate,
        profilePicture,
        onboarded: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand-50 dark:bg-slate-950 overflow-auto">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[44px] shadow-2xl shadow-brand-500/10 border border-brand-100 dark:border-slate-800 text-center">
          
          <div className="relative inline-block mb-8 group">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-[32px] flex items-center justify-center mx-auto text-brand-600 cursor-pointer overflow-hidden border-2 border-dashed border-brand-300 group-hover:border-brand-500 transition-all"
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profil Fotoğrafı" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-camera text-2xl"></i>
                  <span className="text-[10px] font-black uppercase">Yükle</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-500 text-white rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg cursor-pointer">
              <i className="fa-solid fa-plus text-xs"></i>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Hoş Geldiniz!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed">
            Gününüzü planlamaya başlamadan önce sizi biraz tanıyalım.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ADINIZ</label>
              <input 
                required
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Örn: Mert"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">SOYADINIZ</label>
              <input 
                required
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Örn: Yılmaz"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">DOĞUM TARİHİNİZ</label>
              <input 
                required
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-500/20 transition-all active:scale-95 mt-4"
            >
              Başlayalım
            </button>
          </form>
          
          <p className="text-[11px] text-slate-400 mt-8 leading-relaxed italic">
            Verileriniz cihazınızda güvenle saklanır ve size özel analizler üretmek için kullanılır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
