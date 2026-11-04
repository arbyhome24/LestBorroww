import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory } from '../types';
import { formatCurrency } from '../utils/currency';
import { validateNoContactInfo } from '../utils/security';
import { SafeContactBanner } from './SafeContactBanner';
import {
  X,
  Sparkles,
  Plus,
  Send,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const WantedBoardModal: React.FC = () => {
  const {
    isWantedBoardOpen,
    setIsWantedBoardOpen,
    wantedPosts,
    addWantedPost,
    currency,
    t,
    currentCity,
    isLoggedIn,
    openLoginModal,
  } = useApp();

  const [isPostingFormOpen, setIsPostingFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Elektronik');
  const [description, setDescription] = useState('');
  const [neededDate, setNeededDate] = useState('Akhir Pekan Ini');
  const [budget, setBudget] = useState<number>(500000);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [offerSuccessToast, setOfferSuccessToast] = useState(false);

  if (!isWantedBoardOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    const check1 = validateNoContactInfo(title);
    const check2 = validateNoContactInfo(description);

    if (!check1.isValid || !check2.isValid) {
      setValidationError(check1.error || check2.error || t('safeContactError'));
      return;
    }

    addWantedPost(title, category, description, neededDate, budget);
    setIsPostingFormOpen(false);
    setTitle('');
    setDescription('');
    setValidationError(null);
  };

  const handleOfferItem = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setOfferSuccessToast(true);
    setTimeout(() => setOfferSuccessToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 flex items-center justify-center text-[#5A1624] dark:text-[#C2566B]">
              <Sparkles className="w-4 h-4 text-[#B8893C]" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                {t('wantedBoard')}
              </h3>
              <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94]">
                Tetangga sedang mencari pinjaman barang berikut
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWantedBoardOpen(false)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button: Posting Kebutuhan */}
        {!isPostingFormOpen && (
          <div className="mb-4 shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal();
                  return;
                }
                setIsPostingFormOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-xs hover:opacity-95 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('postNeed')}</span>
            </button>
          </div>
        )}

        {/* Posting Form */}
        {isPostingFormOpen ? (
          <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3 pr-1 flex-1">
            <SafeContactBanner />

            {validationError && (
              <div className="p-2.5 rounded-xl bg-[#9C2A3F]/10 border border-[#9C2A3F] text-xs text-[#9C2A3F] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Barang yang Dicari
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  const res = validateNoContactInfo(e.target.value);
                  setValidationError(res.isValid ? null : res.error || t('safeContactError'));
                }}
                placeholder="Misal: Dicari Drone DJI Mini 4 Pro untuk akhir pekan"
                className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Kendaraan">Kendaraan</option>
                  <option value="Outdoor dan olahraga">Outdoor & olahraga</option>
                  <option value="Alat tukang dan perkakas">Alat tukang</option>
                  <option value="Alat pesta dan acara">Alat pesta</option>
                  <option value="Baju dan fashion">Fashion</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Kapan Dibutuhkan
                </label>
                <input
                  type="text"
                  value={neededDate}
                  onChange={(e) => setNeededDate(e.target.value)}
                  placeholder="Contoh: 14 - 15 Nov"
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Deskripsi Kebutuhan
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  const res = validateNoContactInfo(e.target.value);
                  setValidationError(res.isValid ? null : res.error || t('safeContactError'));
                }}
                placeholder="Jelaskan tujuan pemakaian, durasi, dan kesiapan deposit..."
                className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Estimasi Anggaran Sewa ({currency})
              </label>
              <input
                type="number"
                min="50000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPostingFormOpen(false)}
                className="flex-1 py-2 text-xs rounded-xl border border-[#E5E5E5]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!!validationError}
                className="flex-1 py-2 text-xs rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] font-bold shadow-xs disabled:opacity-50"
              >
                Posting Kebutuhan
              </button>
            </div>
          </form>
        ) : (
          /* List of Wanted Items */
          <div className="overflow-y-auto space-y-3 pr-1 flex-1">
            {wantedPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#B8893C]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111111] dark:text-[#F5ECDF] block">
                        {post.userName}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                        {post.city} · {post.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF6A]/20 text-[#5A1624] dark:text-[#D6AE67] text-[10px] font-bold border border-[#D4AF6A]/50">
                    {post.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[#111111] dark:text-[#F5ECDF] mt-1 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]/60 dark:border-[#3A2A2E]/60 text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B6B6B] block">Budget Sewa:</span>
                    <span className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#D6AE67]">
                      {formatCurrency(post.targetBudgetIDR, currency)}
                    </span>
                  </div>

                  {/* Tombol Tawarkan Barang Saya: Outline Emas */}
                  <button
                    onClick={handleOfferItem}
                    className="py-1.5 px-3.5 rounded-xl border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67] text-xs font-bold hover:bg-[#F7F3EC] dark:hover:bg-[#281B20] transition-colors"
                  >
                    {t('offerItem')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offer Success Toast */}
        {offerSuccessToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF6A] text-white text-xs font-semibold text-center shadow-2xl animate-in zoom-in-95">
            Tawaran barang Anda telah dikirim ke tetangga!
          </div>
        )}
      </div>
    </div>
  );
};
