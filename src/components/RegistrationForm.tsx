import React, { useState } from 'react';
import { Member, MembershipPrice } from '../types';
import { User, Mail, Phone, Flame, Heart, Scale, Award, X } from 'lucide-react';

interface RegistrationFormProps {
  onRegister: (member: Member) => void;
  onInstantDemo: () => void;
  membershipPrices?: MembershipPrice[];
  onClose?: () => void;
}

export default function RegistrationForm({ onRegister, onInstantDemo, membershipPrices = [], onClose }: RegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Default to Iuran Bulanan
  const defaultPackage = membershipPrices.length > 0 ? membershipPrices[0].name : 'Iuran Bulanan';
  const [membershipType, setMembershipType] = useState<string>(defaultPackage);
  const [goal, setGoal] = useState('Weight Loss');
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(65);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Semua kolom berlabel bintang (*) wajib diisi!');
      return;
    }

    const actualType = membershipType || defaultPackage;

    // Standard monthly active gym session quota: 30 sessions per month
    const sessions = 30;

    const newMember: Member = {
      id: 'M-' + Math.floor(1000 + Math.random() * 9000),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      membershipType: actualType as any,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      remainingSessions: sessions,
      attendedCount: 0,
      goal,
      height,
      weight
    };

    onRegister(newMember);
  };

  return (
    <div id="registration-container" className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div id="registration-header" className="bg-slate-900 px-6 py-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={100} />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer z-10"
            title="Tutup Formulir"
          >
            <X size={20} />
          </button>
        )}
        <h2 className="text-2xl font-bold tracking-tight">Formulir Pendaftaran Member Baru</h2>
        <p className="text-slate-300 text-sm mt-1">Gabung sekarang dan capai tujuan kebugaran Anda bersama para ahli.</p>
      </div>

      <form id="registration-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {error && (
          <div id="reg-error" className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Informasi Pribadi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="budi@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
                Nomor Telepon / WA <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone size={18} />
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="goal">
                Tujuan Fitness <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Heart size={18} />
                </span>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="Weight Loss">Penurunan Berat Badan</option>
                  <option value="Muscle Build">Pembentukan Otot</option>
                  <option value="Endurance">Ketahanan & Stamina</option>
                  <option value="General Health">Kebugaran Umum</option>
                  <option value="Flexibility">Fleksibilitas & Postur</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Fisik & Komposisi Tubuh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="height">
                Tinggi Badan (cm)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Scale size={18} />
                </span>
                <input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="weight">
                Berat Badan (kg)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Scale size={18} />
                </span>
                <input
                  id="weight"
                  type="number"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer text-center"
          >
            Daftar Sebagai Member
          </button>
          
          <button
            type="button"
            onClick={onInstantDemo}
            className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-3 px-5 rounded-xl transition-all cursor-pointer text-center"
          >
            Non Member
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="sm:w-auto bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm py-3 px-5 rounded-xl transition-all cursor-pointer text-center"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
