import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JenjangPendidikan, Siswa, KelompokMengaji, Ustadz } from '../../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  Calendar,
  BookOpen,
  UserCheck,
  FileText,
  Plus,
  Search,
  CheckCircle,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Printer,
  Eye,
  Trash2,
} from 'lucide-react';
import { StudentDetailModal } from '../common/StudentDetailModal';
import { SetoranModal } from '../common/SetoranModal';
import { AbsensiModal } from '../common/AbsensiModal';

type AdminMenu =
  | 'dashboard'
  | 'siswa'
  | 'ustadz'
  | 'kelompok'
  | 'jadwal'
  | 'hafalan'
  | 'absensi'
  | 'laporan';

export const AdminDashboard: React.FC = () => {
  const {
    siswaList,
    ustadzList,
    kelompokList,
    setoranList,
    absensiList,
    jadwalList,
    addSiswa,
    deleteSiswa,
    addUstadz,
    addKelompok,
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<AdminMenu>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenjang, setFilterJenjang] = useState<string>('Semua');

  // Modals
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isSetoranOpen, setIsSetoranOpen] = useState(false);
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);
  const [setoranTargetSiswaId, setSetoranTargetSiswaId] = useState<string | undefined>();

  // Add Forms Modals
  const [showAddSiswaModal, setShowAddSiswaModal] = useState(false);
  const [showAddUstadzModal, setShowAddUstadzModal] = useState(false);
  const [showAddKelompokModal, setShowAddKelompokModal] = useState(false);

  // New Siswa Form State
  const [newSiswaData, setNewSiswaData] = useState({
    nama: '',
    jenjang: 'SD' as JenjangPendidikan,
    kelas: 'Kelas 5 SD',
    kelompokId: kelompokList[0]?.id || '',
    targetHafalan: 'Juz 30',
    namaOrangTua: '',
    noHpOrangTua: '',
  });

  // Calculate statistics
  const totalSiswa = siswaList.length;
  const totalUstadz = ustadzList.length;
  const totalKelompok = kelompokList.length;
  const totalHadirCount = absensiList.filter((a) => a.status === 'Hadir').length;
  const attendanceRate =
    absensiList.length > 0 ? Math.round((totalHadirCount / absensiList.length) * 100) : 95;

  const averageProgress =
    totalSiswa > 0
      ? Math.round(siswaList.reduce((acc, curr) => acc + curr.capaianPersen, 0) / totalSiswa)
      : 0;

  // Filtered students
  const filteredSiswa = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kelompokNama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJenjang = filterJenjang === 'Semua' || s.jenjang === filterJenjang;
    return matchSearch && matchJenjang;
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'siswa', label: 'Siswa', count: totalSiswa, icon: <Users className="w-4 h-4" /> },
    { id: 'ustadz', label: 'Ustadz', count: totalUstadz, icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'kelompok', label: 'Kelompok', count: totalKelompok, icon: <Layers className="w-4 h-4" /> },
    { id: 'jadwal', label: 'Jadwal', icon: <Calendar className="w-4 h-4" /> },
    { id: 'hafalan', label: 'Hafalan', count: setoranList.length, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'absensi', label: 'Absensi', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'laporan', label: 'Laporan', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleCreateSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    const group = kelompokList.find((k) => k.id === newSiswaData.kelompokId) || kelompokList[0];
    const ustadz = ustadzList.find((u) => u.id === group.ustadzId) || ustadzList[0];

    addSiswa({
      nama: newSiswaData.nama,
      nis: `AJQL-2024-${String(siswaList.length + 1).padStart(3, '0')}`,
      jenjang: newSiswaData.jenjang,
      kelas: newSiswaData.kelas,
      kelompokId: group.id,
      kelompokNama: group.nama,
      ustadzId: ustadz.id,
      ustadzNama: ustadz.nama,
      targetHafalan: newSiswaData.targetHafalan,
      capaianPersen: 10,
      totalSuratLulus: 1,
      suratTerakhir: 'An-Nas (Ayat 1-6)',
      namaOrangTua: newSiswaData.namaOrangTua,
      noHpOrangTua: newSiswaData.noHpOrangTua,
      catatanTerakhir: 'Santri baru bergabung di halaqah.',
    });

    setShowAddSiswaModal(false);
    setNewSiswaData({
      nama: '',
      jenjang: 'SD',
      kelas: 'Kelas 5 SD',
      kelompokId: kelompokList[0]?.id || '',
      targetHafalan: 'Juz 30',
      namaOrangTua: '',
      noHpOrangTua: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner / Role Notice */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
              Admin Portal
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Pusat Manajemen AJQL (Al-Jannah Quran Center)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data santri, ustadz pembimbing, halaqah mengaji, jadwal, presensi, dan perkembangan hafalan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-btn-tambah-setoran"
            onClick={() => {
              setSetoranTargetSiswaId(undefined);
              setIsSetoranOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>+ Setoran Cepat</span>
          </button>
          <button
            id="admin-btn-isi-kehadiran"
            onClick={() => setIsAbsensiOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Presensi Halaqah</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar & View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-2.5">
            <img src="/logo.svg" alt="AJQL Logo" className="w-9 h-9 object-contain shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-xs text-emerald-950 truncate">AJQL Center</div>
              <div className="text-[10px] text-slate-500 truncate">Sistem Halaqah</div>
            </div>
          </div>

          <div>
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
            <nav className="space-y-1 mt-1">
            {menuItems.map((item) => {
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-menu-${item.id}`}
                  onClick={() => setActiveMenu(item.id as AdminMenu)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        active ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Siswa Aktif</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalSiswa}</div>
                  <div className="text-[11px] text-slate-500 mt-1">SD, SMP & SMA</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Jumlah Ustadz</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalUstadz}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Hafizh & Pengajar</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Kelompok Mengaji</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <Layers className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalKelompok}</div>
                  <div className="text-[11px] text-slate-500 mt-1">4–6 Siswa / Kelompok</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">Tingkat Kehadiran</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <UserCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">{attendanceRate}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Presensi di Masjid</div>
                </div>
              </div>

              {/* Progress Summary & Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Perkembangan Hafalan Rata-Rata Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Capaian target juz 30, juz 29, dan juz pilihan
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Rata-rata: {averageProgress}%
                  </span>
                </div>

                {/* Big Green Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${averageProgress}%` }}
                  ></div>
                </div>

                {/* Distribution per Jenjang */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Tingkat SD</span>
                      <span className="text-emerald-700 font-bold">78% Target</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Fokus: Juz 30 (An-Naba s/d An-Nas)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Tingkat SMP</span>
                      <span className="text-emerald-700 font-bold">54% Target</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Fokus: Juz 29 (Tabarak)</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Tingkat SMA</span>
                      <span className="text-emerald-700 font-bold">73% Target</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Fokus: Juz 1-3 & Matan Jazariyyah
                    </div>
                  </div>
                </div>
              </div>

              {/* Setoran Terkini & Jadwal Hari Ini */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Setoran in Masjid */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Setoran Terakhir di Masjid</span>
                    </h3>
                    <button
                      onClick={() => setActiveMenu('hafalan')}
                      className="text-xs text-emerald-700 hover:underline font-semibold"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {setoranList.slice(0, 5).map((st) => (
                      <div
                        key={st.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{st.siswaNama}</div>
                          <div className="text-slate-500 text-[11px]">
                            Surat {st.surat} ({st.ayat}) • Ustadz: {st.ustadzNama}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                            {st.kelancaran}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{st.tanggal}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Jadwal Mengaji Hari Ini */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <span>Jadwal Halaqah Mengaji</span>
                    </h3>
                    <button
                      onClick={() => setActiveMenu('jadwal')}
                      className="text-xs text-emerald-700 hover:underline font-semibold"
                    >
                      Lihat Jadwal
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {jadwalList.slice(0, 4).map((j) => (
                      <div
                        key={j.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{j.kelompokNama}</span>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {j.jam}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {j.ruang}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          Pembimbing: <strong>{j.ustadzNama}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SISWA VIEW */}
          {activeMenu === 'siswa' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Data Seluruh Siswa / Santri</h2>
                  <p className="text-xs text-slate-500">
                    Total {filteredSiswa.length} santri aktif terdaftar di AJQL
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSiswaModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Siswa Baru</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari santri berdasarkan nama, NIS, atau kelompok..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1 self-start sm:self-auto">
                  {['Semua', 'SD', 'SMP', 'SMA'].map((j) => (
                    <button
                      key={j}
                      onClick={() => setFilterJenjang(j)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        filterJenjang === j
                          ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Table / Cards */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-3">Santri</th>
                      <th className="py-3 px-3">Jenjang</th>
                      <th className="py-3 px-3">Kelompok & Ustadz</th>
                      <th className="py-3 px-3">Target & Capaian</th>
                      <th className="py-3 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSiswa.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{s.nama}</div>
                          <div className="text-[11px] text-slate-500">NIS: {s.nis}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                            {s.jenjang} • {s.kelas}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{s.kelompokNama}</div>
                          <div className="text-[11px] text-emerald-700">{s.ustadzNama}</div>
                        </td>
                        <td className="py-3 px-3 min-w-[140px]">
                          <div className="flex justify-between text-[11px] font-semibold mb-1">
                            <span className="text-slate-600">Target: {s.targetHafalan}</span>
                            <span className="text-emerald-700 font-bold">{s.capaianPersen}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${s.capaianPersen}%` }}
                            ></div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            Terakhir: {s.suratTerakhir}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedSiswa(s)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Lihat Profil
                          </button>
                          <button
                            onClick={() => {
                              setSetoranTargetSiswaId(s.id);
                              setIsSetoranOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            + Setoran
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus santri ${s.nama}?`)) {
                                deleteSiswa(s.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Hapus santri"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. USTADZ VIEW */}
          {activeMenu === 'ustadz' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Daftar Asatidz / Pengajar</h2>
                  <p className="text-xs text-slate-500">
                    Pembimbing halaqah tahfidz Al-Jannah Quran Learning Center
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUstadzModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Ustadz</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ustadzList.map((u) => {
                  const groupsGuided = kelompokList.filter((k) => k.ustadzId === u.id);
                  const totalStudentsInCare = siswaList.filter((s) => s.ustadzId === u.id).length;

                  return (
                    <div
                      key={u.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-base">
                            {u.nama.split(' ')[1]?.charAt(0) || u.nama.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{u.nama}</h3>
                            <div className="text-xs text-emerald-800 font-semibold">{u.gelar}</div>
                            <div className="text-[11px] text-slate-500">{u.spesialisasi}</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Halaqah Binaan</span>
                          <span className="font-bold text-slate-800">
                            {groupsGuided.length} Kelompok
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Total Santri</span>
                          <span className="font-bold text-emerald-800">
                            {totalStudentsInCare} Santri
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <strong>Kelompok: </strong>
                        {groupsGuided.map((g) => g.nama).join(', ') || 'Belum ada kelompok'}
                      </div>

                      <div className="pt-2 flex justify-between items-center text-xs">
                        <span className="text-slate-500">WA: {u.noHp}</span>
                        <a
                          href={`https://wa.me/${u.noHp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          Hubungi
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. KELOMPOK VIEW */}
          {activeMenu === 'kelompok' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Daftar Kelompok Mengaji</h2>
                  <p className="text-xs text-slate-500">
                    Setiap ustadz membimbing kelompok kecil berisi sekitar 4–6 siswa di masjid
                  </p>
                </div>
                <button
                  onClick={() => setShowAddKelompokModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kelompok</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kelompokList.map((k) => {
                  const students = siswaList.filter((s) => s.kelompokId === k.id);

                  return (
                    <div
                      key={k.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{k.nama}</h3>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {k.jenjang}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Pembimbing: <strong className="text-slate-700">{k.ustadzNama}</strong>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-800 rounded-lg border border-slate-200">
                          {students.length} Santri
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{k.jadwalHari.join(', ')} • {k.jam}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate">{k.ruang}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Santri dalam Kelompok:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {students.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => setSelectedSiswa(st)}
                              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            >
                              {st.nama} ({st.capaianPersen}%)
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. JADWAL VIEW */}
          {activeMenu === 'jadwal' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Jadwal Mengaji di Masjid</h2>
                <p className="text-xs text-slate-500">
                  Waktu halaqah belajar langsung bersama ustadz di lingkungan Masjid Al-Jannah
                </p>
              </div>

              <div className="space-y-3">
                {jadwalList.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{j.kelompokNama}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {j.hari}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        Ustadz Pembimbing: <strong>{j.ustadzNama}</strong>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{j.ruang}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        {j.jam}
                      </span>
                      <span className="text-[11px] text-slate-500 italic">{j.fokus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. HAFALAN VIEW */}
          {activeMenu === 'hafalan' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Rekap Seluruh Setoran Hafalan
                  </h2>
                  <p className="text-xs text-slate-500">
                    Data riwayat setoran ziyadah dan muraja’ah santri
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSetoranTargetSiswaId(undefined);
                    setIsSetoranOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Setoran</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-3">Tanggal</th>
                      <th className="py-3 px-3">Santri</th>
                      <th className="py-3 px-3">Surat & Ayat</th>
                      <th className="py-3 px-3">Tipe</th>
                      <th className="py-3 px-3">Kelancaran & Nilai</th>
                      <th className="py-3 px-3">Ustadz & Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {setoranList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{st.tanggal}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{st.siswaNama}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          Surat {st.surat} <span className="text-slate-500 font-normal">({st.ayat})</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              st.tipe === 'Hafalan Baru'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {st.tipe}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{st.kelancaran}</div>
                          <div className="text-[11px] text-emerald-700 font-bold">
                            Nilai: {st.nilai}
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-[220px]">
                          <div className="text-slate-700 font-medium">{st.ustadzNama}</div>
                          <div className="text-[11px] text-slate-500 truncate" title={st.catatanUstadz}>
                            {st.catatanUstadz}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. ABSENSI VIEW */}
          {activeMenu === 'absensi' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Rekap Presensi Kehadiran</h2>
                  <p className="text-xs text-slate-500">
                    Log kehadiran santri di halaqah masjid Al-Jannah
                  </p>
                </div>
                <button
                  onClick={() => setIsAbsensiOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Isi Presensi Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-3">Tanggal</th>
                      <th className="py-3 px-3">Santri</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {absensiList.map((ab) => (
                      <tr key={ab.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 text-slate-500">{ab.tanggal}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{ab.siswaNama}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              ab.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ab.status === 'Izin'
                                ? 'bg-amber-100 text-amber-800'
                                : ab.status === 'Sakit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ab.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{ab.keterangan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. LAPORAN VIEW */}
          {activeMenu === 'laporan' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              {/* Kop Rapor Resmi AJQL */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src="/logo.svg"
                  alt="Logo AJQL"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 tracking-tight">
                    AL-JANNAH QURAN LEARNING CENTER (AJQL)
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Sistem Manajemen Halaqah Tahfidz & Pembelajaran Al-Qur'an Masjid Al-Jannah
                  </p>
                  <p className="text-[11px] text-emerald-800 italic mt-0.5">
                    "Belajar Al-Qur’an, Menyentuh Hati, Membentuk Generasi Qurani."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Laporan Perkembangan Hafalan Santri
                  </h2>
                  <p className="text-xs text-slate-500">
                    Rapor evaluasi capaian tahfidz Al-Jannah Quran Learning Center
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Ekspor Rapor</span>
                </button>
              </div>

              {/* Summary Stats Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xs font-semibold text-emerald-800">Total Santri Lulus Juz 30</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">12 Santri</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Siap Wisuda Tahfidz</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-600">Santri Aktif Menghafal</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{totalSiswa} Santri</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">SD, SMP, & SMA</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-600">Rata-rata Nilai Setoran</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-1">91.4 / 100</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Kategori Mumtaz</div>
                </div>
              </div>

              {/* Rapor Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-xs text-slate-800">
                  Daftar Capaian Perkembangan Santri (Siap Diunduh)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-white">
                        <th className="py-2.5 px-3">Nama Santri</th>
                        <th className="py-2.5 px-3">Jenjang</th>
                        <th className="py-2.5 px-3">Ustadz Pembimbing</th>
                        <th className="py-2.5 px-3">Target</th>
                        <th className="py-2.5 px-3">Capaian</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {siswaList.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.nama}</td>
                          <td className="py-2.5 px-3 text-slate-600">{s.jenjang}</td>
                          <td className="py-2.5 px-3 text-emerald-800">{s.ustadzNama}</td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{s.targetHafalan}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700">{s.capaianPersen}%</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                s.capaianPersen >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : s.capaianPersen >= 50
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {s.capaianPersen >= 80 ? 'Mumtaz (Siap Wisuda)' : 'Berprogres Baik'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Tambah Siswa Baru */}
      {showAddSiswaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Pendaftaran Santri Baru</h3>
            <form onSubmit={handleCreateSiswa} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Abdurrahman Wahid"
                  value={newSiswaData.nama}
                  onChange={(e) => setNewSiswaData({ ...newSiswaData, nama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenjang</label>
                  <select
                    value={newSiswaData.jenjang}
                    onChange={(e) =>
                      setNewSiswaData({
                        ...newSiswaData,
                        jenjang: e.target.value as JenjangPendidikan,
                        kelas: `Kelas ${e.target.value === 'SD' ? '4 SD' : e.target.value === 'SMP' ? '7 SMP' : '10 SMA'}`,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Hafalan</label>
                  <input
                    type="text"
                    value={newSiswaData.targetHafalan}
                    onChange={(e) =>
                      setNewSiswaData({ ...newSiswaData, targetHafalan: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    placeholder="Juz 30 / Juz 29"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelompok Mengaji</label>
                <select
                  value={newSiswaData.kelompokId}
                  onChange={(e) => setNewSiswaData({ ...newSiswaData, kelompokId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                >
                  {kelompokList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.jenjang} - {k.ustadzNama})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    required
                    placeholder="Bapak / Ibu ..."
                    value={newSiswaData.namaOrangTua}
                    onChange={(e) =>
                      setNewSiswaData({ ...newSiswaData, namaOrangTua: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={newSiswaData.noHpOrangTua}
                    onChange={(e) =>
                      setNewSiswaData({ ...newSiswaData, noHpOrangTua: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddSiswaModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
                >
                  Daftarkan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Detail Profil Siswa */}
      <StudentDetailModal
        siswa={selectedSiswa}
        isOpen={!!selectedSiswa}
        onClose={() => setSelectedSiswa(null)}
        onOpenSetoran={(id) => {
          setSetoranTargetSiswaId(id);
          setIsSetoranOpen(true);
        }}
      />

      {/* MODAL: Setoran Hafalan */}
      <SetoranModal
        isOpen={isSetoranOpen}
        onClose={() => setIsSetoranOpen(false)}
        preselectedSiswaId={setoranTargetSiswaId}
      />

      {/* MODAL: Isi Absensi */}
      <AbsensiModal isOpen={isAbsensiOpen} onClose={() => setIsAbsensiOpen(false)} />
    </div>
  );
};
