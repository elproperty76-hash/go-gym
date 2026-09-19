import React, { useState } from 'react';
import { GymNotification } from '../types';
import { Bell, BellOff, CheckCheck, Trash2, Calendar, Clock, Sparkles, MessageSquare, Award, AlertCircle } from 'lucide-react';

interface NotificationCenterProps {
  notifications: GymNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onSimulateNotification: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onSimulateNotification
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: GymNotification['type']) => {
    switch (type) {
      case 'class_reminder':
        return <Calendar size={16} className="text-indigo-600" />;
      case 'workout_reminder':
        return <Award size={16} className="text-orange-600" />;
      case 'announcement':
        return <MessageSquare size={16} className="text-emerald-600" />;
      default:
        return <AlertCircle size={16} className="text-slate-500" />;
    }
  };

  const getNotificationBg = (type: GymNotification['type'], isRead: boolean) => {
    if (isRead) return 'bg-white border-slate-100';
    switch (type) {
      case 'class_reminder': return 'bg-indigo-50/40 border-indigo-100/50';
      case 'workout_reminder': return 'bg-orange-50/40 border-orange-100/50';
      case 'announcement': return 'bg-emerald-50/40 border-emerald-100/50';
      default: return 'bg-slate-50 border-slate-200/50';
    }
  };

  return (
    <div id="notification-center-container" className="relative">
      
      {/* Bell Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl border border-slate-700/60 transition-all cursor-pointer flex items-center justify-center"
        aria-label="Notifikasi"
      >
        <Bell size={18} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Portal Card */}
      {isOpen && (
        <>
          {/* Transparent Backdrop Click-away */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-300 animate-fade-in origin-top-right">
            
            {/* Header section */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell size={16} className="text-emerald-400" />
                <span className="font-bold text-sm tracking-tight">Notifikasi & Pengingat Sesi</span>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckCheck size={12} /> Tandai Semua Dibaca
                </button>
              )}
            </div>

            {/* Simulated Notification Trigger */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex justify-between items-center text-[11px] text-slate-500">
              <span>Uji coba sistem pengingat:</span>
              <button
                onClick={onSimulateNotification}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Kirim Pengingat Demo
              </button>
            </div>

            {/* List scroll block */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 bg-slate-50/30">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 border-l-4 transition-all flex justify-between gap-3 ${
                      !n.isRead ? 'border-l-emerald-500' : 'border-l-transparent'
                    } ${getNotificationBg(n.type, n.isRead)}`}
                  >
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>
                      
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                          {n.title}
                        </p>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock size={9} /> {n.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 justify-between shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => onMarkAsRead(n.id)}
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                          title="Tandai telah dibaca"
                        />
                      )}
                      <button
                        onClick={() => onClearNotification(n.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Hapus notifikasi"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <BellOff size={28} className="text-slate-300" />
                  <p>Tidak ada pemberitahuan.</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-normal">Pemberitahuan kelas atau latihan Anda akan masuk di sini secara otomatis.</p>
                </div>
              )}
            </div>

            {/* Footer summary */}
            <div className="p-3 bg-white border-t border-slate-100 text-center text-[10px] text-slate-400 leading-tight">
              Sistem pengingat kelas aktif. Anda akan menerima peringatan 30 menit sebelum jadwal kelas dimulai.
            </div>

          </div>
        </>
      )}

    </div>
  );
}
