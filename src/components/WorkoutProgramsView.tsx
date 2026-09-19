import React, { useState } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Zap, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { WorkoutProgram, ExerciseMovement } from '../types';
import { WORKOUT_PROGRAMS_DATA } from '../data/workoutProgramsData';

interface WorkoutProgramsViewProps {
  onSelectProgramForLogger?: (programName: string, exerciseName: string) => void;
}

export const WorkoutProgramsView: React.FC<WorkoutProgramsViewProps> = ({
  onSelectProgramForLogger
}) => {
  const [programs] = useState<WorkoutProgram[]>(WORKOUT_PROGRAMS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeProgram, setActiveProgram] = useState<WorkoutProgram | null>(null);
  const [activeExerciseModal, setActiveExerciseModal] = useState<ExerciseMovement | null>(null);

  const categories = ['Semua', 'Pemula', 'Hipertrofi (Massa Otot)', 'Penurunan Lemak / Fat Loss', 'Kekuatan (Strength)'];

  const filteredPrograms = selectedCategory === 'Semua' 
    ? programs 
    : programs.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Program Latihan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
            <Dumbbell size={14} /> Panduan & Kurikulum Latihan Resmi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Program Latihan & Petunjuk Gerakan Gym
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pilih program latihan terstruktur sesuai sasaran kebugaran Anda. Dilengkapi foto panduan visual, instruksi langkah-demi-langkah, tips biomekanik, serta pencegahan kesalahan gerakan yang rawan cedera.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveProgram(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Program Detail Mode (Jika sedang melihat 1 program spesifik) */}
      {activeProgram ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveProgram(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-all cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft size={16} /> Kembali ke Pilihan Program
          </button>

          {/* Program Overview Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <img
                src={activeProgram.bannerImage}
                alt={activeProgram.title}
                className="w-full lg:w-72 h-48 object-cover rounded-2xl shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-100 text-emerald-800">
                    {activeProgram.category}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                    Tingkat: {activeProgram.level}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800">
                    {activeProgram.durationWeeks} Minggu Siklus
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">
                    {activeProgram.daysPerWeek} Hari / Minggu
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeProgram.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeProgram.description}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-2 text-xs text-slate-700">
                  <Calendar size={16} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold">Rekomendasi Hari:</span> {activeProgram.scheduleDay}
                </div>
              </div>
            </div>

            {/* Manfaat Program */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                Manfaat & Sasaran Hasil Latihan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeProgram.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daftar Gerakan dalam Program */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Daftar Gerakan Latihan ({activeProgram.exercises.length} Gerakan)
                </h4>
                <p className="text-xs text-slate-500">
                  Klik pada gerakan di bawah untuk melihat petunjuk lengkap dan panduan keselamatan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeProgram.exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  onClick={() => setActiveExerciseModal(ex)}
                  className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={ex.imageUrl}
                        alt={ex.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        Gerakan #{index + 1}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
                        {ex.difficulty}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                        {ex.name}
                      </h5>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        Target: {ex.targetMuscle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Layers size={13} className="text-slate-400" />
                        <span>{ex.setsReps}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={13} className="text-slate-400" />
                        <span>Jeda: {ex.restTime}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Panduan Gerakan</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Pilihan Daftar Semua Program Latihan */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={prog.bannerImage}
                    alt={prog.title}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider">
                      {prog.level}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                      {prog.durationWeeks} Minggu
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {prog.category}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-700">
                      <span className="font-semibold flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} /> Frekuensi:
                      </span>
                      <span className="font-bold">{prog.daysPerWeek} Hari / Minggu</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-700">
                      <span className="font-semibold flex items-center gap-1.5 text-slate-500">
                        <Dumbbell size={14} /> Jumlah Gerakan:
                      </span>
                      <span className="font-bold">{prog.exercises.length} Gerakan Terarah</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveProgram(prog)}
                  className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Lihat Seluruh Gerakan & Petunjuk</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Gerakan & Petunjuk (Step-by-Step, Tips, Common Mistakes) */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative h-56 w-full bg-slate-900">
              <img
                src={activeExerciseModal.imageUrl}
                alt={activeExerciseModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase">
                    {activeExerciseModal.difficulty}
                  </span>
                  <span className="text-emerald-400 font-semibold text-xs">
                    Alat: {activeExerciseModal.equipment}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">{activeExerciseModal.name}</h3>
                <p className="text-xs text-slate-300">Target Utama: {activeExerciseModal.targetMuscle}</p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rekomendasi Set</span>
                <span className="font-extrabold text-slate-800 text-xs">{activeExerciseModal.setsReps}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Jeda Istirahat</span>
                <span className="font-extrabold text-slate-800 text-xs">{activeExerciseModal.restTime}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Peralatan</span>
                <span className="font-extrabold text-emerald-700 text-xs truncate block">{activeExerciseModal.equipment}</span>
              </div>
            </div>

            {/* Modal Body: Instructions, Tips, Mistakes */}
            <div className="p-6 space-y-6">
              {/* Petunjuk Langkah Demi Langkah */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Petunjuk Pelaksanaan Gerakan:
                </h4>
                <div className="space-y-2.5">
                  {activeExerciseModal.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Biomekanik & Efektivitas */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  Tips Kunci & Posisi Tubuh:
                </h4>
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  {activeExerciseModal.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-amber-900">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesalahan Umum yang Harus Dihindari */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-500" />
                  Kesalahan Umum & Risiko Cedera:
                </h4>
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2">
                  {activeExerciseModal.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-900">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Tutup / Aksi */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setActiveExerciseModal(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Selesai Membaca & Tutup Panduan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
