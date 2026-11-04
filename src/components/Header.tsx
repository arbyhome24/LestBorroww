import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Globe, Moon, Sun, Sparkles, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    currentCity,
    currency,
    isDark,
    themeMode,
    setThemeMode,
    setIsLocationPickerOpen,
    setIsLanguageCurrencyOpen,
    setIsWantedBoardOpen,
    setActiveTab,
  } = useApp();

  const [currencyChanged, setCurrencyChanged] = React.useState(false);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrencyChanged(true);
    const timer = setTimeout(() => setCurrencyChanged(false), 700);
    return () => clearTimeout(timer);
  }, [currency]);

  const toggleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/90 dark:bg-[#150E10]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#3A2A2E] px-4 py-2.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Lockup: LB monogram gradient + LetsBorrow serif wordmark + gold dot */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A1F32] to-[#4A0F1C] flex items-center justify-center shadow-sm border border-[#D4AF6A]/40">
            <span className="font-serif-luxury text-sm font-bold text-[#D4AF6A]">LB</span>
          </div>
          <div className="flex items-baseline">
            <span className="font-serif-luxury text-xl font-bold tracking-tight bg-gradient-to-r from-[#5A1624] via-[#7A1F32] to-[#5A1624] dark:from-[#C2566B] dark:to-[#E5A0AF] bg-clip-text text-transparent">
              LetsBorrow
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8893C] dark:bg-[#D6AE67] ml-0.5 inline-block"></span>
          </div>
        </div>

        {/* Center: Location Chip with gold pin + burgundy text */}
        <button
          onClick={() => setIsLocationPickerOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#201518] border border-[#B8893C]/40 hover:border-[#B8893C] text-[#5A1624] dark:text-[#F5ECDF] text-xs font-medium shadow-xs transition-colors max-w-[180px] truncate"
          title={t('currentLocation')}
        >
          <MapPin className="w-3.5 h-3.5 text-[#B8893C] shrink-0" />
          <span className="truncate">{currentCity || t('allCities')}</span>
        </button>

        {/* Right Actions: Wanted ("Dicari") button + Currency/Language + Theme toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tombol Dicari: putih + border emas + teks burgundy */}
          <button
            onClick={() => setIsWantedBoardOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white dark:bg-[#201518] border border-[#B8893C] hover:bg-[#F7F3EC] dark:hover:bg-[#281B20] text-[#5A1624] dark:text-[#D6AE67] text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-[#B8893C]" />
            <span>{t('wanted')}</span>
          </button>

          {/* Currency / Language Chip */}
          <button
            onClick={() => setIsLanguageCurrencyOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              currencyChanged
                ? 'scale-110 bg-[#5A1624] text-[#F7F3EC] ring-2 ring-[#B8893C] shadow-md'
                : 'bg-[#EFECE8] dark:bg-[#201518] hover:bg-[#E5E0D8] dark:hover:bg-[#2A1C20] text-[#111111] dark:text-[#F5ECDF]'
            }`}
            title={t('chooseLanguage')}
          >
            <Globe className={`w-3.5 h-3.5 transition-transform duration-300 ${currencyChanged ? 'text-[#D4AF6A] rotate-45' : 'text-[#B8893C]'}`} />
            <span
              key={currency}
              className={`font-bold text-[11px] tracking-wider transition-all duration-300 inline-block ${
                currencyChanged ? 'text-white' : ''
              }`}
            >
              {currency}
            </span>
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#5A1624] dark:hover:text-[#F5ECDF] hover:bg-[#EFECE8] dark:hover:bg-[#201518] transition-colors"
            title="Theme switch"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D6AE67]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
