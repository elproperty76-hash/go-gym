import { GymClass, GymAnnouncement } from './types';

export const INITIAL_CLASSES: GymClass[] = [
  {
    id: 'c1',
    name: 'Yoga Relaksasi & Meditasi',
    instructor: 'Siti Rahma',
    room: 'Studio A (Zen)',
    day: 'Senin',
    time: '08:00 - 09:30',
    maxCapacity: 15,
    currentParticipants: 8,
    category: 'Yoga',
    description: 'Fokus pada teknik pernapasan, fleksibilitas tubuh, dan ketenangan pikiran. Cocok untuk semua tingkat kebugaran.',
    intensity: 'Ringan'
  },
  {
    id: 'c2',
    name: 'Zumba Cardio Party',
    instructor: 'Rian Wijaya',
    room: 'Studio B (Main)',
    day: 'Senin',
    time: '17:00 - 18:00',
    maxCapacity: 25,
    currentParticipants: 19,
    category: 'Zumba',
    description: 'Latihan kardio berbasis tarian dengan musik Latin dan internasional yang energik. Membakar kalori dengan menyenangkan!',
    intensity: 'Sedang'
  },
  {
    id: 'c3',
    name: 'HIIT Fat Burner',
    instructor: 'Coach Bimo',
    room: 'Area Fungsional',
    day: 'Selasa',
    time: '09:00 - 10:00',
    maxCapacity: 12,
    currentParticipants: 11,
    category: 'HIIT',
    description: 'High-Intensity Interval Training yang dirancang untuk memaksimalkan pembakaran lemak dalam waktu singkat.',
    intensity: 'Tinggi'
  },
  {
    id: 'c4',
    name: 'Power Strength Conditioning',
    instructor: 'Coach Deni',
    room: 'Area Beban Bebas',
    day: 'Rabu',
    time: '16:00 - 17:30',
    maxCapacity: 10,
    currentParticipants: 6,
    category: 'Strength',
    description: 'Latihan beban fokus pada teknik angkat beban yang benar (Squat, Bench Press, Deadlift) untuk memperkuat otot inti.',
    intensity: 'Tinggi'
  },
  {
    id: 'c5',
    name: 'Spinning Virtual Challenge',
    instructor: 'Amalia Rosa',
    room: 'Cycling Studio',
    day: 'Kamis',
    time: '18:30 - 19:30',
    maxCapacity: 20,
    currentParticipants: 14,
    category: 'Spinning',
    description: 'Simulasi bersepeda dengan intensitas tinggi, tanjakan, dan sprint yang diiringi ketukan musik yang memompa adrenalin.',
    intensity: 'Tinggi'
  },
  {
    id: 'c6',
    name: 'Pilates Core Alignment',
    instructor: 'Siti Rahma',
    room: 'Studio A (Zen)',
    day: 'Jumat',
    time: '07:30 - 08:30',
    maxCapacity: 15,
    currentParticipants: 12,
    category: 'Pilates',
    description: 'Fokus pada kekuatan otot perut, panggul, punggung bawah, serta peningkatan postur tubuh yang seimbang.',
    intensity: 'Sedang'
  },
  {
    id: 'c7',
    name: 'Zumba Weekend Blast',
    instructor: 'Rian Wijaya',
    room: 'Studio B (Main)',
    day: 'Sabtu',
    time: '10:00 - 11:30',
    maxCapacity: 30,
    currentParticipants: 22,
    category: 'Zumba',
    description: 'Sesi Zumba akhir pekan yang meriah untuk melepas penat dan mengisi ulang energi tubuh Anda.',
    intensity: 'Sedang'
  },
  {
    id: 'c8',
    name: 'Sunday Flow Yoga',
    instructor: 'Siti Rahma',
    room: 'Studio A (Zen)',
    day: 'Minggu',
    time: '09:00 - 10:30',
    maxCapacity: 15,
    currentParticipants: 5,
    category: 'Yoga',
    description: 'Mengalirkan gerakan yoga vinyasa yang dinamis untuk menyegarkan pikiran menjelang hari Senin.',
    intensity: 'Ringan'
  },
  {
    id: 'c9',
    name: 'HIIT Kettlebell Specialist',
    instructor: 'Coach Bimo',
    room: 'Area Fungsional',
    day: 'Rabu',
    time: '08:00 - 09:00',
    maxCapacity: 12,
    currentParticipants: 7,
    category: 'HIIT',
    description: 'Latihan fungsional menggunakan kettlebell untuk melatih kekuatan otot seluruh tubuh secara efisien.',
    intensity: 'Tinggi'
  },
  {
    id: 'c10',
    name: 'Intro to Weight Training',
    instructor: 'Coach Deni',
    room: 'Area Beban Bebas',
    day: 'Kamis',
    time: '10:00 - 11:30',
    maxCapacity: 10,
    currentParticipants: 4,
    category: 'Strength',
    description: 'Kelas khusus pemula yang ingin belajar cara menggunakan alat beban dan dumbell dengan postur yang aman.',
    intensity: 'Ringan'
  }
];

export const INITIAL_ANNOUNCEMENTS: GymAnnouncement[] = [
  {
    id: 'a1',
    title: 'Jam Operasional Selama Hari Libur Nasional',
    date: '18 Sep 2026',
    content: 'Pemberitahuan kepada seluruh member bahwa gym akan beroperasi setengah hari (06.00 - 12.00 WIB) pada hari libur nasional mendatang. Semua kelas reguler sore ditiadakan.',
    category: 'Operasional'
  },
  {
    id: 'a2',
    title: 'Kompetisi Internal Gym: Deadlift & Bench Challenge',
    date: '15 Sep 2026',
    content: 'Tunjukkan kekuatan Anda di kompetisi eksklusif member tanggal 5 Oktober 2026! Hadiah menarik berupa gratis membership 3 bulan dan merchandise official menanti pemenang kategori Putra/Putri.',
    category: 'Event'
  },
  {
    id: 'a3',
    title: 'Promo Spesial: Upgrade VIP Hanya Rp 150rb!',
    date: '10 Sep 2026',
    content: 'Upgrade keanggotaan Regular Anda ke VIP sekarang untuk menikmati akses sauna tanpa batas, loker prioritas, dan 2x sesi personal trainer gratis setiap bulan.',
    category: 'Promo'
  }
];
