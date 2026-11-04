import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ListingItem, ThirdPartyAd } from '../types';
import { formatCurrency, formatDistance } from '../utils/currency';
import {
  Heart,
  Bookmark,
  Share2,
  Images,
  Volume2,
  VolumeX,
  Play,
  Disc3,
  Music,
  MapPin,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const {
    listings,
    currency,
    currentCity,
    t,
    toggleLike,
    toggleSave,
    toggleFollowUser,
    followedUserIds,
    setSelectedListing,
    setIsBookingModalOpen,
    setIsLocationPickerOpen,
    thirdPartyAds,
    isLoggedIn,
    openLoginModal,
  } = useApp();

  const [feedTab, setFeedTab] = useState<'following' | 'for_you'>('for_you');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [galleryModalItem, setGalleryModalItem] = useState<ListingItem | null>(null);
  const [activeGalleryPhotoIndex, setActiveGalleryPhotoIndex] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  // Filter: ONLY listings that have videoUrl are eligible for the Home feed!
  const videoListings = listings.filter((item) => !!item.videoUrl);

  const displayedListings =
    feedTab === 'following'
      ? videoListings.filter((item) => followedUserIds.includes(item.ownerId))
      : videoListings;

  // Interleave active third-party ads
  const activeAds = thirdPartyAds.filter((ad) => ad.status === 'active');

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer or scroll handler for snap video autoplay
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeVideoIndex && index >= 0) {
      setActiveVideoIndex(index);
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `LetsBorrow: ${title}`,
        url: window.location.href,
      });
    } else {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleRentClick = (item: ListingItem) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setSelectedListing(item);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-116px)] sm:h-[calc(100vh-120px)] max-w-md mx-auto bg-black overflow-hidden select-none">
      {/* Top Floating Feed Bar: Tabs (Mengikuti | Untuk Kamu) + Location Chip */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Tabs */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              setFeedTab('following');
              setActiveVideoIndex(0);
            }}
            className="relative py-1 text-sm font-semibold transition-colors flex flex-col items-center"
          >
            <span
              className={
                feedTab === 'following'
                  ? 'text-white font-bold drop-shadow-md'
                  : 'text-white/60 hover:text-white/80'
              }
            >
              {t('following')}
            </span>
            {feedTab === 'following' && (
              <span className="w-8 h-0.5 rounded-full bg-[#D4AF6A] mt-1 shadow-sm" />
            )}
          </button>

          <button
            onClick={() => {
              setFeedTab('for_you');
              setActiveVideoIndex(0);
            }}
            className="relative py-1 text-sm font-semibold transition-colors flex flex-col items-center"
          >
            <span
              className={
                feedTab === 'for_you'
                  ? 'text-white font-bold drop-shadow-md'
                  : 'text-white/60 hover:text-white/80'
              }
            >
              {t('forYou')}
            </span>
            {feedTab === 'for_you' && (
              <span className="w-8 h-0.5 rounded-full bg-[#D4AF6A] mt-1 shadow-sm" />
            )}
          </button>
        </div>

        {/* Location Chip on the Right of tab row */}
        <button
          onClick={() => setIsLocationPickerOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#D4AF6A]/50 text-white text-[11px] font-medium max-w-[140px] truncate shadow-xs hover:border-[#D4AF6A]"
        >
          <MapPin className="w-3 h-3 text-[#D4AF6A] shrink-0" />
          <span className="truncate">{currentCity}</span>
        </button>
      </div>

      {/* Mute/Unmute Global Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-14 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Feed Container: Snap Scroll */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y-mandatory no-scrollbar"
      >
        {displayedListings.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#150E10]">
            <Sparkles className="w-12 h-12 text-[#D4AF6A] mb-3 animate-pulse" />
            <h3 className="font-serif-luxury text-lg font-bold">
              {feedTab === 'following'
                ? 'Belum ada video dari akun yang kamu ikuti'
                : 'Belum ada video barang di area ini'}
            </h3>
            <p className="text-xs text-white/70 max-w-xs mt-1 mb-4 leading-relaxed">
              Jelajahi tab "Untuk Kamu" atau ikuti tetangga pemilik mobil sport, villa, dan barang mewah lainnya.
            </p>
            <button
              onClick={() => setFeedTab('for_you')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold ring-1 ring-[#D4AF6A]"
            >
              Lihat Untuk Kamu
            </button>
          </div>
        ) : (
          displayedListings.map((item, idx) => {
            const isCurrent = idx === activeVideoIndex;
            const isFollowingOwner = followedUserIds.includes(item.ownerId);

            return (
              <div
                key={item.id}
                className="relative w-full h-full snap-start snap-always shrink-0 bg-black flex items-center justify-center overflow-hidden"
              >
                {/* Video Component */}
                <FeedVideoPlayer
                  videoUrl={item.videoUrl!}
                  poster={item.images[0]}
                  isActive={isCurrent}
                  isMuted={isMuted}
                />

                {/* Luxury Vignette Overlay: burgundy tint at bottom, dark scrim */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/30 via-40% to-transparent" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#5A1624]/30 via-transparent to-black/80" />

                {/* Badges on Top Left of video */}
                <div className="absolute top-14 left-4 z-10 flex flex-wrap items-center gap-1.5 pointer-events-auto">
                  {item.isPromoted && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#A67C2E] text-[#4A0F1C] text-[10px] font-bold tracking-wider shadow-sm uppercase">
                      {t('promoted')}
                    </span>
                  )}
                  {item.isNeighborPick && (
                    <span className="px-2 py-0.5 rounded-full bg-[#5A1624]/90 border border-[#D4AF6A]/60 text-[#F5ECDF] text-[10px] font-semibold backdrop-blur-xs">
                      {t('neighborPick')}
                    </span>
                  )}
                  {isFollowingOwner && (
                    <span className="px-2 py-0.5 rounded-full bg-[#5A1624]/80 text-[#D4AF6A] text-[10px] font-semibold border border-[#D4AF6A]/40">
                      {t('friends')}
                    </span>
                  )}
                </div>

                {/* Bottom Left Info: Owner, Title, Price, Distance, Music Marquee */}
                <div className="absolute bottom-4 left-4 right-20 z-10 text-white pointer-events-auto">
                  {/* Owner snippet */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative">
                      <img
                        src={item.ownerAvatar}
                        alt={item.ownerName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D4AF6A]"
                      />
                      {item.isOwnerVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF6A] fill-[#5A1624] absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white drop-shadow-xs">
                          {item.ownerName}
                        </span>
                        <span className="text-[11px] text-[#D4AF6A] font-bold">★ {item.ownerRating}</span>
                      </div>
                      {/* Transparent burgundy distance chip */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#5A1624]/70 border border-[#D4AF6A]/30 text-[10px] font-medium text-white/90 backdrop-blur-xs flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#D4AF6A]" />
                          {formatDistance(item.distanceKm, currency)} · {item.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description preview */}
                  <h3
                    onClick={() => {
                      setSelectedListing(item);
                    }}
                    className="font-serif-luxury text-base font-bold text-white line-clamp-1 drop-shadow-md cursor-pointer hover:underline"
                  >
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 drop-shadow-xs">
                    {item.description}
                  </p>

                  {/* Price in Gold */}
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="font-serif-luxury text-lg font-extrabold text-[#D4AF6A] drop-shadow-md">
                      {formatCurrency(item.originalPriceIDR, currency)}
                    </span>
                    <span className="text-xs text-white/80 font-medium">
                      {item.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
                    </span>
                    {item.depositIDR > 0 && (
                      <span className="text-[10px] text-white/60 ml-1">
                        · Dep: {formatCurrency(item.depositIDR, currency)}
                      </span>
                    )}
                  </div>

                  {/* Music Marquee on bottom left */}
                  <div className="flex items-center gap-2 mt-2 max-w-[200px] overflow-hidden text-[11px] text-white/80">
                    <Music className="w-3 h-3 text-[#D4AF6A] shrink-0" />
                    <div className="overflow-hidden whitespace-nowrap">
                      <span className="animate-marquee inline-block">
                        {item.musicTrack?.title || 'LetsBorrow Luxury Soundtrack'} —{' '}
                        {item.musicTrack?.artist || 'Original Audio'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Icons Column */}
                <div className="absolute right-3 bottom-6 z-10 flex flex-col items-center gap-4 text-white pointer-events-auto">
                  {/* Follow / Unfollow */}
                  <button
                    onClick={() => toggleFollowUser(item.ownerId)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md active:scale-90 ${
                      isFollowingOwner
                        ? 'bg-[#5A1624] border border-[#D4AF6A] text-[#D4AF6A]'
                        : 'bg-white text-[#5A1624] hover:bg-[#F7F3EC]'
                    }`}
                    title={isFollowingOwner ? t('followingBtn') : t('follow')}
                  >
                    {isFollowingOwner ? '✓' : '+'}
                  </button>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                        item.isLiked
                          ? 'bg-[#9C2A3F] text-white'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${item.isLiked ? 'fill-white stroke-none' : ''}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-white drop-shadow-sm">
                      {item.likesCount}
                    </span>
                  </button>

                  {/* Save / Bookmark Button */}
                  <button
                    onClick={() => toggleSave(item.id)}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                        item.isSaved
                          ? 'bg-[#D4AF6A] text-[#5A1624]'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${item.isSaved ? 'fill-current stroke-none' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(item.title)}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60">
                      <Share2 className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Photo Gallery Icon with Count: Tepat di bawah bagikan ikon galeri foto dengan angka jumlah foto */}
                  <button
                    onClick={() => {
                      setGalleryModalItem(item);
                      setActiveGalleryPhotoIndex(0);
                    }}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                    title="Buka Galeri Foto"
                  >
                    <div className="relative w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-[#D4AF6A]/60 flex items-center justify-center text-[#D4AF6A] hover:bg-black/60">
                      <Images className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 px-1 rounded-full bg-[#5A1624] text-[#D4AF6A] text-[9px] font-bold border border-[#D4AF6A]/50">
                        {item.images.length}
                      </span>
                    </div>
                  </button>

                  {/* Rotating Vinyl Record for Music */}
                  <div className="w-10 h-10 rounded-full bg-black/80 border-2 border-[#D4AF6A] flex items-center justify-center p-1 shadow-lg animate-spin-slow">
                    <Disc3 className="w-6 h-6 text-[#D4AF6A]" />
                  </div>

                  {/* Tombol Sewa: Gradasi emas dengan teks burgundy gelap */}
                  <button
                    onClick={() => handleRentClick(item)}
                    className="mt-1 px-3 py-2 rounded-full bg-gradient-to-r from-[#D4AF6A] via-[#E5C384] to-[#A67C2E] text-[#4A0F1C] font-bold text-xs shadow-lg active:scale-95 transition-transform tracking-wide"
                  >
                    {t('rentNow')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF6A] text-white text-xs font-medium animate-in fade-in">
          Tautan disalin ke papan klip!
        </div>
      )}

      {/* Swipeable Photo Gallery Overlay Modal (without leaving the video!) */}
      {galleryModalItem && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in">
          {/* Top Bar: Close & Count */}
          <div className="flex items-center justify-between text-white pt-2">
            <span className="text-xs font-semibold text-[#D4AF6A]">
              Foto {activeGalleryPhotoIndex + 1} dari {galleryModalItem.images.length}
            </span>
            <button
              onClick={() => setGalleryModalItem(null)}
              className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Active Photo with swipe navigation */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={galleryModalItem.images[activeGalleryPhotoIndex]}
              alt={`Foto ${activeGalleryPhotoIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all"
            />

            {/* Left/Right arrow controls */}
            {activeGalleryPhotoIndex > 0 && (
              <button
                onClick={() => setActiveGalleryPhotoIndex((prev) => prev - 1)}
                className="absolute left-2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {activeGalleryPhotoIndex < galleryModalItem.images.length - 1 && (
              <button
                onClick={() => setActiveGalleryPhotoIndex((prev) => prev + 1)}
                className="absolute right-2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dots Indicator & Rent CTA */}
          <div className="space-y-3 pb-2">
            <div className="flex justify-center gap-1.5">
              {galleryModalItem.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGalleryPhotoIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeGalleryPhotoIndex ? 'w-5 bg-[#D4AF6A]' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl p-3 border border-[#B8893C]/40">
              <div>
                <p className="text-xs font-bold text-[#5A1624] dark:text-[#F5ECDF] line-clamp-1">
                  {galleryModalItem.title}
                </p>
                <p className="font-serif-luxury text-sm font-extrabold text-[#B8893C] mt-0.5">
                  {formatCurrency(galleryModalItem.originalPriceIDR, currency)}
                  <span className="text-[11px] font-normal text-[#6B6B6B] dark:text-[#B09F94] ml-1">
                    {galleryModalItem.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setGalleryModalItem(null);
                  handleRentClick(galleryModalItem);
                }}
                className="py-1.5 px-4 rounded-full bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold shadow-xs"
              >
                {t('rentNow')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface FeedVideoPlayerProps {
  videoUrl: string;
  poster?: string;
  isActive: boolean;
  isMuted: boolean;
}

const FeedVideoPlayer: React.FC<FeedVideoPlayerProps> = ({
  videoUrl,
  poster,
  isActive,
  isMuted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy fallback: mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      onClick={togglePlayPause}
      className="relative w-full h-full flex items-center justify-center cursor-pointer bg-black"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        loop
        playsInline
        muted={isMuted}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />

      {/* Fallback image if video fails to load */}
      {hasError && poster && (
        <img
          src={poster}
          alt="Poster"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Play/Pause indicator icon when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};
