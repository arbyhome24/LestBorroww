import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ListingItem,
  ServiceListing,
  RentalBooking,
  ChatThread,
  ChatMessage,
  WantedPost,
  AppNotification,
  ThirdPartyAd,
  ProductPromotionAd,
  LanguageCode,
  CurrencyCode,
} from '../types';
import {
  CURRENT_LOGGED_IN_USER,
  SAMPLE_USERS,
  MOCK_LISTINGS,
  MOCK_SERVICES,
  MOCK_WANTED_POSTS,
  MOCK_NOTIFICATIONS,
  MOCK_THIRD_PARTY_ADS,
  INITIAL_BOOKING,
} from '../data/mockData';
import { getTranslation, TranslationKey, SUPPORTED_LANGUAGES } from '../i18n';
import { sanitizeChatMessage } from '../utils/security';
import { COUNTRIES_DATA } from '../data/countryRegions';

interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  currentUser: UserProfile | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string) => boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;

  // Language & i18n
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRtl: boolean;

  // Currency
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;

  // Theme
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;

  // Location & Country
  countryCode: string;
  setCountryCode: (code: string) => void;
  selectCountry: (countryCode: string) => void;
  currentCity: string;
  currentProvince: string;
  setCurrentCity: (city: string, province?: string) => void;
  detectGPSLocation: () => Promise<string>;

  // Data
  listings: ListingItem[];
  services: ServiceListing[];
  wantedPosts: WantedPost[];
  notifications: AppNotification[];
  bookings: RentalBooking[];
  chatThreads: ChatThread[];
  thirdPartyAds: ThirdPartyAd[];
  productAds: ProductPromotionAd[];

  // Actions
  addListing: (item: Omit<ListingItem, 'id' | 'likesCount' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerRating' | 'isOwnerVerified'>) => void;
  addService: (service: Omit<ServiceListing, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'providerRating' | 'isVerified'>) => void;
  addWantedPost: (title: string, category: any, description: string, neededDate: string, targetBudgetIDR: number) => void;
  toggleLike: (listingId: string) => void;
  toggleSave: (listingId: string) => void;
  toggleFollowUser: (userId: string) => void;
  followedUserIds: string[];

  // Rental & Booking
  createBooking: (bookingData: Omit<RentalBooking, 'id' | 'createdAt' | 'status'>) => RentalBooking;
  updateBookingStatus: (bookingId: string, status: RentalBooking['status'], photoUrl?: string) => void;

  // Chat
  activeChatThread: ChatThread | null;
  openChatWithBooking: (bookingId: string) => void;
  closeChat: () => void;
  sendChatMessage: (threadId: string, text: string, photoUrl?: string, locationShare?: { name: string; lat: number; lng: number }) => void;

  // Notifications
  markAllNotificationsRead: () => void;
  unreadNotifCount: number;

  // Ads
  submitThirdPartyAd: (ad: Omit<ThirdPartyAd, 'id' | 'advertiserId' | 'advertiserName' | 'impressions' | 'clicks' | 'remainingBudgetIDR' | 'createdAt' | 'status'>) => void;
  updateAdStatus: (adId: string, status: ThirdPartyAd['status'], reason?: string) => void;
  promoteListing: (listingId: string, days: 1 | 3 | 7 | 30) => void;

  // Navigation & Modals
  activeTab: 'home' | 'explore' | 'post' | 'notifications' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'post' | 'notifications' | 'profile') => void;
  selectedListing: ListingItem | null;
  setSelectedListing: (item: ListingItem | null) => void;
  selectedService: ServiceListing | null;
  setSelectedService: (service: ServiceListing | null) => void;
  isWantedBoardOpen: boolean;
  setIsWantedBoardOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  isAdvertiserPortalOpen: boolean;
  setIsAdvertiserPortalOpen: (open: boolean) => void;
  isLocationPickerOpen: boolean;
  setIsLocationPickerOpen: (open: boolean) => void;
  isLanguageCurrencyOpen: boolean;
  setIsLanguageCurrencyOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  activeBookingForStatus: RentalBooking | null;
  setActiveBookingForStatus: (booking: RentalBooking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state - default logged in for rich initial experience, can toggle anytime
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(CURRENT_LOGGED_IN_USER);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // i18n
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('lb_lang') as LanguageCode;
    return saved || 'id';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('lb_lang', lang);
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = langConfig?.isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isRtl = SUPPORTED_LANGUAGES.find((l) => l.code === language)?.isRtl ?? false;

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('lb_curr') as CurrencyCode;
    return saved || 'IDR';
  });

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('lb_curr', curr);
  };

  // Theme
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('lb_theme') as 'light' | 'dark' | 'system') || 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    let effectiveDark = false;
    if (themeMode === 'system') {
      effectiveDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      effectiveDark = themeMode === 'dark';
    }

    setIsDark(effectiveDark);
    if (effectiveDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lb_theme', themeMode);
  }, [themeMode]);

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
  };

  // Location & Country
  const [countryCode, setCountryCodeState] = useState<string>(() => {
    return localStorage.getItem('lb_country') || 'ID';
  });

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    localStorage.setItem('lb_country', code);
  };

  const selectCountry = (newCountryCode: string) => {
    const matched = COUNTRIES_DATA.find((c) => c.code === newCountryCode);
    if (!matched) return;
    setCountryCode(matched.code);
    setLanguage(matched.language);
    setCurrency(matched.defaultCurrency);
  };

  const [currentCity, setCurrentCityState] = useState<string>('Jakarta Selatan');
  const [currentProvince, setCurrentProvince] = useState<string>('DKI Jakarta');

  const setCurrentCity = (city: string, province?: string) => {
    setCurrentCityState(city);
    if (province) setCurrentProvince(province);
  };

  const detectGPSLocation = async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(currentCity);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Based on coordinates simulation
          const lat = position.coords.latitude;
          if (lat < -8.0) {
            setCurrentCityState('Denpasar');
            setCurrentProvince('Bali');
            resolve('Denpasar');
          } else {
            setCurrentCityState('Jakarta Selatan');
            setCurrentProvince('DKI Jakarta');
            resolve('Jakarta Selatan');
          }
        },
        () => {
          resolve(currentCity);
        },
        { timeout: 5000 }
      );
    });
  };

  // Listings & Services
  const [listings, setListings] = useState<ListingItem[]>(MOCK_LISTINGS);
  const [services, setServices] = useState<ServiceListing[]>(MOCK_SERVICES);
  const [wantedPosts, setWantedPosts] = useState<WantedPost[]>(MOCK_WANTED_POSTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [bookings, setBookings] = useState<RentalBooking[]>([INITIAL_BOOKING]);
  const [thirdPartyAds, setThirdPartyAds] = useState<ThirdPartyAd[]>(MOCK_THIRD_PARTY_ADS);
  const [productAds, setProductAds] = useState<ProductPromotionAd[]>([
    {
      id: 'pad_1',
      listingId: 'item_porsche',
      listingTitle: 'Porsche 911 Carrera GTS (992) Guards Red',
      listingImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      packageDays: 7,
      costIDR: 700000,
      status: 'active',
      daysRemaining: 5,
      impressions: 4120,
      clicks: 384,
      rentalsGenerated: 3,
      startedAt: '2026-11-01',
    },
  ]);

  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['user_dimas', 'user_clara']);

  // Chat threads
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread_01',
      bookingId: 'booking_sample_01',
      listingId: 'item_sony_fx3',
      listingTitle: 'Sony FX3 Cinema Line Kit + G Master 24-70mm f/2.8 II',
      listingImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      otherUserId: 'user_dimas',
      otherUserName: 'Dimas Wicaksono',
      otherUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      lastMessage: 'Halo Arya, nanti jam 10 pagi saya ambil ke apartemen ya. Sudah disiapkan?',
      lastTimestamp: '10:15',
      unreadCount: 1,
      isLocked: false,
      messages: [
        {
          id: 'msg_1',
          senderId: 'system',
          senderName: 'LetsBorrow Safe Guard',
          text: 'Pembayaran telah diamankan di Rekening Escrow LetsBorrow. Anda dapat mengatur serah terima barang sekarang.',
          timestamp: '10:00',
        },
        {
          id: 'msg_2',
          senderId: 'user_dimas',
          senderName: 'Dimas Wicaksono',
          text: 'Halo Arya, nanti jam 10 pagi saya ambil ke apartemen ya. Sudah disiapkan?',
          timestamp: '10:15',
        },
      ],
    },
  ]);

  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(null);

  // Tabs & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'post' | 'notifications' | 'profile'>('home');
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [isWantedBoardOpen, setIsWantedBoardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdvertiserPortalOpen, setIsAdvertiserPortalOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isLanguageCurrencyOpen, setIsLanguageCurrencyOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBookingForStatus, setActiveBookingForStatus] = useState<RentalBooking | null>(null);

  // Auth actions
  const login = (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser({
      ...CURRENT_LOGGED_IN_USER,
      name: email.split('@')[0],
      username: email.split('@')[0],
    });
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const register = (name: string, email: string, _phone: string) => {
    setIsLoggedIn(true);
    setCurrentUser({
      ...CURRENT_LOGGED_IN_USER,
      name,
      username: email.split('@')[0],
    });
    setIsLoginModalOpen(false);
    return true;
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Toggle Like
  const toggleLike = (listingId: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likesCount: isLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
          };
        }
        return item;
      })
    );
  };

  // Toggle Save
  const toggleSave = (listingId: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          return {
            ...item,
            isSaved: !item.isSaved,
          };
        }
        return item;
      })
    );
  };

  // Toggle Follow
  const toggleFollowUser = (userId: string) => {
    setFollowedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  // Add Listing
  const addListing = (
    itemData: Omit<ListingItem, 'id' | 'likesCount' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerRating' | 'isOwnerVerified'>
  ) => {
    const newListing: ListingItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      likesCount: 0,
      ownerId: currentUser?.id || 'user_me',
      ownerName: currentUser?.name || 'Arya Pratama',
      ownerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      ownerRating: 5.0,
      isOwnerVerified: true,
      isLiked: false,
      isSaved: false,
    };
    setListings((prev) => [newListing, ...prev]);
    // Notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        type: 'new_item',
        title: 'Barang Berhasil Diposting',
        body: `Listing "${itemData.title}" kini telah tayang dan siap disewa oleh tetangga sekitar.`,
        timestamp: 'Baru saja',
        isRead: false,
        linkTab: 'explore',
      },
      ...prev,
    ]);
  };

  // Add Service
  const addService = (
    serviceData: Omit<ServiceListing, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'providerRating' | 'isVerified'>
  ) => {
    const newService: ServiceListing = {
      ...serviceData,
      id: `service_${Date.now()}`,
      providerId: currentUser?.id || 'user_me',
      providerName: currentUser?.name || 'Arya Pratama',
      providerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      providerRating: 5.0,
      isVerified: true,
    };
    setServices((prev) => [newService, ...prev]);
  };

  // Add Wanted Post
  const addWantedPost = (
    title: string,
    category: any,
    description: string,
    neededDate: string,
    targetBudgetIDR: number
  ) => {
    const newPost: WantedPost = {
      id: `wanted_${Date.now()}`,
      userId: currentUser?.id || 'user_me',
      userName: currentUser?.name || 'Arya Pratama',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      title,
      category,
      description,
      neededDate,
      targetBudgetIDR,
      city: currentCity,
      offersCount: 0,
      createdAt: 'Baru saja',
    };
    setWantedPosts((prev) => [newPost, ...prev]);
  };

  // Bookings
  const createBooking = (bookingData: Omit<RentalBooking, 'id' | 'createdAt' | 'status'>): RentalBooking => {
    const newBooking: RentalBooking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      status: 'paid', // Instant confirmation simulation with escrow
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Create a matching unlocked chat thread
    const existingThread = chatThreads.find((t) => t.bookingId === newBooking.id);
    if (!existingThread) {
      const newThread: ChatThread = {
        id: `thread_${Date.now()}`,
        bookingId: newBooking.id,
        listingId: newBooking.listingId,
        listingTitle: newBooking.listingTitle,
        listingImage: newBooking.listingImage,
        otherUserId: newBooking.ownerId,
        otherUserName: newBooking.ownerName,
        otherUserAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        lastMessage: 'Pembayaran terkonfirmasi. Atur waktu serah terima barang.',
        lastTimestamp: 'Baru saja',
        unreadCount: 0,
        isLocked: false,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: 'system',
            senderName: 'LetsBorrow Safe Guard',
            text: `Pembayaran sebesar Rp ${newBooking.totalPaidIDR.toLocaleString('id-ID')} telah diamankan di Rekening Escrow LetsBorrow. Dana akan dicairkan ke pemilik setelah barang dikembalikan dalam kondisi baik.`,
            timestamp: 'Baru saja',
          },
        ],
      };
      setChatThreads((prev) => [newThread, ...prev]);
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: RentalBooking['status'], photoUrl?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status };
          if (status === 'in_use' && photoUrl) {
            updated.handoverPhotos = [...(updated.handoverPhotos || []), photoUrl];
          } else if (status === 'returned' && photoUrl) {
            updated.returnInspectionPhotos = [...(updated.returnInspectionPhotos || []), photoUrl];
          }
          return updated;
        }
        return b;
      })
    );
  };

  // Chat Actions
  const openChatWithBooking = (bookingId: string) => {
    const thread = chatThreads.find((t) => t.bookingId === bookingId);
    if (thread) {
      setActiveChatThread(thread);
    } else {
      // Find booking and create thread
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        const newThread: ChatThread = {
          id: `thread_${Date.now()}`,
          bookingId: booking.id,
          listingId: booking.listingId,
          listingTitle: booking.listingTitle,
          listingImage: booking.listingImage,
          otherUserId: booking.ownerId,
          otherUserName: booking.ownerName,
          otherUserAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          lastMessage: 'Chat dimulai',
          lastTimestamp: 'Baru saja',
          unreadCount: 0,
          isLocked: booking.status === 'requested',
          messages: [],
        };
        setChatThreads((prev) => [newThread, ...prev]);
        setActiveChatThread(newThread);
      }
    }
  };

  const closeChat = () => setActiveChatThread(null);

  const sendChatMessage = (
    threadId: string,
    text: string,
    photoUrl?: string,
    locationShare?: { name: string; lat: number; lng: number }
  ) => {
    const sanitized = sanitizeChatMessage(text);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 'user_me',
      senderName: currentUser?.name || 'Arya Pratama',
      text: sanitized.cleanText,
      photoUrl,
      locationShare,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWarning: sanitized.hasViolation,
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const updatedMessages = [...thread.messages, newMsg];
          if (sanitized.warningNote) {
            updatedMessages.push({
              id: `warning_${Date.now()}`,
              senderId: 'system',
              senderName: 'LetsBorrow Safe Guard',
              text: sanitized.warningNote,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isWarning: true,
            });
          }
          return {
            ...thread,
            lastMessage: newMsg.text,
            lastTimestamp: newMsg.timestamp,
            messages: updatedMessages,
          };
        }
        return thread;
      })
    );

    if (activeChatThread && activeChatThread.id === threadId) {
      setActiveChatThread((prev) => {
        if (!prev) return null;
        const updated = [...prev.messages, newMsg];
        if (sanitized.warningNote) {
          updated.push({
            id: `warning_${Date.now()}`,
            senderId: 'system',
            senderName: 'LetsBorrow Safe Guard',
            text: sanitized.warningNote,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isWarning: true,
          });
        }
        return {
          ...prev,
          lastMessage: newMsg.text,
          lastTimestamp: newMsg.timestamp,
          messages: updated,
        };
      });
    }
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Ads
  const submitThirdPartyAd = (adData: any) => {
    const newAd: ThirdPartyAd = {
      ...adData,
      id: `ad_${Date.now()}`,
      advertiserId: currentUser?.id || 'adv_me',
      advertiserName: currentUser?.name || 'Arya Pratama',
      status: 'pending_approval',
      impressions: 0,
      clicks: 0,
      remainingBudgetIDR: adData.budgetIDR,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setThirdPartyAds((prev) => [newAd, ...prev]);
  };

  const updateAdStatus = (adId: string, status: ThirdPartyAd['status'], reason?: string) => {
    setThirdPartyAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return {
            ...ad,
            status,
            rejectionReason: reason || ad.rejectionReason,
          };
        }
        return ad;
      })
    );
  };

  const promoteListing = (listingId: string, days: 1 | 3 | 7 | 30) => {
    const item = listings.find((l) => l.id === listingId);
    if (!item) return;

    const costs: Record<number, number> = { 1: 150000, 3: 350000, 7: 700000, 30: 2200000 };
    const newPromo: ProductPromotionAd = {
      id: `pad_${Date.now()}`,
      listingId,
      listingTitle: item.title,
      listingImage: item.images[0],
      packageDays: days,
      costIDR: costs[days] || 350000,
      status: 'active',
      daysRemaining: days,
      impressions: 1,
      clicks: 0,
      rentalsGenerated: 0,
      startedAt: new Date().toISOString().split('T')[0],
    };

    setProductAds((prev) => [newPromo, ...prev]);
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, isPromoted: true } : l))
    );
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
        register,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
        language,
        setLanguage,
        t,
        isRtl,
        currency,
        setCurrency,
        themeMode,
        setThemeMode,
        isDark,
        countryCode,
        setCountryCode,
        selectCountry,
        currentCity,
        currentProvince,
        setCurrentCity,
        detectGPSLocation,
        listings,
        services,
        wantedPosts,
        notifications,
        bookings,
        chatThreads,
        thirdPartyAds,
        productAds,
        addListing,
        addService,
        addWantedPost,
        toggleLike,
        toggleSave,
        toggleFollowUser,
        followedUserIds,
        createBooking,
        updateBookingStatus,
        activeChatThread,
        openChatWithBooking,
        closeChat,
        sendChatMessage,
        markAllNotificationsRead,
        unreadNotifCount,
        submitThirdPartyAd,
        updateAdStatus,
        promoteListing,
        activeTab,
        setActiveTab,
        selectedListing,
        setSelectedListing,
        selectedService,
        setSelectedService,
        isWantedBoardOpen,
        setIsWantedBoardOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        isAdvertiserPortalOpen,
        setIsAdvertiserPortalOpen,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        isLanguageCurrencyOpen,
        setIsLanguageCurrencyOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        activeBookingForStatus,
        setActiveBookingForStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
