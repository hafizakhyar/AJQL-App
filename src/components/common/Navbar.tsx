import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  BookOpen,
  Shield,
  GraduationCap,
  Users,
  User,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeUstadzId,
    setActiveUstadzId,
    activeSiswaId,
    setActiveSiswaId,
    ustadzList,
    siswaList,
    resetAllData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; desc: string }> = {
    admin: {
      label: 'Admin',
      icon: <Shield className="w-4 h-4" />,
      desc: 'Pengelola Lembaga',
    },
    ustadz: {
      label: 'Ustadz',
      icon: <GraduationCap className="w-4 h-4" />,
      desc: 'Pengajar & Pembimbing',
    },
    orang_tua: {
      label: 'Orang Tua',
      icon: <Users className="w-4 h-4" />,
      desc: 'Wali Santri',
    },
    siswa: {
      label: 'Siswa',
      icon: <User className="w-4 h-4" />,
      desc: 'Santri Tahfidz',
    },
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Tagline */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Belajar Al-Qur’an, Menyentuh Hati, Membentuk Generasi Qurani.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Logo AJQL - Al Jannah Quran Learning"
              className="w-11 h-11 object-contain shrink-0 drop-shadow-xs hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-emerald-950 tracking-tight">AJQL App</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Masjid Al-Jannah
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Al Jannah Quran Learning Center
              </p>
            </div>
          </div>

          {/* Role Switcher (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(Object.keys(roleLabels) as UserRole[]).map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  id={`role-btn-${r}`}
                  onClick={() => handleRoleChange(r)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span className={active ? 'text-emerald-700' : 'text-slate-500'}>
                    {roleLabels[r].icon}
                  </span>
                  <span>{roleLabels[r].label}</span>
                </button>
              );
            })}
          </div>

          {/* Account/Persona Context Dropdown (For Testing Experience) */}
          <div className="flex items-center gap-2">
            {role === 'ustadz' && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-emerald-700 font-medium">Ustadz:</span>
                <select
                  id="select-active-ustadz"
                  value={activeUstadzId}
                  onChange={(e) => setActiveUstadzId(e.target.value)}
                  className="bg-transparent font-semibold text-emerald-900 focus:outline-hidden cursor-pointer"
                >
                  {ustadzList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(role === 'orang_tua' || role === 'siswa') && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-emerald-700 font-medium">
                  {role === 'orang_tua' ? 'Anak:' : 'Santri:'}
                </span>
                <select
                  id="select-active-siswa"
                  value={activeSiswaId}
                  onChange={(e) => setActiveSiswaId(e.target.value)}
                  className="bg-transparent font-semibold text-emerald-900 focus:outline-hidden cursor-pointer max-w-[160px] truncate"
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.jenjang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Data Button */}
            <button
              id="btn-reset-data"
              onClick={() => {
                if (confirm('Kembalikan semua data simulasi ke setelan awal?')) {
                  resetAllData();
                }
              }}
              title="Reset data prototype"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Pilih Role Akun (4 Role Pengguna):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    id={`mobile-role-btn-${r}`}
                    onClick={() => handleRoleChange(r)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {roleLabels[r].icon}
                    <div className="text-left">
                      <div className="font-bold">{roleLabels[r].label}</div>
                      <div className={`text-[10px] ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {roleLabels[r].desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona selector on mobile */}
          {role === 'ustadz' && (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs">
              <label htmlFor="mobile-select-ustadz" className="block text-emerald-800 font-semibold mb-1">
                Ganti Akun Ustadz Aktif:
              </label>
              <select
                id="mobile-select-ustadz"
                value={activeUstadzId}
                onChange={(e) => setActiveUstadzId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-md p-2 font-medium text-slate-800"
              >
                {ustadzList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama} ({u.spesialisasi})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(role === 'orang_tua' || role === 'siswa') && (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs">
              <label htmlFor="mobile-select-siswa" className="block text-emerald-800 font-semibold mb-1">
                {role === 'orang_tua' ? 'Pilih Anak Santri:' : 'Pilih Profil Santri:'}
              </label>
              <select
                id="mobile-select-siswa"
                value={activeSiswaId}
                onChange={(e) => setActiveSiswaId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-md p-2 font-medium text-slate-800"
              >
                {siswaList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} - {s.jenjang} ({s.kelompokNama})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
