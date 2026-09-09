import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Siswa,
  Ustadz,
  KelompokMengaji,
  SetoranHafalan,
  Absensi,
  JadwalPelajaran,
} from '../types';
import {
  INITIAL_SISWA,
  INITIAL_USTADZ,
  INITIAL_KELOMPOK,
  INITIAL_SETORAN,
  INITIAL_ABSENSI,
  INITIAL_JADWAL,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeUstadzId: string;
  setActiveUstadzId: (id: string) => void;
  activeSiswaId: string;
  setActiveSiswaId: (id: string) => void;

  // Data
  siswaList: Siswa[];
  ustadzList: Ustadz[];
  kelompokList: KelompokMengaji[];
  setoranList: SetoranHafalan[];
  absensiList: Absensi[];
  jadwalList: JadwalPelajaran[];

  // Mutations
  addSetoran: (setoran: Omit<SetoranHafalan, 'id'>) => void;
  recordBulkAbsensi: (records: Omit<Absensi, 'id'>[]) => void;
  addSiswa: (siswa: Omit<Siswa, 'id'>) => void;
  updateSiswa: (id: string, data: Partial<Siswa>) => void;
  deleteSiswa: (id: string) => void;
  addKelompok: (kelompok: Omit<KelompokMengaji, 'id'>) => void;
  addUstadz: (ustadz: Omit<Ustadz, 'id'>) => void;
  resetAllData: () => void;

  // Active user getters
  activeUstadz: Ustadz | undefined;
  activeSiswa: Siswa | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ajql_role') as UserRole) || 'admin';
  });

  const [activeUstadzId, setActiveUstadzId] = useState<string>(() => {
    return localStorage.getItem('ajql_active_ustadz') || 'u-1';
  });

  const [activeSiswaId, setActiveSiswaId] = useState<string>(() => {
    return localStorage.getItem('ajql_active_siswa') || 's-1';
  });

  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem('ajql_siswa');
    return saved ? JSON.parse(saved) : INITIAL_SISWA;
  });

  const [ustadzList, setUstadzList] = useState<Ustadz[]>(() => {
    const saved = localStorage.getItem('ajql_ustadz');
    return saved ? JSON.parse(saved) : INITIAL_USTADZ;
  });

  const [kelompokList, setKelompokList] = useState<KelompokMengaji[]>(() => {
    const saved = localStorage.getItem('ajql_kelompok');
    return saved ? JSON.parse(saved) : INITIAL_KELOMPOK;
  });

  const [setoranList, setSetoranList] = useState<SetoranHafalan[]>(() => {
    const saved = localStorage.getItem('ajql_setoran');
    return saved ? JSON.parse(saved) : INITIAL_SETORAN;
  });

  const [absensiList, setAbsensiList] = useState<Absensi[]>(() => {
    const saved = localStorage.getItem('ajql_absensi');
    return saved ? JSON.parse(saved) : INITIAL_ABSENSI;
  });

  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(() => {
    const saved = localStorage.getItem('ajql_jadwal');
    return saved ? JSON.parse(saved) : INITIAL_JADWAL;
  });

  useEffect(() => {
    localStorage.setItem('ajql_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ajql_active_ustadz', activeUstadzId);
  }, [activeUstadzId]);

  useEffect(() => {
    localStorage.setItem('ajql_active_siswa', activeSiswaId);
  }, [activeSiswaId]);

  useEffect(() => {
    localStorage.setItem('ajql_siswa', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('ajql_setoran', JSON.stringify(setoranList));
  }, [setoranList]);

  useEffect(() => {
    localStorage.setItem('ajql_absensi', JSON.stringify(absensiList));
  }, [absensiList]);

  useEffect(() => {
    localStorage.setItem('ajql_kelompok', JSON.stringify(kelompokList));
  }, [kelompokList]);

  useEffect(() => {
    localStorage.setItem('ajql_ustadz', JSON.stringify(ustadzList));
  }, [ustadzList]);

  const addSetoran = (data: Omit<SetoranHafalan, 'id'>) => {
    const newId = `st-${Date.now()}`;
    const newEntry: SetoranHafalan = { ...data, id: newId };
    
    setSetoranList((prev) => [newEntry, ...prev]);

    // Update student's last recited and bump progress if appropriate
    setSiswaList((prev) =>
      prev.map((s) => {
        if (s.id === data.siswaId) {
          const newSurat = `${data.surat} (Ayat ${data.ayat})`;
          // Increment progress by 2% if not 100%
          const updatedProgress = Math.min(100, Math.round(s.capaianPersen + (data.tipe === 'Hafalan Baru' ? 2 : 0.5)));
          return {
            ...s,
            suratTerakhir: newSurat,
            capaianPersen: updatedProgress,
            catatanTerakhir: data.catatanUstadz || s.catatanTerakhir,
            totalSuratLulus: s.totalSuratLulus + (data.tipe === 'Hafalan Baru' ? 1 : 0),
          };
        }
        return s;
      })
    );
  };

  const recordBulkAbsensi = (records: Omit<Absensi, 'id'>[]) => {
    const newEntries: Absensi[] = records.map((r, i) => ({
      ...r,
      id: `ab-${Date.now()}-${i}`,
    }));
    setAbsensiList((prev) => [...newEntries, ...prev]);
  };

  const addSiswa = (siswaData: Omit<Siswa, 'id'>) => {
    const newId = `s-${Date.now()}`;
    const newSiswa: Siswa = { ...siswaData, id: newId };
    setSiswaList((prev) => [...prev, newSiswa]);

    // Update group count
    setKelompokList((prev) =>
      prev.map((k) =>
        k.id === siswaData.kelompokId
          ? { ...k, jumlahSiswa: k.jumlahSiswa + 1, siswaIds: [...k.siswaIds, newId] }
          : k
      )
    );
  };

  const updateSiswa = (id: string, data: Partial<Siswa>) => {
    setSiswaList((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSiswa = (id: string) => {
    setSiswaList((prev) => prev.filter((s) => s.id !== id));
  };

  const addKelompok = (kelompokData: Omit<KelompokMengaji, 'id'>) => {
    const newId = `k-${Date.now()}`;
    const newKelompok: KelompokMengaji = { ...kelompokData, id: newId };
    setKelompokList((prev) => [...prev, newKelompok]);
  };

  const addUstadz = (ustadzData: Omit<Ustadz, 'id'>) => {
    const newId = `u-${Date.now()}`;
    const newUstadz: Ustadz = { ...ustadzData, id: newId };
    setUstadzList((prev) => [...prev, newUstadz]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setSiswaList(INITIAL_SISWA);
    setUstadzList(INITIAL_USTADZ);
    setKelompokList(INITIAL_KELOMPOK);
    setSetoranList(INITIAL_SETORAN);
    setAbsensiList(INITIAL_ABSENSI);
    setJadwalList(INITIAL_JADWAL);
    setRole('admin');
    setActiveUstadzId('u-1');
    setActiveSiswaId('s-1');
  };

  const activeUstadz = ustadzList.find((u) => u.id === activeUstadzId) || ustadzList[0];
  const activeSiswa = siswaList.find((s) => s.id === activeSiswaId) || siswaList[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeUstadzId,
        setActiveUstadzId,
        activeSiswaId,
        setActiveSiswaId,
        siswaList,
        ustadzList,
        kelompokList,
        setoranList,
        absensiList,
        jadwalList,
        addSetoran,
        recordBulkAbsensi,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        addKelompok,
        addUstadz,
        resetAllData,
        activeUstadz,
        activeSiswa,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
