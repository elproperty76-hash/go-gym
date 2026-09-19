import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Member, Booking, WorkoutSession } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Collection References
export const MEMBERS_COLLECTION = 'members';
export const BOOKINGS_COLLECTION = 'bookings';
export const SESSIONS_COLLECTION = 'sessions';

// Helper to normalize phone numbers (e.g. +62812, 0812, 62812 -> 0812...)
export function normalizePhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('62')) {
    return '0' + digits.slice(2);
  }
  return digits;
}

// Check if identifier is an email
export function isEmail(input: string): boolean {
  return input.includes('@') && input.includes('.');
}

// Member with password stored for login verification
export interface MemberAccount extends Member {
  passwordHash?: string;
  whatsapp?: string;
  authUid?: string;
}

// 1. Fetch all members from Firestore
export async function fetchMembersFromFirestore(): Promise<Member[]> {
  try {
    const querySnapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
    const members: Member[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const rawType = data.membershipType || 'Regular';
      const normType: 'Regular' | 'Premium' | 'VIP' = 
        rawType === 'VIP' ? 'VIP' : rawType === 'Premium' ? 'Premium' : 'Regular';

      const rawStatus = data.status || 'Active';
      const normStatus: 'Active' | 'Pending' | 'Expired' =
        rawStatus.toLowerCase() === 'expired' ? 'Expired' : rawStatus.toLowerCase() === 'pending' ? 'Pending' : 'Active';

      members.push({
        id: docSnap.id,
        fullName: data.fullName || 'Member',
        email: data.email || '',
        phone: data.phone || data.whatsapp || '',
        membershipType: normType,
        status: normStatus,
        joinedDate: data.joinedDate || new Date().toLocaleDateString('id-ID'),
        remainingSessions: typeof data.remainingSessions === 'number' ? data.remainingSessions : (normType === 'VIP' ? 999 : 12),
        attendedCount: Number(data.attendedCount) || 0,
        goal: data.goal || data.fitnessGoals || 'Meningkatkan Kebugaran & Stamina',
        height: Number(data.height) || 170,
        weight: Number(data.weight) || 68
      });
    });
    return members;
  } catch (error) {
    console.error('Error fetching members from Firestore:', error);
    return [];
  }
}

// 2. Save or update member to Firestore
export async function saveMemberToFirestore(member: Member, password?: string): Promise<void> {
  try {
    const memberDocRef = doc(db, MEMBERS_COLLECTION, member.id);
    const dataToSave: Record<string, any> = {
      fullName: member.fullName,
      email: member.email.trim().toLowerCase(),
      phone: member.phone.trim(),
      whatsapp: normalizePhoneNumber(member.phone),
      membershipType: member.membershipType,
      status: member.status,
      joinedDate: member.joinedDate,
      remainingSessions: member.remainingSessions,
      attendedCount: member.attendedCount || 0,
      goal: member.goal,
      height: member.height || 170,
      weight: member.weight || 68,
      updatedAt: new Date().toISOString()
    };
    if (password) {
      dataToSave.password = password;
    }
    await setDoc(memberDocRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving member to Firestore:', error);
    throw error;
  }
}

// 3. Delete member from Firestore
export async function deleteMemberFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MEMBERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting member from Firestore:', error);
    throw error;
  }
}

