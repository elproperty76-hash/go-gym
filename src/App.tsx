import React, { useState, useEffect } from 'react';
import { 
  Member, GymClass, Booking, WorkoutSession, GymAnnouncement, GymNotification, 
  MembershipPrice, Instructor, GalleryItem, GymInformation 
} from './types';
import { INITIAL_CLASSES, INITIAL_ANNOUNCEMENTS } from './data';
import RegistrationForm from './components/RegistrationForm';
import MemberAuthModal from './components/MemberAuthModal';
import InteractiveCalendar from './components/InteractiveCalendar';
import MemberProfile from './components/MemberProfile';
import GymCheckIn from './components/GymCheckIn';
import WorkoutLogger from './components/WorkoutLogger';
import { WorkoutProgramsView } from './components/WorkoutProgramsView';
import NotificationCenter from './components/NotificationCenter';
import AdminPanel from './components/AdminPanel';
import { 
  Dumbbell, LogOut, Bell, Flame, HelpCircle, Activity, 
  LayoutDashboard, Calendar, FileText, CheckCircle2, Shield,
  LogIn, UserPlus, Users, Sparkles, BookOpen, Dumbbell as WorkoutIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  fetchMembersFromFirestore, 
  saveMemberToFirestore, 
  deleteMemberFromFirestore,
  fetchMemberBookings,
  saveBookingToFirestore,
  deleteBookingFromFirestore,
  fetchMemberSessions,
  saveSessionToFirestore
} from './lib/firebase';

const INITIAL_PRICES: MembershipPrice[] = [
  { 
    id: 'p1', 
    name: 'Iuran Bulanan', 
    price: 150000, 
    durationMonths: 1, 
    benefits: [
      'Akses Penuh Seluruh Fasilitas Gym',
      'Akses Area Beban Bebas & Mesin Latihan',
      'Loker & Ruang Ganti Bersih',
      'Bebas Latihan Setiap Hari Jam Operasional',
      'Konsultasi Penggunaan Alat Dasar'
    ] 
  }
];

