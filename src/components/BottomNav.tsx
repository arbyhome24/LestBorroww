import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    unreadNotifCount,
    isLoggedIn,
    openLoginModal,
    t,
  } = useApp();

  const handleTabClick = (tab: 'home' | 'explore' | 'post' | 'notifications' | 'profile') => {
    if ((tab === 'post' || tab === 'notifications' || tab === 'profile') && !isLoggedIn) {
      openLoginModal();
      return;
    }
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#150E10]/95 backdrop-blur-md border-t border-[#E5E5E5] dark:border-[#3A2A2E] shadow-lg transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {/* 1. Beranda */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex flex-col items-center justify-center h-full relative transition-transform active:scale-90"
        >
          <Home
            className={`w-5 h-5 transition-colors ${
              activeTab === 'home'
                ? 'text-[#5A1624] dark:text-[#C2566B]'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          />
          <span
            className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
              activeTab === 'home'
                ? 'text-[#5A1624] dark:text-[#C2566B] font-semibold'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          >
            {t('tabHome')}
          </span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8893C] dark:bg-[#D6AE67] absolute bottom-1" />
          )}
        </button>

        {/* 2. Jelajah */}
        <button
          onClick={() => handleTabClick('explore')}
          className="flex flex-col items-center justify-center h-full relative transition-transform active:scale-90"
        >
          <Compass
            className={`w-5 h-5 transition-colors ${
              activeTab === 'explore'
                ? 'text-[#5A1624] dark:text-[#C2566B]'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          />
          <span
            className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
              activeTab === 'explore'
                ? 'text-[#5A1624] dark:text-[#C2566B] font-semibold'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          >
            {t('tabExplore')}
          </span>
          {activeTab === 'explore' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8893C] dark:bg-[#D6AE67] absolute bottom-1" />
          )}
        </button>

        {/* 3. Tombol Tengah (+) - Berbentuk kotak bersudut membulat, ring emas, menonjol di atas navbar, tanpa teks */}
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => handleTabClick('post')}
            className="w-12 h-12 -mt-6 rounded-2xl bg-gradient-to-tr from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] text-[#F7F3EC] flex items-center justify-center shadow-lg ring-2 ring-[#B8893C] dark:ring-[#D6AE67] hover:scale-105 active:scale-95 transition-all"
            title={t('tabPost')}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Notifikasi */}
        <button
          onClick={() => handleTabClick('notifications')}
          className="flex flex-col items-center justify-center h-full relative transition-transform active:scale-90"
        >
          <div className="relative">
            <Bell
              className={`w-5 h-5 transition-colors ${
                activeTab === 'notifications'
                  ? 'text-[#5A1624] dark:text-[#C2566B]'
                  : 'text-[#6B6B6B] dark:text-[#B09F94]'
              }`}
            />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#9C2A3F] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotifCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
              activeTab === 'notifications'
                ? 'text-[#5A1624] dark:text-[#C2566B] font-semibold'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          >
            {t('tabNotifications')}
          </span>
          {activeTab === 'notifications' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8893C] dark:bg-[#D6AE67] absolute bottom-1" />
          )}
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => handleTabClick('profile')}
          className="flex flex-col items-center justify-center h-full relative transition-transform active:scale-90"
        >
          <User
            className={`w-5 h-5 transition-colors ${
              activeTab === 'profile'
                ? 'text-[#5A1624] dark:text-[#C2566B]'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          />
          <span
            className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
              activeTab === 'profile'
                ? 'text-[#5A1624] dark:text-[#C2566B] font-semibold'
                : 'text-[#6B6B6B] dark:text-[#B09F94]'
            }`}
          >
            {t('tabProfile')}
          </span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8893C] dark:bg-[#D6AE67] absolute bottom-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
