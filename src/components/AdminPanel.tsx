import React, { useState, useEffect } from 'react';
import { Member, GymClass, MembershipPrice, Instructor, GalleryItem, GymInformation } from '../types';
import { 
  Shield, Lock, User, LogOut, Download, Trash2, Edit, Plus, Save, X, Check,
  Users, Award, Image, Info, DollarSign, FileSpreadsheet, FileText, PlusCircle,
  Clock, ShieldAlert, CheckCircle, UserPlus, Phone, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  members: Member[];
  onUpdateMembers: (updatedMembers: Member[]) => void;
  onDeleteMember?: (id: string) => void;
  classes: GymClass[];
  onUpdateClasses: (updatedClasses: GymClass[]) => void;
  onDeleteClass?: (id: string) => void;
  membershipPrices: MembershipPrice[];
  onUpdatePrices: (prices: MembershipPrice[]) => void;
  onDeletePrice?: (id: string) => void;
  instructors: Instructor[];
  onUpdateInstructors: (instructors: Instructor[]) => void;
  onDeleteInstructor?: (id: string) => void;
  galleryItems: GalleryItem[];
  onUpdateGallery: (items: GalleryItem[]) => void;
  onDeleteGallery?: (id: string) => void;
  informations: GymInformation[];
  onUpdateInformations: (infos: GymInformation[]) => void;
  onDeleteInfo?: (id: string) => void;
  onBackToApp: () => void;
}

