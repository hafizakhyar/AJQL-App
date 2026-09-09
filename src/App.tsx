import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UstadzDashboard } from './components/ustadz/UstadzDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { BookOpen, Shield, GraduationCap, Users, User, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)] pb-12">
      {role === 'admin' && <AdminDashboard />}
      {role === 'ustadz' && <UstadzDashboard />}
      {role === 'orang_tua' && <ParentDashboard />}
      {role === 'siswa' && <StudentDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
        <div>
          <Navbar />
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
              <img
                src="/logo.svg"
                alt="AJQL Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="font-bold text-emerald-950">AJQL App</span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-slate-600 font-medium">Al-Jannah Quran Learning Center</span>
            </div>

            <p className="text-slate-500 text-[11px]">
              Belajar Al-Qur’an, Menyentuh Hati, Membentuk Generasi Qurani.
            </p>

            <div className="text-[11px] text-slate-400">
              Sistem Manajemen Halaqah Tahfidz Masjid
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
