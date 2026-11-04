import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SafeContactBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useApp();

  return (
    <div className="w-full bg-[#F7F3EC] dark:bg-[#281B20] border border-[#B8893C]/35 rounded-2xl p-3.5 shadow-2xs flex items-start gap-3 transition-colors">
      <div className="w-8 h-8 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5 text-[#5A1624] dark:text-[#C2566B]" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-[#5A1624] dark:text-[#F5ECDF] tracking-tight">
          {t('safeContactTitle')}
        </h4>
        <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] leading-relaxed mt-0.5">
          {t('safeContactPrivacy')}
        </p>
      </div>
    </div>
  );
};
