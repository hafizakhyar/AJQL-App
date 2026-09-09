import React, { useState } from 'react';
import { Siswa } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  GraduationCap,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Phone,
  MessageSquare,
  Clock,
} from 'lucide-react';

interface StudentDetailModalProps {
  siswa: Siswa | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSetoran?: (siswaId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  siswa,
  isOpen,
  onClose,
  onOpenSetoran,
}) => {
  const { setoranList, absensiList } = useApp();
  const [activeTab, setActiveTab] = useState<'hafalan' | 'kehadiran' | 'info'>('hafalan');

  if (!isOpen || !siswa) return null;

  const studentSetoran = setoranList.filter((s) => s.siswaId === siswa.id);
  const studentAbsensi = absensiList.filter((a) => a.siswaId === siswa.id);

  const totalHadir = studentAbsensi.filter((a) => a.status === 'Hadir').length;
  const attendanceRate =
    studentAbsensi.length > 0 ? Math.round((totalHadir / studentAbsensi.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Profile Card */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {siswa.nama.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold">{siswa.nama}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-100 border border-emerald-500/40">
                  {siswa.jenjang} • {siswa.kelas}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white">
                  NIS: {siswa.nis}
                </span>
              </div>
              <div className="text-xs text-emerald-100/90 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Pembimbing: {siswa.ustadzNama}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {siswa.kelompokNama}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar Hijau */}
          <div className="mt-5 bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-300" />
                <span className="font-semibold text-emerald-100">Target Hafalan:</span>
                <span className="font-bold text-white bg-emerald-900/80 px-2 py-0.5 rounded-md">
                  {siswa.targetHafalan}
                </span>
              </div>
              <div className="text-right">
                <span className="text-emerald-200 text-[11px] mr-1">Capaian:</span>
                <span className="font-bold text-base text-white">{siswa.capaianPersen}%</span>
              </div>
            </div>

            {/* Custom Green Progress Bar */}
            <div className="w-full bg-emerald-950/60 rounded-full h-3.5 p-0.5 overflow-hidden border border-emerald-500/30">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                style={{ width: `${Math.min(100, Math.max(5, siswa.capaianPersen))}%` }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-emerald-200/90 mt-2">
              <span>Hafalan Terakhir: <strong>{siswa.suratTerakhir}</strong></span>
              <span>Total Lulus: <strong>{siswa.totalSuratLulus} Surat</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('hafalan')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'hafalan'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Riwayat Setoran ({studentSetoran.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('kehadiran')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'kehadiran'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kehadiran ({attendanceRate}%)</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Data & Kontak Wali</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeTab === 'hafalan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Catatan Setoran Santri
                </h4>
                {onOpenSetoran && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSetoran(siswa.id);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    + Tambah Setoran Baru
                  </button>
                )}
              </div>

              {studentSetoran.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada rekaman setoran untuk santri ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentSetoran.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            Surat {st.surat}
                          </span>
                          <span className="text-xs text-slate-500">Ayat {st.ayat}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              st.tipe === 'Hafalan Baru'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {st.tipe}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Nilai: {st.nilai}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {st.tanggal}
                          </span>
                        </div>
                      </div>

                      {/* Details parameter */}
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                        <div>
                          <span className="text-slate-400">Kelancaran: </span>
                          <span className="font-semibold text-slate-700">{st.kelancaran}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Tajwid: </span>
                          <span className="font-semibold text-slate-700">{st.tajwid}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Makhraj: </span>
                          <span className="font-semibold text-slate-700">{st.makhraj}</span>
                        </div>
                      </div>

                      {/* Catatan ustadz */}
                      {st.catatanUstadz && (
                        <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-emerald-800">Catatan Ustadz: </span>
                            {st.catatanUstadz}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'kehadiran' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <div className="text-xs text-emerald-700 font-semibold">Tingkat Hadir</div>
                  <div className="text-xl font-bold text-emerald-900 mt-0.5">{attendanceRate}%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Total Hadir</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">{totalHadir} Hari</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Total Pertemuan</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {studentAbsensi.length} Hari
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Log Kehadiran di Masjid
                </h4>
                {studentAbsensi.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada data presensi pertemuan.
                  </p>
                ) : (
                  studentAbsensi.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200/80"
                    >
                      <span className="font-medium text-slate-700">{a.tanggal}</span>
                      <div className="flex items-center gap-2">
                        {a.keterangan && (
                          <span className="text-[11px] text-slate-400 italic">
                            ({a.keterangan})
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            a.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'Izin'
                              ? 'bg-amber-100 text-amber-800'
                              : a.status === 'Sakit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Nama Lengkap</span>
                  <span className="font-bold text-slate-800">{siswa.nama}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Jenjang & Tingkat</span>
                  <span className="font-bold text-slate-800">
                    {siswa.jenjang} - {siswa.kelas}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Kelompok Mengaji</span>
                  <span className="font-bold text-slate-800">{siswa.kelompokNama}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Ustadz Pembimbing</span>
                  <span className="font-bold text-emerald-800">{siswa.ustadzNama}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Wali / Orang Tua</span>
                  <span className="font-bold text-slate-800">{siswa.namaOrangTua}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Kontak WhatsApp Wali
                  </span>
                  <a
                    href={`https://wa.me/${siswa.noHpOrangTua.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                  >
                    {siswa.noHpOrangTua}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
