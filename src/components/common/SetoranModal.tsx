import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TipeSetoran,
  KelancaranLevel,
  TajwidLevel,
  MakhrajLevel,
} from '../../types';
import { DAFTAR_SURAT_JUZ_30 } from '../../data/mockData';
import { X, CheckCircle, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface SetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSiswaId?: string;
  preselectedUstadzId?: string;
}

export const SetoranModal: React.FC<SetoranModalProps> = ({
  isOpen,
  onClose,
  preselectedSiswaId,
  preselectedUstadzId,
}) => {
  const { siswaList, ustadzList, addSetoran, activeUstadz } = useApp();

  const [siswaId, setSiswaId] = useState('');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [surat, setSurat] = useState('An-Naba’');
  const [ayat, setAyat] = useState('1 - 20');
  const [tipe, setTipe] = useState<TipeSetoran>('Hafalan Baru');
  const [kelancaran, setKelancaran] = useState<KelancaranLevel>('Sangat Lancar (Mumtaz)');
  const [tajwid, setTajwid] = useState<TajwidLevel>('Mumtaz (Sangat Baik)');
  const [makhraj, setMakhraj] = useState<MakhrajLevel>('Sangat Baik');
  const [nilai, setNilai] = useState<number>(92);
  const [catatanUstadz, setCatatanUstadz] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    if (preselectedSiswaId) {
      setSiswaId(preselectedSiswaId);
    } else if (siswaList.length > 0 && !siswaId) {
      setSiswaId(siswaList[0].id);
    }
  }, [preselectedSiswaId, siswaList, siswaId]);

  if (!isOpen) return null;

  const currentSiswa = siswaList.find((s) => s.id === siswaId);
  const recordingUstadz = preselectedUstadzId
    ? ustadzList.find((u) => u.id === preselectedUstadzId)
    : activeUstadz || ustadzList[0];

  const quickNotesSuggestions = [
    'Makhraj fasih dan mad thabi’i terjaga rapi.',
    'Alhamdulillah sangat lancar mutqin tanpa ragu.',
    'Perhatikan ketukan ghunnah dan waqaf.',
    'Perlu pengulangan muraja’ah di ayat tengah.',
    'Irama tilawah tartil dan nafas panjang.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSiswa || !recordingUstadz) return;

    addSetoran({
      siswaId: currentSiswa.id,
      siswaNama: currentSiswa.nama,
      kelompokId: currentSiswa.kelompokId,
      ustadzId: recordingUstadz.id,
      ustadzNama: recordingUstadz.nama,
      tanggal,
      surat,
      ayat,
      tipe,
      kelancaran,
      tajwid,
      makhraj,
      nilai: Number(nilai),
      catatanUstadz: catatanUstadz.trim() || 'Setoran tercatat dengan baik.',
    });

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Catat Setoran Hafalan</h3>
              <p className="text-xs text-emerald-200">
                Pencatatan perkembangan setoran santri di masjid
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

        {/* Success toast */}
        {successNotice ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Setoran Berhasil Disimpan!</h4>
            <p className="text-sm text-slate-500">
              Riwayat dan persentase capaian santri telah otomatis diperbarui.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Siswa Selector & Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Santri / Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  id="modal-setoran-siswa"
                  value={siswaId}
                  onChange={(e) => setSiswaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  required
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.jenjang} - {s.kelompokNama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Setoran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="modal-setoran-tanggal"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Target reminder banner */}
            {currentSiswa && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2 text-xs">
                <div>
                  <span className="text-slate-600 font-medium">Target: </span>
                  <span className="font-bold text-emerald-900">{currentSiswa.targetHafalan}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">Capaian Saat Ini: </span>
                  <span className="font-bold text-emerald-800">{currentSiswa.capaianPersen}%</span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  Terakhir: {currentSiswa.suratTerakhir}
                </span>
              </div>
            )}

            {/* Surat & Ayat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surat yang Disetorkan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="modal-setoran-surat"
                    value={surat}
                    onChange={(e) => setSurat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                    required
                  >
                    <optgroup label="Juz 30">
                      {DAFTAR_SURAT_JUZ_30.map((s) => (
                        <option key={s.no} value={s.nama}>
                          {s.no}. Surat {s.nama} ({s.ayat} ayat)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Surat Pilihan Lain">
                      <option value="Al-Fatihah">Surat Al-Fatihah</option>
                      <option value="Al-Baqarah">Surat Al-Baqarah</option>
                      <option value="Ali ‘Imran">Surat Ali ‘Imran</option>
                      <option value="Al-Mulk">Surat Al-Mulk</option>
                      <option value="Al-Qalam">Surat Al-Qalam</option>
                      <option value="Ar-Rahman">Surat Ar-Rahman</option>
                      <option value="Al-Waqi’ah">Surat Al-Waqi’ah</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rentang Ayat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="modal-setoran-ayat"
                  placeholder="Contoh: 1 - 20"
                  value={ayat}
                  onChange={(e) => setAyat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Tipe Setoran (Hafalan Baru / Muraja'ah) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Setoran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Hafalan Baru', 'Muraja’ah'] as TipeSetoran[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTipe(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      tipe === t
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'Hafalan Baru' ? '✨ Hafalan Baru (Ziyadah)' : '🔁 Muraja’ah (Pengulangan)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Penilaian: Kelancaran, Tajwid, Makhraj */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelancaran
                </label>
                <select
                  id="modal-setoran-kelancaran"
                  value={kelancaran}
                  onChange={(e) => setKelancaran(e.target.value as KelancaranLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Sangat Lancar (Mumtaz)">Sangat Lancar (Mumtaz)</option>
                  <option value="Lancar">Lancar</option>
                  <option value="Cukup Lancar">Cukup Lancar</option>
                  <option value="Perlu Diulang">Perlu Diulang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kualitas Tajwid
                </label>
                <select
                  id="modal-setoran-tajwid"
                  value={tajwid}
                  onChange={(e) => setTajwid(e.target.value as TajwidLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Mumtaz (Sangat Baik)">Mumtaz (Sangat Baik)</option>
                  <option value="Jayyid Jiddan (Baik Sekali)">Jayyid Jiddan (Baik Sekali)</option>
                  <option value="Jayyid (Baik)">Jayyid (Baik)</option>
                  <option value="Maqbul (Cukup)">Maqbul (Cukup)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Makhraj Huruf
                </label>
                <select
                  id="modal-setoran-makhraj"
                  value={makhraj}
                  onChange={(e) => setMakhraj(e.target.value as MakhrajLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                </select>
              </div>
            </div>

            {/* Nilai Angka */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Nilai Angka Evaluasi
                </label>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {nilai} / 100
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={nilai}
                onChange={(e) => setNilai(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            {/* Catatan Ustadz */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Perkembangan dari Ustadz
              </label>
              <textarea
                id="modal-setoran-catatan"
                rows={2}
                value={catatanUstadz}
                onChange={(e) => setCatatanUstadz(e.target.value)}
                placeholder="Tuliskan evaluasi makhraj, tajwid, atau nasehat motivasi untuk santri & orang tua..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickNotesSuggestions.map((note, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCatatanUstadz(note)}
                    className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    + {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
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
                id="btn-submit-setoran"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simpan Setoran Santri</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
