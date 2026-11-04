import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import {
  X,
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Megaphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    currency,
    bookings,
    thirdPartyAds,
    updateAdStatus,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'ads_queue' | 'reports' | 'settings'>('metrics');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingAdId, setRejectingAdId] = useState<string | null>(null);

  // Editable settings
  const [renterFeePercent, setRenterFeePercent] = useState<number>(20);
  const [ownerFeePercent, setOwnerFeePercent] = useState<number>(15);

  if (!isAdminDashboardOpen) return null;

  // Revenue metrics
  const totalTransactionVolume = 148500000;
  const renterFeeRevenue = Math.round(totalTransactionVolume * (renterFeePercent / 100));
  const ownerFeeRevenue = Math.round(totalTransactionVolume * (ownerFeePercent / 100));
  const totalServiceFeeRevenue = renterFeeRevenue + ownerFeeRevenue;
  const adsRevenue = 28400000;
  const totalPlatformGrossRevenue = totalServiceFeeRevenue + adsRevenue;

  const pendingAds = thirdPartyAds.filter((ad) => ad.status === 'pending_approval');

  const handleApproveAd = (adId: string) => {
    updateAdStatus(adId, 'active');
  };

  const handleRejectAd = (adId: string) => {
    if (!rejectReason.trim()) {
      alert('Alasan penolakan iklan wajib diisi.');
      return;
    }
    updateAdStatus(adId, 'rejected', rejectReason);
    setRejectingAdId(null);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
        {/* Header with Subtitle "Omset & Verifikasi" */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#3A2A2E] pb-3 mb-4 shrink-0">
          <div>
            <span className="text-[10px] text-[#B8893C] font-bold uppercase tracking-wider block">
              Omset & Verifikasi
            </span>
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF] flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4 text-[#B8893C]" />
              <span>Dashboard Manajemen Platform LetsBorrow</span>
            </h3>
          </div>
          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 p-1 bg-[#EFECE8] dark:bg-[#201518] rounded-2xl mb-4 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'metrics'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Omset & Finansial
          </button>
          <button
            onClick={() => setActiveAdminTab('ads_queue')}
            className={`flex-1 py-1.5 rounded-xl transition-all relative ${
              activeAdminTab === 'ads_queue'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Antrean Iklan
            {pendingAds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#9C2A3F] text-white text-[9px]">
                {pendingAds.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'reports'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Laporan Keamanan
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'settings'
                ? 'bg-[#5A1624] text-[#F7F3EC]'
                : 'text-[#6B6B6B]'
            }`}
          >
            Pengaturan Fee
          </button>
        </div>

        {/* Tab 1: Omset & Finansial */}
        {activeAdminTab === 'metrics' && (
          <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
            {/* Top Cards: Total Volume, Service Fees, Ad Revenues */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40">
                <span className="text-[10px] text-[#6B6B6B] block">Volume Transaksi Kotor</span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  {formatCurrency(totalTransactionVolume, currency)}
                </span>
                <span className="text-[9px] text-emerald-600 block mt-1">+18.4% bulan ini</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40">
                <span className="text-[10px] text-[#6B6B6B] block">Pendapatan Biaya Layanan</span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  {formatCurrency(totalServiceFeeRevenue, currency)}
                </span>
                <span className="text-[9px] text-[#6B6B6B] block mt-1">20% penyewa + 15% pemilik</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40">
                <span className="text-[10px] text-[#6B6B6B] block">Pendapatan Iklan</span>
                <span className="font-serif-luxury font-extrabold text-base text-[#5A1624] dark:text-[#D6AE67]">
                  {formatCurrency(adsRevenue, currency)}
                </span>
                <span className="text-[9px] text-[#B8893C] font-semibold block mt-1">Promosi produk & pihak ke-3</span>
              </div>
            </div>

            {/* Monthly Chart Bar Graphic Representation */}
            <div className="p-4 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] dark:border-[#3A2A2E] space-y-2">
              <span className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF] block">
                Pertumbuhan Pendapatan Bulanan (6 Bulan Terakhir)
              </span>

              <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { month: 'Jun', height: '40%', val: '45 Jt' },
                  { month: 'Jul', height: '55%', val: '62 Jt' },
                  { month: 'Agu', height: '65%', val: '78 Jt' },
                  { month: 'Sep', height: '80%', val: '95 Jt' },
                  { month: 'Okt', height: '90%', val: '118 Jt' },
                  { month: 'Nov', height: '100%', val: '148 Jt' },
                ].map((bar) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-bold text-[#5A1624] dark:text-[#D6AE67]">
                      {bar.val}
                    </span>
                    <div
                      style={{ height: bar.height }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#7A1F32] to-[#D4AF6A] shadow-xs"
                    />
                    <span className="text-[10px] text-[#6B6B6B]">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Rentals Table */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E]">
              <span className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF] block mb-2">
                Daftar Sewa Berjalan di Seluruh Indonesia
              </span>
              <div className="space-y-1.5">
                {bookings.map((b) => (
                  <div key={b.id} className="p-2 rounded-xl bg-[#F7F3EC] dark:bg-[#201518] flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-[#111111] dark:text-[#F5ECDF] truncate max-w-[200px]">
                        {b.listingTitle}
                      </p>
                      <p className="text-[9px] text-[#6B6B6B]">Penyewa: {b.renterName} · Status: {b.status}</p>
                    </div>
                    <span className="font-bold text-[#5A1624] dark:text-[#D6AE67]">
                      {formatCurrency(b.totalPaidIDR, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Antrean Iklan (Setujui, Tolak dengan alasan wajib, Hentikan) */}
        {activeAdminTab === 'ads_queue' && (
          <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
            <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67]">
              Iklan Pihak Ketiga Menunggu Persetujuan ({pendingAds.length})
            </h4>

            {pendingAds.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#6B6B6B]">
                Tidak ada antrean iklan baru saat ini.
              </p>
            ) : (
              pendingAds.map((ad) => (
                <div key={ad.id} className="p-3.5 rounded-2xl bg-[#EFECE8] dark:bg-[#201518] border border-[#E5E5E5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111111] dark:text-[#F5ECDF]">{ad.advertiserName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 text-[10px] font-bold">
                      Menunggu Persetujuan
                    </span>
                  </div>

                  <p className="font-semibold text-[#5A1624] dark:text-[#D6AE67]">{ad.title}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{ad.description}</p>
                  <p className="text-[10px] text-blue-600 truncate">URL Tujuan: {ad.targetUrl}</p>

                  <div className="flex gap-2 pt-2 border-t border-[#E5E5E5]">
                    <button
                      onClick={() => handleApproveAd(ad.id)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui & Terbitkan</span>
                    </button>

                    <button
                      onClick={() => setRejectingAdId(ad.id)}
                      className="flex-1 py-1.5 rounded-xl bg-[#9C2A3F] text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak Iklan</span>
                    </button>
                  </div>

                  {rejectingAdId === ad.id && (
                    <div className="p-2.5 mt-2 bg-white rounded-xl border border-[#9C2A3F] space-y-2">
                      <label className="text-[11px] font-bold text-[#9C2A3F] block">
                        Alasan Penolakan (Wajib Diisi):
                      </label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Misal: Gambar melanggar pedoman kualitas..."
                        className="w-full p-2 text-xs border rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRejectingAdId(null)}
                          className="flex-1 py-1 text-xs border rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleRejectAd(ad.id)}
                          className="flex-1 py-1 text-xs bg-[#9C2A3F] text-white font-bold rounded-lg"
                        >
                          Konfirmasi Tolak
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Laporan Keamanan & Chat */}
        {activeAdminTab === 'reports' && (
          <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/30 space-y-2">
              <span className="font-bold text-[#5A1624] dark:text-[#D6AE67] block">
                Pencegahan Kebocoran Kontak Otomatis
              </span>
              <p className="text-[11px] text-[#6B6B6B]">
                Sistem LetsBorrow Safe Guard telah memfilter 42 percobaan berbagi nomor HP/WhatsApp dan link berbahaya secara instan dalam 24 jam terakhir.
              </p>
              <div className="p-2 rounded-xl bg-white dark:bg-[#150E10] text-[10px] font-mono text-[#9C2A3F]">
                [BLOCKED]: 0812-xxxx-xxxx diblokir pada listing camera
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pengaturan Fee Platform */}
        {activeAdminTab === 'settings' && (
          <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
            <div className="p-4 rounded-2xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/40 space-y-3">
              <h4 className="font-bold text-xs text-[#5A1624] dark:text-[#D6AE67]">
                Konfigurasi Persentase Biaya Layanan
              </h4>
              <p className="text-[11px] text-[#6B6B6B]">
                Total standar biaya layanan adalah 35% (20% ditambahkan ke total penyewa, 15% dipotong dari penerimaan pemilik).
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Biaya Layanan Penyewa:</span>
                    <span className="text-[#5A1624]">{renterFeePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={renterFeePercent}
                    onChange={(e) => setRenterFeePercent(Number(e.target.value))}
                    className="w-full accent-[#5A1624]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Potongan Layanan Pemilik:</span>
                    <span className="text-[#5A1624]">{ownerFeePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={ownerFeePercent}
                    onChange={(e) => setOwnerFeePercent(Number(e.target.value))}
                    className="w-full accent-[#5A1624]"
                  />
                </div>
              </div>

              <button
                onClick={() => alert('Konfigurasi persentase biaya layanan berhasil diperbarui!')}
                className="w-full py-2.5 rounded-xl bg-[#5A1624] text-[#F7F3EC] font-bold text-xs shadow-xs"
              >
                Simpan Perubahan Biaya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