// 4. Authenticate member via Email OR WhatsApp number + Password
export async function loginMember(identifier: string, password: string): Promise<{ success: boolean; member?: Member; error?: string }> {
  const cleanId = identifier.trim();
  if (!cleanId || !password) {
    return { success: false, error: 'Email / Nomor WhatsApp dan Password harus diisi.' };
  }

  try {
    const membersRef = collection(db, MEMBERS_COLLECTION);
    let matchedDoc: any = null;

    if (isEmail(cleanId)) {
      // Query by email
      const q = query(membersRef, where('email', '==', cleanId.toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        matchedDoc = snap.docs[0];
      }
    } else {
      // Query by phone / whatsapp number
      const normPhone = normalizePhoneNumber(cleanId);
      const q1 = query(membersRef, where('whatsapp', '==', normPhone));
      const snap1 = await getDocs(q1);
      if (!snap1.empty) {
        matchedDoc = snap1.docs[0];
      } else {
        // Also check raw phone
        const q2 = query(membersRef, where('phone', '==', cleanId));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          matchedDoc = snap2.docs[0];
        }
      }
    }

    if (!matchedDoc) {
      // Also check if any doc matches in all members (fallback for existing seeded/offline members)
      const allDocs = await getDocs(membersRef);
      const normInput = normalizePhoneNumber(cleanId);
      for (const d of allDocs.docs) {
        const dData = d.data();
        const dEmail = (dData.email || '').toLowerCase();
        const dPhone = normalizePhoneNumber(dData.phone || dData.whatsapp || '');
        if (dEmail === cleanId.toLowerCase() || (normInput && dPhone === normInput)) {
          matchedDoc = d;
          break;
        }
      }
    }

    if (!matchedDoc) {
      return { success: false, error: 'Akun dengan Email atau No WhatsApp tersebut tidak ditemukan. Silakan lakukan pendaftaran baru.' };
    }

    const memberData = matchedDoc.data();
    // Validate password if stored, or allow login if member was created without password
    if (memberData.password && memberData.password !== password) {
      return { success: false, error: 'Kata sandi yang Anda masukkan salah.' };
    }

    const rawType = memberData.membershipType || 'Regular';
    const normType: 'Regular' | 'Premium' | 'VIP' = 
      rawType === 'VIP' ? 'VIP' : rawType === 'Premium' ? 'Premium' : 'Regular';

    const rawStatus = memberData.status || 'Active';
    const normStatus: 'Active' | 'Pending' | 'Expired' =
      rawStatus.toLowerCase() === 'expired' ? 'Expired' : rawStatus.toLowerCase() === 'pending' ? 'Pending' : 'Active';

    const member: Member = {
      id: matchedDoc.id,
      fullName: memberData.fullName || 'Member',
      email: memberData.email || cleanId,
      phone: memberData.phone || cleanId,
      membershipType: normType,
      status: normStatus,
      joinedDate: memberData.joinedDate || new Date().toLocaleDateString('id-ID'),
      remainingSessions: typeof memberData.remainingSessions === 'number' ? memberData.remainingSessions : (normType === 'VIP' ? 999 : 12),
      attendedCount: Number(memberData.attendedCount) || 0,
      goal: memberData.goal || memberData.fitnessGoals || 'Meningkatkan Kebugaran & Stamina',
      height: Number(memberData.height) || 170,
      weight: Number(memberData.weight) || 68
    };

    return { success: true, member };
  } catch (err: any) {
    console.error('Login error:', err);
    return { success: false, error: err.message || 'Terjadi kendala saat melakukan login ke database.' };
  }
}

