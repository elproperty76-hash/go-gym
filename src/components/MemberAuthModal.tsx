import React, { useState } from 'react';
import { Member, MembershipPrice } from '../types';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, X, LogIn, UserPlus, 
  Sparkles, CheckCircle2, AlertCircle, Dumbbell, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginMember, registerNewMember } from '../lib/firebase';

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (member: Member) => void;
  onNonMemberDemo?: () => void;
  membershipPrices?: MembershipPrice[];
  initialMode?: 'login' | 'register';
}

export default function MemberAuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  onNonMemberDemo,
  membershipPrices = [],
  initialMode = 'login'
}: MemberAuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  
  // Form State
  const [identifier, setIdentifier] = useState(''); // Email or WhatsApp
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('Iuran Bulanan');
  const [fitnessGoals, setFitnessGoals] = useState('Meningkatkan Kebugaran & Stamina');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabSwitch = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        // LOGIN FLOW
        const result = await loginMember(identifier, password);
        if (result.success && result.member) {
          setSuccessMessage(`Selamat datang kembali, ${result.member.fullName}!`);
          setTimeout(() => {
            onAuthSuccess(result.member!);
            onClose();
            resetForm();
          }, 600);
        } else {
          setErrorMessage(result.error || 'Email / Nomor WhatsApp atau kata sandi tidak cocok.');
        }
      } else {
        // REGISTER FLOW
        if (password !== confirmPassword) {
          setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
          setIsLoading(false);
          return;
        }

        const result = await registerNewMember({
          fullName,
          identifier,
          password,
          membershipType: selectedPackage,
          fitnessGoals
        });

        if (result.success && result.member) {
          setSuccessMessage(`Akun berhasil dibuat dan tersimpan di Firebase! Selamat datang, ${result.member.fullName}!`);
          setTimeout(() => {
            onAuthSuccess(result.member!);
            onClose();
            resetForm();
          }, 800);
        } else {
          setErrorMessage(result.error || 'Gagal mendaftarkan akun baru ke Firebase.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan pada sistem autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="relative w-full max-w-lg z-10 my-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer z-10"
            title="Tutup"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-inner">
              <Dumbbell size={20} className="transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Portal Member Go Gym</h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck size={13} /> Firebase Multi-User Storage
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            {authMode === 'login' 
              ? 'Masuk ke akun Anda menggunakan Email atau No WhatsApp terdaftar untuk melanjutkan latihan Anda.'
              : 'Daftarkan akun member baru. Akun Anda tersimpan aman di cloud database sehingga data latihan tidak hilang saat logout.'}
          </p>

          {/* Mode Tabs */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl mt-5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn size={14} /> Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus size={14} /> Daftar Baru
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Full Name (Register Only) */}
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-emerald-600" /> Nama Lengkap Member
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none font-medium text-slate-900"
                />
              </div>
            )}

            {/* Field: Identifier (Email OR WhatsApp) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail size={13} className="text-emerald-600" />
                  <span>Email atau Nomor WhatsApp</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Bisa salah satu</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="contoh: budi@gmail.com atau 08123456789"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none font-medium text-slate-900"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1">
                  <Phone size={14} />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                {authMode === 'login' 
                  ? 'Gunakan alamat email atau nomor WhatsApp yang Anda daftarkan sebelumnya.'
                  : 'Anda dapat menggunakan email atau nomor HP/WhatsApp aktif Anda untuk login.'}
              </p>
            </div>

            {/* Field: Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Lock size={13} className="text-emerald-600" />
                  <span>{authMode === 'login' ? 'Kata Sandi (Password)' : 'Buat Kata Sandi'}</span>
                </label>
                {authMode === 'register' && (
                  <span className="text-[10px] text-slate-400">Min. 6 karakter</span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder={authMode === 'login' ? 'Masukkan kata sandi Anda' : 'Buat kata sandi minimal 6 karakter'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all cursor-pointer p-1"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Field: Confirm Password (Register Only) */}
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Lock size={13} className="text-emerald-600" /> Konfirmasi Ulang Kata Sandi
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Ketik ulang kata sandi yang sama"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none font-medium text-slate-900"
                />
              </div>
            )}

            {/* Field: Package Selection (Register Only) */}
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Biaya Keanggotaan</label>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Iuran Bulanan Go Gym</span>
                    <span className="text-[11px] text-slate-500">Akses penuh fasilitas setiap hari (1 Bulan)</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    Rp 150.000 / bln
                  </span>
                </div>
              </div>
            )}

            {/* Field: Goals (Register Only) */}
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Kebugaran</label>
                <select
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="Meningkatkan Kebugaran & Stamina">Meningkatkan Kebugaran & Stamina</option>
                  <option value="Menurunkan Berat Badan (Fat Loss)">Menurunkan Berat Badan (Fat Loss)</option>
                  <option value="Membentuk & Membesarkan Otot (Hypertrophy)">Membentuk & Membesarkan Otot (Hypertrophy)</option>
                  <option value="Latihan Kekuatan & Powerlifting">Latihan Kekuatan & Powerlifting</option>
                  <option value="Fleksibilitas & Kesehatan Postur">Fleksibilitas & Kesehatan Postur</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : authMode === 'login' ? (
                <>
                  <LogIn size={16} /> Masuk Sekarang
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Daftar Akun Member Baru
                </>
              )}
            </button>
          </form>

          {/* Switch Tab Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-500">
                Belum terdaftar sebagai member?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Daftar Baru di sini
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Sudah memiliki akun member?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>

          {/* Non Member Demo Option */}
          {onNonMemberDemo && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  onNonMemberDemo();
                  onClose();
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Atau jelajahi aplikasi sebagai Non Member
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
