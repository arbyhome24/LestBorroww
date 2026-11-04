import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { CURRENCY_CONFIGS } from '../utils/currency';
import { LanguageCode, CurrencyCode } from '../types';
import {
  X,
  Globe,
  Coins,
  Check,
} from 'lucide-react';

export const LanguageCurrencyModal: React.FC = () => {
  const {
    isLanguageCurrencyOpen,
    setIsLanguageCurrencyOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lang' | 'curr'>('lang');

  if (!isLanguageCurrencyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#B8893C]" />
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              {activeTab === 'lang' ? t('chooseLanguage') : t('chooseCurrency')}
            </h3>
          </div>
          <button
            onClick={() => setIsLanguageCurrencyOpen(false)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Bahasa | Mata Uang */}
        <div className="flex gap-2 p-1 bg-white dark:bg-[#150E10] rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] mb-3 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('lang')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'lang'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            12 Bahasa
          </button>
          <button
            onClick={() => setActiveTab('curr')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'curr'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Mata Uang Tampilan
          </button>
        </div>

        {/* Tab 1: Languages (12 Languages with RTL for Arabic) */}
        {activeTab === 'lang' ? (
          <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <div
                  key={langItem.code}
                  onClick={() => {
                    setLanguage(langItem.code);
                    setIsLanguageCurrencyOpen(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#B8893C] bg-[#5A1624]/6 dark:bg-[#C2566B]/15 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] hover:border-[#B8893C]/40'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{langItem.nativeName}</span>
                    <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                      {langItem.label} {langItem.isRtl ? '(RTL)' : ''}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#B8893C] stroke-[3]" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 2: Currencies */
          <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
            {Object.values(CURRENCY_CONFIGS).map((currConfig) => {
              const isSelected = currency === currConfig.code;
              return (
                <div
                  key={currConfig.code}
                  onClick={() => {
                    setCurrency(currConfig.code);
                    setIsLanguageCurrencyOpen(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#B8893C] bg-[#5A1624]/6 dark:bg-[#C2566B]/15 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] hover:border-[#B8893C]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#EFECE8] dark:bg-[#201518] flex items-center justify-center font-serif-luxury font-extrabold text-sm text-[#B8893C]">
                      {currConfig.symbol}
                    </span>
                    <div>
                      <span className="text-xs font-bold block text-[#111111] dark:text-[#F5ECDF]">
                        {currConfig.code}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                        {currConfig.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#B8893C] stroke-[3]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
