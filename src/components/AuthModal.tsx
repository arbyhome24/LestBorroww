import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    register,
    t,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: t('passwordStrengthWeak'), color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: t('passwordStrengthMedium'), color: 'bg-amber-500' };
    return { score: 3, label: t('passwordStrengthStrong'), color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Rule: Email must be @gmail.com
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@gmail.com')) {
      setErrorMsg(t('emailGmailOnly'));
      return;
    }

    if (mode === 'login') {
      if (!password) {
        setErrorMsg('Kata sandi wajib diisi.');
        return;
      }
      login(trimmedEmail);
    } else if (mode === 'register') {
      if (password.length < 8) {
        setErrorMsg(t('passwordMin8'));
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (!phone) {
        setErrorMsg('Nomor HP wajib diisi untuk verifikasi akun.');
        return;
      }

      register(name, trimmedEmail, `${countryCode}${phone}`);
      setSuccessMsg(t('verifyGmailNotice'));
    } else if (mode === 'forgot') {
      setSuccessMsg('Tautan pemulihan kata sandi telah dikirim ke alamat Gmail Anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFFFFF] dark:bg-[#150E10] border border-[#E5E5E5] dark:border-[#3A2A2E] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-1 rounded-full text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7A1F32] to-[#4A0F1C] border border-[#D4AF6A] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="font-serif-luxury font-bold text-lg text-[#D4AF6A]">LB</span>
          </div>
          <h3 className="font-serif-luxury font-bold text-xl text-[#5A1624] dark:text-[#F5ECDF]">
            {mode === 'login' ? 'Masuk ke LetsBorrow' : mode === 'register' ? 'Daftar Akun Baru' : 'Lupa Kata Sandi'}
          </h3>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#B09F94] mt-0.5">
            {t('loginRequiredDesc')}
          </p>
        </div>

        {/* Safe Contact Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-[#F7F3EC] dark:bg-[#201518] border border-[#B8893C]/30 flex items-center gap-2 text-[10px] text-[#5A1624] dark:text-[#D6AE67]">
          <ShieldCheck className="w-4 h-4 text-[#B8893C] shrink-0" />
          <span>Nomor HP dan email Anda 100% aman dan tidak pernah ditampilkan ke publik.</span>
        </div>

        {/* Errors & Success */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#9C2A3F]/15 border border-[#9C2A3F] text-xs text-[#9C2A3F] flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-500 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai identitas resmi"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email: Gmail Only */}
          <div>
            <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
              Alamat Email (@gmail.com saja)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number on Register (with country code) */}
          {mode === 'register' && (
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Nomor WhatsApp / HP (Verifikasi Internal)
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20 p-2 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10] text-xs font-bold"
                >
                  <option value="+62">🇮🇩 +62</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="81234567890"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password (Min 8 chars, visibility toggle, strength indicator) */}
          {mode !== 'forgot' && (
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] focus:border-[#B8893C] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter on register */}
              {mode === 'register' && password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[#6B6B6B]">{strength.label}</span>
                </div>
              )}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="font-bold text-[#5A1624] dark:text-[#D6AE67] block mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF]"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-[11px] text-[#B8893C] font-semibold hover:underline"
              >
                Lupa kata sandi?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7A1F32] to-[#4A0F1C] text-[#F7F3EC] text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all"
          >
            {mode === 'login' ? 'Masuk' : mode === 'register' ? 'Daftar Sekarang' : 'Kirim Tautan Reset'}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#3A2A2E] text-center text-xs text-[#6B6B6B]">
          {mode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-bold text-[#5A1624] dark:text-[#D6AE67] hover:underline"
              >
                Daftar Sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-[#5A1624] dark:text-[#D6AE67] hover:underline"
              >
                Masuk di Sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
