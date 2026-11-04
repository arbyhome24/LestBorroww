import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { SafeContactBanner } from './SafeContactBanner';
import {
  CheckCircle2,
  Sparkles,
  Star,
  Settings,
  Shield,
  Sun,
  Moon,
  Award,
  TrendingUp,
  LayoutDashboard,
  Megaphone,
  Grid,
  Clock,
  CheckCheck,
  ChevronRight,
  EyeOff,
  UserX,
  X,
  LogOut,
  Plus,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    logout,
    currency,
    t,
    listings,
    bookings,
    themeMode,
    setThemeMode,
    isDark,
    setIsAdminDashboardOpen,
    setIsAdvertiserPortalOpen,
    setActiveBookingForStatus,
    openChatWithBooking,
    promoteListing,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'rentals' | 'items' | 'earnings' | 'reviews'>('rentals');
  const [activeRentalSubTab, setActiveRentalSubTab] = useState<'active' | 'completed' | 'lent'>('active');
  const [statsModalType, setStatsModalType] = useState<'following' | 'followers' | 'likes' | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [promoteModalListingId, setPromoteModalListingId] = useState<string | null>(null);

  if (!currentUser) return null;

  // My listings
  const myListings = listings.filter((item) => item.ownerId === currentUser.id);

  // My rentals
  const activeRentals = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const completedRentals = bookings.filter((b) => b.status === 'completed');

  // Earnings calculation:
  // Base sum, 15% owner deduction, net earnings
  const totalGrossEarnings = myListings.reduce((acc, curr) => acc + curr.originalPriceIDR * 3, 18500000);
  const totalOwnerDeduction = Math.round(totalGrossEarnings * 0.15); // 15%
  const totalNetEarnings = totalGrossEarnings - totalOwnerDeduction;

  const toggleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-28 transition-colors">
      <div className="bg-white dark:bg-[#150E10] rounded-3xl border border-[#E5E5E5] dark:border-[#3A2A2E] p-5 shadow-sm space-y-5">
        {/* Top Header: Actions & Quick Theme Switch */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#3A2A2E]">
          <span className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
            Profil Pengguna
          </span>

          <div className="flex items-center gap-2">
            {/* Quick theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-[#EFECE8] dark:bg-[#201518] text-[#5A1624] dark:text-[#D6AE67] hover:scale-105 transition-transform"
              title="Ganti Mode Tampilan"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Privacy Settings */}
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="p-1.5 rounded-full bg-[#EFECE8] dark:bg-[#201518] text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]"
              title="Pengaturan Privasi"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-1.5 rounded-full bg-[#9C2A3F]/10 text-[#9C2A3F] hover:bg-[#9C2A3F]/20"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-3 ring-[#B8893C] shadow-md"
            />
            {currentUser.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-[#B8893C] fill-[#5A1624] absolute -bottom-1 -right-1 shadow-xs" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury font-bold text-lg text-[#111111] dark:text-[#F5ECDF] truncate">
                {currentUser.name}
              </h1>
            </div>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94]">
              @{currentUser.username} · {currentUser.location}
            </p>

            {/* Badges: Tetangga Terpercaya & Terpopuler di Sekitarmu */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {currentUser.isTrustedNeighbor && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#B8893C]/15 border border-[#B8893C]/40 text-[#B8893C] dark:text-[#D6AE67] text-[10px] font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Tetangga Terpercaya</span>
                </span>
              )}
              {currentUser.isPopularNeighbor && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 border border-[#5A1624]/30 text-[#5A1624] dark:text-[#F5ECDF] text-[10px] font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#B8893C]" />
                  <span>Terpopuler di Sekitarmu</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[#111111] dark:text-[#F5ECDF] leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Stats Strip: Mengikuti | Pengikut | Suka (bisa diketuk) */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] text-center border border-[#E5E5E5] dark:border-[#3A2A2E]">
          <button
            onClick={() => setStatsModalType('following')}
            className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-transform"
          >
            <span className="font-serif-luxury font-extrabold text-sm text-[#5A1624] dark:text-[#D6AE67]">
              {currentUser.followingCount}
            </span>
            <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">{t('following')}</span>
          </button>

          <button
            onClick={() => setStatsModalType('followers')}
            className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-transform border-x border-[#E5E5E5] dark:border-[#3A2A2E]"
          >
            <span className="font-serif-luxury font-extrabold text-sm text-[#5A1624] dark:text-[#D6AE67]">
              {currentUser.followersCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">Pengikut</span>
          </button>

          <button
            onClick={() => setStatsModalType('likes')}
            className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-transform"
          >
            <span className="font-serif-luxury font-extrabold text-sm text-[#5A1624] dark:text-[#D6AE67]">
              {(currentUser.likesCount / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">Suka</span>
          </button>
        </div>

        {/* Two Luxury Admin & Advertiser Cards:
            Krem-soft #F7F3EC dengan border emas tipis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Pasang Iklan */}
          <div
            onClick={() => setIsAdvertiserPortalOpen(true)}
            className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 cursor-pointer hover:border-[#B8893C] transition-all flex items-center justify-between shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#150E10] border border-[#B8893C]/40 flex items-center justify-center text-[#B8893C] group-hover:scale-105 transition-transform">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF]">
                  {t('placeThirdPartyAds')}
                </h4>
                <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                  Jangkau ribuan tetangga di sekitarmu
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B8893C]" />
          </div>

          {/* Card 2: Dashboard Admin ("Omset & Verifikasi") */}
          <div
            onClick={() => setIsAdminDashboardOpen(true)}
            className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 cursor-pointer hover:border-[#B8893C] transition-all flex items-center justify-between shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#150E10] border border-[#B8893C]/40 flex items-center justify-center text-[#B8893C] group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF]">
                  {t('adminDashboard')}
                </h4>
                <p className="text-[10px] text-[#B8893C] font-semibold">
                  {t('revenueAndVerification')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B8893C]" />
          </div>
        </div>

        {/* Navigation Tabs inside Profile:
            "Sewaan Saya", "Barang Saya", "Pendapatan Saya", "Ulasan" */}
        <div className="flex items-center border-b border-[#E5E5E5] dark:border-[#3A2A2E] text-xs font-bold">
          <button
            onClick={() => setActiveProfileTab('rentals')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeProfileTab === 'rentals'
                ? 'border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            {t('myRentals')} ({bookings.length})
          </button>

          <button
            onClick={() => setActiveProfileTab('items')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeProfileTab === 'items'
                ? 'border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Barang Saya ({myListings.length})
          </button>

          <button
            onClick={() => setActiveProfileTab('earnings')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeProfileTab === 'earnings'
                ? 'border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            {t('myEarnings')}
          </button>

          <button
            onClick={() => setActiveProfileTab('reviews')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeProfileTab === 'reviews'
                ? 'border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Ulasan ({currentUser.reviewCount})
          </button>
        </div>

        {/* Tab 1: Sewaan Saya (Active, Completed, Lent) */}
        {activeProfileTab === 'rentals' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRentalSubTab('active')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  activeRentalSubTab === 'active'
                    ? 'bg-[#5A1624] text-[#F7F3EC]'
                    : 'bg-[#EFECE8] dark:bg-[#201518] text-[#6B6B6B]'
                }`}
              >
                Sedang Berjalan ({activeRentals.length})
              </button>
              <button
                onClick={() => setActiveRentalSubTab('completed')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  activeRentalSubTab === 'completed'
                    ? 'bg-[#5A1624] text-[#F7F3EC]'
                    : 'bg-[#EFECE8] dark:bg-[#201518] text-[#6B6B6B]'
                }`}
              >
                Selesai ({completedRentals.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {(activeRentalSubTab === 'active' ? activeRentals : completedRentals).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] flex items-center justify-between gap-3"
                >
                  <img
                    src={b.listingImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[#5A1624] text-[#D4AF6A] text-[9px] font-bold uppercase">
                      {b.status}
                    </span>
                    <h4 className="font-bold text-[#111111] dark:text-[#F5ECDF] truncate mt-1">
                      {b.listingTitle}
                    </h4>
                    <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                      {b.startDate} s/d {b.endDate} · Total: {formatCurrency(b.totalPaidIDR, currency)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => setActiveBookingForStatus(b)}
                      className="py-1 px-3 rounded-xl bg-white dark:bg-[#150E10] border border-[#B8893C] text-[10px] font-bold text-[#5A1624] dark:text-[#D6AE67]"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => openChatWithBooking(b.id)}
                      className="py-1 px-3 rounded-xl bg-[#5A1624] text-[#F7F3EC] text-[10px] font-bold"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Barang Saya (Grid with Promosikan button) */}
        {activeProfileTab === 'items' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] p-2.5 flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2">
                    <img
                      src={item.images[0]}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {item.isPromoted && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#D4AF6A] text-[#4A0F1C] text-[8px] font-bold uppercase">
                        {t('promoted')}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-[#111111] dark:text-[#F5ECDF] line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <p className="font-serif-luxury font-bold text-xs text-[#5A1624] dark:text-[#D6AE67] mb-2">
                    {formatCurrency(item.originalPriceIDR, currency)} /hari
                  </p>

                  {/* Tombol Promosikan: Outline Emas */}
                  <button
                    onClick={() => setPromoteModalListingId(item.id)}
                    className="w-full py-1.5 rounded-xl border border-[#B8893C] text-[10px] font-bold text-[#5A1624] dark:text-[#D6AE67] hover:bg-[#F7F3EC] transition-colors"
                  >
                    Promosikan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pendapatan Saya (15% deduction breakdown) */}
        {activeProfileTab === 'earnings' && (
          <div className="space-y-4 text-xs">
            {/* Blok Burgundy Gradasi dengan Teks Krem untuk Kartu Ringkasan Pendapatan */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] text-[#F7F3EC] shadow-md border border-[#D4AF6A]/30">
              <span className="text-[10px] font-bold text-[#D4AF6A] uppercase tracking-wider block">
                Total Pendapatan Bersih
              </span>
              <p className="font-serif-luxury text-2xl font-extrabold text-[#F7F3EC] mt-1">
                {formatCurrency(totalNetEarnings, currency)}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/20 text-[11px]">
                <div>
                  <span className="text-white/70 block">Omset Kotor:</span>
                  <span className="font-bold">{formatCurrency(totalGrossEarnings, currency)}</span>
                </div>
                <div>
                  <span className="text-white/70 block">{t('serviceFeeOwner')}:</span>
                  <span className="font-bold text-[#D4AF6A]">- {formatCurrency(totalOwnerDeduction, currency)}</span>
                </div>
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/30 space-y-2">
              <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67]">
                Riwayat Pencairan Otomatis ke Rekening
              </h4>
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E]">
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-[#F5ECDF]">BCA Transfer · Rek. *4819</p>
                    <p className="text-[10px] text-[#6B6B6B]">3 November 2026</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+ {formatCurrency(2465000, currency)}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E]">
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-[#F5ECDF]">BCA Transfer · Rek. *4819</p>
                    <p className="text-[10px] text-[#6B6B6B]">28 Oktober 2026</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+ {formatCurrency(7800000, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Ulasan */}
        {activeProfileTab === 'reviews' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1 text-[#B8893C] font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs text-[#111111] dark:text-[#F5ECDF] ml-1">5.0</span>
                </div>
                <span className="text-[10px] text-[#6B6B6B]">2 hari yang lalu</span>
              </div>
              <p className="text-xs text-[#111111] dark:text-[#F5ECDF] leading-relaxed">
                "Kamera Sony FX3 sangat terawat dan paket baterainya lengkap. Serah terima cepat dan sangat profesional!"
              </p>
              <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] mt-1 font-semibold">
                — Dimas W. (Penyewa Terverifikasi)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Promosikan Modal */}
      {promoteModalListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#201518] p-5 shadow-2xl">
            <h4 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF] mb-2">
              Promosikan Barang
            </h4>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] mb-3">
              Barang akan tampil di urutan atas Jelajah dan sela feed Beranda dengan badge "DIPROMOSIKAN".
            </p>

            <div className="space-y-2 mb-4 text-xs">
              {[
                { days: 1, cost: 150000 },
                { days: 3, cost: 350000 },
                { days: 7, cost: 700000 },
                { days: 30, cost: 2200000 },
              ].map((pkg) => (
                <button
                  key={pkg.days}
                  onClick={() => {
                    promoteListing(promoteModalListingId, pkg.days as any);
                    setPromoteModalListingId(null);
                    alert(`Iklan berhasil aktif selama ${pkg.days} hari.`);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#B8893C] text-left flex justify-between items-center hover:bg-[#F7F3EC] dark:hover:bg-[#150E10]"
                >
                  <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">{pkg.days} Hari</span>
                  <span className="font-serif-luxury font-bold">{formatCurrency(pkg.cost, currency)}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPromoteModalListingId(null)}
              className="w-full py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Stats Modal (Followers/Following/Likes) */}
      {statsModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#201518] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E5E5]">
              <h4 className="font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF] capitalize">
                Daftar {statsModalType === 'following' ? 'Mengikuti' : statsModalType === 'followers' ? 'Pengikut' : 'Suka'}
              </h4>
              <button onClick={() => setStatsModalType(null)}>
                <X className="w-4 h-4 text-[#6B6B6B]" />
              </button>
            </div>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] mb-3">
              Semua nomor HP dan kontak tetap dirahasiakan sepenuhnya.
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {['Clara Van Der Veen', 'Dimas Wicaksono', 'Valerie Tan', 'Wayan Made'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#EFECE8] dark:bg-[#150E10]">
                  <span className="font-semibold text-[#111111] dark:text-[#F5ECDF]">{name}</span>
                  <span className="text-[10px] text-[#B8893C] font-bold">Tetangga Terverifikasi</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E5E5]">
              <h4 className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
                Pengaturan Privasi & Keamanan
              </h4>
              <button onClick={() => setPrivacyModalOpen(false)}>
                <X className="w-4 h-4 text-[#6B6B6B]" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#111111] dark:text-[#F5ECDF]">
              <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#150E10] cursor-pointer">
                <span>Sembunyikan daftar pengikut</span>
                <input type="checkbox" defaultChecked className="accent-[#5A1624]" />
              </label>
              <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#150E10] cursor-pointer">
                <span>Blokir interaksi akun asing</span>
                <input type="checkbox" className="accent-[#5A1624]" />
              </label>
            </div>
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="w-full mt-4 py-2 rounded-xl bg-[#5A1624] text-white text-xs font-bold"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
