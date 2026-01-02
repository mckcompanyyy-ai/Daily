
import React, { useRef, useState } from 'react';
import { User } from '../types';

interface SettingsModalProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onUpdateUser, onClose }) => {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Dosya boyutu çok büyük (Maks 2MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateUser({ ...user, profilePicture: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 md:p-10 rounded-[48px] shadow-3xl border border-white/20 dark:border-slate-800 animate-in zoom-in duration-300 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Ayarlar</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Profil ve Uygulama Tercihleri</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <section className="text-center">
            <div className="relative inline-block group mb-4">
              <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 mx-auto">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300">{user.firstName[0]}</div>
                )}
              </div>
              <button onClick={() => profileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-500 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                <i className="fa-solid fa-camera text-[10px]"></i>
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">{user.firstName} {user.lastName}</h3>
          </section>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-brand-500"></i>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Gizlilik Politikası</span>
              </div>
              <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-brand-500"></i>
            </a>
            <div className="flex items-center justify-between px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Versiyon</span>
              <span>1.0.0 (Build 1)</span>
            </div>
          </div>
        </div>

        <input type="file" ref={profileInputRef} onChange={handleProfileUpload} accept="image/*" className="hidden" />

        <button onClick={onClose} className="w-full mt-10 py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 transition-all">
          KAYDET VE KAPAT
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
