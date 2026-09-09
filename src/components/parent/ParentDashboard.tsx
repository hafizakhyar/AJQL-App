import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  Phone,
  Clock,
  Sparkles,
  CheckCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { activeSiswa, activeSiswaId, setActiveSiswaId, siswaList, setoranList, absensiList, kelompokList } =
    useApp();

  const currentSiswa = activeSiswa || siswaList[0];
  const studentSetoran = setoranList.filter((st) => st.siswaId === currentSiswa?.id);
  const studentAbsensi = absensiList.filter((ab) => ab.siswaId === currentSiswa?.id);
  const studentKelompok = kelompokList.find((k) => k.id === currentSiswa?.kelompokId);

  const totalHadir = studentAbsensi.filter((a) => a.status === 'Hadir').length;
  const attendanceRate =
    studentAbsensi.length > 0 ? Math.round((totalHadir / studentAbsensi.length) * 100) : 100;

  const latestSetoran = studentSetoran[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src="/logo.svg"
            alt="Logo AJQL"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
                Portal Wali Santri
              </span>
              <span className="text-xs text-slate-500 font-medium">Assalamu’alaikum Warahmatullahi Wabarakatuh</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Perkembangan Mengaji Ananda {currentSiswa?.nama.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-500">
              Laporan hafalan, kedisiplinan, dan catatan bimbingan ustadz di Masjid Al-Jannah
            </p>
          </div>
        </div>

        {/* Switch child selector if multiple students */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs">
          <label htmlFor="parent-switch-child" className="block text-[11px] font-semibold text-slate-500 mb-1">
            Pilih Ananda:
          </label>
          <select
            id="parent-switch-child"
            value={activeSiswaId}
            onChange={(e) => setActiveSiswaId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
          >
            {siswaList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.jenjang})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Progress Hafalan Besar */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-700 text-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-200" />
              <h2 className="font-bold text-sm text-emerald-100">Capaian Target Hafalan</h2>
            </div>
            <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              Target: {currentSiswa?.targetHafalan}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {currentSiswa?.capaianPersen}%
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                {currentSiswa?.totalSuratLulus} Surat Selesai
              </span>
            </div>

            {/* Large Green Progress Bar */}
            <div className="w-full bg-emerald-950/60 rounded-full h-4 p-0.5 border border-emerald-500/40">
              <div
                className="bg-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${currentSiswa?.capaianPersen}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100">
            <span>
              Hafalan Terakhir: <strong>{currentSiswa?.suratTerakhir}</strong>
            </span>
            <span className="text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded-md">
              {currentSiswa?.jenjang} • {currentSiswa?.kelas}
            </span>
          </div>
        </div>

        {/* Card 2: Kehadiran di Masjid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h2 className="font-bold text-sm text-slate-800">Kehadiran di Masjid</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {attendanceRate}% Hadir
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Total Pertemuan</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                  {studentAbsensi.length} Hari
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">Hadir Rajin</span>
                <span className="text-xl font-bold text-emerald-800 mt-0.5 block">
                  {totalHadir} Hari
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Kelompok: <strong>{currentSiswa?.kelompokNama}</strong></span>
            <span className="text-emerald-700 font-semibold">Istiqomah di Masjid</span>
          </div>
        </div>
      </div>

      {/* Card 3: Setoran Hafalan Terbaru & Catatan Ustadz */}
      {latestSetoran && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Setoran Hafalan Terbaru</h3>
                <p className="text-xs text-slate-500">Disimak pada {latestSetoran.tanggal}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Nilai: {latestSetoran.nilai}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Surat & Ayat</span>
              <span className="font-bold text-slate-800 text-sm">
                Surat {latestSetoran.surat}
              </span>
              <span className="text-slate-500 block">Ayat {latestSetoran.ayat}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tingkat Kelancaran</span>
              <span className="font-semibold text-emerald-700 block mt-0.5">
                {latestSetoran.kelancaran}
              </span>
              <span className="text-[11px] text-slate-500">Tajwid: {latestSetoran.tajwid}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kategori</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                {latestSetoran.tipe}
              </span>
            </div>
          </div>

          {/* Catatan Ustadz Highlight Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <MessageSquare className="w-4 h-4" />
              <span>Pesan & Evaluasi dari {currentSiswa?.ustadzNama}:</span>
            </div>
            <p className="text-slate-700 italic leading-relaxed pl-5">
              "{latestSetoran.catatanUstadz}"
            </p>
          </div>
        </div>
      )}

      {/* Riwayat Setoran Sebelumnya */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Riwayat Setoran Sebelumnya
          </h3>
          <span className="text-xs text-slate-400">Total {studentSetoran.length} Catatan</span>
        </div>

        <div className="space-y-2.5">
          {studentSetoran.slice(1, 6).map((st) => (
            <div
              key={st.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">
                    Surat {st.surat}
                  </span>
                  <span className="text-slate-500 font-medium">Ayat {st.ayat}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {st.tipe}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Tajwid: {st.tajwid} • Makhraj: {st.makhraj}
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                  {st.kelancaran}
                </span>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {st.tanggal}
                </span>
              </div>
            </div>
          ))}

          {studentSetoran.length <= 1 && (
            <div className="text-center py-4 text-xs text-slate-400">
              Belum ada riwayat setoran tambahan lainnya.
            </div>
          )}
        </div>
      </div>

      {/* Jadwal & Kontak Ustadz Pembimbing */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Informasi Halaqah & Kontak Pembimbing
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Jadwal Mengaji di Masjid</span>
            </div>
            <p className="text-slate-600 font-medium">
              {studentKelompok?.jadwalHari.join(', ') || 'Senin, Rabu, Jumat'}
            </p>
            <p className="text-emerald-800 font-bold">
              {studentKelompok?.jam || '16.00 - 17.30 WIB'}
            </p>
            <div className="text-slate-500 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3" />
              <span>{studentKelompok?.ruang || 'Masjid Al-Jannah'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-800">Ustadz Pembimbing</div>
              <p className="text-sm font-bold text-emerald-800 mt-1">{currentSiswa?.ustadzNama}</p>
              <p className="text-slate-500 text-[11px]">
                Pengajar Halaqah Tahfidz Al-Jannah
              </p>
            </div>
            <a
              href="https://wa.me/6281289213401"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Ustadz via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
