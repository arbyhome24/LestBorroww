import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div className="w-full bg-[#F7F3EC] dark:bg-[#281B20] border border-[#B8893C]/40 rounded-2xl p-3.5 shadow-2xs relative transition-colors">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2.5 right-2.5 text-[#6B6B6B] hover:text-[#111111] dark:hover:text-[#F5ECDF] p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A1F32] to-[#4A0F1C] flex items-center justify-center text-[#D4AF6A] shrink-0 shadow-xs border border-[#D4AF6A]/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 pr-6">
            <h4 className="text-xs font-bold text-[#5A1624] dark:text-[#F5ECDF]">
              {t('installPWA')}
            </h4>
            <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] line-clamp-1 mt-0.5">
              {t('installPWADesc')}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95 active:scale-98 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('installNow')}</span>
          </button>
          <button
            onClick={() => setShowGuideModal(true)}
            className="py-1.5 px-3 rounded-xl border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67] text-xs font-medium hover:bg-white dark:hover:bg-[#201518] transition-colors"
          >
            Petunjuk
          </button>
        </div>
      </div>

      {/* Guide Modal for iOS & Android */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#5A1624] dark:text-[#D6AE67]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                  Pasang LetsBorrow
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs text-[#111111] dark:text-[#F5ECDF]">
              {/* Android Guide */}
              <div className="p-3 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E]">
                <h5 className="font-bold text-[#5A1624] dark:text-[#D6AE67] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#B8893C]" />
                  Android (Chrome / Browser)
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[#6B6B6B] dark:text-[#B09F94] pl-1 leading-relaxed">
                  <li>Ketuk menu tiga titik (⋮) di pojok kanan atas browser.</li>
                  <li>Pilih <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                  <li>LetsBorrow akan muncul sebagai aplikasi mandiri di beranda HP kamu.</li>
                </ol>
              </div>

              {/* iPhone iOS Guide */}
              <div className="p-3 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E]">
                <h5 className="font-bold text-[#5A1624] dark:text-[#D6AE67] mb-1.5 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-[#B8893C]" />
                  iPhone / iPad (Safari)
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[#6B6B6B] dark:text-[#B09F94] pl-1 leading-relaxed">
                  <li>Buka LetsBorrow di browser <strong>Safari</strong>.</li>
                  <li>Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas di bilah bawah).</li>
                  <li>Gulir ke bawah dan ketuk <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold shadow-xs"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
