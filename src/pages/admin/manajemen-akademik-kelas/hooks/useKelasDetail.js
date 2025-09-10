import { useState, useEffect, useCallback } from 'react';
import { getMapelKelas } from '../../../../services/kelasService';

export const useKelasDetail = (kelasId, idTahun, semester) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!kelasId || !idTahun) {
      setData([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMapelKelas({ 
        kelas_id: kelasId, 
        page: 1, 
        limit: 100 
      });
      
      const mapelKelasData = response?.data?.items || [];
      
      // Transform data to match expected format
      const transformedData = mapelKelasData.map(item => ({
        id: item.id,
        id_mata_pelajaran: item.id_mapel,
        nama_mata_pelajaran: item.nama_mapel,
        guru_pengampu: item.nama_guru || 'Belum ditentukan',
        id_mapel: item.id_mapel,
        id_guru: item.id_guru,
        nama_kelas: kelasId,
        tahun: idTahun,
        semester: semester
      }));
      
      setData(transformedData);
      
    } catch (err) {
      setError('Gagal memuat data mata pelajaran');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [kelasId, idTahun, semester]);

  useEffect(() => {
    fetchData();
  }, [kelasId, idTahun, semester, fetchData]);

  return {
    data,
    loading,
    error,
    refreshData: fetchData
  };
};
