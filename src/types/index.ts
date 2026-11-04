export type LanguageCode =
  | 'id'
  | 'en'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'th'
  | 'ar'
  | 'hi'
  | 'vi';

export type CurrencyCode =
  | 'IDR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'SGD'
  | 'JPY'
  | 'AUD'
  | 'CAD'
  | 'MYR'
  | 'AED'
  | 'SAR'
  | 'CNY'
  | 'THB'
  | 'INR'
  | 'VND'
  | 'KRW';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  city: string;
  province: string;
  isVerified: boolean;
  isTrustedNeighbor: boolean;
  isPopularNeighbor: boolean;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  role: 'user' | 'admin';
}

export type ItemCategory =
  | 'Elektronik'
  | 'Alat tukang dan perkakas'
  | 'Outdoor dan olahraga'
  | 'Alat pesta dan acara'
  | 'Baju dan fashion'
  | 'Kendaraan'
  | 'Perabot dan rumah tangga'
  | 'Alat musik'
  | 'Buku dan pendidikan'
  | 'Bayi dan anak'
  | 'Kesehatan'
  | 'Hobi dan koleksi'
  | 'Hobi & koleksi'
  | 'Rumah & Villa'
  | 'Lainnya';

export type ServiceCategory =
  | 'Tukang Pijat'
  | 'Tukang Kebun'
  | 'Supir'
  | 'Travel Guide'
  | 'Pendamping Acara';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  genre: string;
  audioUrl?: string;
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface ListingItem {
  id: string;
  title: string;
  category: ItemCategory;
  description: string;
  originalPriceIDR: number; // base stored in IDR
  priceUnit: 'hari' | 'malam' | 'minggu';
  depositIDR: number;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  rules: string;
  location: string;
  city: string;
  province: string;
  distanceKm: number;
  images: string[];
  videoUrl?: string; // listing must have video to appear on Home feed
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  isOwnerVerified: boolean;
  isNeighborPick?: boolean;
  isPromoted?: boolean;
  musicTrack?: MusicTrack;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  availableDates: string[]; // ISO dates
  // Villa specific
  bedrooms?: number;
  guestCapacity?: number;
  amenities?: string[];
  houseRules?: string;
}

export interface ServiceListing {
  id: string;
  title: string;
  category: ServiceCategory;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  isVerified: boolean;
  skills: string[];
  ratePerHourIDR: number;
  ratePerDayIDR: number;
  serviceArea: string;
  city: string;
  experienceYears: number;
  availableDays: string[];
  image: string;
  description: string;
  isEventCompanion?: boolean;
}

export interface RentalBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  category: ItemCategory | ServiceCategory;
  type: 'item' | 'service';
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  duration: number;
  unit: 'hari' | 'malam' | 'jam';
  deliveryType: 'self_pickup' | 'delivery';
  notes?: string;
  basePriceIDR: number;
  renterServiceFeeIDR: number; // 20%
  ownerServiceFeeIDR: number; // 15%
  depositIDR: number;
  totalPaidIDR: number; // basePrice + renterServiceFee + deposit
  netOwnerEarningsIDR: number; // basePrice - ownerServiceFee
  status:
    | 'requested'
    | 'approved'
    | 'paid'
    | 'in_use'
    | 'returned'
    | 'completed'
    | 'cancelled';
  paymentMethod: string;
  handoverPhotos?: string[];
  returnInspectionPhotos?: string[];
  createdAt: string;
  hasReviewed?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  translatedText?: string;
  photoUrl?: string;
  locationShare?: { name: string; lat: number; lng: number };
  timestamp: string;
  isWarning?: boolean;
}

export interface ChatThread {
  id: string;
  bookingId: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isLocked: boolean; // Locked before payment
  messages: ChatMessage[];
}

export interface WantedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  category: ItemCategory;
  description: string;
  neededDate: string;
  targetBudgetIDR: number;
  city: string;
  offersCount: number;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'follow' | 'new_item' | 'rental_status' | 'chat' | 'promo';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: 'home' | 'explore' | 'post' | 'notifications' | 'profile';
}

export interface ThirdPartyAd {
  id: string;
  advertiserId: string;
  advertiserName: string;
  title: string;
  description: string;
  bannerUrl: string;
  targetUrl: string;
  ctaText: 'Unduh' | 'Kunjungi' | 'Pelajari Lebih Lanjut';
  packageType: '1_day' | '3_days' | '7_days' | '30_days';
  targetAudience: 'all' | 'city' | 'luxury_interest';
  targetCity?: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'ended';
  rejectionReason?: string;
  impressions: number;
  clicks: number;
  budgetIDR: number;
  remainingBudgetIDR: number;
  createdAt: string;
}

export interface ProductPromotionAd {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  packageDays: 1 | 3 | 7 | 30;
  costIDR: number;
  status: 'active' | 'ended';
  daysRemaining: number;
  impressions: number;
  clicks: number;
  rentalsGenerated: number;
  startedAt: string;
}
