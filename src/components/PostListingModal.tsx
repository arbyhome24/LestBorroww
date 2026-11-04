import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, ServiceCategory, MusicTrack } from '../types';
import { validateNoContactInfo } from '../utils/security';
import { SafeContactBanner } from './SafeContactBanner';
import { APP_MUSIC_LIBRARY } from '../data/mockData';
import { formatCurrency } from '../utils/currency';
import {
  X,
  Upload,
  Video,
  Music,
  Plus,
  Play,
  Pause,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Briefcase,
  Bed,
  Users,
  Building,
  Flag,
} from 'lucide-react';

export const PostListingModal: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currency,
    t,
    currentCity,
    currentProvince,
    addListing,
    addService,
  } = useApp();

  const [postType, setPostType] = useState<'item' | 'service'>('item');

  // Item Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Elektronik');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState<number>(500000);
  const [deposit, setDeposit] = useState<number>(1000000);
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [rules, setRules] = useState('Jaga kebersihan dan rawat dengan baik. Dilarang merusak atau memindahtangankan ke pihak lain.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80');
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-professional-camera-42894-large.mp4');

  // Villa specific
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [guestCapacity, setGuestCapacity] = useState<number>(6);
  const [amenities, setAmenities] = useState<string>('Private Pool, Wi-Fi Starlink, Kitchen, AC');

  // Service Form Fields
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('Supir');
  const [serviceSkills, setServiceSkills] = useState('Defensive Driving, Bahasa Inggris, Airport Transfer');
  const [serviceRateHour, setServiceRateHour] = useState<number>(150000);
  const [serviceRateDay, setServiceRateDay] = useState<number>(850000);
  const [experienceYears, setExperienceYears] = useState<number>(5);

  // TikTok Music Picker Sheet State
  const [isMusicSheetOpen, setIsMusicSheetOpen] = useState(false);
  const [selectedMusicSource, setSelectedMusicSource] = useState<'app' | 'custom' | 'original'>('app');
  const [activeMusicTrack, setActiveMusicTrack] = useState<MusicTrack | null>(APP_MUSIC_LIBRARY[0]);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [musicSearch, setMusicSearch] = useState('');
  const [musicTab, setMusicTab] = useState<'popular' | 'trending' | 'saved'>('popular');
  const [audioConsentChecked, setAudioConsentChecked] = useState(false);
  const [musicVolume, setMusicVolume] = useState<number>(70);
  const [voiceVolume, setVoiceVolume] = useState<number>(80);
  const [fadeInOut, setFadeInOut] = useState(true);
  const [reportAudioOpen, setReportAudioOpen] = useState(false);

  // Contact validation error state
  const [validationError, setValidationError] = useState<string | null>(null);

  if (activeTab !== 'post') return null;

  // Real-time contact checking
  const handleValidateText = (fieldVal: string) => {
    const res = validateNoContactInfo(fieldVal);
    if (!res.isValid) {
      setValidationError(res.error || t('safeContactError'));
    } else {
      setValidationError(null);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict security check across all text inputs
    const check1 = validateNoContactInfo(title);
    const check2 = validateNoContactInfo(description);
    const check3 = validateNoContactInfo(rules);

    if (!check1.isValid || !check2.isValid || !check3.isValid) {
      setValidationError(
        check1.error || check2.error || check3.error || t('safeContactError')
      );
      return;
    }

    if (postType === 'item') {
      addListing({
        title,
        category,
        description,
        originalPriceIDR: Number(pricePerDay),
        priceUnit: category === 'Rumah & Villa' ? 'malam' : 'hari',
        depositIDR: Number(deposit),
        condition,
        rules,
        location: currentCity,
        city: currentCity,
        province: currentProvince,
        distanceKm: 1.2,
        images: [imageUrl],
        videoUrl: videoUrl || undefined,
        musicTrack: activeMusicTrack || undefined,
        availableDates: ['2026-11-04', '2026-11-05', '2026-11-06'],
        bedrooms: category === 'Rumah & Villa' ? bedrooms : undefined,
        guestCapacity: category === 'Rumah & Villa' ? guestCapacity : undefined,
        amenities: category === 'Rumah & Villa' ? amenities.split(',').map((s) => s.trim()) : undefined,
      });
      setActiveTab('explore');
    } else {
      addService({
        title,
        category: serviceCategory,
        skills: serviceSkills.split(',').map((s) => s.trim()),
        ratePerHourIDR: Number(serviceRateHour),
        ratePerDayIDR: Number(serviceRateDay),
        serviceArea: `${currentCity} (Radius 20km)`,
        city: currentCity,
        experienceYears,
        availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        image: imageUrl,
        description,
        isEventCompanion: serviceCategory === 'Pendamping Acara',
      });
      setActiveTab('explore');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-24 transition-colors">
      <div className="bg-white dark:bg-[#150E10] rounded-3xl border border-[#E5E5E5] dark:border-[#3A2A2E] p-5 shadow-sm">
        {/* Header and Type Selector: Barang | Jasa */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#3A2A2E] mb-4">
          <h2 className="font-serif-luxury font-bold text-lg text-[#5A1624] dark:text-[#F5ECDF]">
            Sewakan ke Tetangga
          </h2>

          <div className="flex items-center p-1 bg-[#EFECE8] dark:bg-[#201518] rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E]">
            <button
              type="button"
              onClick={() => setPostType('item')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'item'
                  ? 'bg-[#5A1624] text-white'
                  : 'text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Barang</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('service')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'service'
                  ? 'bg-[#5A1624] text-white'
                  : 'text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>Jasa (Tenaga)</span>
            </button>
          </div>
        </div>

        {/* Kotak Perlindungan Kontak Aman di atas form */}
        <div className="mb-4">
          <SafeContactBanner />
        </div>

        {/* Validation Warning Notice if Leak Detected */}
        {validationError && (
          <div className="mb-4 p-3 rounded-2xl bg-[#9C2A3F]/10 border border-[#9C2A3F] flex items-start gap-2.5 text-xs text-[#9C2A3F] dark:text-[#E5A0AF] animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{validationError}</p>
          </div>
        )}

        <form onSubmit={handlePostSubmit} className="space-y-4">
          {/* Media Upload Slots (Dashed Gold Border) */}
          <div>
            <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1.5">
              Foto & Video (Wajib Minimal 1 Video untuk Tampil di Beranda Reels)
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Photo Slot */}
              <div className="relative aspect-4/3 rounded-2xl border-2 border-dashed border-[#B8893C] bg-[#F7F3EC] dark:bg-[#201518] flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium">
                      Foto Utama
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-[#B8893C] mb-1" />
                    <span className="text-[11px] font-semibold text-[#5A1624] dark:text-[#D6AE67]">
                      Unggah Foto
                    </span>
                  </>
                )}
              </div>

              {/* Video Slot with Music Add Trigger */}
              <div className="relative aspect-4/3 rounded-2xl border-2 border-dashed border-[#B8893C] bg-[#F7F3EC] dark:bg-[#201518] flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                {videoUrl ? (
                  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white p-2">
                    <Video className="w-6 h-6 text-[#D4AF6A] mb-1" />
                    <span className="text-[10px] font-semibold text-center line-clamp-1">
                      Video Aktif (Masuk Feed Beranda)
                    </span>
                    {/* Tombol Tambah Musik */}
                    <button
                      type="button"
                      onClick={() => setIsMusicSheetOpen(true)}
                      className="mt-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#A67C2E] text-[#4A0F1C] text-[10px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Music className="w-3 h-3" />
                      <span>{activeMusicTrack ? 'Edit Musik' : 'Tambah Musik'}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Video className="w-6 h-6 text-[#B8893C] mb-1" />
                    <span className="text-[11px] font-semibold text-[#5A1624] dark:text-[#D6AE67]">
                      Unggah Video Reels
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Music Badge if attached */}
            {activeMusicTrack && (
              <div className="mt-2 p-2 rounded-xl bg-[#EFECE8] dark:bg-[#201518] border border-[#B8893C]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-[#B8893C]" />
                  <span className="font-semibold text-[#5A1624] dark:text-[#F5ECDF] truncate max-w-[200px]">
                    {activeMusicTrack.title} — {activeMusicTrack.artist}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMusicSheetOpen(true)}
                  className="text-[11px] text-[#B8893C] font-bold hover:underline"
                >
                  Ubah
                </button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
              Judul {postType === 'item' ? 'Barang' : 'Layanan'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleValidateText(e.target.value);
              }}
              placeholder={postType === 'item' ? 'Contoh: Porsche 911 Carrera GTS Guards Red' : 'Contoh: Supir Pribadi Eksekutif & VIP Escort'}
              className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Kategori
              </label>
              {postType === 'item' ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
                >
                  <option value="Rumah & Villa">Rumah & Villa</option>
                  <option value="Kendaraan">Kendaraan</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Hobi & koleksi">Hobi & koleksi</option>
                  <option value="Baju dan fashion">Baju dan fashion</option>
                  <option value="Alat tukang dan perkakas">Alat tukang & perkakas</option>
                  <option value="Outdoor dan olahraga">Outdoor & olahraga</option>
                  <option value="Alat pesta dan acara">Alat pesta & acara</option>
                  <option value="Perabot dan rumah tangga">Perabot & rumah tangga</option>
                  <option value="Alat musik">Alat musik</option>
                  <option value="Buku dan pendidikan">Buku & pendidikan</option>
                  <option value="Bayi dan anak">Bayi & anak</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              ) : (
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
                >
                  <option value="Pendamping Acara">Pendamping Acara (Platonis)</option>
                  <option value="Supir">Supir</option>
                  <option value="Travel Guide">Travel Guide</option>
                  <option value="Tukang Pijat">Tukang Pijat</option>
                  <option value="Tukang Kebun">Tukang Kebun</option>
                </select>
              )}
            </div>

            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Kondisi Fisik
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
              >
                <option value="Brand New">Brand New (Segel / Baru)</option>
                <option value="Like New">Like New (Mulus Terawat)</option>
                <option value="Good">Good (Fungsi Normal)</option>
                <option value="Fair">Fair (Bekas Pemakaian Normal)</option>
              </select>
            </div>
          </div>

          {/* Villa Specific Fields */}
          {postType === 'item' && category === 'Rumah & Villa' && (
            <div className="p-3.5 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30 space-y-3">
              <span className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67] block">
                Pengaturan Khusus Rumah & Villa (Tarif per Malam)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="font-medium text-[#6B6B6B] block mb-1">Jumlah Kamar</label>
                  <input
                    type="number"
                    min="1"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#6B6B6B] block mb-1">Kapasitas Tamu</label>
                  <input
                    type="number"
                    min="1"
                    value={guestCapacity}
                    onChange={(e) => setGuestCapacity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#6B6B6B] block mb-1">
                  Fasilitas Unggulan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="Private Pool, Wi-Fi Starlink, Kitchen..."
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
              Deskripsi Lengkap
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleValidateText(e.target.value);
              }}
              placeholder="Jelaskan spesifikasi, kelengkapan, dan kondisi barang..."
              className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
            />
          </div>

          {/* Price & Deposit */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                {postType === 'item' && category === 'Rumah & Villa'
                  ? 'Harga Sewa per Malam'
                  : 'Harga Sewa per Hari'}{' '}
                ({currency})
              </label>
              <input
                type="number"
                required
                min="10000"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
              />
            </div>

            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Uang Jaminan (Deposit) ({currency})
              </label>
              <input
                type="number"
                required
                min="0"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
              />
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
              Aturan Pemakaian
            </label>
            <input
              type="text"
              value={rules}
              onChange={(e) => {
                setRules(e.target.value);
                handleValidateText(e.target.value);
              }}
              placeholder="Contoh: Dilarang merokok, wajib SIM A, dll."
              className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
            />
          </div>

          {/* Submit Button: Gradasi Burgundy */}
          <button
            type="submit"
            disabled={!!validationError}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] disabled:opacity-50 text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all"
          >
            {postType === 'item' ? 'Posting Barang' : 'Posting Layanan'}
          </button>
        </form>
      </div>

      {/* TikTok Style Music Bottom Sheet Modal */}
      {isMusicSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[#5A1624] dark:text-[#D6AE67]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
                  Pilih Musik Latar Video
                </h3>
              </div>
              <button
                onClick={() => setIsMusicSheetOpen(false)}
                className="p-1 text-[#6B6B6B] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Source Tabs: Musik Aplikasi | Unggah Audio Sendiri | Suara Asli */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-[#150E10] rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] mb-3 text-center text-xs">
              <button
                type="button"
                onClick={() => setSelectedMusicSource('app')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedMusicSource === 'app'
                    ? 'bg-[#5A1624] text-[#F7F3EC]'
                    : 'text-[#6B6B6B]'
                }`}
              >
                Musik Aplikasi
              </button>
              <button
                type="button"
                onClick={() => setSelectedMusicSource('custom')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedMusicSource === 'custom'
                    ? 'bg-[#5A1624] text-[#F7F3EC]'
                    : 'text-[#6B6B6B]'
                }`}
              >
                Unggah Sendiri
              </button>
              <button
                type="button"
                onClick={() => setSelectedMusicSource('original')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedMusicSource === 'original'
                    ? 'bg-[#5A1624] text-[#F7F3EC]'
                    : 'text-[#6B6B6B]'
                }`}
              >
                Suara Asli
              </button>
            </div>

            {/* Content for App Music */}
            {selectedMusicSource === 'app' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Cari lagu mewah, lounge, upbeat..."
                  value={musicSearch}
                  onChange={(e) => setMusicSearch(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                />

                {/* Sub-tabs: Populer | Trending | Tersimpan */}
                <div className="flex items-center gap-2 text-xs">
                  {(['popular', 'trending', 'saved'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMusicTab(tab)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        musicTab === tab
                          ? 'bg-[#B8893C] text-white'
                          : 'bg-white dark:bg-[#150E10] text-[#6B6B6B]'
                      }`}
                    >
                      {tab === 'popular' ? 'Populer' : tab === 'trending' ? 'Trending' : 'Tersimpan'}
                    </button>
                  ))}
                </div>

                {/* Music Track List with 15s preview simulation */}
                <div className="space-y-1.5">
                  {APP_MUSIC_LIBRARY.map((track) => {
                    const isSelected = activeMusicTrack?.id === track.id;
                    const isPlaying = previewTrackId === track.id;

                    return (
                      <div
                        key={track.id}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20'
                            : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setPreviewTrackId(isPlaying ? null : track.id)}
                            className="w-8 h-8 rounded-full bg-[#5A1624] text-[#D4AF6A] flex items-center justify-center shrink-0"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <p className="text-xs font-bold text-[#111111] dark:text-[#F5ECDF]">
                              {track.title}
                            </p>
                            <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                              {track.artist} · {track.genre} ({track.duration}s)
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMusicTrack(track);
                            setIsMusicSheetOpen(false);
                          }}
                          className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#B8893C] text-white'
                              : 'border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67]'
                          }`}
                        >
                          {isSelected ? 'Terpilih' : 'Gunakan'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content for Custom Audio Upload */}
            {selectedMusicSource === 'custom' && (
              <div className="space-y-3 my-2 text-xs">
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#B8893C] bg-white dark:bg-[#150E10] text-center">
                  <Upload className="w-8 h-8 text-[#B8893C] mx-auto mb-1" />
                  <p className="font-bold text-[#5A1624] dark:text-[#D6AE67]">Pilih File Audio (MP3 / WAV)</p>
                  <p className="text-[10px] text-[#6B6B6B]">Maksimum durasi 60 detik.</p>
                </div>

                <label className="flex items-start gap-2 p-2 bg-white dark:bg-[#150E10] rounded-xl border border-[#E5E5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioConsentChecked}
                    onChange={(e) => setAudioConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded accent-[#5A1624] w-4 h-4 shrink-0"
                  />
                  <span className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] leading-relaxed">
                    {t('audioCopyrightConsent')}
                  </span>
                </label>

                <button
                  type="button"
                  disabled={!audioConsentChecked}
                  onClick={() => {
                    setActiveMusicTrack({
                      id: `custom_${Date.now()}`,
                      title: 'Audio Milik Pengguna',
                      artist: 'Audio Sendiri',
                      duration: 45,
                      genre: 'Custom',
                    });
                    setIsMusicSheetOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] disabled:opacity-50 text-[#F7F3EC] text-xs font-bold"
                >
                  Terapkan Audio Sendiri
                </button>
              </div>
            )}

            {/* Simple Audio Editor: Sliders for Volume and Trim */}
            <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#3A2A2E] mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">Volume Musik</span>
                <span>{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full accent-[#5A1624]"
              />

              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">Suara Asli Video</span>
                <span>{voiceVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                className="w-full accent-[#5A1624]"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMusicTrack(null)}
                  className="text-[11px] text-[#9C2A3F] font-bold hover:underline"
                >
                  Hapus Musik
                </button>
                <button
                  type="button"
                  onClick={() => setReportAudioOpen(true)}
                  className="text-[11px] text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1"
                >
                  <Flag className="w-3 h-3 text-[#B8893C]" />
                  <span>{t('reportAudio')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Audio Confirmation */}
      {reportAudioOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#201518] p-4 text-center">
            <h4 className="font-bold text-xs text-[#9C2A3F] mb-1">Laporkan Hak Cipta Audio</h4>
            <p className="text-[11px] text-[#6B6B6B] mb-3">
              Klaim hak cipta musik akan ditindaklanjuti dalam 24 jam kerja sesuai ketentuan DMCA.
            </p>
            <button
              type="button"
              onClick={() => {
                setReportAudioOpen(false);
                alert('Laporan hak cipta audio telah diterima tim peninjau.');
              }}
              className="w-full py-1.5 rounded-xl bg-[#9C2A3F] text-white text-xs font-bold"
            >
              Kirim Klaim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
