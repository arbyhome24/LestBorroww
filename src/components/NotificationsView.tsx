import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallBanner } from './PWAInstallBanner';
import {
  Bell,
  CheckCheck,
  Moon,
  Settings2,
  Users,
  Package,
  Receipt,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markAllNotificationsRead,
    unreadNotifCount,
    t,
    setActiveTab,
    openChatWithBooking,
    bookings,
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [notifRentalRequests, setNotifRentalRequests] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifFollowers, setNotifFollowers] = useState(true);
  const [notifNewItems, setNotifNewItems] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'follow':
        return <Users className="w-4 h-4 text-[#B8893C]" />;
      case 'new_item':
        return <Package className="w-4 h-4 text-[#5A1624] dark:text-[#C2566B]" />;
      case 'rental_status':
        return <Receipt className="w-4 h-4 text-[#B8893C]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-[#5A1624] dark:text-[#C2566B]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#B8893C]" />;
    }
  };

  const handleNotifClick = (notif: any) => {
    if (notif.type === 'rental_status' && bookings.length > 0) {
      openChatWithBooking(bookings[0].id);
    } else if (notif.linkTab) {
      setActiveTab(notif.linkTab);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-24 transition-colors">
      {/* PWA Install Banner at Top */}
      <div className="mb-4">
        <PWAInstallBanner />
      </div>

      <div className="bg-white dark:bg-[#150E10] rounded-3xl border border-[#E5E5E5] dark:border-[#3A2A2E] p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#3A2A2E] mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-luxury font-bold text-lg text-[#5A1624] dark:text-[#F5ECDF]">
              {t('tabNotifications')}
            </h2>
            {unreadNotifCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#9C2A3F] text-white text-[10px] font-bold">
                {unreadNotifCount} baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] text-[#6B6B6B] dark:text-[#B09F94] hover:text-[#111111] dark:hover:text-[#F5ECDF]"
              title="Pengaturan Notifikasi"
            >
              <Settings2 className="w-4 h-4 text-[#B8893C]" />
            </button>

            {unreadNotifCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 text-xs text-[#5A1624] dark:text-[#D6AE67] font-semibold hover:underline"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t('markAllRead')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification Settings Sheet */}
        {showSettings && (
          <div className="p-4 mb-4 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/40 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] dark:border-[#3A2A2E]">
              <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">
                Preferensi Notifikasi
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[11px] text-[#6B6B6B] hover:underline"
              >
                Tutup
              </button>
            </div>

            {/* Quiet Hours Switch */}
            <div className="p-2.5 bg-white dark:bg-[#150E10] rounded-xl flex items-center justify-between border border-[#E5E5E5] dark:border-[#3A2A2E]">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#B8893C]" />
                <div>
                  <p className="font-bold text-[#111111] dark:text-[#F5ECDF]">{t('quietHours')}</p>
                  <p className="text-[10px] text-[#6B6B6B]">Hanya tampilkan notifikasi penting saat malam</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={quietHoursEnabled}
                onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#5A1624]"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1 text-[11px] text-[#111111] dark:text-[#F5ECDF]">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Permintaan sewa baru</span>
                <input
                  type="checkbox"
                  checked={notifRentalRequests}
                  onChange={(e) => setNotifRentalRequests(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Pembayaran berhasil</span>
                <input
                  type="checkbox"
                  checked={notifPayments}
                  onChange={(e) => setNotifPayments(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Pesan chat baru</span>
                <input
                  type="checkbox"
                  checked={notifChat}
                  onChange={(e) => setNotifChat(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Pengikut baru</span>
                <input
                  type="checkbox"
                  checked={notifFollowers}
                  onChange={(e) => setNotifFollowers(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Barang baru dari akun yang diikuti</span>
                <input
                  type="checkbox"
                  checked={notifNewItems}
                  onChange={(e) => setNotifNewItems(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Promo dan diskon sewa</span>
                <input
                  type="checkbox"
                  checked={notifPromos}
                  onChange={(e) => setNotifPromos(e.target.checked)}
                  className="accent-[#5A1624]"
                />
              </label>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 hover:border-[#B8893C]/50 ${
                !notif.isRead
                  ? 'bg-[#F7F3EC] dark:bg-[#201518] border-[#B8893C]/35'
                  : 'bg-white dark:bg-[#150E10] border-[#E5E5E5] dark:border-[#3A2A2E]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#EFECE8] dark:bg-[#281B20] flex items-center justify-center shrink-0 mt-0.5">
                {getIconForType(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-[#111111] dark:text-[#F5ECDF] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5 leading-relaxed">
                  {notif.body}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-[#6B6B6B] shrink-0 self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
