import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingItem, ItemCategory } from '../types';
import { formatCurrency, formatDistance } from '../utils/currency';
import { ServicesView } from './ServicesView';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Map as MapIcon,
  Grid,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Tv,
  Wrench,
  Tent,
  PartyPopper,
  Shirt,
  Car,
  Armchair,
  Music,
  BookOpen,
  Baby,
  HeartPulse,
  Watch,
  Home,
  Layers,
  X,
  UserPlus,
  Star,
} from 'lucide-react';
import { SAMPLE_USERS } from '../data/mockData';

const CATEGORIES: { label: ItemCategory; icon: React.FC<{ className?: string }> }[] = [
  { label: 'Rumah & Villa', icon: Home },
  { label: 'Kendaraan', icon: Car },
  { label: 'Elektronik', icon: Tv },
  { label: 'Hobi & koleksi', icon: Watch },
  { label: 'Baju dan fashion', icon: Shirt },
  { label: 'Alat tukang dan perkakas', icon: Wrench },
  { label: 'Outdoor dan olahraga', icon: Tent },
  { label: 'Alat pesta dan acara', icon: PartyPopper },
  { label: 'Perabot dan rumah tangga', icon: Armchair },
  { label: 'Alat musik', icon: Music },
  { label: 'Buku dan pendidikan', icon: BookOpen },
  { label: 'Bayi dan anak', icon: Baby },
  { label: 'Kesehatan', icon: HeartPulse },
  { label: 'Lainnya', icon: Layers },
];