// 5. Register new member with Email OR WhatsApp + Password
export async function registerNewMember(params: {
  fullName: string;
  identifier: string; // Email or Phone/WhatsApp
  password: string;
  phone?: string;
  email?: string;
  membershipType?: string;
  fitnessGoals?: string;
  height?: number;
  weight?: number;
}): Promise<{ success: boolean; member?: Member; error?: string }> {
  const { fullName, identifier, password, membershipType, fitnessGoals, height, weight } = params;

  if (!fullName.trim()) {
    return { success: false, error: 'Nama lengkap wajib diisi.' };
  }
  if (!identifier.trim()) {
    return { success: false, error: 'User Email atau Nomor WhatsApp wajib diisi.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password minimal 6 karakter demi keamanan akun Anda.' };
  }

  const cleanId = identifier.trim();
  const inputIsEmail = isEmail(cleanId);
  const resolvedEmail = inputIsEmail ? cleanId.toLowerCase() : (params.email?.trim().toLowerCase() || `${normalizePhoneNumber(cleanId)}@member.gogym.id`);
  const resolvedPhone = inputIsEmail ? (params.phone?.trim() || cleanId) : cleanId;
  const normPhone = normalizePhoneNumber(resolvedPhone);

  try {
    // Check if user already exists in Firestore
    const membersRef = collection(db, MEMBERS_COLLECTION);
    if (inputIsEmail) {
      const q = query(membersRef, where('email', '==', resolvedEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan menu Masuk.' };
      }
    } else {
      const q = query(membersRef, where('whatsapp', '==', normPhone));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: false, error: 'Nomor WhatsApp ini sudah terdaftar. Silakan gunakan menu Masuk.' };
      }
    }

    const memberId = 'M-' + Math.floor(1000 + Math.random() * 9000);
    const rawType = membershipType || 'Regular';
    const normType: 'Regular' | 'Premium' | 'VIP' = 
      rawType.includes('VIP') ? 'VIP' : rawType.includes('Premium') ? 'Premium' : 'Regular';

    const newMember: Member = {
      id: memberId,
      fullName: fullName.trim(),
      email: resolvedEmail,
      phone: resolvedPhone,
      membershipType: normType,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      remainingSessions: normType === 'VIP' ? 999 : 12,
      attendedCount: 0,
      goal: fitnessGoals || 'Meningkatkan Kebugaran & Stamina Tubuh',
      height: height || 170,
      weight: weight || 65
    };

    // Save to Firestore with password
    const memberDocRef = doc(db, MEMBERS_COLLECTION, memberId);
    await setDoc(memberDocRef, {
      id: memberId,
      fullName: newMember.fullName,
      email: resolvedEmail,
      phone: resolvedPhone,
      whatsapp: normPhone,
      password: password,
      membershipType: newMember.membershipType,
      status: newMember.status,
      joinedDate: newMember.joinedDate,
      remainingSessions: newMember.remainingSessions,
      attendedCount: 0,
      goal: newMember.goal,
      height: newMember.height,
      weight: newMember.weight,
      createdAt: new Date().toISOString()
    });

    // Also attempt Firebase Auth creation if email format is valid (best practice, non-blocking)
    try {
      await createUserWithEmailAndPassword(auth, resolvedEmail, password);
    } catch (authErr) {
      console.warn('Firebase Auth notice:', authErr);
    }

    return { success: true, member: newMember };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { success: false, error: err.message || 'Gagal menyimpan akun baru ke Firebase.' };
  }
}

// 6. Sync Bookings
export async function fetchMemberBookings(memberId: string): Promise<Booking[]> {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), where('memberId', '==', memberId));
    const snap = await getDocs(q);
    const bookings: Booking[] = [];
    snap.forEach((d) => {
      const data = d.data();
      bookings.push({
        id: d.id,
        memberId: data.memberId,
        classId: data.classId,
        bookingDate: data.bookingDate || data.date || new Date().toLocaleDateString('id-ID'),
        status: data.status === 'Cancelled' ? 'Cancelled' : data.status === 'Attended' ? 'Attended' : 'Confirmed'
      });
    });
    return bookings;
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

export async function saveBookingToFirestore(booking: Booking): Promise<void> {
  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), booking, { merge: true });
  } catch (err) {
    console.error('Error saving booking to Firestore:', err);
  }
}

export async function deleteBookingFromFirestore(bookingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
  } catch (err) {
    console.error('Error deleting booking from Firestore:', err);
  }
}

// 7. Sync Sessions
export async function fetchMemberSessions(memberId: string): Promise<WorkoutSession[]> {
  try {
    const q = query(collection(db, SESSIONS_COLLECTION), where('memberId', '==', memberId));
    const snap = await getDocs(q);
    const sessions: WorkoutSession[] = [];
    snap.forEach((d) => {
      const data = d.data();
      sessions.push({
        id: d.id,
        memberId: data.memberId,
        title: data.title || data.activity || 'Sesi Latihan',
        date: data.date || new Date().toLocaleDateString('id-ID'),
        duration: Number(data.duration) || Number(data.durationMinutes) || 45,
        caloriesBurned: Number(data.caloriesBurned) || 300,
        notes: data.notes || '',
        exercises: data.exercises || []
      });
    });
    return sessions;
  } catch (err) {
    console.error('Error fetching sessions:', err);
    return [];
  }
}

export async function saveSessionToFirestore(session: WorkoutSession): Promise<void> {
  try {
    await setDoc(doc(db, SESSIONS_COLLECTION, session.id), session, { merge: true });
  } catch (err) {
    console.error('Error saving session to Firestore:', err);
  }
}

export default app;
