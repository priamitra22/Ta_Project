import { useState, useEffect, useMemo } from 'react';
import { getGuruAktif } from '../../../../services/kelasService';

export const useFormConfig = (selectedTahunAjaranId, selectedTahunAjaran, selectedSemester) => {
  const [guruOptions, setGuruOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGuruData = async () => {
    setLoading(true);
    try {
      const response = await getGuruAktif();
      const guruData = response?.data || [];
      
      // Transform data to options format
      const guruOpts = guruData.map(item => ({
        value: item.id,
        label: `${item.nama} (${item.nip})`
      }));
      setGuruOptions(guruOpts);
      
    } catch (error) {
      setGuruOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuruData();
  }, []);

  const formConfig = useMemo(() => {
    
    // Force re-render dengan key yang berbeda setiap kali
    const configKey = `${selectedTahunAjaranId}-${selectedSemester}-${selectedTahunAjaran}`;
    
    return [
      {
        name: 'nama',
        label: 'Nama Kelas',
        type: 'text',
        required: true,
        placeholder: 'Contoh: 4A',
        customValidation: (value) => {
          if (!value) return 'Nama kelas wajib diisi';
          if (value.length < 1) return 'Nama kelas minimal 1 karakter';
          return null;
        }
      },
      {
        name: 'id_tahun',
        label: '',
        type: 'hidden',
        value: selectedTahunAjaranId
      },
      {
        name: 'tahun_ajaran',
        label: '',
        type: 'hidden',
        value: selectedTahunAjaran
      },
      {
        name: 'semester',
        label: '',
        type: 'hidden',
        value: selectedSemester
      },
      {
        name: 'id_wali_guru',
        label: 'Wali Kelas',
        type: 'select',
        required: true,
        options: loading 
          ? [{ value: '', label: 'Loading...' }]
          : guruOptions,
        customValidation: (value) => {
          if (!value) return 'Wali kelas wajib dipilih';
          return null;
        }
      }
    ];
  }, [selectedTahunAjaranId, selectedTahunAjaran, selectedSemester, loading, guruOptions]);

  return {
    formConfig,
    refreshFormConfig: fetchGuruData,
    loading
  };
};
