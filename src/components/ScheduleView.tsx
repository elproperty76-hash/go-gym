import React, { useState } from 'react';
import { GymClass, Booking } from '../types';
import { Calendar, Clock, MapPin, User, Search, Filter, CheckCircle, X, Info } from 'lucide-react';

interface ScheduleViewProps {
  classes: GymClass[];
  bookings: Booking[];
  onBookClass: (classId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  activeTab: 'all' | 'mine';
  setActiveTab: (tab: 'all' | 'mine') => void;
}

export default function ScheduleView({
  classes,
  bookings,
  onBookClass,
  onCancelBooking,
  activeTab,
  setActiveTab
}: ScheduleViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const days = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const categories = ['Semua', 'Yoga', 'Zumba', 'HIIT', 'Strength', 'Spinning', 'Pilates'];

  // Match bookings to specific classes
  const myBookedClasses = bookings.map(b => {
    const gymClass = classes.find(c => c.id === b.classId);
    return {
      bookingId: b.id,
      gymClass,
      bookingDate: b.bookingDate,
      status: b.status
    };
  }).filter(b => b.gymClass !== undefined) as { bookingId: string; gymClass: GymClass; bookingDate: string; status: 'Confirmed' | 'Cancelled' | 'Attended' }[];

  const filteredClasses = classes.filter(c => {
    const matchesDay = selectedDay === 'Semua' || c.day === selectedDay;
    const matchesCategory = selectedCategory === 'Semua' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesCategory && matchesSearch;
  });

  const getIntensityBadgeColor = (intensity: 'Ringan' | 'Sedang' | 'Tinggi') => {
    switch (intensity) {
      case 'Ringan':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Sedang':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Tinggi':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Yoga': return 'bg-indigo-50 text-indigo-700';
      case 'Zumba': return 'bg-pink-50 text-pink-700';
      case 'HIIT': return 'bg-orange-50 text-orange-700';
      case 'Strength': return 'bg-rose-50 text-rose-700';
      case 'Spinning': return 'bg-sky-50 text-sky-700';
      case 'Pilates': return 'bg-teal-50 text-teal-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div id="schedule-module" className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Semua Jadwal Kelas Gym
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all cursor-pointer relative ${
            activeTab === 'mine'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Jadwal Terdaftar Saya
          {bookings.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-600 text-white rounded-full font-bold">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Controls & Filters */}
          <div id="filters-panel" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Cari kelas, instruktur, atau studio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-slate-400 transition-all"
                />
              </div>

              {/* Category Dropdown for Mobile / Compact */}
              <div className="w-full md:w-48 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Filter size={16} />
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-700 transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'Semua' ? 'Semua Kategori' : cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day Filter Chips */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> Hari Latihan
              </span>
              <div className="flex flex-wrap gap-1.5">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedDay === day
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Classes Listing */}
          <div id="class-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((c) => {
                const isBooked = bookings.some(b => b.classId === c.id);
                const isFull = c.currentParticipants >= c.maxCapacity;
                const percentage = Math.min(100, Math.round((c.currentParticipants / c.maxCapacity) * 100));

                return (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all flex flex-col justify-between ${
                      isBooked ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Class Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getCategoryBadgeColor(c.category)}`}>
                              {c.category}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-medium border rounded-md ${getIntensityBadgeColor(c.intensity)}`}>
                              {c.intensity}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base tracking-tight leading-snug">{c.name}</h4>
                        </div>
                      </div>

                      {/* Instructor & Description */}
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Logistics Info Grid */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="font-medium text-slate-800">{c.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span>{c.time}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <User size={14} className="text-slate-400" />
                          <span>Instruktur: <strong className="text-slate-800 font-semibold">{c.instructor}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{c.room}</span>
                        </div>
                      </div>

                      {/* Capacity Meter */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Okupansi Kelas</span>
                          <span className="font-semibold text-slate-800">{c.currentParticipants} / {c.maxCapacity} Terdaftar</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              isFull ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Booking Trigger Footer */}
                    <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      {isBooked ? (
                        <>
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> Terdaftar
                          </span>
                          <button
                            onClick={() => {
                              const foundBooking = bookings.find(b => b.classId === c.id);
                              if (foundBooking) onCancelBooking(foundBooking.id);
                            }}
                            className="bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200 hover:border-red-200 text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <X size={12} /> Batalkan
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-slate-500">
                            {isFull ? 'Kuota kelas penuh' : 'Sisa kuota: ' + (c.maxCapacity - c.currentParticipants) + ' member'}
                          </span>
                          <button
                            onClick={() => onBookClass(c.id)}
                            disabled={isFull}
                            className={`text-xs font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer shadow-xs ${
                              isFull
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            Daftar Kelas
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                <Info size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm">Tidak ada kelas yang cocok dengan filter pencarian Anda.</p>
                <button
                  onClick={() => {
                    setSelectedDay('Semua');
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 text-xs font-semibold underline"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* My Schedule Tab */
        <div id="my-bookings-section" className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-emerald-600" /> Kelas yang Anda Ikuti
          </h3>

          {myBookedClasses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myBookedClasses.map(({ bookingId, gymClass, bookingDate }) => (
                <div key={bookingId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-base">{gymClass.name}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getCategoryBadgeColor(gymClass.category)}`}>
                        {gymClass.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-500">
                      <p className="flex items-center gap-1.5">
                        <Calendar size={13} /> {gymClass.day}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock size={13} /> {gymClass.time}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin size={13} /> {gymClass.room}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">Didaftarkan pada: {bookingDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onCancelBooking(bookingId)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Batalkan Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 text-sm font-semibold">Belum Ada Kelas Terdaftar</p>
              <p className="text-slate-400 text-xs mt-1">Anda belum mendaftarkan diri pada kelas gym minggu ini.</p>
              <button
                onClick={() => setActiveTab('all')}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Cari & Daftar Kelas Sekarang
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
