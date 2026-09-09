import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAFTAR_SURAT_JUZ_30 } from '../../data/mockData';
import {
  BookOpen,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { activeSiswa, activeSiswaId, setActiveSiswaId, siswaList, setoranList, kelompokList } =
    useApp();

  const currentSiswa = activeSiswa || siswaList[0];
  const mySetoran = setoranList.filter((st) => st.siswaId === currentSiswa?.id);
  const myKelompok = kelompokList.find((k) => k.id === currentSiswa?.kelompokId);

  const [filterSuratTab, setFilterSuratTab] = useState<'semua' | 'lulus' | 'proses'>('semua');

  // Reversed Juz 30 (from An-Nas to An-Naba, which is the traditional memorization order for children)
  const memorizationOrderJuz30 = [...DAFTAR_SURAT_JUZ_30].reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner - Greeting Santri */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-2xl p-6 shadow-sm border border-emerald-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
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
                  Santri Tahfidz AJQL
                </span>
                <span className="text-xs text-emerald-200">{currentSiswa?.kelas}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                Ahlan wa Sahlan, {currentSiswa?.nama}
              </h1>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Pembimbing: <strong>{currentSiswa?.ustadzNama}</strong> • {currentSiswa?.kelompokNama}
              </p>
            </div>
          </div>

          {/* Quick Santri Switcher (For Demo/Testing convenience) */}
          <div className="bg-emerald-950/40 p-2 rounded-xl border border-white/10 text-xs">
            <label htmlFor="student-switch-profile" className="block text-[10px] text-emerald-200 font-semibold mb-1">
              Ganti Profil Santri:
            </label>
            <select
              id="student-switch-profile"
              value={activeSiswaId}
              onChange={(e) => setActiveSiswaId(e.target.value)}
              className="bg-emerald-900/80 text-white border border-emerald-600 rounded-lg px-2 py-1 text-xs focus:outline-hidden cursor-pointer"
            >
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.jenjang})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Progress Bar Card */}
        <div className="mt-6 bg-emerald-950/50 backdrop-blur-xs rounded-xl p-4 border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold text-emerald-100">Target Hafalan:</span>
              <span className="font-bold text-white bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/40">
                {currentSiswa?.targetHafalan}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-200 font-medium mr-1">Capaian:</span>
              <span className="text-xl font-extrabold text-white">
                {currentSiswa?.capaianPersen}%
              </span>
            </div>
          </div>

          {/* Green Progress Bar */}
          <div className="w-full bg-emerald-950/80 rounded-full h-3.5 p-0.5 border border-emerald-500/30">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1"
              style={{ width: `${currentSiswa?.capaianPersen}%` }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-emerald-200/90 pt-1">
            <span>
              Setoran Terakhir: <strong>{currentSiswa?.suratTerakhir}</strong>
            </span>
            <span>
              Total Lulus: <strong>{currentSiswa?.totalSuratLulus} Surat</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Jadwal Mengaji Saya Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Jadwal Mengaji di Masjid</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {myKelompok?.nama}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-[11px]">Hari Belajar</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {myKelompok?.jadwalHari.join(', ') || 'Senin, Rabu, Jumat'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-[11px]">Waktu Mengaji</span>
            <span className="font-bold text-emerald-800 text-sm mt-0.5 block">
              {myKelompok?.jam || '16.00 - 17.30 WIB'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-[11px]">Lokasi di Masjid</span>
            <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">
              {myKelompok?.ruang || 'Serambi Masjid Al-Jannah'}
            </span>
          </div>
        </div>
      </div>

      {/* Peta Capaian Surat Juz 30 (Checklist Hafalan) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Daftar Surat Juz 30 & Status Kelulusan</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Urutan dari Surat An-Nas (114) menuju Surat An-Naba (78)
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterSuratTab('semua')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterSuratTab === 'semua'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua (37)
            </button>
            <button
              onClick={() => setFilterSuratTab('lulus')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterSuratTab === 'lulus'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lulus ({currentSiswa?.totalSuratLulus || 0})
            </button>
            <button
              onClick={() => setFilterSuratTab('proses')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterSuratTab === 'proses'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dalam Proses ({37 - (currentSiswa?.totalSuratLulus || 0)})
            </button>
          </div>
        </div>

        {/* Grid Surat */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {memorizationOrderJuz30
            .filter((_, idx) => {
              const isPassed = idx < (currentSiswa?.totalSuratLulus || 0);
              if (filterSuratTab === 'lulus') return isPassed;
              if (filterSuratTab === 'proses') return !isPassed;
              return true;
            })
            .map((s, idx) => {
              const originalIndex = memorizationOrderJuz30.findIndex((m) => m.no === s.no);
              const isPassed = originalIndex < (currentSiswa?.totalSuratLulus || 0);

              return (
                <div
                  key={s.no}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isPassed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                      : 'bg-slate-50/70 border-slate-200 text-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1">
                      <span>{s.nama}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      No. {s.no} • {s.ayat} ayat
                    </div>
                  </div>
                  <div>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Riwayat Belajar & Setoran Saya */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Riwayat Belajar & Setoran Saya</span>
          </h3>
          <span className="text-xs text-slate-400">Total {mySetoran.length} Catatan</span>
        </div>

        <div className="space-y-3">
          {mySetoran.map((st) => (
            <div
              key={st.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors text-xs space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Surat {st.surat}
                  </span>
                  <span className="text-slate-500">Ayat {st.ayat}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      st.tipe === 'Hafalan Baru'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {st.tipe}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Nilai: {st.nilai}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {st.tanggal}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200/70">
                <div>
                  <span className="text-slate-400">Kelancaran: </span>
                  <span className="font-semibold text-slate-800">{st.kelancaran}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tajwid: </span>
                  <span className="font-semibold text-slate-800">{st.tajwid}</span>
                </div>
                <div>
                  <span className="text-slate-400">Makhraj: </span>
                  <span className="font-semibold text-slate-800">{st.makhraj}</span>
                </div>
              </div>

              {st.catatanUstadz && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 italic text-[11px]">
                  <strong>Nasehat Ustadz:</strong> "{st.catatanUstadz}"
                </div>
              )}
            </div>
          ))}

          {mySetoran.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Belum ada riwayat setoran hafalan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
