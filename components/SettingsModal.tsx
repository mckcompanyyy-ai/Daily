
import React, { useRef, useState } from 'react';
import { User } from '../types';

interface SettingsModalProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit for profile picture

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onUpdateUser, onClose }) => {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Dosya boyutu çok büyük. Lütfen 2MB\'dan küçük bir görsel seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onUpdateUser({
        ...user,
        profilePicture: result
      });
    };
    reader.onerror = () => {
      setError('Görsel yüklenirken bir hata oluştu.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 md:p-10 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-800 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Ayarlar</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Profilini güncelle</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <div className="space-y-10">
          <section className="text-center">
            <div className="relative inline-block group mb-6">
              <div className="w-28 h-28 rounded-[36px] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 mx-auto">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                    {user.firstName[0]}
                  </div>
                )}
              </div>
              <button 
                onClick={() => profileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-600 transition-all active:scale-90 border-4 border-white dark:border-slate-900"
              >
                <i className="fa-solid fa-camera text-xs"></i>
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-800 dark:text-white">{user.firstName} {user.lastName}</h3>
              <p className="text-xs text-slate-400 font-medium">Uygulama arka planı, günün moduna göre otomatik olarak güncellenir.</p>
            </div>
          </section>
        </div>

        <input type="file" ref={profileInputRef} onChange={handleProfileUpload} accept="image/*" className="hidden" />

        <button 
          onClick={onClose}
          className="w-full mt-10 py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 active:scale-[0.98] transition-all"
        >
          KAYDET VE KAPAT
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