export const ExploreView: React.FC = () => {
  const {
    listings,
    currency,
    t,
    setSelectedListing,
    currentCity,
    setIsLocationPickerOpen,
    followedUserIds,
    toggleFollowUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'items' | 'services'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isMapView, setIsMapView] = useState(false);

  // Filters state
  const [maxDistance, setMaxDistance] = useState<number>(30); // in km
  const [maxPrice, setMaxPrice] = useState<number>(25000000); // in IDR

  // Filter listings
  const filteredListings = listings.filter((item) => {
    // City filter
    if (currentCity && currentCity !== 'Semua Kota' && item.city !== currentCity) {
      // allow nearby city if distance <= maxDistance
      if (item.distanceKm > maxDistance) return false;
    }
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchOwner = item.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchOwner) return false;
    }
    // Price filter
    if (item.originalPriceIDR > maxPrice) return false;

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 pb-24 transition-colors">
      {/* 2 Main Tabs: Sewa Barang | Pinjam Tenaga (Jasa) */}
      <div className="flex items-center justify-center p-1 bg-[#EFECE8] dark:bg-[#201518] rounded-2xl max-w-sm mx-auto mb-4 border border-[#E5E5E5] dark:border-[#3A2A2E]">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-[#5A1624] text-white shadow-xs'
              : 'text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{t('rentItems')}</span>
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-[#5A1624] text-white shadow-xs'
              : 'text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 shrink-0" />
          <span>{t('hireHelp')}</span>
        </button>
      </div>

      {/* If Services Tab active, render ServicesView */}
      {activeTab === 'services' ? (
        <ServicesView />
      ) : (
        <>
          {/* Search Bar + Filter Trigger + Map Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6B6B6B] dark:text-[#B09F94] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] text-xs text-[#111111] dark:text-[#F5ECDF] placeholder-[#6B6B6B] focus:outline-none focus:border-[#B8893C] shadow-2xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] hover:border-[#B8893C] text-[#5A1624] dark:text-[#F5ECDF] shadow-2xs transition-colors shrink-0"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#B8893C]" />
            </button>

            {/* Map Toggle Button */}
            <button
              onClick={() => setIsMapView(!isMapView)}
              className={`p-2.5 rounded-2xl border transition-colors shadow-2xs shrink-0 ${
                isMapView
                  ? 'bg-[#5A1624] border-[#5A1624] text-white'
                  : 'bg-white dark:bg-[#201518] border-[#E5E5E5] dark:border-[#3A2A2E] text-[#5A1624] dark:text-[#F5ECDF]'
              }`}
              title={isMapView ? 'Tampilan Grid' : 'Tampilan Peta'}
            >
              {isMapView ? <Grid className="w-4 h-4" /> : <MapIcon className="w-4 h-4 text-[#B8893C]" />}
            </button>
          </div>

          {/* Categories Horizontal Carousel + "Lihat Semua Kategori" */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors shadow-2xs ${
                selectedCategory === 'All'
                  ? 'bg-[#5A1624] text-[#F7F3EC]'
                  : 'bg-[#EFECE8] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF] hover:bg-[#E5E0D8]'
              }`}
            >
              Semua
            </button>

            {CATEGORIES.slice(0, 7).map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors shadow-2xs ${
                    isActive
                      ? 'bg-[#5A1624] text-[#F7F3EC]'
                      : 'bg-[#EFECE8] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF] hover:bg-[#E5E0D8] dark:hover:bg-[#281B20]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF6A]' : 'text-[#B8893C]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsAllCategoriesOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#201518] border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67] text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-[#F7F3EC] transition-colors"
            >
              Semua Kategori ({CATEGORIES.length})
            </button>
          </div>

          {/* Map View Interactive Simulation */}
          {isMapView ? (
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-[#B8893C]/40 shadow-sm mb-6 bg-[#EFECE8] dark:bg-[#201518] flex items-center justify-center">
              {/* Map Canvas Background Vector Graphic */}
              <div className="absolute inset-0 opacity-25 dark:opacity-10 bg-[radial-gradient(#B8893C_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-[#B8893C]/30 text-xs text-[#5A1624] dark:text-[#F5ECDF] font-semibold flex items-center gap-1.5 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#B8893C]" />
                <span>Peta Interaktif Sekitar: {currentCity}</span>
              </div>

              {/* Pins on the map */}
              {filteredListings.slice(0, 6).map((item, i) => {
                const offsets = [
                  { top: '35%', left: '42%' },
                  { top: '55%', left: '28%' },
                  { top: '25%', left: '68%' },
                  { top: '65%', left: '72%' },
                  { top: '48%', left: '52%' },
                  { top: '75%', left: '40%' },
                ];
                const pos = offsets[i] || { top: '50%', left: '50%' };
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedListing(item)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className="px-2.5 py-1 rounded-full bg-[#5A1624] border border-[#D4AF6A] text-white text-[11px] font-bold shadow-lg flex items-center gap-1 hover:scale-110 transition-transform">
                      <span className="text-[#D4AF6A]">★</span>
                      <span>{formatCurrency(item.originalPriceIDR, currency)}</span>
                    </div>
                  </div>
                );
              })}

              <div className="text-center z-10 pointer-events-none p-4 bg-white/80 dark:bg-[#150E10]/80 rounded-2xl backdrop-blur-md border border-[#E5E5E5] dark:border-[#3A2A2E] max-w-xs">
                <p className="text-xs font-semibold text-[#5A1624] dark:text-[#F5ECDF]">
                  Menampilkan {filteredListings.length} barang di sekitar {currentCity}
                </p>
                <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5">
                  Ketuk pin harga di peta untuk melihat detail barang.
                </p>
              </div>
            </div>
          ) : null}

          {/* Section: Akun yang Mungkin Kamu Kenal */}
          <div className="mb-6 bg-[#F7F3EC] dark:bg-[#201518] rounded-3xl p-4 border border-[#B8893C]/30 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
                {t('accountsYouMayKnow')}
              </h3>
              <span className="text-[11px] text-[#B8893C] font-medium">Tetangga Terverifikasi</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {SAMPLE_USERS.slice(1, 5).map((user) => {
                const isFollowing = followedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="w-36 shrink-0 bg-white dark:bg-[#150E10] rounded-2xl p-3 border border-[#E5E5E5] dark:border-[#3A2A2E] flex flex-col items-center text-center shadow-2xs"
                  >
                    <div className="relative mb-1.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#B8893C]"
                      />
                      {user.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B8893C] fill-[#5A1624] absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#111111] dark:text-[#F5ECDF] line-clamp-1">
                      {user.name}
                    </h4>
                    <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] line-clamp-1">
                      {user.location}
                    </p>

                    <div className="flex items-center gap-1 my-1 text-[10px] text-[#B8893C] font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{user.rating}</span>
                    </div>

                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={`w-full mt-1 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                        isFollowing
                          ? 'bg-[#5A1624] border-[#5A1624] text-[#F7F3EC]'
                          : 'border-[#5A1624] dark:border-[#C2566B] text-[#5A1624] dark:text-[#C2566B] hover:bg-[#5A1624]/5'
                      }`}
                    >
                      {isFollowing ? t('followingBtn') : `+ ${t('follow')}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Title & Count */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              {t('availableItems', { count: filteredListings.length })}
            </h2>
            <span className="text-xs text-[#6B6B6B] dark:text-[#B09F94]">
              {currentCity || 'Semua Kota'}
            </span>
          </div>

          {/* Kartu Barang: Grid 2 Kolom, Jarak 16px.
              Foto penuh di atas (rasio sama), lalu area krem #EFECE8 dengan padding lega berisi nama (maks. 2 baris, regular) dan harga di bawahnya.
              Barang dengan beberapa varian menampilkan strip thumbnail kecil di sisi kanan foto. */}
          <div className="grid grid-cols-2 gap-4">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedListing(item)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xs hover:shadow-md transition-all active:scale-[0.98] flex flex-col"
              >
                {/* Photo Container (rasio sama) */}
                <div className="relative aspect-4/3 w-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Thumbnail strip on the right side if item has multiple images */}
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                      {item.images.slice(1, 3).map((thumb, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-md overflow-hidden ring-1 ring-white/80 shadow-xs"
                        >
                          <img
                            src={thumb}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Badges on photo */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                    {item.isPromoted && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#A67C2E] text-[#4A0F1C] text-[9px] font-extrabold shadow-xs uppercase tracking-wider">
                        {t('promoted')}
                      </span>
                    )}
                    {item.category === 'Rumah & Villa' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#B8893C] text-white text-[9px] font-bold shadow-xs">
                        Per Malam
                      </span>
                    )}
                  </div>

                  {/* Distance Chip at bottom right of photo */}
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[#D4AF6A]" />
                    <span>{formatDistance(item.distanceKm, currency)}</span>
                  </div>
                </div>

                {/* Area Krem #EFECE8 dengan padding lega */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Owner snippet */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <img
                        src={item.ownerAvatar}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded-full object-cover ring-1 ring-[#B8893C]"
                      />
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] truncate">
                        {item.ownerName}
                      </span>
                      {item.isOwnerVerified && (
                        <CheckCircle2 className="w-3 h-3 text-[#B8893C] shrink-0" />
                      )}
                    </div>

                    {/* Nama (maks. 2 baris, regular font) */}
                    <h3 className="text-xs font-normal text-[#111111] dark:text-[#F5ECDF] line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Harga di bawahnya */}
                  <div className="mt-2.5 pt-2 border-t border-[#E5E5E5]/60 dark:border-[#3A2A2E]/60 flex items-baseline justify-between">
                    <div>
                      <span className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#D6AE67]">
                        {formatCurrency(item.originalPriceIDR, currency)}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] ml-1">
                        {item.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-[10px] font-semibold text-[#B8893C]">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{item.ownerRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Filter Sheet Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4">
              <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                Filter Pencarian
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City Filter Trigger */}
            <div className="mb-4">
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1.5">
                Kota / Wilayah
              </label>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  setIsLocationPickerOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] text-xs text-[#111111] dark:text-[#F5ECDF]"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B8893C]" />
                  <span>{currentCity || 'Pilih Kota'}</span>
                </div>
                <span className="text-[#B8893C] font-semibold">Ubah</span>
              </button>
            </div>

            {/* Distance Slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">{t('filterDistance')}</span>
                <span className="font-semibold text-[#111111] dark:text-[#F5ECDF]">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[#5A1624]"
              />
            </div>

            {/* Max Price Slider */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">{t('filterPrice')}</span>
                <span className="font-serif-luxury font-bold text-[#5A1624] dark:text-[#D6AE67]">
                  s/d {formatCurrency(maxPrice, currency)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#5A1624]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMaxDistance(50);
                  setMaxPrice(50000000);
                  setSelectedCategory('All');
                  setIsFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67] text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold shadow-xs"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Categories Modal */}
      {isAllCategoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4">
              <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                Semua Kategori Barang
              </h3>
              <button
                onClick={() => setIsAllCategoriesOpen(false)}
                className="p-1 text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto no-scrollbar pr-1 flex-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setSelectedCategory(cat.label);
                      setIsAllCategoriesOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                        : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] hover:border-[#B8893C]/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EFECE8] dark:bg-[#201518] flex items-center justify-center text-[#B8893C]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
