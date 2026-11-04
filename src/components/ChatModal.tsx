import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Camera,
  MapPin,
  Languages,
  Flag,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const {
    activeChatThread,
    closeChat,
    sendChatMessage,
    currentUser,
    t,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [photoAttachOpen, setPhotoAttachOpen] = useState(false);
  const [locationSent, setLocationSent] = useState(false);

  if (!activeChatThread) return null;

  const thread = activeChatThread;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(thread.id, inputText);
    setInputText('');
  };

  const handleSendPhoto = (url: string) => {
    sendChatMessage(
      thread.id,
      'Foto kondisi serah terima barang:',
      url
    );
    setPhotoAttachOpen(false);
  };

  const handleShareLocation = () => {
    sendChatMessage(thread.id, 'Titik temu serah terima:', undefined, {
      name: 'Lobby Utama Apartemen / Titik Temu Aman',
      lat: -6.2297,
      lng: 106.8295,
    });
    setLocationSent(true);
    setTimeout(() => setLocationSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#150E10] sm:rounded-3xl shadow-2xl h-full sm:h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Chat Header */}
        <div className="p-3.5 bg-white/95 dark:bg-[#150E10]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#3A2A2E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={thread.otherUserAvatar}
              alt={thread.otherUserName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#B8893C]"
            />
            <div>
              <h4 className="font-bold text-xs text-[#111111] dark:text-[#F5ECDF] flex items-center gap-1.5">
                {thread.otherUserName}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </h4>
              <p className="text-[10px] text-[#6B6B6B] dark:text-[#B09F94] truncate max-w-[190px]">
                {thread.listingTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto Translate Toggle */}
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`p-1.5 rounded-full transition-colors ${
                autoTranslate
                  ? 'bg-[#5A1624] text-[#D4AF6A]'
                  : 'hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#6B6B6B]'
              }`}
              title="Terjemahan Otomatis"
            >
              <Languages className="w-4 h-4" />
            </button>

            {/* Laporkan Chat */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#9C2A3F]"
              title="Laporkan Percakapan"
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={closeChat}
              className="p-1.5 rounded-full hover:bg-[#EFECE8] dark:hover:bg-[#201518] text-[#111111] dark:text-[#F5ECDF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Warning Banner */}
        <div className="px-4 py-2 bg-[#F7F3EC] dark:bg-[#201518] border-b border-[#B8893C]/30 flex items-center gap-2 text-[11px] text-[#5A1624] dark:text-[#D6AE67] font-medium shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#B8893C] shrink-0" />
          <span className="truncate">{t('chatSafetyBanner')}</span>
        </div>

        {/* Chat Locked State Before Payment */}
        {thread.isLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#EFECE8] dark:bg-[#150E10]">
            <div className="w-14 h-14 rounded-full bg-[#5A1624]/10 dark:bg-[#C2566B]/20 text-[#5A1624] dark:text-[#C2566B] flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury font-bold text-base text-[#5A1624] dark:text-[#F5ECDF]">
              {t('chatUnlockedAfterPayment')}
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#B09F94] max-w-xs mt-1.5 leading-relaxed">
              Untuk melindungi privasi dan keamanan bersama, ruang obrolan langsung baru akan dibuka setelah pembayaran sewa diselesaikan via Escrow.
            </p>
          </div>
        ) : (
          /* Unlocked Messages Scroll Area */
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFFFF] dark:bg-[#150E10]">
            {thread.messages.map((msg) => {
              const isMe = msg.senderId === (currentUser?.id || 'user_me');
              const isSys = msg.senderId === 'system';

              if (isSys) {
                return (
                  <div
                    key={msg.id}
                    className={`mx-auto max-w-xs p-2.5 rounded-2xl text-[11px] text-center leading-relaxed ${
                      msg.isWarning
                        ? 'bg-[#9C2A3F]/15 border border-[#9C2A3F] text-[#9C2A3F] font-bold'
                        : 'bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/30 text-[#5A1624] dark:text-[#D6AE67]'
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] rounded-br-xs'
                        : 'bg-[#EFECE8] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF] rounded-bl-xs border border-[#E5E5E5] dark:border-[#3A2A2E]'
                    }`}
                  >
                    {msg.photoUrl && (
                      <img
                        src={msg.photoUrl}
                        alt="Kondisi barang"
                        referrerPolicy="no-referrer"
                        className="rounded-xl max-h-48 w-full object-cover mb-2 border border-white/20"
                      />
                    )}

                    {msg.locationShare && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-black/10 dark:bg-black/30 mb-1.5 border border-white/20">
                        <MapPin className="w-4 h-4 text-[#D4AF6A] shrink-0" />
                        <div>
                          <p className="font-bold text-[11px]">{msg.locationShare.name}</p>
                          <p className="text-[9px] opacity-80">Koordinat: {msg.locationShare.lat}, {msg.locationShare.lng}</p>
                        </div>
                      </div>
                    )}

                    <p>{msg.text}</p>

                    {autoTranslate && (
                      <p className="mt-1 pt-1 border-t border-white/20 text-[10px] italic opacity-90">
                        [Auto-translated]: {msg.text}
                      </p>
                    )}
                  </div>

                  <span className="text-[9px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Input Bar (Only when unlocked) */}
        {!thread.isLocked && (
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-[#150E10] border-t border-[#E5E5E5] dark:border-[#3A2A2E] flex items-center gap-2 shrink-0"
          >
            {/* Camera / Photo Attachment */}
            <button
              type="button"
              onClick={() => setPhotoAttachOpen(true)}
              className="p-2 rounded-full text-[#6B6B6B] hover:text-[#5A1624] dark:hover:text-[#D6AE67] hover:bg-[#EFECE8] dark:hover:bg-[#201518] transition-colors"
              title="Kirim Foto Serah Terima"
            >
              <Camera className="w-5 h-5 text-[#B8893C]" />
            </button>

            {/* Share Location */}
            <button
              type="button"
              onClick={handleShareLocation}
              className="p-2 rounded-full text-[#6B6B6B] hover:text-[#5A1624] dark:hover:text-[#D6AE67] hover:bg-[#EFECE8] dark:hover:bg-[#201518] transition-colors"
              title="Bagikan Titik Temu"
            >
              <MapPin className="w-5 h-5 text-[#B8893C]" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan ke tetangga..."
              className="flex-1 px-3.5 py-2 text-xs rounded-2xl border border-[#E5E5E5] dark:border-[#3A2A2E] bg-[#F7F3EC] dark:bg-[#201518] text-[#111111] dark:text-[#F5ECDF] focus:outline-none focus:border-[#B8893C]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] disabled:opacity-40 hover:opacity-95 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Photo Attachment Modal */}
        {photoAttachOpen && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-[#F7F3EC] dark:bg-[#201518] border-t border-[#B8893C] p-4 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E5E5]">
              <h5 className="font-bold text-xs text-[#5A1624] dark:text-[#F5ECDF]">
                Kirim Foto Bukti Kondisi Fisik
              </h5>
              <button onClick={() => setPhotoAttachOpen(false)}>
                <X className="w-4 h-4 text-[#6B6B6B]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleSendPhoto(
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="p-2 rounded-xl bg-white dark:bg-[#150E10] border text-center hover:border-[#B8893C]"
              >
                Foto Kondisi Lensa & Sensor
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendPhoto(
                    'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="p-2 rounded-xl bg-white dark:bg-[#150E10] border text-center hover:border-[#B8893C]"
              >
                Foto Fisik Body & Aksesoris
              </button>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#201518] p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-[#9C2A3F] mx-auto mb-2" />
              <h4 className="font-bold text-xs text-[#9C2A3F] mb-1">Laporkan Percakapan Ini</h4>
              <p className="text-[11px] text-[#6B6B6B] mb-3">
                Laporan akan langsung dicek oleh tim keamanan LetsBorrow untuk mencegah penipuan atau ajakan transaksi di luar aplikasi.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 py-1.5 rounded-xl border border-[#E5E5E5] text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReportModalOpen(false);
                    alert('Laporan percakapan telah diterima tim moderasi LetsBorrow.');
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-[#9C2A3F] text-white text-xs font-bold"
                >
                  Kirim Laporan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
