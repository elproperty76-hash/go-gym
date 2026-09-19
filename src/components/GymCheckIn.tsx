import React, { useState } from 'react';
import { Member } from '../types';
import { QrCode, Scan, Calendar, Clock, Sparkles, CheckCircle } from 'lucide-react';

interface GymCheckInProps {
  member: Member;
  onCheckIn: () => void;
}

export default function GymCheckIn({ member, onCheckIn }: GymCheckInProps) {
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [logs, setLogs] = useState<{ time: string; type: string }[]>([]);

  const handleSimulatedScan = () => {
    if (member.remainingSessions <= 0 && member.membershipType !== 'VIP') {
      alert('Sesi kuota membership Anda telah habis. Silakan lakukan top-up!');
      return;
    }

    onCheckIn();
    setCheckedInToday(true);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setLogs(prev => [{ time: timeString, type: 'Gym Entrance Access' }, ...prev]);

    setTimeout(() => {
      setCheckedInToday(false);
    }, 4000);
  };

  return (
    <div id="check-in-module" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
      {/* Visual Member Card with QR */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="w-full flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Barcode Check-In</span>
          <span className="text-[10px] px-2 py-0.5 font-bold uppercase bg-slate-200 text-slate-700 rounded-md">Gate 01</span>
        </div>

        {/* QR Simulation Card */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs inline-block relative group">
          {/* Animated scan overlay */}
          {checkedInToday && (
            <div className="absolute inset-0 bg-emerald-500/80 rounded-xl flex flex-col items-center justify-center text-white p-3 z-20 animate-fade-in">
              <CheckCircle size={40} className="text-white animate-bounce" />
              <p className="text-xs font-bold mt-2">Scan Sukses!</p>
              <p className="text-[10px] opacity-90">Selamat Latihan</p>
            </div>
          )}

          {/* Custom QR Grid Art */}
          <div className="w-32 h-32 bg-slate-900 rounded-lg p-2 flex flex-col justify-between select-none relative">
            <div className="flex justify-between h-7">
              <div className="w-7 h-7 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white" />
              </div>
              <div className="w-7 h-7 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white" />
              </div>
            </div>
            
            {/* Middle simulated dot noise */}
            <div className="grid grid-cols-8 gap-0.5 px-1 py-1 text-white opacity-90 text-[6px] font-mono leading-none tracking-tighter text-center">
              <div>▒</div><div>░</div><div>▓</div><div>▒</div><div>░</div><div>▓</div><div>▒</div><div>░</div>
              <div>▓</div><div>▒</div><div>░</div><div>▓</div><div>▒</div><div>░</div><div>▓</div><div>▒</div>
              <div>░</div><div>▓</div><div>▒</div><div>░</div><div>▓</div><div>▒</div><div>░</div><div>▓</div>
            </div>

            <div className="flex justify-between h-7">
              <div className="w-7 h-7 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white" />
              </div>
              <div className="w-7 h-7 flex items-end justify-end">
                <div className="w-3 h-3 bg-white rounded-xs" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-bold text-slate-800 text-sm">Tunjukkan QR Untuk Masuk</p>
          <p className="text-xs text-slate-500 max-w-xs leading-normal">
            Dekatkan QR Code Anda ke scanner di meja resepsionis untuk mencatat kunjungan harian Anda.
          </p>
        </div>

        <button
          onClick={handleSimulatedScan}
          disabled={checkedInToday}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
            checkedInToday
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          <Scan size={15} />
          {checkedInToday ? 'Mencatat Kunjungan...' : 'Simulasi Check-In Sekarang'}
        </button>
      </div>

      {/* Real-time Entrance Logs */}
      <div className="flex flex-col justify-between h-full py-1">
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles size={16} className="text-emerald-600" /> Log Kunjungan Hari Ini
          </h4>
          <p className="text-xs text-slate-400">Riwayat akses pintu masuk fisik gym untuk hari ini:</p>
          
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 bg-emerald-50/40 border border-emerald-100/50 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span className="font-semibold text-slate-800">{log.type}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{log.time}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                Belum ada aktivitas masuk untuk sesi ini.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[11px] text-slate-500 leading-relaxed mt-4">
          <strong className="text-slate-700">Catatan Praktis:</strong> Scan Check-in ini mengintegrasikan kehadiran Anda ke database sistem resepsionis gym tanpa membutuhkan formulir kertas.
        </div>
      </div>

    </div>
  );
}
