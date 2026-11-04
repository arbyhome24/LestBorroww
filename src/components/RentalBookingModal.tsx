import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Truck,
  Building,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const RentalBookingModal: React.FC = () => {
  const {
    selectedListing,
    isBookingModalOpen,
    setIsBookingModalOpen,
    currency,
    t,
    createBooking,
    openChatWithBooking,
  } = useApp();

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  const [durationDays, setDurationDays] = useState<number>(2);
  const [deliveryType, setDeliveryType] = useState<'self_pickup' | 'delivery'>('self_pickup');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  if (!isBookingModalOpen || !selectedListing) return null;

  const item = selectedListing;
  const basePrice = item.originalPriceIDR * durationDays;
  const renterFee = Math.round(basePrice * 0.2); // 20%
  const ownerFee = Math.round(basePrice * 0.15); // 15%
  const deposit = item.depositIDR;
  const grandTotal = basePrice + renterFee + deposit;

  // Calculate return date
  const start = new Date(startDate);
  const returnDate = new Date(start);
  returnDate.setDate(returnDate.getDate() + durationDays);
  const returnDateStr = returnDate.toISOString().split('T')[0];

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking = createBooking({
        listingId: item.id,
        listingTitle: item.title,
        listingImage: item.images[0],
        category: item.category,
        type: 'item',
        renterId: 'user_me',
        renterName: 'Arya Pratama',
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        startDate,
        endDate: returnDateStr,
        duration: durationDays,
        unit: item.category === 'Rumah & Villa' ? 'malam' : 'hari',
        deliveryType,
        notes: deliveryNotes,
        basePriceIDR: basePrice,
        renterServiceFeeIDR: renterFee,
        ownerServiceFeeIDR: ownerFee,
        depositIDR: deposit,
        totalPaidIDR: grandTotal,
        netOwnerEarningsIDR: basePrice - ownerFee,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setIsProcessing(false);
      setIsSuccess(true);
      setConfirmedBookingId(newBooking.id);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF6A', '#5A1624', '#F7F3EC'],
        });
      } catch {}
    }, 1200);
  };

  const handleFinishAndChat = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
    if (confirmedBookingId) {
      openChatWithBooking(confirmedBookingId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#B8893C]" />
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              Form Pengajuan Sewa
            </h3>
          </div>
          <button
            onClick={() => {
              setIsBookingModalOpen(false);
              setIsSuccess(false);
            }}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7A1F32] to-[#4A0F1C] border-2 border-[#D4AF6A] flex items-center justify-center mx-auto text-[#D4AF6A] shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif-luxury text-xl font-bold text-[#5A1624] dark:text-[#F5ECDF]">
                Pembayaran Berhasil!
              </h4>
              <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] mt-1 max-w-xs mx-auto leading-relaxed">
                Dana sebesar {formatCurrency(grandTotal, currency)} telah diamankan di Rekening Escrow LetsBorrow. Chat dengan pemilik barang kini telah aktif.
              </p>
            </div>

            <div className="p-3.5 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">Barang Disewa:</span>
                <span className="font-bold text-[#111111] dark:text-[#F5ECDF] truncate max-w-[180px]">
                  {item.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">Jadwal Sewa:</span>
                <span className="font-semibold text-[#111111] dark:text-[#F5ECDF]">
                  {startDate} s/d {returnDateStr} ({durationDays} hari)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">Metode:</span>
                <span className="font-semibold text-[#111111] dark:text-[#F5ECDF]">
                  {paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleFinishAndChat}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95"
              >
                Buka Chat & Koordinasi Serah Terima
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="overflow-y-auto space-y-4 pr-1 flex-1">
            {/* Item Mini Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#EFECE8] dark:bg-[#201518]">
              <img
                src={item.images[0]}
                alt=""
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#111111] dark:text-[#F5ECDF] truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5">
                  Pemilik: {item.ownerName} · {item.city}
                </p>
                <p className="font-serif-luxury font-extrabold text-xs text-[#5A1624] dark:text-[#D6AE67] mt-0.5">
                  {formatCurrency(item.originalPriceIDR, currency)} /
                  {item.category === 'Rumah & Villa' ? t('perNight') : t('perDay')}
                </p>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Tanggal Ambil
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                  Durasi Sewa
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
                >
                  <option value={1}>1 {item.category === 'Rumah & Villa' ? 'Malam' : 'Hari'}</option>
                  <option value={2}>2 {item.category === 'Rumah & Villa' ? 'Malam' : 'Hari'}</option>
                  <option value={3}>3 {item.category === 'Rumah & Villa' ? 'Malam' : 'Hari'}</option>
                  <option value={7}>7 Hari (Diskon 20% Mingguan)</option>
                  <option value={14}>14 Hari</option>
                  <option value={30}>30 Hari (Bulanan)</option>
                </select>
              </div>
            </div>

            {/* Delivery Choice: Ambil Sendiri vs Diantar */}
            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1.5">
                Metode Pengambilan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('self_pickup')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'self_pickup'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67]'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#6B6B6B]'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#B8893C]" />
                  <span>Ambil Sendiri</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67]'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#6B6B6B]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#B8893C]" />
                  <span>Diantar ke Lokasi</span>
                </button>
              </div>
            </div>

            {/* Notes to Owner */}
            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Catatan untuk Pemilik
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Misal: Akan diambil jam 10 pagi dengan mobil box..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
              />
            </div>

            {/* Price Breakdown Card:
                Harga sewa + Biaya layanan 20% + Deposit = Total Pembayaran */}
            <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 space-y-2 text-xs">
              <h4 className="font-serif-luxury font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF] border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-1.5">
                {t('bookingSummary')}
              </h4>

              <div className="flex justify-between text-[#111111] dark:text-[#F5ECDF]">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">
                  Harga Sewa ({durationDays} {item.category === 'Rumah & Villa' ? 'Malam' : 'Hari'}):
                </span>
                <span className="font-semibold">{formatCurrency(basePrice, currency)}</span>
              </div>

              <div className="flex justify-between text-[#111111] dark:text-[#F5ECDF]">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">
                  {t('serviceFeeRenter')}:
                </span>
                <span className="font-semibold">{formatCurrency(renterFee, currency)}</span>
              </div>

              <div className="flex justify-between text-[#111111] dark:text-[#F5ECDF]">
                <span className="text-[#6B6B6B] dark:text-[#B09F94]">
                  Deposit Jaminan (Dikembalikan 100%):
                </span>
                <span className="font-semibold">{formatCurrency(deposit, currency)}</span>
              </div>

              <div className="pt-2 border-t border-[#B8893C]/30 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#5A1624] dark:text-[#F5ECDF]">
                  {t('totalPayment')}:
                </span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  {formatCurrency(grandTotal, currency)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1.5">
                Metode Pembayaran Aman (Escrow)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#B8893C]" />
                  <span>QRIS & E-Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca_va')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    paymentMethod === 'bca_va'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B8893C]" />
                  <span>BCA / Mandiri VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B8893C]" />
                  <span>Kartu Visa / Master</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#B8893C] bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#D6AE67] font-bold'
                      : 'border-[#E5E5E5] dark:border-[#3A2A2E] bg-white dark:bg-[#150E10]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#B8893C]" />
                  <span>Apple / Google Pay</span>
                </button>
              </div>
            </div>

            {/* Escrow Trust Assurance */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#5A1624]/5 dark:bg-[#C2566B]/10 text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
              <ShieldCheck className="w-4 h-4 text-[#5A1624] dark:text-[#C2566B] shrink-0" />
              <span>
                Dana ditahan di sistem Escrow LetsBorrow. Pemilik baru menerima pencairan setelah barang kembali utuh.
              </span>
            </div>

            {/* Submit Button */}
            <button
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7A1F32] via-[#5A1624] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#D4AF6A] border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Pembayaran Aman...</span>
                </>
              ) : (
                <>
                  <span>{t('payNow')}</span>
                  <span>· {formatCurrency(grandTotal, currency)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
