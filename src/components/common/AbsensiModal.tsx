import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusKehadiran } from '../../types';
import { X, CheckCircle2, UserCheck, Calendar, Users } from 'lucide-react';

interface AbsensiModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedKelompokId?: string;
}

export const AbsensiModal: React.FC<AbsensiModalProps> = ({
  isOpen,
  onClose,
  preselectedKelompokId,
}) => {
  const { kelompokList, siswaList, recordBulkAbsensi, activeUstadz } = useApp();

  const [kelompokId, setKelompokId] = useState('');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: StatusKehadiran; keterangan: string }>
  >({});
  const [isSaved, setIsSaved] = useState(false);

  // Initialize group selection
  useEffect(() => {
    if (preselectedKelompokId) {
      setKelompokId(preselectedKelompokId);
    } else if (activeUstadz && activeUstadz.kelompokIds.length > 0) {
      setKelompokId(activeUstadz.kelompokIds[0]);
    } else if (kelompokList.length > 0 && !kelompokId) {
      setKelompokId(kelompokList[0].id);
    }
  }, [preselectedKelompokId, activeUstadz, kelompokList, kelompokId]);

  // When group changes, populate student list with default 'Hadir'
  const currentKelompok = kelompokList.find((k) => k.id === kelompokId);
  const studentsInGroup = siswaList.filter((s) => s.kelompokId === kelompokId);

  useEffect(() => {
    const initialState: Record<string, { status: StatusKehadiran; keterangan: string }> = {};
    studentsInGroup.forEach((s) => {
      initialState[s.id] = { status: 'Hadir', keterangan: '' };
    });
    setAttendanceState(initialState);
  }, [kelompokId, siswaList]);

  if (!isOpen) return null;

  const handleStatusChange = (siswaId: string, status: StatusKehadiran) => {
    setAttendanceState((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        status,
      },
    }));
  };

  const handleKeteranganChange = (siswaId: string, keterangan: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        keterangan,
      },
    }));
  };

  const handleMarkAllHadir = () => {
    const updated: Record<string, { status: StatusKehadiran; keterangan: string }> = {};
    studentsInGroup.forEach((s) => {
      updated[s.id] = { status: 'Hadir', keterangan: '' };
    });
    setAttendanceState(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKelompok) return;

    const records = studentsInGroup.map((s) => {
      const att = attendanceState[s.id] || { status: 'Hadir', keterangan: '' };
      return {
        siswaId: s.id,
        siswaNama: s.nama,
        kelompokId: currentKelompok.id,
        ustadzId: currentKelompok.ustadzId,
        tanggal,
        status: att.status,
        keterangan: att.keterangan || undefined,
      };
    });

    recordBulkAbsensi(records);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center border border-emerald-500/30">
              <UserCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Isi Kehadiran Halaqah</h3>
              <p className="text-xs text-emerald-200">
                Pencatatan presensi siswa mengaji di masjid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Presensi Berhasil Disimpan!</h4>
            <p className="text-sm text-slate-500">
              Data kehadiran kelompok santri telah tersimpan ke sistem.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Top controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelompok Mengaji
                </label>
                <div className="relative">
                  <select
                    id="modal-absensi-kelompok"
                    value={kelompokId}
                    onChange={(e) => setKelompokId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    {kelompokList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} ({k.jumlahSiswa} Siswa - {k.ustadzNama})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Pertemuan
                </label>
                <input
                  type="date"
                  id="modal-absensi-tanggal"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Quick action: mark all present */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Daftar Santri ({studentsInGroup.length} orang)</span>
              </div>
              <button
                type="button"
                onClick={handleMarkAllHadir}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              >
                ✓ Set Semua Hadir
              </button>
            </div>

            {/* Student attendance items */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {studentsInGroup.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Tidak ada santri yang terdaftar dalam kelompok ini.
                </div>
              ) : (
                studentsInGroup.map((s, idx) => {
                  const currentStatus = attendanceState[s.id]?.status || 'Hadir';
                  const currentKet = attendanceState[s.id]?.keterangan || '';

                  return (
                    <div
                      key={s.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{s.nama}</div>
                          <div className="text-[11px] text-slate-500">
                            {s.jenjang} • Target: {s.targetHafalan}
                          </div>
                        </div>
                      </div>

                      {/* Status pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as StatusKehadiran[]).map((status) => {
                          const isSelected = currentStatus === status;
                          const colorClasses = {
                            Hadir: isSelected
                              ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50',
                            Izin: isSelected
                              ? 'bg-amber-600 text-white border-amber-600 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50',
                            Sakit: isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50',
                            Alpa: isSelected
                              ? 'bg-rose-600 text-white border-rose-600 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50',
                          }[status];

                          return (
                            <button
                              type="button"
                              key={status}
                              onClick={() => handleStatusChange(s.id, status)}
                              className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${colorClasses}`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>

                      {/* Optional note when Izin/Sakit */}
                      {currentStatus !== 'Hadir' && (
                        <div className="w-full sm:w-48">
                          <input
                            type="text"
                            placeholder="Alasan / keterangan..."
                            value={currentKet}
                            onChange={(e) => handleKeteranganChange(s.id, e.target.value)}
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-submit-absensi"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Kehadiran</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
