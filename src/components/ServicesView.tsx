import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceListing, ServiceCategory } from '../types';
import { formatCurrency } from '../utils/currency';
import {
  Sparkles,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  ShieldAlert,
  Share2,
  Flag,
  AlertTriangle,
  X,
  Send,
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const {
    services,
    currency,
    t,
    setSelectedService,
    isLoggedIn,
    openLoginModal,
    createBooking,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [companionModalService, setCompanionModalService] = useState<ServiceListing | null>(null);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [emergencyLocationSent, setEmergencyLocationSent] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<ServiceListing | null>(null);

  const categories: ServiceCategory[] = [
    'Pendamping Acara',
    'Supir',
    'Travel Guide',
    'Tukang Pijat',
    'Tukang Kebun',
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    return true;
  });

  const handleBookService = (service: ServiceListing) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (service.isEventCompanion) {
      setCompanionModalService(service);
      setRulesAccepted(false);
    } else {
      executeServiceBooking(service);
    }
  };

  const executeServiceBooking = (service: ServiceListing) => {
    const basePrice = service.ratePerDayIDR;
    const renterFee = Math.round(basePrice * 0.2);
    const ownerFee = Math.round(basePrice * 0.15);
    const deposit = 0; // Services typically don't have item deposit

    createBooking({
      listingId: service.id,
      listingTitle: service.title,
      listingImage: service.image,
      category: service.category,
      type: 'service',
      renterId: 'user_me',
      renterName: 'Arya Pratama',
      ownerId: service.providerId,
      ownerName: service.providerName,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      duration: 1,
      unit: 'hari',
      deliveryType: 'self_pickup',
      basePriceIDR: basePrice,
      renterServiceFeeIDR: renterFee,
      ownerServiceFeeIDR: ownerFee,
      depositIDR: deposit,
      totalPaidIDR: basePrice + renterFee,
      netOwnerEarningsIDR: basePrice - ownerFee,
      paymentMethod: 'QRIS BCA',
    });

    setCompanionModalService(null);
    setBookingSuccessModal(service);
  };

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs ${
            selectedCategory === 'All'
              ? 'bg-[#5A1624] text-[#F7F3EC]'
              : 'bg-[#EFECE8] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF]'
          }`}
        >
          Semua Layanan
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs ${
              selectedCategory === cat
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'bg-[#EFECE8] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] overflow-hidden p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
          >
            <div>
              {/* Provider Info Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={service.providerAvatar}
                      alt={service.providerName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#B8893C]"
                    />
                    {service.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#B8893C] fill-[#5A1624] absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111111] dark:text-[#F5ECDF] flex items-center gap-1.5">
                      {service.providerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B6B6B] dark:text-[#B09F94]">
                      <span className="flex items-center gap-0.5 text-[#B8893C] font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {service.providerRating}
                      </span>
                      <span>·</span>
                      <span>Pengalaman {service.experienceYears} thn</span>
                    </div>
                  </div>
                </div>

                {service.isEventCompanion && (
                  <span className="px-2 py-0.5 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] text-[10px] font-bold border border-[#B8893C]/40">
                    Acara Formal
                  </span>
                )}
              </div>

              {/* Service Title & Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 mb-3">
                <img
                  src={service.image}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D4AF6A]" />
                  <span>{service.serviceArea}</span>
                </div>
              </div>

              <h4 className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF] mb-1 leading-snug">
                {service.title}
              </h4>
              <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] line-clamp-2 leading-relaxed mb-3">
                {service.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {service.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#150E10] text-[#6B6B6B] dark:text-[#B09F94] text-[10px] font-medium border border-[#E5E5E5] dark:border-[#3A2A2E]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Rates & Booking Action */}
            <div className="pt-3 border-t border-[#E5E5E5]/70 dark:border-[#3A2A2E]/70 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">Tarif Layanan</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                    {formatCurrency(service.ratePerHourIDR, currency)}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">{t('perHour')}</span>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] ml-1">
                    ({formatCurrency(service.ratePerDayIDR, currency)}/hari)
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleBookService(service)}
                className="py-2 px-5 rounded-2xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all"
              >
                Pesan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Special Event Companion Platonic Rules Modal */}
      {companionModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#9C2A3F]" />
                <h3 className="font-serif-luxury font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
                  {t('eventCompanionRuleTitle')}
                </h3>
              </div>
              <button
                onClick={() => setCompanionModalService(null)}
                className="p-1 text-[#6B6B6B] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-4 text-xs">
              <div className="p-3 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E] space-y-2 text-[#111111] dark:text-[#F5ECDF]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5A1624]/10 text-[#5A1624] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-[11px] leading-relaxed">{t('eventCompanionRule1')}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5A1624]/10 text-[#5A1624] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-[11px] leading-relaxed">{t('eventCompanionRule2')}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5A1624]/10 text-[#5A1624] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-[11px] leading-relaxed">{t('eventCompanionRule3')}</p>
                </div>
              </div>

              {/* Safety Features Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEmergencyLocationSent(true);
                    setTimeout(() => setEmergencyLocationSent(false), 3000);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-[#150E10] border border-[#B8893C] text-[11px] font-semibold text-[#5A1624] dark:text-[#D6AE67] flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{emergencyLocationSent ? 'Lokasi Terkirim!' : t('shareEmergencyLocation')}</span>
                </button>
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-[#150E10] border border-[#9C2A3F] text-[11px] font-semibold text-[#9C2A3F] flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Laporkan</span>
                </button>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2.5 p-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="mt-0.5 rounded accent-[#5A1624] w-4 h-4 shrink-0"
                />
                <span className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] leading-relaxed">
                  Saya telah membaca dan menyetujui seluruh aturan pendamping acara formal di atas.
                </span>
              </label>
            </div>

            <button
              disabled={!rulesAccepted}
              onClick={() => executeServiceBooking(companionModalService)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] disabled:opacity-50 text-[#F7F3EC] text-xs font-semibold shadow-xs"
            >
              Lanjutkan Pemesanan
            </button>
          </div>
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 p-5 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#5A1624] text-[#D4AF6A] flex items-center justify-center mx-auto mb-3 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              Layanan Berhasil Dipesan!
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] mt-1 mb-4 leading-relaxed">
              Pembayaran telah diamankan. Chat dengan {bookingSuccessModal.providerName} kini telah aktif untuk konfirmasi jadwal serah terima.
            </p>
            <button
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-semibold shadow-xs"
            >
              Buka Detail Pemesanan
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#201518] p-5 shadow-2xl">
            <h4 className="font-bold text-sm text-[#9C2A3F] mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Laporkan Penyedia Jasa
            </h4>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] mb-3">
              Tim moderasi LetsBorrow akan meninjau laporan Anda dalam waktu maksimal 15 menit.
            </p>
            <textarea
              placeholder="Jelaskan alasan pelaporan secara rinci..."
              className="w-full h-24 p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-[#F7F3EC] dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] mb-3 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2 text-xs rounded-xl border border-[#E5E5E5]"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setReportModalOpen(false);
                  alert('Laporan berhasil dikirim ke tim keamanan LetsBorrow.');
                }}
                className="flex-1 py-2 text-xs rounded-xl bg-[#9C2A3F] text-white font-bold"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
