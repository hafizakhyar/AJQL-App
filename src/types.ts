export type UserRole = 'admin' | 'ustadz' | 'orang_tua' | 'siswa';

export type JenjangPendidikan = 'SD' | 'SMP' | 'SMA';

export type TipeSetoran = 'Hafalan Baru' | 'Muraja’ah';

export type KelancaranLevel = 'Sangat Lancar (Mumtaz)' | 'Lancar' | 'Cukup Lancar' | 'Perlu Diulang';

export type TajwidLevel = 'Mumtaz (Sangat Baik)' | 'Jayyid Jiddan (Baik Sekali)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)';

export type MakhrajLevel = 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan';

export type StatusKehadiran = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  jenjang: JenjangPendidikan;
  kelas: string;
  kelompokId: string;
  kelompokNama: string;
  ustadzId: string;
  ustadzNama: string;
  targetHafalan: string;
  capaianPersen: number; // e.g. 75
  totalSuratLulus: number;
  suratTerakhir: string;
  namaOrangTua: string;
  noHpOrangTua: string;
  noHpSiswa?: string;
  tanggalLahir?: string;
  alamat?: string;
  catatanTerakhir?: string;
}

export interface Ustadz {
  id: string;
  nama: string;
  gelar: string;
  noHp: string;
  spesialisasi: string;
  kelompokIds: string[];
  totalSantri: number;
  email?: string;
}

export interface KelompokMengaji {
  id: string;
  nama: string;
  jenjang: JenjangPendidikan;
  ustadzId: string;
  ustadzNama: string;
  jumlahSiswa: number;
  siswaIds: string[];
  jadwalHari: string[];
  jam: string; // e.g. "16.00 - 17.30"
  ruang: string; // e.g. "Serambi Utama Masjid Al-Jannah"
}

export interface SetoranHafalan {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelompokId: string;
  ustadzId: string;
  ustadzNama: string;
  tanggal: string; // YYYY-MM-DD
  surat: string;
  ayat: string; // e.g. "1 - 20"
  tipe: TipeSetoran;
  kelancaran: KelancaranLevel;
  tajwid: TajwidLevel;
  makhraj: MakhrajLevel;
  nilai: number; // 60 - 100
  catatanUstadz: string;
}

export interface Absensi {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelompokId: string;
  ustadzId: string;
  tanggal: string; // YYYY-MM-DD
  status: StatusKehadiran;
  keterangan?: string;
}

export interface JadwalPelajaran {
  id: string;
  kelompokId: string;
  kelompokNama: string;
  ustadzNama: string;
  hari: string;
  jam: string;
  ruang: string;
  fokus: string;
}