const INITIAL_INSTRUCTORS: Instructor[] = [
  { id: 'i1', name: 'Siti Rahma', specialty: 'Yoga & Pilates', phone: '081299998888', experienceYears: 5, isPersonalTrainer: true, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60' },
  { id: 'i2', name: 'Rian Wijaya', specialty: 'Zumba & Cardio', phone: '081277776666', experienceYears: 4, isPersonalTrainer: false, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60' },
  { id: 'i3', name: 'Coach Bimo', specialty: 'HIIT & Conditioning', phone: '081255554444', experienceYears: 6, isPersonalTrainer: true, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60' },
  { id: 'i4', name: 'Coach Deni', specialty: 'Powerlifting & Strength', phone: '081233332222', experienceYears: 8, isPersonalTrainer: true, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60' }
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Area Beban Bebas', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=60', description: 'Dilengkapi dumbel premium, power rack, dan barbel bersertifikasi.', uploadedAt: '12 September 2026' },
  { id: 'g2', title: 'Studio Yoga Zen', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=60', description: 'Ruangan tenang berpemanas dengan aroma terapi khusus meditasi.', uploadedAt: '14 September 2026' },
  { id: 'g3', title: 'Cycling Studio', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=60', description: 'Dilengkapi sepeda magnetik dengan visual rute virtual interaktif.', uploadedAt: '18 September 2026' }
];

const INITIAL_INFORMATIONS: GymInformation[] = [
  { id: 'inf1', key: 'operasional', title: 'Jam Operasional Go Gym', content: 'Senin - Minggu: 06:00 - 22:00 WIB (Hari Libur Nasional tetap buka kecuali Hari Raya Keagamaan).', updatedAt: '19 September 2026' },
  { id: 'inf2', key: 'aturan', title: 'Tata Tertib Anggota', content: 'Wajib menggunakan sepatu olahraga bersih, membawa handuk pribadi, dan mengembalikan beban ke rak setelah digunakan demi kenyamanan bersama.', updatedAt: '19 September 2026' },
  { id: 'inf3', key: 'kontak', title: 'Lokasi & Layanan Anggota', content: 'Ruko Grand Wijaya, Blok C-12, Kebayoran Baru, Jakarta Selatan. WhatsApp CS: 0812-3456-7890 (Layanan aktif pukul 08:00 - 20:00 WIB).', updatedAt: '19 September 2026' }
];

const DEFAULT_MEMBERS: Member[] = [
  { id: 'M-1022', fullName: 'Andi Perkasa', email: 'andi.perkasa@gmail.com', phone: '081288339900', membershipType: 'VIP' as any, status: 'Active', joinedDate: '15 Agustus 2026', remainingSessions: 42, attendedCount: 3, goal: 'Pembentukan Otot', height: 175, weight: 74 },
  { id: 'M-2294', fullName: 'Siti Aminah', email: 'siti.aminah@yahoo.com', phone: '081199334455', membershipType: 'Premium' as any, status: 'Active', joinedDate: '01 September 2026', remainingSessions: 22, attendedCount: 2, goal: 'Penurunan Berat Badan', height: 162, weight: 58 },
  { id: 'M-4810', fullName: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '085611223344', membershipType: 'Regular' as any, status: 'Active', joinedDate: '10 September 2026', remainingSessions: 10, attendedCount: 2, goal: 'Kebugaran Umum', height: 168, weight: 70 },
  { id: 'M-6791', fullName: 'Fanny Lestari', email: 'fanny.l@gmail.com', phone: '081399881122', membershipType: 'Premium' as any, status: 'Expired', joinedDate: '10 Juni 2026', remainingSessions: 0, attendedCount: 24, goal: 'Fleksibilitas & Postur', height: 165, weight: 53 }
];

const INITIAL_NOTIFICATIONS: GymNotification[] = [
  {
    id: 'n-init-1',
    title: 'Selamat Bergabung di Go Gym!',
    message: 'Gunakan tab "Jadwal Kelas" di atas untuk mendaftarkan diri pada kelas harian seperti Yoga, Zumba, atau HIIT.',
    timestamp: 'Baru saja',
    isRead: false,
    type: 'system'
  },
  {
    id: 'n-init-2',
    title: 'INFO: Renovasi Loker Lantai 2',
    message: 'Area loker pria lantai 2 sedang direnovasi untuk penambahan sauna baru. Loker alternatif tersedia di lantai 1.',
    timestamp: '2 jam yang lalu',
    isRead: true,
    type: 'announcement'
  }
];

export default function App() {
  const [member, setMember] = useState<Member | null>(null);
  const [classes, setClasses] = useState<GymClass[]>(INITIAL_CLASSES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [announcements] = useState<GymAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<GymNotification[]>(INITIAL_NOTIFICATIONS);
  
  // Admin-managed collections states
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [membershipPrices, setMembershipPrices] = useState<MembershipPrice[]>(INITIAL_PRICES);
  const [instructors, setInstructors] = useState<Instructor[]>(INITIAL_INSTRUCTORS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [informations, setInformations] = useState<GymInformation[]>(INITIAL_INFORMATIONS);
  const [isAdminView, setIsAdminView] = useState(false);

  // Dashboard Navigation tabs
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'classes' | 'workouts' | 'programs'>('home');
  const [showAnnouncements, setShowAnnouncements] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Load state from localStorage on initialization and sync with Firebase
  useEffect(() => {
    const savedMember = localStorage.getItem('gym_member');
    const savedBookings = localStorage.getItem('gym_bookings');
    const savedSessions = localStorage.getItem('gym_sessions');
    const savedClasses = localStorage.getItem('gym_classes');
    const savedNotifications = localStorage.getItem('gym_notifications');
    
    // Admin loaded states
    const savedMembers = localStorage.getItem('gogym_members');
    const savedPrices = localStorage.getItem('gogym_prices');
    const savedInstructors = localStorage.getItem('gogym_instructors');
    const savedGallery = localStorage.getItem('gogym_gallery');
    const savedInformations = localStorage.getItem('gogym_informations');

    if (savedMember) {
      setMember(JSON.parse(savedMember));
    }
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    if (savedPrices) {
      try {
        const parsedPrices: MembershipPrice[] = JSON.parse(savedPrices);
        // If saved prices still contains the old multi-tier packages (Regular, Premium, VIP), update to current Iuran Bulanan 150rb
        if (parsedPrices.some(p => p.name === 'Regular' || p.name === 'VIP' || p.name === 'Premium')) {
          setMembershipPrices(INITIAL_PRICES);
          localStorage.setItem('gogym_prices', JSON.stringify(INITIAL_PRICES));
        } else {
          setMembershipPrices(parsedPrices);
        }
      } catch (e) {
        setMembershipPrices(INITIAL_PRICES);
      }
    } else {
      localStorage.setItem('gogym_prices', JSON.stringify(INITIAL_PRICES));
    }
    if (savedInstructors) {
      setInstructors(JSON.parse(savedInstructors));
    }
    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    }
    if (savedInformations) {
      setInformations(JSON.parse(savedInformations));
    }

    // Connect to Firebase Firestore to retrieve real multi-user members
    fetchMembersFromFirestore()
      .then((fbMembers) => {
        if (fbMembers && fbMembers.length > 0) {
          setMembers(fbMembers);
          localStorage.setItem('gogym_members', JSON.stringify(fbMembers));
        } else {
          // Seed default members to Firestore if database is initially empty
          DEFAULT_MEMBERS.forEach((m) => {
            saveMemberToFirestore(m).catch(console.error);
          });
        }
      })
      .catch((err) => {
        console.warn('Firebase sync notice:', err);
      });
  }, []);

  // Sync state helpers
  const saveMember = (newMember: Member | null) => {
    setMember(newMember);
    if (newMember) {
      localStorage.setItem('gym_member', JSON.stringify(newMember));
      saveMemberToFirestore(newMember).catch(console.error);
    } else {
      localStorage.removeItem('gym_member');
    }
  };

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('gogym_members', JSON.stringify(newMembers));
  };

  const savePrices = (newPrices: MembershipPrice[]) => {
    setMembershipPrices(newPrices);
    localStorage.setItem('gogym_prices', JSON.stringify(newPrices));
  };

  const saveInstructors = (newInstructors: Instructor[]) => {
    setInstructors(newInstructors);
    localStorage.setItem('gogym_instructors', JSON.stringify(newInstructors));
  };

  const saveGallery = (newGallery: GalleryItem[]) => {
    setGalleryItems(newGallery);
    localStorage.setItem('gogym_gallery', JSON.stringify(newGallery));
  };

  const saveInformations = (newInfos: GymInformation[]) => {
    setInformations(newInfos);
    localStorage.setItem('gogym_informations', JSON.stringify(newInfos));
  };

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('gym_bookings', JSON.stringify(newBookings));
  };

  const saveSessions = (newSessions: WorkoutSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('gym_sessions', JSON.stringify(newSessions));
  };

  const saveClasses = (newClasses: GymClass[]) => {
    setClasses(newClasses);
    localStorage.setItem('gym_classes', JSON.stringify(newClasses));
  };

  const saveNotifications = (newNotifs: GymNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('gym_notifications', JSON.stringify(newNotifs));
  };

  // Explicit delete handlers for admin panel integration
  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    saveMembers(updated);
    deleteMemberFromFirestore(id).catch(console.error);
    if (member?.id === id) {
      saveMember(null);
    }
  };

  const handleDeletePrice = (id: string) => {
    const updated = membershipPrices.filter(p => p.id !== id);
    savePrices(updated);
  };

  const handleDeleteInstructor = (id: string) => {
    const updated = instructors.filter(i => i.id !== id);
    saveInstructors(updated);
  };

  const handleDeleteGallery = (id: string) => {
    const updated = galleryItems.filter(g => g.id !== id);
    saveGallery(updated);
  };

  const handleDeleteInfo = (id: string) => {
    const updated = informations.filter(inf => inf.id !== id);
    saveInformations(updated);
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter(c => c.id !== id);
    saveClasses(updated);
  };

  // Push notification helper
  const triggerNotification = (title: string, message: string, type: GymNotification['type']) => {
    const newNotif: GymNotification = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      isRead: false,
      type
    };
    saveNotifications([newNotif, ...notifications]);
  };

  // Actions
  const handleAuthSuccess = async (authenticatedMember: Member) => {
    localStorage.removeItem('gym_is_demo');
    saveMember(authenticatedMember);
    // Add to member repository if not exists
    if (!members.some(m => m.id === authenticatedMember.id)) {
      saveMembers([authenticatedMember, ...members]);
    }

    // Load any existing bookings & sessions for this member from Firestore
    try {
      const userBookings = await fetchMemberBookings(authenticatedMember.id);
      if (userBookings && userBookings.length > 0) {
        saveBookings(userBookings);
      }
      const userSessions = await fetchMemberSessions(authenticatedMember.id);
      if (userSessions && userSessions.length > 0) {
        saveSessions(userSessions);
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }

    // Welcome Notification
    const welcomeNotifs = [
      {
        id: `n-${Date.now()}-1`,
        title: `Selamat Datang, ${authenticatedMember.fullName}! 🎉`,
        message: `Akun keanggotaan ${authenticatedMember.membershipType} Anda aktif. Kuota sesi Anda: ${authenticatedMember.remainingSessions} sesi. Data tersimpan di Cloud Firebase.`,
        timestamp: 'Baru saja',
        isRead: false,
        type: 'system' as const
      },
      ...notifications
    ];
    saveNotifications(welcomeNotifs);
  };

  const handleRegister = (newMember: Member) => {
    handleAuthSuccess(newMember);
  };

  const handleInstantDemo = () => {
    localStorage.setItem('gym_is_demo', 'true');
    const demoMember: Member = {
      id: 'M-7790',
      fullName: 'Rizky Pratama',
      email: 'rizky.pratama@gmail.com',
      phone: '081288991122',
      membershipType: 'Premium',
      status: 'Active',
      joinedDate: '10 Agustus 2026',
      remainingSessions: 18,
      attendedCount: 6,
      goal: 'Muscle Build',
      height: 175,
      weight: 72
    };

    saveMember(demoMember);
    
    // Save to admin member repository if not exists
    if (!members.some(m => m.id === demoMember.id)) {
      saveMembers([demoMember, ...members]);
    }

    // Seed some initial bookings and custom sessions for demo experience
    const demoBookings: Booking[] = [
      {
        id: 'b-demo-1',
        memberId: demoMember.id,
        classId: 'c2', // Monday Zumba
        bookingDate: '18 Sep 2026',
        status: 'Confirmed'
      },
      {
        id: 'b-demo-2',
        memberId: demoMember.id,
        classId: 'c4', // Wednesday Power Strength
        bookingDate: '19 Sep 2026',
        status: 'Confirmed'
      }
    ];
    saveBookings(demoBookings);

    const demoSessions: WorkoutSession[] = [
      {
        id: 'ws-demo-1',
        memberId: demoMember.id,
        title: 'Treadmill Speed Interval',
        date: '17 Sep 2026',
        duration: 45,
        caloriesBurned: 350,
        notes: 'Incline 2.5, Speed 8.0km/h selama 30 mnt, cooling down 15 mnt.',
        exercises: [
          { id: 'ex-d1', name: 'Treadmill Sprints', sets: 5, reps: 1, weight: 0 }
        ]
      },
      {
        id: 'ws-demo-2',
        memberId: demoMember.id,
        title: 'Bicep & Shoulder Press',
        date: '15 Sep 2026',
        duration: 50,
        caloriesBurned: 220,
        notes: 'Dumbbell bicep curls 3 set x 12 reps, lateral raises 4 set x 10 reps.',
        exercises: [
          { id: 'ex-d2', name: 'Barbell Bicep Curl', sets: 3, reps: 12, weight: 15 },
          { id: 'ex-d3', name: 'Dumbbell Shoulder Press', sets: 4, reps: 10, weight: 12 }
        ]
      }
    ];
    saveSessions(demoSessions);

    // Sync class capacities for seed classes
    const updatedClasses = classes.map(c => {
      if (c.id === 'c2' || c.id === 'c4') {
        return { ...c, currentParticipants: Math.min(c.maxCapacity, c.currentParticipants + 1) };
      }
      return c;
    });
    saveClasses(updatedClasses);

    // Seed demo notifications
    const demoNotifs: GymNotification[] = [
      {
        id: 'n-demo-1',
        title: 'Reminder: Kelas Zumba Party Sore Ini',
        message: 'Pengingat kelas: Zumba Party Anda terjadwal pukul 17:00 WIB di Studio B. Siapkan air minum Anda!',
        timestamp: '30 menit yang lalu',
        isRead: false,
        type: 'class_reminder'
      },
      {
        id: 'n-demo-2',
        title: 'Latihan Sukses Tercatat',
        message: 'Statistik kalori "Treadmill Speed Interval" Anda telah ditambahkan ke dashboard kemajuan.',
        timestamp: 'Kemarin',
        isRead: true,
        type: 'workout_reminder'
      },
      ...INITIAL_NOTIFICATIONS
    ];
    saveNotifications(demoNotifs);
  };

  const handleBookClass = (classId: string) => {
    if (!member) return;

    // Check duplicate booking
    if (bookings.some(b => b.classId === classId)) {
      alert('Anda sudah mendaftar kelas ini!');
      return;
    }

    const gymClass = classes.find(c => c.id === classId);
    if (!gymClass) return;

    if (gymClass.currentParticipants >= gymClass.maxCapacity) {
      alert('Maaf, kuota kelas ini sudah penuh!');
      return;
    }

    // Check remaining sessions for non-VIP
    if (member.membershipType !== 'VIP' && member.remainingSessions <= 0) {
      alert('Sesi membership Anda tidak mencukupi untuk memesan kelas baru. Silakan lakukan Check-In di resepsionis.');
      return;
    }

    const newBooking: Booking = {
      id: 'B-' + Math.floor(1000 + Math.random() * 9000),
      memberId: member.id,
      classId: classId,
      bookingDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Confirmed'
    };

    saveBookings([...bookings, newBooking]);
    saveBookingToFirestore(newBooking).catch(console.error);

    // Update class participants count
    const updatedClasses = classes.map(c => {
      if (c.id === classId) {
        return { ...c, currentParticipants: c.currentParticipants + 1 };
      }
      return c;
    });
    saveClasses(updatedClasses);

    // Trigger Success Notification & Reminder Alert
    triggerNotification(
      'Pendaftaran Kelas Berhasil 🎉',
      `Anda telah mendaftar di kelas "${gymClass.name}" hari ${gymClass.day} jam ${gymClass.time}.`,
      'class_reminder'
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const gymClass = classes.find(c => c.id === booking.classId);

    const newBookings = bookings.filter(b => b.id !== bookingId);
    saveBookings(newBookings);
    deleteBookingFromFirestore(bookingId).catch(console.error);

    // Update class participants count
    const updatedClasses = classes.map(c => {
      if (c.id === booking.classId) {
        return { ...c, currentParticipants: Math.max(0, c.currentParticipants - 1) };
      }
      return c;
    });
    saveClasses(updatedClasses);

    if (gymClass) {
      triggerNotification(
        'Pembatalan Kelas Berhasil',
        `Pendaftaran Anda di kelas "${gymClass.name}" telah dibatalkan secara praktis.`,
        'system'
      );
    }
  };

  const handleCheckIn = () => {
    if (!member) return;

    const updatedMember = {
      ...member,
      remainingSessions: member.membershipType === 'VIP' ? member.remainingSessions : Math.max(0, member.remainingSessions - 1),
      attendedCount: member.attendedCount + 1
    };
    saveMember(updatedMember);

    // Notification
    triggerNotification(
      'Check-In Sukses Masuk Gym 📲',
      `Gerbang 01 terbuka. Selamat latihan! Kuota tersisa Anda: ${updatedMember.membershipType === 'VIP' ? 'Unlimited' : updatedMember.remainingSessions + ' sesi'}.`,
      'workout_reminder'
    );
  };

  const handleAddSession = (sessionData: Omit<WorkoutSession, 'id' | 'memberId'>) => {
    if (!member) return;

    const newSession: WorkoutSession = {
      id: 'WS-' + Math.floor(1000 + Math.random() * 9000),
      memberId: member.id,
      ...sessionData
    };

    saveSessions([newSession, ...sessions]);
    saveSessionToFirestore(newSession).catch(console.error);

    // Push motivational notification
    triggerNotification(
      'Aktivitas Latihan Tersimpan 💪',
      `Hebat! Anda merekam "${newSession.title}" dengan membakar ${newSession.caloriesBurned} Kcal. Kemajuan Anda dianalisis.`,
      'workout_reminder'
    );
  };

  const handleUpdatePhysicals = (height: number, weight: number, goal: string) => {
    if (!member) return;

    const updatedMember = {
      ...member,
      height,
      weight,
      goal
    };
    saveMember(updatedMember);

    triggerNotification(
      'Komposisi Fisik Diperbarui ⚖️',
      `Data berat (${weight} kg) dan tinggi (${height} cm) Anda diperbarui. Analisis BMI disinkronisasi.`,
      'system'
    );
  };

  // Notification Operations
  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const handleClearNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleSimulateNotification = () => {
    const sampleReminders = [
      {
        title: '⚠️ Pengingat Kelas 30 Menit Lagi',
        message: 'Kelas "Power Strength Conditioning" bersama Coach Deni akan dimulai dalam 30 menit di Area Beban Bebas. Harap segera datang tepat waktu.',
        type: 'class_reminder' as const
      },
      {
        title: '🔥 Target Latihan Anda Hari Ini',
        message: 'Pengingat rutin: Jadwal latihan mandiri "Muscle Build" Anda menunggu. Raih target repetisi terbaik Anda hari ini!',
        type: 'workout_reminder' as const
      },
      {
        title: '📢 Event Gym Akhir Pekan',
        message: 'Jangan lewatkan kompetisi internal "Deadlift & Bench Challenge" tanggal 5 Oktober. Pendaftaran dibuka di meja depan.',
        type: 'announcement' as const
      }
    ];

    const randomPick = sampleReminders[Math.floor(Math.random() * sampleReminders.length)];
    triggerNotification(randomPick.title, randomPick.message, randomPick.type);
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    const isDemo = member?.id === 'M-7790' || localStorage.getItem('gym_is_demo') === 'true';
    if (isDemo) {
      // Non member demo: reset everything
      localStorage.removeItem('gym_member');
      localStorage.removeItem('gym_bookings');
      localStorage.removeItem('gym_sessions');
      localStorage.removeItem('gym_is_demo');
      setBookings([]);
      setSessions([]);
    } else {
      // Member logout: DO NOT RESET bookings and sessions, preserve member data!
      localStorage.removeItem('gym_member');
      localStorage.removeItem('gym_is_demo');
    }
    setMember(null);
    setActiveNavTab('home');
    setIsLogoutConfirmOpen(false);
  };

  if (isAdminView) {
    return (
      <AdminPanel
        members={members}
        onUpdateMembers={saveMembers}
        onDeleteMember={handleDeleteMember}
        classes={classes}
        onUpdateClasses={saveClasses}
        onDeleteClass={handleDeleteClass}
        membershipPrices={membershipPrices}
        onUpdatePrices={savePrices}
        onDeletePrice={handleDeletePrice}
        instructors={instructors}
        onUpdateInstructors={saveInstructors}
        onDeleteInstructor={handleDeleteInstructor}
        galleryItems={galleryItems}
        onUpdateGallery={saveGallery}
        onDeleteGallery={handleDeleteGallery}
        informations={informations}
        onUpdateInformations={saveInformations}
        onDeleteInfo={handleDeleteInfo}
        onBackToApp={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* App Header Navigation bar */}
      <header id="app-header" className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Dumbbell size={22} className="text-white transform -rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-military text-emerald-300">Go Gym</h1>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wide">Bumi Pesona Asri A3 No.9 Rancaekek-Bandung</p>
            </div>
          </div>

          {member ? (
            <div className="flex items-center gap-2.5">
              {/* Notification Center Trigger and Dropdown Portal */}
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearNotification={handleClearNotification}
                onSimulateNotification={handleSimulateNotification}
              />

              <div className="hidden sm:flex flex-col text-right px-2">
                <span className="text-xs font-semibold text-slate-100">{member.fullName}</span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{member.membershipType} Member</span>
              </div>
              
              <button
                onClick={handleLogout}
                title="Log Out Akun"
                className="p-2.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-xl border border-slate-700/60 hover:border-red-900/50 transition-all cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {!member ? (
          /* REGISTRATION / WELCOME SCREEN - LOGIN MEMBER AS PRIMARY ACTION */
          <div className="space-y-10 py-4 animate-fade-in">
            {/* Main Hero Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden border border-slate-800">
              <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold tracking-wide">
                  <Sparkles size={14} /> Official Fitness Management
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Wujudkan Tubuh Bugar & Sehat Bersama <span className="text-emerald-400">Go Gym</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Kelola keanggotaan kebugaran Anda, reservasi kelas harian (Yoga, Zumba, HIIT), dan catat progres beban angkatan serta evaluasi fisik harian secara praktis dan terstruktur.
                </p>

                {/* Primary Action Buttons: Login Member & Non Member */}
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn size={18} /> Login Member
                  </button>
                  <button
                    onClick={handleInstantDemo}
                    className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Users size={18} className="text-slate-400" /> Non Member
                  </button>
                </div>
              </div>
            </div>

            {/* Fitur Utama Gym Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Jadwal Kelas Eksklusif</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Akses beragam jadwal kelas olahraga seperti HIIT, Zumba, Power Yoga, dan Cycling dipandu instruktur berpengalaman.
                  </p>
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-50/60 px-3 py-2 rounded-xl text-center">
                  Tersedia untuk Seluruh Member
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Pelacakan Kemajuan Beban</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Catat riwayat angkatan beban, repetisi set harian, kalori terbakar, dan pantau indeks massa tubuh secara teratur.
                  </p>
                </div>
                <div className="text-xs font-semibold text-purple-600 bg-purple-50/60 px-3 py-2 rounded-xl text-center">
                  Log Evaluasi Latihan Otomatis
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Program & Petunjuk Gerakan</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Panduan latihan lengkap (Pemula, Hipertrofi, Fat Loss, Strength) dengan foto ilustrasi gerakan, instruksi step-by-step, dan tips aman.
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleInstantDemo();
                    setActiveNavTab('programs');
                  }}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl text-center transition-all cursor-pointer"
                >
                  Lihat Program Latihan →
                </button>
              </div>
            </div>

            {/* Informasi Iuran Bulanan Gym */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Biaya Iuran Keanggotaan Member Go Gym</h3>
                  <p className="text-xs text-slate-500">Iuran bulanan terjangkau dengan akses penuh fasilitas gym setiap hari.</p>
                </div>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <UserPlus size={14} /> Daftar Member
                </button>
              </div>

              <div className="max-w-xl mx-auto w-full">
                {membershipPrices.map((pkg) => (
                  <div key={pkg.id} className="border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/50 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                      Iuran Bulanan
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xl">{pkg.name}</span>
                        <p className="text-xs text-slate-500 mt-0.5">Berlaku selama {pkg.durationMonths} bulan penuh tanpa biaya tersembunyi.</p>
                      </div>

                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-sm text-slate-500 font-semibold"> / bulan</span>
                      </div>

                      <div className="border-t border-slate-200/80 pt-4 space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Fasilitas yang Didapatkan:</p>
                        <ul className="text-xs text-slate-600 space-y-2">
                          {pkg.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                              <span className="font-medium">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} /> Daftar & Mulai Latihan (Rp 150.000 / bln)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED MEMBER DASHBOARD */
          <div className="space-y-8 animate-fade-in">
            
            {/* Real-time Toast Announcements Banner */}
            {showAnnouncements && (
              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-5 shadow-xs relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                    <Bell size={18} className="text-emerald-600 animate-bounce" />
                    <span>Papan Pengumuman & Pengingat Penting Gym</span>
                  </div>
                  <button
                    onClick={() => setShowAnnouncements(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white border border-slate-200/50 p-4 rounded-xl space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{ann.date}</span>
                        <span className="font-semibold text-emerald-600 uppercase">{ann.category}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs line-clamp-1">{ann.title}</h5>
                      <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dashboard Tabs & Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const isDemoUser = member?.id === 'M-7790' || localStorage.getItem('gym_is_demo') === 'true';
                  return (
                    <>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {isDemoUser ? 'Dashboard Non Member' : 'Dashboard Anggota'}
                      </h2>
                      {!isDemoUser && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full uppercase">
                          Aktif
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Navigation Menu (Single view modular layout) */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 max-w-max self-start sm:self-auto relative">
                <button
                  onClick={() => setActiveNavTab('home')}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer z-10 ${
                    activeNavTab === 'home'
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeNavTab === 'home' && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <LayoutDashboard size={14} /> Beranda & Profil
                </button>
                <button
                  onClick={() => setActiveNavTab('classes')}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer z-10 ${
                    activeNavTab === 'classes'
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeNavTab === 'classes' && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Calendar size={14} /> Kalender Kelas
                </button>
                <button
                  onClick={() => setActiveNavTab('workouts')}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer z-10 ${
                    activeNavTab === 'workouts'
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeNavTab === 'workouts' && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <FileText size={14} /> Pelacakan Latihan
                </button>
                <button
                  onClick={() => setActiveNavTab('programs')}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer z-10 ${
                    activeNavTab === 'programs'
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeNavTab === 'programs' && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <BookOpen size={14} /> Program Latihan
                </button>
              </div>
            </div>

            {/* Dynamic View Loader */}
            <div id="dynamic-dashboard-content" className="relative overflow-hidden min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNavTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="space-y-8"
                >
                  {activeNavTab === 'home' && (
                    <div className="space-y-8">
                      {/* Member Profile Stats Summary */}
                      <MemberProfile member={member} onUpdatePhysicals={handleUpdatePhysicals} />

                      {/* Entrance Check-in Barcode Simulation */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Akses Pintu Masuk Resepsionis</h3>
                        <GymCheckIn member={member} onCheckIn={handleCheckIn} />
                      </div>

                      {/* Upcoming Class Schedule Widget */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">Kelas Terdaftar Terdekat</h3>
                          <button
                            onClick={() => {
                              setActiveNavTab('classes');
                            }}
                            className="text-emerald-600 hover:text-emerald-700 text-xs font-bold underline cursor-pointer"
                          >
                            Buka Kalender Kelas ({bookings.length})
                          </button>
                        </div>

                        {bookings.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bookings.slice(0, 2).map((b) => {
                              const c = classes.find(item => item.id === b.classId);
                              if (!c) return null;
                              return (
                                <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                                  <div>
                                    <h5 className="font-bold text-slate-800 text-sm">{c.name}</h5>
                                    <p className="text-slate-500 text-xs mt-0.5">{c.day} • {c.time} • {c.room}</p>
                                  </div>
                                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded-md">
                                    Terdaftar
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                            Anda belum mendaftar kelas apa pun minggu ini. 
                            <button onClick={() => { setActiveNavTab('classes'); }} className="text-emerald-600 font-semibold ml-1 underline cursor-pointer">
                              Buka Kalender Kelas
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeNavTab === 'classes' && (
                    <InteractiveCalendar
                      classes={classes}
                      bookings={bookings}
                      onBookClass={handleBookClass}
                      onCancelBooking={handleCancelBooking}
                    />
                  )}

                  {activeNavTab === 'workouts' && (
                    <WorkoutLogger
                      sessions={sessions}
                      onAddSession={handleAddSession}
                    />
                  )}

                  {activeNavTab === 'programs' && (
                    <WorkoutProgramsView />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer id="app-footer" className="bg-slate-900 border-t border-slate-800 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Dumbbell size={16} className="text-emerald-500" />
            <span className="font-bold text-slate-200">Go Gym</span>
            <span className="text-slate-600">|</span>
            <span>Aplikasi Manajemen Gym Praktis v1.1</span>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => setIsAdminView(true)}
              className="text-emerald-500 hover:text-emerald-400 font-semibold cursor-pointer hover:underline underline-offset-4 decoration-emerald-500/30"
            >
              Akses Admin
            </button>
          </div>
          <p className="text-slate-500">
            &copy; 2026 Go Gym Inc. Semua Hak Dilindungi. Menghubungkan Anda ke kebugaran fisik harian.
          </p>
        </div>
      </footer>

      {/* Custom Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4 z-10"
            >
              {(() => {
                const isDemoUser = member?.id === 'M-7790' || localStorage.getItem('gym_is_demo') === 'true';
                return (
                  <>
                    <div className="text-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${isDemoUser ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <LogOut size={22} />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Keluar</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {isDemoUser 
                          ? 'Apakah Anda yakin ingin keluar? Seluruh riwayat latihan dan jadwal kelas non-member akan diatur ulang (Reset).'
                          : 'Apakah Anda yakin ingin keluar? Data akun, riwayat latihan, dan jadwal kelas Anda tetap tersimpan aman dan tidak akan direset.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsLogoutConfirmOpen(false)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={confirmLogout}
                        className={`w-full py-2 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center shadow-xs ${
                          isDemoUser ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {isDemoUser ? 'Keluar & Reset' : 'Keluar (Data Tersimpan)'}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-User Firebase Auth Modal (Login & Daftar Baru) */}
      <MemberAuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authed) => {
          handleAuthSuccess(authed);
          setIsAuthModalOpen(false);
        }}
        onNonMemberDemo={() => {
          setIsAuthModalOpen(false);
          handleInstantDemo();
        }}
        membershipPrices={membershipPrices}
      />

    </div>
  );
}
