import React, { useState, useMemo } from 'react';
import { WorkoutSession, ExerciseLog } from '../types';
import { Flame, Clock, Plus, Trophy, Activity, Trash2, LineChart, List, TrendingUp, Sparkles } from 'lucide-react';

interface WorkoutLoggerProps {
  sessions: WorkoutSession[];
  onAddSession: (session: Omit<WorkoutSession, 'id' | 'memberId'>) => void;
}

export default function WorkoutLogger({ sessions, onAddSession }: WorkoutLoggerProps) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(45);
  const [calories, setCalories] = useState<number>(300);
  const [notes, setNotes] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'progress'>('history');

  // Multi-exercise builder state inside the form
  const [exercisesList, setExercisesList] = useState<Omit<ExerciseLog, 'id'>[]>([]);
  const [currExName, setCurrExName] = useState('');
  const [currExSets, setCurrExSets] = useState<number>(3);
  const [currExReps, setCurrExReps] = useState<number>(12);
  const [currExWeight, setCurrExWeight] = useState<number>(20);

  // Selected exercise for progress analysis dropdown
  const [selectedAnalysisExercise, setSelectedAnalysisExercise] = useState<string>('');

  const handleAddExerciseToTempList = () => {
    if (!currExName.trim()) return;
    setExercisesList(prev => [
      ...prev,
      {
        name: currExName.trim(),
        sets: currExSets,
        reps: currExReps,
        weight: currExWeight
      }
    ]);
    setCurrExName('');
    setCurrExSets(3);
    setCurrExReps(12);
    setCurrExWeight(20);
  };

  const handleRemoveTempExercise = (index: number) => {
    setExercisesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Structure list into required types with IDs
    const finalExercises: ExerciseLog[] = exercisesList.map((ex, i) => ({
      id: `ex-${Date.now()}-${i}`,
      ...ex
    }));

    onAddSession({
      title: title.trim(),
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
      duration,
      caloriesBurned: calories,
      notes: notes.trim(),
      exercises: finalExercises.length > 0 ? finalExercises : undefined
    });

    // Reset Form
    setTitle('');
    setDuration(45);
    setCalories(300);
    setNotes('');
    setExercisesList([]);
    setIsFormOpen(false);
  };

  // Extract unique exercises across all recorded sessions for the analysis dropdown
  const uniqueExerciseNames = useMemo(() => {
    const names = new Set<string>();
    sessions.forEach(session => {
      session.exercises?.forEach(ex => {
        names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [sessions]);

  // Set default exercise to analyze
  React.useEffect(() => {
    if (uniqueExerciseNames.length > 0 && !selectedAnalysisExercise) {
      setSelectedAnalysisExercise(uniqueExerciseNames[0]);
    }
  }, [uniqueExerciseNames, selectedAnalysisExercise]);

  // Gather timeline data for the selected exercise to analyze progression
  const exerciseProgressTimeline = useMemo(() => {
    if (!selectedAnalysisExercise) return [];
    
    const timeline: { date: string; sessionTitle: string; sets: number; reps: number; weight: number; oneRepMaxEstimate: number }[] = [];
    
    // Reverse sessions list to see from oldest to newest progression
    [...sessions].reverse().forEach(session => {
      session.exercises?.forEach(ex => {
        if (ex.name.toLowerCase() === selectedAnalysisExercise.toLowerCase()) {
          // Calculate estimated 1-Rep Max using Epley Formula: Weight * (1 + Reps/30)
          const oneRepMaxVal = Math.round(ex.weight * (1 + ex.reps / 30));
          timeline.push({
            date: session.date,
            sessionTitle: session.title,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            oneRepMaxEstimate: oneRepMaxVal
          });
        }
      });
    });
    return timeline;
  }, [sessions, selectedAnalysisExercise]);

  // Summary Metrics
  const totalCalories = sessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalWorkouts = sessions.length;

  return (
    <div id="workout-tracker-container" className="space-y-6">
      
      {/* 1. Header & Summary Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity size={20} className="text-emerald-600" /> Pelacakan Kemajuan Latihan
          </h3>
          <p className="text-slate-500 text-xs">Masukkan detail set, repetisi, dan beban angkatan untuk memantau peningkatan kekuatan Anda dari waktu ke waktu.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-center min-w-[90px]">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Sesi</p>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">{totalWorkouts} Sesi</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-center min-w-[90px]">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Waktu</p>
            <p className="text-base font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
              <Clock size={14} className="text-emerald-600" /> {totalDuration} <span className="text-[10px] font-normal text-slate-500">mnt</span>
            </p>
          </div>
          <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl text-center min-w-[90px]">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Kalori</p>
            <p className="text-base font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
              <Flame size={14} className="text-orange-600 animate-pulse" /> {totalCalories} <span className="text-[10px] font-normal text-slate-500">kkal</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Logger Form Button */}
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} /> Catat Sesi Latihan Baru & Detail Gerakan (Set, Reps, Beban)
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Form Latihan & Kemajuan Anggota</h4>
              <p className="text-[11px] text-slate-400">Isi detail sesi Anda beserta catatan gerakan set/reps/beban di bawah.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer border border-slate-200 px-2.5 py-1 rounded-lg"
            >
              Batal
            </button>
          </div>

          {/* Form Top Section: General Session details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nama Sesi Latihan *</label>
              <input
                type="text"
                required
                placeholder="Misal: Leg Day Ultimate, Latihan Dada"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Estimasi Durasi (Menit)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Estimasi Kalori Terbakar (Kcal)</label>
              <input
                type="number"
                min="0"
                max="2000"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Sub-form: Structured Exercise builder */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-4">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" /> Detail Gerakan / Angkatan Fisik
              </span>
              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border">
                {exercisesList.length} Gerakan Ditambahkan
              </span>
            </div>

            {/* Structured row fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Gerakan (Alat / Otot)</label>
                <input
                  type="text"
                  placeholder="Misal: Bench Press, Barbell Squat"
                  value={currExName}
                  onChange={(e) => setCurrExName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:col-span-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase text-center">Set</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={currExSets}
                    onChange={(e) => setCurrExSets(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase text-center">Reps</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={currExReps}
                    onChange={(e) => setCurrExReps(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase text-center">Beban (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={currExWeight}
                    onChange={(e) => setCurrExWeight(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center focus:outline-none text-slate-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddExerciseToTempList}
              disabled={!currExName.trim()}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                currExName.trim()
                  ? 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <Plus size={14} /> Tambahkan Gerakan ke Sesi Ini
            </button>

            {/* Visual list of currently added exercises inside the form */}
            {exercisesList.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                {exercisesList.map((ex, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="font-bold text-slate-700">{ex.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">
                        {ex.sets} Set × {ex.reps} Reps • <strong>{ex.weight} kg</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTempExercise(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
            <textarea
              placeholder="Catatan tambahan mengenai stamina, rasa pegal, atau pengamatan fisik lainnya."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 h-16 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Simpan & Rekam Latihan
            </button>
          </div>
        </form>
      )}

      {/* 3. Sub-tabs toggle: Riwayat vs Progres Analisis */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'history'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <List size={14} /> Riwayat Lengkap Sesi Latihan
        </button>
        <button
          onClick={() => setActiveSubTab('progress')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'progress'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LineChart size={14} /> Analisis Progres Angkatan Gerakan
        </button>
      </div>

      {/* Render selected Sub-tab */}
      {activeSubTab === 'history' ? (
        <div className="space-y-3">
          {sessions.length > 0 ? (
            sessions.map((s) => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="space-y-3 flex-1 w-full">
                  
                  {/* Session Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-600" /> {s.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tanggal Latihan: {s.date}</p>
                    </div>
                    <div className="flex gap-2 text-[11px]">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        🕒 {s.duration} mnt
                      </span>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded font-semibold">
                        🔥 {s.caloriesBurned} Kcal
                      </span>
                    </div>
                  </div>

                  {/* Exercises Details Nested */}
                  {s.exercises && s.exercises.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                      {s.exercises.map((ex, idx) => {
                        // Calculate volume = sets * reps * weight
                        const totalVolume = ex.sets * ex.reps * ex.weight;
                        return (
                          <div key={ex.id || idx} className="bg-white p-2.5 border border-slate-100 rounded-lg text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800">{ex.name}</p>
                              <p className="text-slate-400 text-[10px] mt-0.5">Vol: {totalVolume} kg</p>
                            </div>
                            <div className="text-right text-slate-700 font-medium">
                              {ex.sets} Set × {ex.reps} Reps • <span className="text-emerald-700 font-bold">{ex.weight} kg</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Sesi latihan fungsional tanpa detail angkatan beban spesifik.</p>
                  )}

                  {s.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50/40 p-2.5 rounded-lg italic leading-relaxed border border-slate-100">
                      Catatan: &ldquo;{s.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <Activity size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 text-xs">Belum ada sesi latihan mandiri yang dicatat minggu ini.</p>
            </div>
          )}
        </div>
      ) : (
        /* Progress Analysis tab */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          
          {/* Picker Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-600" /> Analisis Kekuatan Maksimum & Volume
              </h4>
              <p className="text-slate-500 text-xs">Pilih salah satu gerakan untuk memantau peningkatan beban angkatan (kg) Anda.</p>
            </div>

            {uniqueExerciseNames.length > 0 ? (
              <div className="w-full sm:w-64">
                <select
                  value={selectedAnalysisExercise}
                  onChange={(e) => setSelectedAnalysisExercise(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  {uniqueExerciseNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">Belum ada data gerakan beban terdaftar</span>
            )}
          </div>

          {/* Timeline chart/list of improvement */}
          {uniqueExerciseNames.length > 0 && selectedAnalysisExercise ? (
            <div className="space-y-4">
              <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                <Sparkles size={18} className="text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 leading-normal">
                  Sistem menghitung estimasi <strong>1-Rep Max (1RM)</strong> Anda menggunakan formula Epley. Semakin tinggi 1RM, semakin kuat fisik angkatan otot Anda.
                </p>
              </div>

              <div className="relative border-l-2 border-emerald-500/30 ml-3 pl-6 space-y-6 py-2">
                {exerciseProgressTimeline.map((item, idx) => {
                  const isLast = idx === exerciseProgressTimeline.length - 1;
                  const isFirst = idx === 0;

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[31px] top-1 flex items-center justify-center h-4 w-4 rounded-full border-2 ${
                        isFirst ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-emerald-500'
                      }`}>
                        {isFirst && <span className="h-1.5 w-1.5 bg-white rounded-full" />}
                      </span>

                      {/* Timeline content box */}
                      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-mono">{item.date} • Sesi: {item.sessionTitle}</p>
                          <p className="text-sm font-bold text-slate-800">{selectedAnalysisExercise}</p>
                          <p className="text-slate-500 text-xs">
                            Format: {item.sets} Set × {item.reps} Reps dengan berat <strong className="text-slate-700">{item.weight} kg</strong>
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50 text-center min-w-[75px]">
                            <p className="text-[9px] text-slate-400 uppercase">Angkatan</p>
                            <p className="text-sm font-extrabold text-slate-800">{item.weight} kg</p>
                          </div>
                          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-center min-w-[75px]">
                            <p className="text-[9px] text-emerald-600 uppercase font-semibold">Estimasi 1RM</p>
                            <p className="text-sm font-extrabold text-emerald-800">{item.oneRepMaxEstimate} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {exerciseProgressTimeline.length > 1 && (
                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                    <TrendingUp size={14} className="text-emerald-600" />
                    Beban Anda untuk <strong>{selectedAnalysisExercise}</strong> meningkat dari {exerciseProgressTimeline[exerciseProgressTimeline.length - 1].weight} kg menjadi {exerciseProgressTimeline[0].weight} kg!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Mulai rekam detail latihan beban (set, reps, berat) di form pendaftaran latihan di atas untuk memvisualisasikan grafik perkembangan fisik Anda di sini!
            </div>
          )}
        </div>
      )}

    </div>
  );
}
