import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Siswa, KelompokMengaji } from '../../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  UserCheck,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  Award,
  Calendar,
  Search,
} from 'lucide-react';
import { SetoranModal } from '../common/SetoranModal';
import { AbsensiModal } from '../common/AbsensiModal';
import { StudentDetailModal } from '../common/StudentDetailModal';

export const UstadzDashboard: React.FC = () => {
  const { activeUstadz, kelompokList, siswaList, setoranList } = useApp();

  // Selected group under this ustadz
  const myKelompokList = kelompokList.filter((k) => k.ustadzId === activeUstadz?.id);
  const [selectedKelompokId, setSelectedKelompokId] = useState<string>(() => {
    return myKelompokList[0]?.id || kelompokList[0]?.id || '';
  });

  const [searchStudent, setSearchStudent] = useState('');

  // Modals
  const [isSetoranOpen, setIsSetoranOpen] = useState(false);
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Siswa | null>(null);
  const [preselectedSiswaId, setPreselectedSiswaId] = useState<string | undefined>();

  const currentKelompok = kelompokList.find((k) => k.id === selectedKelompokId) || myKelompokList[0];
  const studentsInKelompok = siswaList.filter((s) => s.kelompokId === currentKelompok?.id);

  const filteredStudents = studentsInKelompok.filter((s) =>
    s.nama.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Setoran logged by this ustadz recently
  const myRecentSetoran = setoranList.filter((st) => st.ustadzId === activeUstadz?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner - Ustadz Identity & Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-2xl p-6 shadow-sm border border-emerald-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <img
                src="/logo.svg"
                alt="AJQL Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-900/80 text-emerald-200 rounded-md border border-emerald-500/30">
                  Portal Ustadz Pembimbing
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">AJQL Center</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                {activeUstadz?.nama}
              </h1>
              <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-2 mt-0.5">
                <span>{activeUstadz?.gelar}</span>
                <span>•</span>
                <span>{activeUstadz?.spesialisasi}</span>
              </p>
            </div>
          </div>

          {/* Primary Quick Actions for Mosque Sessions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="ustadz-btn-tambah-setoran"
              onClick={() => {
                setPreselectedSiswaId(undefined);
                setIsSetoranOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Tambah Setoran</span>
            </button>

            <button
              id="ustadz-btn-isi-kehadiran"
              onClick={() => setIsAbsensiOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-900/80 text-white hover:bg-emerald-900 border border-emerald-500/40 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Isi Kehadiran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kelompok Yang Dibimbing Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Kelompok yang Dibimbing:</span>
          <span className="text-slate-400 font-normal">
            Total {myKelompokList.length} Kelompok Binaan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myKelompokList.map((k) => {
            const isSelected = k.id === (currentKelompok?.id || selectedKelompokId);
            const studentCount = siswaList.filter((s) => s.kelompokId === k.id).length;

            return (
              <button
                key={k.id}
                onClick={() => setSelectedKelompokId(k.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{k.nama}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {k.jenjang}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Ustadz: <strong className="text-slate-700">{k.ustadzNama}</strong>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-emerald-800 font-bold">{studentCount} Siswa</span>
                  <span className="text-slate-400 text-[11px]">{k.jam}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Group Details & Student List */}
      {currentKelompok && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Group Header Info */}
          <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{currentKelompok.nama}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {studentsInKelompok.length} Siswa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Jadwal: {currentKelompok.jadwalHari.join(', ')} ({currentKelompok.jam}) • {currentKelompok.ruang}
              </p>
            </div>

            {/* Search within group */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari santri bimbingan..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Student List Cards */}
          <div className="p-5">
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tidak ditemukan santri dalam kelompok ini.
                </div>
              ) : (
                filteredStudents.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Info */}
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{s.nama}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700">
                            {s.jenjang} • {s.kelas}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                          <span>Setoran Terakhir: <strong>{s.suratTerakhir}</strong></span>
                        </div>
                        {s.catatanTerakhir && (
                          <div className="text-[11px] text-slate-600 italic mt-1 bg-white px-2.5 py-1 rounded-md border border-slate-200/80">
                            "{s.catatanTerakhir}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Progress Bar Hijau */}
                    <div className="w-full md:w-56 shrink-0 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Target: {s.targetHafalan}</span>
                        <span className="text-emerald-700 font-bold">{s.capaianPersen}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${s.capaianPersen}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                        <span>Lulus: {s.totalSuratLulus} Surat</span>
                        <span>{s.capaianPersen >= 75 ? '🔥 Mutqin' : '📖 Berproses'}</span>
                      </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => {
                          setPreselectedSiswaId(s.id);
                          setIsSetoranOpen(true);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Catat Setoran</span>
                      </button>
                      <button
                        onClick={() => setSelectedStudentForDetail(s)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Profil & Riwayat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Riwayat Setoran Terakhir oleh Ustadz ini */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Riwayat Setoran yang Baru Selesai Disimak</span>
          </h3>
          <span className="text-xs text-slate-400">Total {myRecentSetoran.length} Catatan</span>
        </div>

        <div className="space-y-2">
          {myRecentSetoran.slice(0, 4).map((st) => (
            <div
              key={st.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{st.siswaNama}</span>
                <span className="text-slate-500 ml-2">
                  Surat {st.surat} (Ayat {st.ayat}) • {st.tipe}
                </span>
                <div className="text-[11px] text-slate-600 mt-0.5">{st.catatanUstadz}</div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  {st.kelancaran}
                </span>
                <span className="text-[10px] text-slate-400">{st.tanggal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <SetoranModal
        isOpen={isSetoranOpen}
        onClose={() => setIsSetoranOpen(false)}
        preselectedSiswaId={preselectedSiswaId}
        preselectedUstadzId={activeUstadz?.id}
      />

      <AbsensiModal
        isOpen={isAbsensiOpen}
        onClose={() => setIsAbsensiOpen(false)}
        preselectedKelompokId={currentKelompok?.id}
      />

      <StudentDetailModal
        siswa={selectedStudentForDetail}
        isOpen={!!selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        onOpenSetoran={(id) => {
          setPreselectedSiswaId(id);
          setIsSetoranOpen(true);
        }}
      />
    </div>
  );
};
