import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import {
  X,
  Megaphone,
  Upload,
  BarChart2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdvertiserModal: React.FC = () => {
  const {
    isAdvertiserPortalOpen,
    setIsAdvertiserPortalOpen,
    currency,
    thirdPartyAds,
    submitThirdPartyAd,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('dashboard');

  // Form State
  const [advertiserName, setAdvertiserName] = useState('Boutique Brand ID');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80');
  const [targetUrl, setTargetUrl] = useState('https://swissvault.id');
  const [ctaText, setCtaText] = useState<'Unduh' | 'Kunjungi' | 'Pelajari Lebih Lanjut'>('Kunjungi');
  const [packageType, setPackageType] = useState<'1_day' | '3_days' | '7_days' | '30_days'>('7_days');
  const [targetAudience, setTargetAudience] = useState<'all' | 'city' | 'luxury_interest'>('all');
  const [budgetIDR, setBudgetIDR] = useState<number>(2500000);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  if (!isAdvertiserPortalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitThirdPartyAd({
      title,
      description,
      bannerUrl,
      targetUrl,
      ctaText,
      packageType,
      targetAudience,
      budgetIDR,
    });
    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
      setActiveTab('dashboard');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 flex items-center justify-center text-[#5A1624]">
              <Megaphone className="w-4 h-4 text-[#B8893C]" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                Portal Pengiklan LetsBorrow
              </h3>
              <p className="text-[10px] text-[#6B6B6B]">
                Promosikan brand & layanan Anda ke komunitas tetangga terverifikasi
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdvertiserPortalOpen(false)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar: Dashboard Pengiklan | Pasang Iklan Baru */}
        <div className="flex gap-2 p-1 bg-[#EFECE8] dark:bg-[#201518] rounded-2xl mb-4 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Dashboard Iklan Saya
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'create'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            + Pasang Iklan Baru
          </button>
        </div>

        {/* Tab 1: Dashboard Analytics */}
        {activeTab === 'dashboard' ? (
          <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
            {/* Analytics Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30">
                <span className="text-[10px] text-[#6B6B6B] block">Total Tayangan</span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  13,760
                </span>
              </div>
              <div className="p-3 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30">
                <span className="text-[10px] text-[#6B6B6B] block">Total Klik</span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  1,052
                </span>
              </div>
              <div className="p-3 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30">
                <span className="text-[10px] text-[#6B6B6B] block">Rata-rata CTR</span>
                <span className="font-serif-luxury font-extrabold text-base text-emerald-600">
                  7.64%
                </span>
              </div>
            </div>

            {/* List of Ads */}
            <div className="space-y-3">
              <span className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67] block">
                Kampanye Iklan Aktif
              </span>

              {thirdPartyAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-3.5 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111111] dark:text-[#F5ECDF] truncate max-w-[200px]">
                      {ad.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        ad.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-700'
                          : ad.status === 'pending_approval'
                          ? 'bg-amber-500/20 text-amber-700'
                          : 'bg-rose-500/20 text-rose-700'
                      }`}
                    >
                      {ad.status === 'active' ? 'Tayang' : ad.status === 'pending_approval' ? 'Menunggu Review' : 'Ditolak'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6B6B6B] line-clamp-1">{ad.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E5E5] text-[10px]">
                    <div>
                      <span className="text-[#6B6B6B] block">Tayang:</span>
                      <span className="font-bold">{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6B6B] block">Klik:</span>
                      <span className="font-bold">{ad.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6B6B] block">Sisa Anggaran:</span>
                      <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">
                        {formatCurrency(ad.remainingBudgetIDR, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tab 2: Create Ad Form */
          <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3.5 pr-1 flex-1 text-xs">
            {isSuccessToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Iklan berhasil dikirim ke antrean review admin!</span>
              </div>
            )}

            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Judul Iklan / Kampanye
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Biji Kopi Sangrai Eksklusif Diantar 30 Menit"
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
              />
            </div>

            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Pesan promosi singkat yang menarik..."
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Satu Link Tujuan Resmi
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://brandanda.com"
                  className="w-full p-2 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Tombol Ajakan (CTA)
                </label>
                <select
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                >
                  <option value="Kunjungi">Kunjungi</option>
                  <option value="Unduh">Unduh</option>
                  <option value="Pelajari Lebih Lanjut">Pelajari Lebih Lanjut</option>
                </select>
              </div>
            </div>

            {/* Package Choice */}
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Paket Durasi & Estimasi Jangkauan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { pkg: '1_day', label: '1 Hari (Est. 2.000 Tayang)', cost: 500000 },
                  { pkg: '3_days', label: '3 Hari (Est. 7.500 Tayang)', cost: 1250000 },
                  { pkg: '7_days', label: '7 Hari (Est. 20.000 Tayang)', cost: 2500000 },
                  { pkg: '30_days', label: '30 Hari (Est. 80.000 Tayang)', cost: 8000000 },
                ].map((item) => (
                  <button
                    key={item.pkg}
                    type="button"
                    onClick={() => {
                      setPackageType(item.pkg as any);
                      setBudgetIDR(item.cost);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      packageType === item.pkg
                        ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                        : 'border-[#E5E5E5] bg-white dark:bg-[#150E10]'
                    }`}
                  >
                    <p className="text-xs">{item.label}</p>
                    <p className="font-serif-luxury font-bold mt-1 text-[#5A1624] dark:text-[#D6AE67]">
                      {formatCurrency(item.cost, currency)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95"
            >
              Bayar & Pasang Iklan ({formatCurrency(budgetIDR, currency)})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
