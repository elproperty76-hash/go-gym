export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: 'Regular' | 'Premium' | 'VIP';
  status: 'Active' | 'Pending' | 'Expired';
  joinedDate: string;
  remainingSessions: number;
  attendedCount: number;
  goal: string;
  height?: number; // in cm
  weight?: number; // in kg
}

export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  room: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  time: string;
  maxCapacity: number;
  currentParticipants: number;
  category: 'Yoga' | 'Zumba' | 'HIIT' | 'Strength' | 'Spinning' | 'Pilates';
  description: string;
  intensity: 'Ringan' | 'Sedang' | 'Tinggi';
}

export interface Booking {
  id: string;
  memberId: string;
  classId: string;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled' | 'Attended';
}

export interface ExerciseLog {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg
}

export interface WorkoutSession {
  id: string;
  memberId: string;
  title: string;
  date: string;
  duration: number; // in minutes
  caloriesBurned: number;
  notes: string;
  exercises?: ExerciseLog[];
}

export interface GymNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'class_reminder' | 'workout_reminder' | 'announcement' | 'system';
  linkedId?: string; // Optional classId or workoutSessionId linked to the notification
}

export interface GymAnnouncement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'Umum' | 'Event' | 'Promo' | 'Operasional';
}

export interface MembershipPrice {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  benefits: string[];
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  experienceYears: number;
  isPersonalTrainer: boolean;
  avatarUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  uploadedAt: string;
}

export interface GymInformation {
  id: string;
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ExerciseMovement {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  setsReps: string;
  restTime: string;
  imageUrl: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  category: 'Pemula' | 'Hipertrofi (Massa Otot)' | 'Penurunan Lemak / Fat Loss' | 'Kekuatan (Strength)';
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  durationWeeks: number;
  daysPerWeek: number;
  description: string;
  bannerImage: string;
  benefits: string[];
  scheduleDay: string;
  exercises: ExerciseMovement[];
}
