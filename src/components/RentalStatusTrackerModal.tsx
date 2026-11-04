import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RentalBooking } from '../types';
import { formatCurrency } from '../utils/currency';
import {
  X,
  CheckCircle2,
  Clock,
  Camera,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const RentalStatusTrackerModal: React.FC = () => {
  const {
    activeBookingForStatus,
    setActiveBookingForStatus,
    updateBookingStatus,
    openChatWithBooking,
    currency,
  } = useApp();

  const [handoverInputUrl, setHandoverInputUrl] = useState('');
  const [returnInputUrl, setReturnInputUrl] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  if (!activeBookingForStatus) return null;

  const booking = activeBookingForStatus;

  const steps: { key: RentalBooking['status']; label: string; desc: string }[] = [
    { key: 'requested', label: 'Diajukan', desc: 'Permintaan sewa dikirim ke pemilik' },
    { key: 'approved', label: 'Disetujui', desc: 'Pemilik menyetujui jadwal sewa' },
    { key: 'paid', label: 'Dibayar', desc: 'Dana diamankan di Escrow LetsBorrow' },
    { key: 'in_use', label: 'Sedang Dipinjam', desc: 'Barang diserahterimakan dengan bukti foto' },
    { key: 'returned', label: 'Dikembalikan', desc: 'Barang dicek bersama saat pengembalian' },
    { key: 'completed', label: 'Selesai', desc: 'Dana dicairkan & deposit dikembalikan penuh' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === booking.status);

  const handleAdvanceStatus = () => {
    if (booking.status === 'paid') {
      updateBookingStatus(
        booking.id,
        'in_use',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
      );
    } else if (booking.status === 'in_use') {
      updateBookingStatus(
        booking.id,
        'returned',
        'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=600&q=80'
      );
    } else if (booking.status === 'returned') {
      updateBookingStatus(booking.id, 'completed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4 shrink-0">
          <div>
            <span className="text-[10px] text-[#B8893C] font-bold uppercase tracking-wider">
              Pelacakan Transaksi Sewa
            </span>
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF] truncate max-w-[240px]">
              {booking.listingTitle}
            </h3>
          </div>
          <button
            onClick={() => setActiveBookingForStatus(null)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Item Banner */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#EFECE8] dark:bg-[#201518]">
            <img
              src={booking.listingImage}
              alt=""
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#5A1624] text-[#D4AF6A] text-[9px] font-bold uppercase">
                Status: {booking.status.toUpperCase()}
              </span>
              <p className="font-semibold text-[#111111] dark:text-[#F5ECDF] truncate mt-1">
                {booking.listingTitle}
              </p>
              <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94]">
                Total: {formatCurrency(booking.totalPaidIDR, currency)} (Dep: {formatCurrency(booking.depositIDR, currency)})
              </p>
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="p-4 bg-[#F7F3EC] dark:bg-[#201518] rounded-2xl border border-[#B8893C]/30 space-y-4">
            <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67]">
              Tahapan Serah Terima & Escrow
            </h4>

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isPassed
                            ? 'bg-[#5A1624] text-[#D4AF6A] ring-2 ring-[#D4AF6A]'
                            : 'bg-white dark:bg-[#150E10] border border-[#E5E5E5] text-[#6B6B6B]'
                        }`}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-6 my-0.5 ${
                            idx < currentStepIndex ? 'bg-[#5A1624]' : 'bg-[#E5E5E5] dark:bg-[#3A2A2E]'
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#5A1624] dark:text-[#D6AE67]'
                            : isPassed
                            ? 'text-[#111111] dark:text-[#F5ECDF]'
                            : 'text-[#6B6B6B] dark:text-[#B09F94]'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Handover and Return Condition Photos */}
          <div className="p-3.5 bg-white dark:bg-[#150E10] rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E] space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#B8893C]" />
                Foto Verifikasi Kondisi Barang
              </h5>
              <button
                onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                className="text-[11px] text-[#B8893C] font-semibold hover:underline"
              >
                + Tambah Foto
              </button>
            </div>

            {/* Handover photos strip */}
            <div>
              <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] block mb-1">
                Saat Serah Terima (Handover):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {booking.handoverPhotos && booking.handoverPhotos.length > 0 ? (
                  booking.handoverPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#D4AF6A]/40 shrink-0"
                    />
                  ))
                ) : (
                  <span className="text-[10px] italic text-[#6B6B6B]">
                    Belum ada foto serah terima diunggah.
                  </span>
                )}
              </div>
            </div>

            {/* Return photos strip */}
            {booking.returnInspectionPhotos && booking.returnInspectionPhotos.length > 0 && (
              <div>
                <span className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] block mb-1">
                  Saat Pengembalian (Return Inspection):
                </span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {booking.returnInspectionPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#D4AF6A]/40 shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Chat + Advance simulation button */}
        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#3A2A2E] flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveBookingForStatus(null);
              openChatWithBooking(booking.id);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl border border-[#B8893C] text-[#5A1624] dark:text-[#D6AE67] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F7F3EC] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buka Chat</span>
          </button>

          {booking.status !== 'completed' && (
            <button
              onClick={handleAdvanceStatus}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Lanjut Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
