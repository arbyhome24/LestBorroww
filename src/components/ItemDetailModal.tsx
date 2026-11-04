import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingItem } from '../types';
import { formatCurrency, formatDistance } from '../utils/currency';
import { SafeContactBanner } from './SafeContactBanner';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
  Bed,
  Users,
  Sparkles,
  Languages,
  Clock,
  Heart,
  Share2,
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedListing,
    setSelectedListing,
    currency,
    t,
    language,
    isLoggedIn,
    openLoginModal,
    setIsBookingModalOpen,
    toggleLike,
    followedUserIds,
    toggleFollowUser,
  } = useApp();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTranslated, setShowTranslated] = useState(false);

  if (!selectedListing) return null;

  const item = selectedListing;
  const isFollowingOwner = followedUserIds.includes(item.ownerId);

  const handleBookClick = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#150E10] sm:rounded-3xl shadow-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 transition-colors">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/90 dark:bg-[#150E10]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#3A2A2E]">
          <button
            onClick={() => setSelectedListing(null)}
            className="p-1.5 rounded-full hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#111111] dark:text-[#F5ECDF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF] truncate max-w-[220px]">
            {item.title}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleLike(item.id)}
              className="p-1.5 rounded-full hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#9C2A3F]"
            >
              <Heart className={`w-5 h-5 ${item.isLiked ? 'fill-[#9C2A3F]' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: item.title, url: window.location.href });
                }
              }}
              className="p-1.5 rounded-full hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#6B6B6B] dark:text-[#B09F94]"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Image Slider */}
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={item.images[currentImageIndex]}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Arrows */}
            {item.images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={() => setCurrentImageIndex((p) => p - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {currentImageIndex < item.images.length - 1 && (
                  <button
                    onClick={() => setCurrentImageIndex((p) => p + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {item.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-5 bg-[#D4AF6A]' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Price Badge on Photo */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-[#D4AF6A]/50 text-white">
              <span className="font-serif-luxury font-extrabold text-base text-[#D4AF6A]">
                {formatCurrency(item.originalPriceIDR, currency)}
              </span>
              <span className="text-xs text-white/80 ml-1">
                {item.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
              </span>
            </div>
          </div>

          {/* Safe Contact Guard Box */}
          <SafeContactBanner />

          {/* Title & Translation toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#B8893C] uppercase tracking-wider">
                {item.category}
              </span>
              <button
                onClick={() => setShowTranslated(!showTranslated)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#5A1624] dark:text-[#D6AE67] hover:underline"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{showTranslated ? t('viewOriginal') : t('viewTranslation')}</span>
              </button>
            </div>

            <h1 className="font-serif-luxury text-lg font-bold text-[#111111] dark:text-[#F5ECDF] leading-snug">
              {showTranslated && language !== 'id'
                ? `[Translated] ${item.title}`
                : item.title}
            </h1>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6B6B6B] dark:text-[#B09F94]">
              <span className="flex items-center gap-1 text-[#5A1624] dark:text-[#F5ECDF] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#B8893C]" />
                {item.city} ({formatDistance(item.distanceKm, currency)})
              </span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-md bg-[#EFECE8] dark:bg-[#201518] text-[10px] font-semibold">
                Kondisi: {item.condition}
              </span>
            </div>
          </div>

          {/* Villa Specific Highlights */}
          {item.category === 'Rumah & Villa' && (
            <div className="p-3.5 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30 space-y-2">
              <h4 className="font-serif-luxury font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF]">
                Spesifikasi & Fasilitas Properti
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5ECDF]">
                  <Bed className="w-4 h-4 text-[#B8893C]" />
                  <span>{item.bedrooms || 4} Kamar Tidur</span>
                </div>
                <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5ECDF]">
                  <Users className="w-4 h-4 text-[#B8893C]" />
                  <span>Hingga {item.guestCapacity || 8} Tamu</span>
                </div>
              </div>

              {item.amenities && item.amenities.length > 0 && (
                <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#3A2A2E]">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-[#150E10] text-[10px] text-[#5A1624] dark:text-[#D6AE67] border border-[#B8893C]/30 font-medium"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="p-3.5 bg-[#EFECE8] dark:bg-[#201518] rounded-2xl">
            <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF] mb-1">
              Deskripsi Barang
            </h4>
            <p className="text-xs text-[#111111] dark:text-[#F5ECDF] leading-relaxed whitespace-pre-line">
              {showTranslated && language !== 'id'
                ? `[Translated to ${language.toUpperCase()}]: ${item.description}`
                : item.description}
            </p>
          </div>

          {/* Rules & Deposit info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E]">
              <span className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Aturan Pakai & Ketentuan
              </span>
              <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] leading-relaxed">
                {item.rules}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E]">
              <span className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Uang Jaminan (Deposit)
              </span>
              <p className="font-serif-luxury font-extrabold text-sm text-[#5A1624] dark:text-[#D6AE67]">
                {formatCurrency(item.depositIDR, currency)}
              </p>
              <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5">
                Dikembalikan 100% setelah barang dikembalikan dalam kondisi aman.
              </p>
            </div>
          </div>

          {/* Owner Profile Snippet (Strictly NO direct contact info!) */}
          <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={item.ownerAvatar}
                  alt={item.ownerName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#B8893C]"
                />
                {item.isOwnerVerified && (
                  <CheckCircle2 className="w-4 h-4 text-[#B8893C] fill-[#5A1624] absolute -bottom-0.5 -right-0.5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#111111] dark:text-[#F5ECDF] flex items-center gap-1.5">
                  {item.ownerName}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5">
                  <span className="text-[#B8893C] font-bold">★ {item.ownerRating}</span>
                  <span>·</span>
                  <span>Tetangga Terpercaya</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleFollowUser(item.ownerId)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isFollowingOwner
                  ? 'bg-[#5A1624] text-[#F7F3EC]'
                  : 'border border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B] hover:bg-[#5A1624]/10'
              }`}
            >
              {isFollowingOwner ? t('followingBtn') : t('follow')}
            </button>
          </div>
        </div>

        {/* Sticky Bottom Rental Action Bar */}
        <div className="p-4 bg-white/95 dark:bg-[#150E10]/95 backdrop-blur-md border-t border-[#E5E5E5] dark:border-[#3A2A2E] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] block">Harga Sewa</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                {formatCurrency(item.originalPriceIDR, currency)}
              </span>
              <span className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94]">
                {item.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
              </span>
            </div>
          </div>

          <button
            onClick={handleBookClick}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all"
          >
            Ajukan Sewa
          </button>
        </div>
      </div>
    </div>
  );
};