export default function AdminPanel({
  members,
  onUpdateMembers,
  onDeleteMember,
  classes,
  onUpdateClasses,
  onDeleteClass,
  membershipPrices,
  onUpdatePrices,
  onDeletePrice,
  instructors,
  onUpdateInstructors,
  onDeleteInstructor,
  galleryItems,
  onUpdateGallery,
  onDeleteGallery,
  informations,
  onUpdateInformations,
  onDeleteInfo,
  onBackToApp
}: AdminPanelProps) {
  // Login State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'members' | 'pricing' | 'instructors' | 'gallery' | 'info'>('members');

  // Modal / Form States
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingPrice, setEditingPrice] = useState<MembershipPrice | null>(null);
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingInfo, setEditingInfo] = useState<GymInformation | null>(null);
  const [isAddingInfo, setIsAddingInfo] = useState(false);

  // Form Fields State
  // Pricing Fields
  const [priceName, setPriceName] = useState('');
  const [priceValue, setPriceValue] = useState(0);
  const [priceDuration, setPriceDuration] = useState(1);
  const [priceBenefits, setPriceBenefits] = useState('');

  // Instructor Fields
  const [instructorName, setInstructorName] = useState('');
  const [instructorSpecialty, setInstructorSpecialty] = useState('');
  const [instructorPhone, setInstructorPhone] = useState('');
  const [instructorExperience, setInstructorExperience] = useState(1);
  const [instructorIsPT, setInstructorIsPT] = useState(false);
  const [instructorAvatar, setInstructorAvatar] = useState('');

  // Gallery Fields
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryDesc, setGalleryDesc] = useState('');

  // Info Fields
  const [infoKey, setInfoKey] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [infoContent, setInfoContent] = useState('');

  // Auto Login Check
  useEffect(() => {
    const adminSession = localStorage.getItem('gogym_admin_session');
    if (adminSession === 'active') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'gogym123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      localStorage.setItem('gogym_admin_session', 'active');
    } else {
      setLoginError('Kredensial Admin tidak valid. Periksa kembali username atau password Anda.');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('gogym_admin_session');
    setUsername('');
    setPassword('');
  };

  // 1. MEMBERS FUNCTIONALITY
  const handleEditMemberSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updated = members.map(m => m.id === editingMember.id ? editingMember : m);
    onUpdateMembers(updated);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    onUpdateMembers(updated);
    if (onDeleteMember) {
      onDeleteMember(id);
    }
    setToastMessage('Data member berhasil dihapus dari sistem');
  };

  // Download Excel (CSV with UTF-8 support)
  const handleDownloadExcel = () => {
    const headers = ['ID Member', 'Nama Lengkap', 'Email', 'No Telepon', 'Paket', 'Status', 'Tanggal Bergabung', 'Sisa Sesi', 'Tujuan', 'Tinggi (cm)', 'Berat (kg)'];
    const rows = members.map(m => [
      m.id,
      m.fullName,
      m.email,
      m.phone,
      m.membershipType,
      m.status,
      m.joinedDate,
      m.remainingSessions,
      m.goal,
      m.height || '-',
      m.weight || '-'
    ]);
    
    const csvContent = "\uFEFF" + [
      headers.join(','), 
      ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Daftar_Member_GoGym_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const tableRows = members.map(m => `
      <tr>
        <td>${m.id}</td>
        <td>${m.fullName}</td>
        <td>${m.email}</td>
        <td>${m.phone}</td>
        <td><span class="badge ${m.membershipType}">${m.membershipType}</span></td>
        <td><span class="badge ${m.status}">${m.status}</span></td>
        <td>${m.joinedDate}</td>
        <td>${m.remainingSessions} Sesi</td>
        <td>${m.goal}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Daftar Member Go Gym</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1e293b; padding: 25px; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
            h1 { margin: 0; color: #0f172a; font-size: 22px; }
            .meta { font-size: 11px; color: #64748b; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 11px; }
            th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
            .Active { background-color: #d1fae5; color: #065f46; }
            .Pending { background-color: #fef3c7; color: #92400e; }
            .Expired { background-color: #fee2e2; color: #991b1b; }
            .Regular { background-color: #f1f5f9; color: #334155; }
            .Premium { background-color: #e0f2fe; color: #0369a1; }
            .VIP { background-color: #f3e8ff; color: #6b21a8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Daftar Anggota Resmi - Go Gym</h1>
            <div class="meta">
              Dicetak pada: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB | Total: ${members.length} Anggota
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>No Telepon</th>
                <th>Paket</th>
                <th>Status</th>
                <th>Tgl Bergabung</th>
                <th>Sisa Sesi</th>
                <th>Tujuan</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  // 2. PRICING FUNCTIONALITY
  const handleOpenAddPrice = () => {
    setPriceName('');
    setPriceValue(350000);
    setPriceDuration(1);
    setPriceBenefits('Akses Area Beban\nLoker Standar\nFree Wifi');
    setIsAddingPrice(true);
  };

  const handleSaveAddPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceName.trim()) return;
    const newPrice: MembershipPrice = {
      id: 'p-' + Date.now(),
      name: priceName.trim(),
      price: priceValue,
      durationMonths: priceDuration,
      benefits: priceBenefits.split('\n').filter(b => b.trim() !== '')
    };
    onUpdatePrices([...membershipPrices, newPrice]);
    setIsAddingPrice(false);
  };

  const handleEditPriceClick = (price: MembershipPrice) => {
    setEditingPrice(price);
    setPriceName(price.name);
    setPriceValue(price.price);
    setPriceDuration(price.durationMonths);
    setPriceBenefits(price.benefits.join('\n'));
  };

  const handleSaveEditPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice || !priceName.trim()) return;
    const updated: MembershipPrice = {
      ...editingPrice,
      name: priceName.trim(),
      price: priceValue,
      durationMonths: priceDuration,
      benefits: priceBenefits.split('\n').filter(b => b.trim() !== '')
    };
    onUpdatePrices(membershipPrices.map(p => p.id === editingPrice.id ? updated : p));
    setEditingPrice(null);
  };

  const handleDeletePrice = (id: string) => {
    const updated = membershipPrices.filter(p => p.id !== id);
    onUpdatePrices(updated);
    if (onDeletePrice) {
      onDeletePrice(id);
    }
    setToastMessage('Paket harga berhasil dihapus');
  };


  // 3. INSTRUCTORS FUNCTIONALITY
  const handleOpenAddInstructor = () => {
    setInstructorName('');
    setInstructorSpecialty('Strength & Weight Training');
    setInstructorPhone('0812');
    setInstructorExperience(3);
    setInstructorIsPT(true);
    setInstructorAvatar('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=60');
    setIsAddingInstructor(true);
  };

  const handleSaveAddInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorName.trim()) return;
    const newIns: Instructor = {
      id: 'ins-' + Date.now(),
      name: instructorName.trim(),
      specialty: instructorSpecialty.trim(),
      phone: instructorPhone.trim(),
      experienceYears: instructorExperience,
      isPersonalTrainer: instructorIsPT,
      avatarUrl: instructorAvatar.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=60'
    };
    onUpdateInstructors([...instructors, newIns]);
    setIsAddingInstructor(false);
  };

  const handleEditInstructorClick = (ins: Instructor) => {
    setEditingInstructor(ins);
    setInstructorName(ins.name);
    setInstructorSpecialty(ins.specialty);
    setInstructorPhone(ins.phone);
    setInstructorExperience(ins.experienceYears);
    setInstructorIsPT(ins.isPersonalTrainer);
    setInstructorAvatar(ins.avatarUrl || '');
  };

  const handleSaveEditInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstructor || !instructorName.trim()) return;
    const updated: Instructor = {
      ...editingInstructor,
      name: instructorName.trim(),
      specialty: instructorSpecialty.trim(),
      phone: instructorPhone.trim(),
      experienceYears: instructorExperience,
      isPersonalTrainer: instructorIsPT,
      avatarUrl: instructorAvatar.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=60'
    };
    onUpdateInstructors(instructors.map(i => i.id === editingInstructor.id ? updated : i));
    setEditingInstructor(null);
  };

  const handleDeleteInstructor = (id: string) => {
    const updated = instructors.filter(i => i.id !== id);
    onUpdateInstructors(updated);
    if (onDeleteInstructor) {
      onDeleteInstructor(id);
    }
    setToastMessage('Instruktur berhasil dihapus');
  };


  // 4. GALLERY FUNCTIONALITY
  const handleOpenAddGallery = () => {
    setGalleryTitle('');
    setGalleryUrl('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=60');
    setGalleryDesc('Fasilitas latihan beban terintegrasi.');
    setIsAddingGallery(true);
  };

  const handleSaveAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryUrl.trim()) return;
    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: galleryTitle.trim(),
      imageUrl: galleryUrl.trim(),
      description: galleryDesc.trim(),
      uploadedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    onUpdateGallery([...galleryItems, newItem]);
    setIsAddingGallery(false);
  };

  const handleEditGalleryClick = (item: GalleryItem) => {
    setEditingGallery(item);
    setGalleryTitle(item.title);
    setGalleryUrl(item.imageUrl);
    setGalleryDesc(item.description || '');
  };

  const handleSaveEditGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !galleryTitle.trim() || !galleryUrl.trim()) return;
    const updated: GalleryItem = {
      ...editingGallery,
      title: galleryTitle.trim(),
      imageUrl: galleryUrl.trim(),
      description: galleryDesc.trim()
    };
    onUpdateGallery(galleryItems.map(g => g.id === editingGallery.id ? updated : g));
    setEditingGallery(null);
  };

  const handleDeleteGallery = (id: string) => {
    const updated = galleryItems.filter(g => g.id !== id);
    onUpdateGallery(updated);
    if (onDeleteGallery) {
      onDeleteGallery(id);
    }
    setToastMessage('Foto galeri berhasil dihapus');
  };

  // Convert uploaded image to Base64 (Local image upload support)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isProfile) {
        setInstructorAvatar(base64String);
      } else {
        setGalleryUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };


  // 5. INFO FUNCTIONALITY
  const handleOpenAddInfo = () => {
    setInfoKey('kontak');
    setInfoTitle('Nomor Layanan Darurat');
    setInfoContent('Hubungi Whatsapp Customer Service di 0812-9900-2211 jika ada kendala di lapangan.');
    setIsAddingInfo(true);
  };

  const handleSaveAddInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoKey.trim() || !infoTitle.trim()) return;
    const newItem: GymInformation = {
      id: 'info-' + Date.now(),
      key: infoKey.trim().toLowerCase(),
      title: infoTitle.trim(),
      content: infoContent.trim(),
      updatedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    onUpdateInformations([...informations, newItem]);
    setIsAddingInfo(false);
  };

  const handleEditInfoClick = (info: GymInformation) => {
    setEditingInfo(info);
    setInfoKey(info.key);
    setInfoTitle(info.title);
    setInfoContent(info.content);
  };

  const handleSaveEditInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInfo || !infoKey.trim() || !infoTitle.trim()) return;
    const updated: GymInformation = {
      ...editingInfo,
      key: infoKey.trim().toLowerCase(),
      title: infoTitle.trim(),
      content: infoContent.trim(),
      updatedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    onUpdateInformations(informations.map(inf => inf.id === editingInfo.id ? updated : inf));
    setEditingInfo(null);
  };

  const handleDeleteInfo = (id: string) => {
    const updated = informations.filter(inf => inf.id !== id);
    onUpdateInformations(updated);
    if (onDeleteInfo) {
      onDeleteInfo(id);
    }
    setToastMessage('Informasi berhasil dihapus');
  };


  // LOGIN GATE VIEW
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Shield size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Keamanan Admin Go Gym</h2>
            <p className="text-slate-500 text-xs px-2 leading-relaxed">
              Silakan masukkan kredensial administrator resmi Anda untuk memvalidasi akses pengaturan sistem.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="admin-username">
                Username Admin
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={16} />
                </span>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-800 placeholder-slate-400 text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-800 placeholder-slate-400 text-sm transition-all"
                />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onBackToApp}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Kembali ke Aplikasi
              </button>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center shadow-xs"
              >
                Masuk Sistem
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED PANEL
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Go Gym Admin Dashboard</h2>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase">Konsol Kontrol & Pengaturan Data</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onBackToApp}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            Aplikasi Utama
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded-lg border border-red-900/60 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={13} /> Keluar Admin
          </button>
        </div>
      </div>

      {/* Admin Navigation Sidebar/Tabs */}
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200/80 p-4 space-y-1 shrink-0 flex flex-row md:flex-col overflow-x-auto gap-1 md:gap-0">
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'members'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Users size={15} /> Daftar Member ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <DollarSign size={15} /> Harga Paket Member ({membershipPrices.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'instructors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Briefcase size={15} /> Instruktur & PT ({instructors.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Image size={15} /> Galeri Foto ({galleryItems.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'info'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Info size={15} /> Pengaturan Informasi ({informations.length})
          </button>
        </div>

        {/* Admin Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-x-hidden min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >

              {/* 1. MEMBERS LIST MANAGEMENT TAB */}
              {activeTab === 'members' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Daftar Anggota / Member Gym</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Pantau status, ubah biodata fisik, ganti paket, atau hapus member terdaftar.</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={handleDownloadExcel}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <FileSpreadsheet size={14} /> Download Excel
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <FileText size={14} /> Download PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">ID Member</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Nama Lengkap</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Kontak / Email</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Tipe Paket</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Status</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Join Date</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Sesi Sisa</th>
                            <th className="p-3.5 text-xs font-bold text-slate-700 uppercase text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {members.length > 0 ? (
                            members.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="p-3.5 font-mono text-xs text-slate-600 font-bold">{m.id}</td>
                                <td className="p-3.5 font-bold text-xs text-slate-900">{m.fullName}</td>
                                <td className="p-3.5 text-xs">
                                  <div className="text-slate-900 font-medium">{m.phone}</div>
                                  <div className="text-slate-400 text-[10px]">{m.email}</div>
                                </td>
                                <td className="p-3.5 text-xs">
                                  <span className={`px-2 py-0.5 font-bold text-[10px] uppercase rounded-md ${
                                    m.membershipType === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                    m.membershipType === 'Premium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                                  }`}>
                                    {m.membershipType}
                                  </span>
                                </td>
                                <td className="p-3.5 text-xs">
                                  <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full uppercase ${
                                    m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                                    m.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-xs text-slate-500 font-medium">{m.joinedDate}</td>
                                <td className="p-3.5 text-xs text-slate-900 font-bold">{m.remainingSessions} Sesi</td>
                                <td className="p-3.5 text-xs">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => setEditingMember(m)}
                                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                                      title="Edit Member"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMember(m.id)}
                                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
                                      title="Hapus Member"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">Belum ada member terdaftar di database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}


              {/* 2. MEMBERSHIP PRICING TAB */}
              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Atur Paket Harga Keanggotaan</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ubah, tambahkan, atau hapus skema biaya member resmi Go Gym.</p>
                    </div>
                    <button
                      onClick={handleOpenAddPrice}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle size={14} /> Tambah Paket Baru
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {membershipPrices.map((p) => (
                      <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-extrabold text-slate-900 text-base">{p.name}</h4>
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md uppercase">{p.durationMonths} Bulan</span>
                          </div>
                          
                          <p className="text-xl font-black text-emerald-600">
                            Rp {p.price.toLocaleString('id-ID')}
                            <span className="text-xs text-slate-400 font-normal"> / paket</span>
                          </p>

                          <div className="border-t border-slate-200/60 pt-3 space-y-1.5">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Keuntungan Paket:</p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              {p.benefits.map((b, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <Check size={12} className="text-emerald-500 shrink-0" />
                                  <span className="line-clamp-1">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-200/60 justify-end">
                          <button
                            onClick={() => handleEditPriceClick(p)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePrice(p.id)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* 3. INSTRUCTORS & PT TAB */}
              {activeTab === 'instructors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Manajemen Instruktur & Personal Trainer</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Kelola instruktur kelas harian dan tim Personal Trainer (PT) profesional.</p>
                    </div>
                    <button
                      onClick={handleOpenAddInstructor}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle size={14} /> Tambah Instruktur
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {instructors.map((ins) => (
                      <div key={ins.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={ins.avatarUrl}
                              alt={ins.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 bg-white"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{ins.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{ins.specialty}</p>
                            </div>
                          </div>

                          <div className="text-xs space-y-1 text-slate-600 pt-1">
                            <div className="flex justify-between">
                              <span>Pengalaman:</span>
                              <span className="font-bold text-slate-800">{ins.experienceYears} Tahun</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tipe Layanan:</span>
                              <span className="font-bold text-emerald-600">
                                {ins.isPersonalTrainer ? 'Personal Trainer' : 'Instruktur Kelas'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Telepon / WA:</span>
                              <span className="font-mono text-slate-800 font-medium">{ins.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/50 justify-end">
                          <button
                            onClick={() => handleEditInstructorClick(ins)}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(ins.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* 4. GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Pengaturan Galeri Gym</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Atur visual foto interior, peralatan, serta dokumentasi aktivitas fisik Go Gym.</p>
                    </div>
                    <button
                      onClick={handleOpenAddGallery}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle size={14} /> Input Foto Baru
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
                        <div>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-44 object-cover border-b border-slate-200 bg-slate-200"
                          />
                          <div className="p-4 space-y-1">
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{item.description || 'Tidak ada deskripsi.'}</p>
                            <span className="block text-[9px] text-slate-400 font-medium pt-1">Diunggah: {item.uploadedAt}</span>
                          </div>
                        </div>

                        <div className="p-4 pt-0 flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEditGalleryClick(item)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* 5. ADDITIONAL INFORMATION TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Pengaturan Informasi & Pengumuman</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Kelola konten jam kerja, tata tertib gym, lokasi, serta nomor bantuan resmi.</p>
                    </div>
                    <button
                      onClick={handleOpenAddInfo}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle size={14} /> Tambah Informasi
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Kata Kunci / Key</th>
                          <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Judul Pengumuman</th>
                          <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Deskripsi / Konten Isi</th>
                          <th className="p-3.5 text-xs font-bold text-slate-700 uppercase">Update Terakhir</th>
                          <th className="p-3.5 text-xs font-bold text-slate-700 uppercase text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {informations.map((info) => (
                          <tr key={info.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-mono text-xs text-emerald-700 font-bold">{info.key}</td>
                            <td className="p-3.5 font-bold text-xs text-slate-900">{info.title}</td>
                            <td className="p-3.5 text-xs text-slate-500 max-w-sm font-medium leading-relaxed">{info.content}</td>
                            <td className="p-3.5 text-xs text-slate-400 font-medium">{info.updatedAt}</td>
                            <td className="p-3.5 text-xs">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEditInfoClick(info)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteInfo(info.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ADMIN SUB-MODAL FORMS (MODAL WINDOWS) */}
      <AnimatePresence>
        {/* EDIT MEMBER MODAL */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMember(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-150 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">Edit Informasi Anggota</h4>
                <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditMemberSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={editingMember.fullName}
                      onChange={(e) => setEditingMember({...editingMember, fullName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nomor Telepon / WA</label>
                    <input
                      type="text"
                      required
                      value={editingMember.phone}
                      onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Komposisi Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      value={editingMember.height || 0}
                      onChange={(e) => setEditingMember({...editingMember, height: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Komposisi Berat Badan (kg)</label>
                    <input
                      type="number"
                      value={editingMember.weight || 0}
                      onChange={(e) => setEditingMember({...editingMember, weight: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Tipe Paket</label>
                    <select
                      value={editingMember.membershipType}
                      onChange={(e) => setEditingMember({...editingMember, membershipType: e.target.value as any})}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Status Akun</label>
                    <select
                      value={editingMember.status}
                      onChange={(e) => setEditingMember({...editingMember, status: e.target.value as any})}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Sisa Kuota Sesi</label>
                    <input
                      type="number"
                      value={editingMember.remainingSessions}
                      onChange={(e) => setEditingMember({...editingMember, remainingSessions: Number(e.target.value)})}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tujuan Kebugaran</label>
                  <input
                    type="text"
                    value={editingMember.goal}
                    onChange={(e) => setEditingMember({...editingMember, goal: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT PRICING MODAL */}
        {(isAddingPrice || editingPrice) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingPrice(false); setEditingPrice(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAddingPrice ? 'Tambah Paket Keanggotaan Baru' : 'Edit Paket Keanggotaan'}
                </h4>
                <button onClick={() => { setIsAddingPrice(false); setEditingPrice(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={isAddingPrice ? handleSaveAddPrice : handleSaveEditPrice} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Paket Keanggotaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Premium, VIP Ultimate"
                    value={priceName}
                    onChange={(e) => setPriceName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Harga Paket (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={priceValue}
                      onChange={(e) => setPriceValue(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Durasi Paket (Bulan)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={priceDuration}
                      onChange={(e) => setPriceDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Keuntungan / Benefits (Satu per baris)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Contoh:&#10;Akses Semua Fasilitas&#10;Loker Prioritas"
                    value={priceBenefits}
                    onChange={(e) => setPriceBenefits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddingPrice(false); setEditingPrice(null); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Simpan Paket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT INSTRUCTOR MODAL */}
        {(isAddingInstructor || editingInstructor) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingInstructor(false); setEditingInstructor(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAddingInstructor ? 'Tambah Instruktur & PT Baru' : 'Edit Instruktur & PT'}
                </h4>
                <button onClick={() => { setIsAddingInstructor(false); setEditingInstructor(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={isAddingInstructor ? handleSaveAddInstructor : handleSaveEditInstructor} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Instruktur / PT</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Rahma"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Keahlian / Spesialisasi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Yoga, HIIT, Cardio"
                      value={instructorSpecialty}
                      onChange={(e) => setInstructorSpecialty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Pengalaman Latihan (Tahun)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={instructorExperience}
                      onChange={(e) => setInstructorExperience(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nomor HP / WA</label>
                    <input
                      type="text"
                      required
                      placeholder="0812xxxxxx"
                      value={instructorPhone}
                      onChange={(e) => setInstructorPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Tipe Instruktur</label>
                    <select
                      value={instructorIsPT ? 'pt' : 'class'}
                      onChange={(e) => setInstructorIsPT(e.target.value === 'pt')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="pt">Personal Trainer (PT)</option>
                      <option value="class">Instruktur Kelas</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Unggah Foto / Seret File Lokal</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400">Atau masukkan URL gambar langsung:</span>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={instructorAvatar}
                      onChange={(e) => setInstructorAvatar(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddingInstructor(false); setEditingInstructor(null); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Simpan Instruktur
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT GALLERY MODAL */}
        {(isAddingGallery || editingGallery) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAddingGallery ? 'Input Foto Galeri Baru' : 'Edit Foto Galeri'}
                </h4>
                <button onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={isAddingGallery ? handleSaveAddGallery : handleSaveEditGallery} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Judul Foto</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Studio Yoga Zen, Area Angkat Beban"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Deskripsi Singkat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dilengkapi matras nyaman dan speaker meditasi khusus."
                    value={galleryDesc}
                    onChange={(e) => setGalleryDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Unggah Foto / Seret File Lokal</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400">Atau masukkan URL gambar langsung:</span>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={galleryUrl}
                      onChange={(e) => setGalleryUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Simpan Foto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT INFO MODAL */}
        {(isAddingInfo || editingInfo) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingInfo(false); setEditingInfo(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAddingInfo ? 'Tambah Informasi Gym Baru' : 'Edit Informasi Gym'}
                </h4>
                <button onClick={() => { setIsAddingInfo(false); setEditingInfo(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={isAddingInfo ? handleSaveAddInfo : handleSaveEditInfo} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Kata Kunci / Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: operasional, aturan, kontak"
                      value={infoKey}
                      onChange={(e) => setInfoKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Judul Pengumuman</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jam Buka Go Gym"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Konten Informasi</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Contoh: Go Gym buka setiap hari pukul 06:00 - 22:00 WIB..."
                    value={infoContent}
                    onChange={(e) => setInfoContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddingInfo(false); setEditingInfo(null); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Simpan Informasi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
