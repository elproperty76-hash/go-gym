import React, { useState } from 'react';
import { GymClass, Booking } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight, CheckCircle, Info, Sparkles, AlertCircle } from 'lucide-react';

interface InteractiveCalendarProps {
  classes: GymClass[];
  bookings: Booking[];
  onBookClass: (classId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;

export default function InteractiveCalendar({
  classes,
  bookings,
  onBookClass,
  onCancelBooking
}: InteractiveCalendarProps) {
  // Current active day of the calendar (defaults to 'Senin' or 'Sabtu' depending on today)
  // 19 Sep 2026 is Saturday ("Sabtu"), so we can default to 'Sabtu' as the active day
  const [activeDay, setActiveDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'>('Sabtu');
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);

  // Map bookings
  const isBooked = (classId: string) => bookings.some(b => b.classId === classId);
  const getBooking = (classId: string) => bookings.find(b => b.classId === classId);

  // Count classes per day
  const getClassCountByDay = (day: string) => classes.filter(c => c.day === day).length;

  const getIntensityStyle = (intensity: 'Ringan' | 'Sedang' | 'Tinggi') => {
    switch (intensity) {
      case 'Ringan': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Sedang': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Tinggi': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Yoga': return 'border-l-indigo-500 bg-indigo-50/10';
      case 'Zumba': return 'border-l-pink-500 bg-pink-50/10';
      case 'HIIT': return 'border-l-orange-500 bg-orange-50/10';
      case 'Strength': return 'border-l-rose-500 bg-rose-50/10';
      case 'Spinning': return 'border-l-sky-500 bg-sky-50/10';
      case 'Pilates': return 'border-l-teal-500 bg-teal-50/10';
      default: return 'border-l-slate-400 bg-slate-50/10';
    }
  };

  return (
    <div id="interactive-calendar" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* 1. Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarIcon size={18} />
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Kalender Kelas Mingguan</h3>
          </div>
          <p className="text-slate-500 text-xs">Pilih hari untuk melihat kelas terjadwal, instruktur, dan kuota pendaftaran.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" /> Yoga
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-pink-500 rounded-xs" /> Zumba
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-xs" /> HIIT
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs" /> Strength
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-sky-500 rounded-xs" /> Cycle
          </div>
        </div>
      </div>

      {/* 2. Interactive Day Timeline Scroller */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
        {DAYS_OF_WEEK.map((day) => {
          const count = getClassCountByDay(day);
          const isToday = day === 'Sabtu'; // 19 Sep 2026 is Saturday
          const isSelected = activeDay === day;

          return (
            <button
              key={day}
              onClick={() => {
                setActiveDay(day);
                setSelectedClass(null); // Clear detailed display on day change
              }}
              className={`p-2.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                {day.substring(0, 3)}
              </span>
              <span className="text-sm font-extrabold mt-1">
                {count > 0 ? `${count} Kls` : '-'}
              </span>
              
              {/* Highlight Saturday (Today Indicator) */}
              {isToday && (
                <span className="absolute -top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Daily Class Timetable Layout & Interactive Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Hourly Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-emerald-600" /> Kelas Terjadwal Hari {activeDay}
            </h4>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
              {getClassCountByDay(activeDay)} Sesi Tersedia
            </span>
          </div>

          <div className="space-y-3">
            {classes.filter(c => c.day === activeDay).length > 0 ? (
              classes
                .filter(c => c.day === activeDay)
                .map((c) => {
                  const booked = isBooked(c.id);
                  const isFull = c.currentParticipants >= c.maxCapacity;
                  const isSelected = selectedClass?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClass(c)}
                      className={`p-4 border-l-4 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-xs ${getCategoryColor(c.category)} ${
                        isSelected 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-slate-50' 
                          : booked 
                          ? 'border-emerald-500 bg-white shadow-xs' 
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{c.name}</span>
                          <span className={`px-2 py-0.2 text-[9px] font-bold uppercase rounded ${
                            c.intensity === 'Tinggi' ? 'bg-rose-100 text-rose-800' :
                            c.intensity === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {c.intensity}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {c.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {c.room}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs text-slate-500">
                          {c.currentParticipants}/{c.maxCapacity} Member
                        </span>
                        
                        {booked ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle size={12} /> Terdaftar
                          </span>
                        ) : isFull ? (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg flex items-center gap-1">
                            Penuh
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 group-hover:underline">
                            Detail & Daftar &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CalendarIcon size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 text-xs">Tidak ada kelas terjadwal pada hari {activeDay}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Selected Class Detail Panel */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          {selectedClass ? (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {selectedClass.category}
                </span>
                <h4 className="font-bold text-slate-900 text-base leading-snug">{selectedClass.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{selectedClass.description}</p>
              </div>

              <div className="space-y-2 border-t border-b border-slate-200/80 py-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Instruktur</span>
                  <strong className="text-slate-800 font-semibold">{selectedClass.instructor}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hari & Jam</span>
                  <span className="text-slate-800 font-medium">{selectedClass.day}, {selectedClass.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Studio / Area</span>
                  <span className="text-slate-800 font-medium">{selectedClass.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tingkat Intensitas</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getIntensityStyle(selectedClass.intensity)}`}>
                    {selectedClass.intensity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kapasitas Sesi</span>
                  <span className="text-slate-800 font-medium">{selectedClass.currentParticipants} dari {selectedClass.maxCapacity} terisi</span>
                </div>
              </div>

              {/* Action Buttons inside detail card */}
              <div>
                {isBooked(selectedClass.id) ? (
                  <button
                    onClick={() => {
                      const b = getBooking(selectedClass.id);
                      if (b) onCancelBooking(b.id);
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Batalkan Pendaftaran Kelas
                  </button>
                ) : (
                  <button
                    onClick={() => onBookClass(selectedClass.id)}
                    disabled={selectedClass.currentParticipants >= selectedClass.maxCapacity}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs ${
                      selectedClass.currentParticipants >= selectedClass.maxCapacity
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {selectedClass.currentParticipants >= selectedClass.maxCapacity ? 'Kuota Kelas Penuh' : 'Daftar Kelas Sekarang'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <Info size={36} className="text-slate-300 mb-2" />
              <p className="text-xs font-medium">Klik pada salah satu kelas terjadwal untuk melihat detail instruktur, deskripsi kelas, dan melakukan pendaftaran secara langsung.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
