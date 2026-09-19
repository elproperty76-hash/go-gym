import React, { useState } from 'react';
import { Member } from '../types';
import { Award, ShieldAlert, CheckCircle2, TrendingUp, Calendar, Hash, Edit3, Scale } from 'lucide-react';

interface MemberProfileProps {
  member: Member;
  onUpdatePhysicals: (height: number, weight: number, goal: string) => void;
}

export default function MemberProfile({ member, onUpdatePhysicals }: MemberProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [weightInput, setWeightInput] = useState(member.weight || 65);
  const [heightInput, setHeightInput] = useState(member.height || 170);
  const [goalInput, setGoalInput] = useState(member.goal || 'Weight Loss');

  const isDemo = member.id === 'M-7790' || localStorage.getItem('gym_is_demo') === 'true';

  // BMI Calculation
  const heightInMeters = heightInput / 100;
  const bmi = heightInMeters > 0 ? (weightInput / (heightInMeters * heightInMeters)).toFixed(1) : '0';
  const bmiNum = Number(bmi);

  const getBmiStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return { text: 'Kurang Berat Badan (Underweight)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmiValue >= 18.5 && bmiValue < 25) return { text: 'Normal & Sehat (Ideal)', color: 'text-green-600 bg-green-50 border-green-200' };
    if (bmiValue >= 25 && bmiValue < 30) return { text: 'Kelebihan Berat Badan (Overweight)', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { text: 'Obesitas (Obese)', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const getGoalTranslation = (goal: string) => {
    switch (goal) {
      case 'Weight Loss': return 'Penurunan Berat Badan';
      case 'Muscle Build': return 'Pembentukan Otot';
      case 'Endurance': return 'Ketahanan & Stamina';
      case 'General Health': return 'Kebugaran Umum';
      case 'Flexibility': return 'Fleksibilitas & Postur';
      default: return goal;
    }
  };

  const bmiStatus = getBmiStatus(bmiNum);

  const handleSave = () => {
    onUpdatePhysicals(heightInput, weightInput, goalInput);
    setIsEditing(false);
  };

  return (
    <div id="member-profile-card" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Membership ID Card Block */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md h-full min-h-[220px]">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                {isDemo ? 'Gym Non Member' : 'Gym Official Member'}
              </span>
              <h3 className="text-xl font-bold tracking-tight mt-1">{member.fullName}</h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950">
              {isDemo ? 'Non Member' : (member.membershipType === 'VIP' || member.membershipType === 'Premium' ? member.membershipType : 'Iuran Bulanan')}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-medium text-slate-400">ID Anggota</span>
            <p className="font-mono text-lg font-bold tracking-wider text-slate-100 flex items-center gap-1">
              <Hash size={16} className="text-slate-500" /> {member.id}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-slate-800/80 pt-4 mt-6 text-xs text-slate-400">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Bergabung Sejak</p>
            <p className="font-medium text-slate-200 flex items-center gap-1 mt-0.5">
              <Calendar size={12} /> {member.joinedDate}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase text-right">Status</p>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Aktif
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Fitness Performance Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-4">
          <TrendingUp size={16} className="text-emerald-600" /> Ringkasan Aktivitas Member
        </h4>

        <div className="grid grid-cols-2 gap-4 my-auto">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-center sm:text-left">
            <span className="text-xs text-slate-500">Sesi Diikuti</span>
            <p className="text-2xl font-extrabold text-slate-900">{member.attendedCount} <span className="text-xs font-normal text-slate-500">kali</span></p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-center sm:text-left">
            <span className="text-xs text-slate-500">Sisa Kuota Gym</span>
            <p className="text-2xl font-extrabold text-slate-900">{member.remainingSessions} <span className="text-xs font-normal text-slate-500">sesi</span></p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>Sesi Anda akan otomatis berkurang saat melakukan Check-In di meja depan.</span>
        </div>
      </div>

      {/* 3. Physical Health Composition (BMI & Goals) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Scale size={16} className="text-emerald-600" /> Komposisi & Target Fisik
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              Simpan
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 my-auto">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase">Tinggi (cm)</label>
                <input
                  type="number"
                  value={heightInput}
                  onChange={(e) => setHeightInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase">Berat (kg)</label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 uppercase">Tujuan Kebugaran</label>
              <select
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
              >
                <option value="Weight Loss">Penurunan Berat Badan</option>
                <option value="Muscle Build">Pembentukan Otot</option>
                <option value="Endurance">Ketahanan & Stamina</option>
                <option value="General Health">Kebugaran Umum</option>
                <option value="Flexibility">Fleksibilitas & Postur</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 my-auto">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Tinggi</p>
                <p className="text-sm font-bold text-slate-800">{member.height || '-'} cm</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Berat</p>
                <p className="text-sm font-bold text-slate-800">{member.weight || '-'} kg</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">BMI</p>
                <p className="text-sm font-bold text-slate-800">{bmi}</p>
              </div>
            </div>

            <div className={`p-2.5 border rounded-xl text-center text-xs font-semibold ${bmiStatus.color}`}>
              Kategori: {bmiStatus.text}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase">Fokus Latihan Saat Ini</p>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Award size={16} className="text-amber-500" /> {getGoalTranslation(member.goal)}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
