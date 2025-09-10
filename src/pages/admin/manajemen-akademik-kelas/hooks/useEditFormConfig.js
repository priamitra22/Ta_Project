import { useState, useEffect, useMemo } from 'react';
import { getGuruAktif } from '../../../../services/kelasService';

export const useEditFormConfig = (editItem) => {
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
      console.error('Error fetching guru data:', error);
      setGuruOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuruData();
  }, []);

  const formConfig = useMemo(() => [
    {
      name: 'nama',
      label: 'Nama Kelas',
      type: 'text',
      required: true,
      placeholder: 'Contoh: 4A',
      value: editItem?.nama || '',
      customValidation: (value) => {
        if (!value) return 'Nama kelas wajib diisi';
        if (value.length < 1) return 'Nama kelas minimal 1 karakter';
        return null;
      }
    },
    {
      name: 'id_wali_guru',
      label: 'Wali Kelas',
      type: 'select',
      required: true,
      value: editItem?.wali_guru_id || '',
      options: loading 
        ? [{ value: '', label: 'Loading...' }]
        : guruOptions,
      customValidation: (value) => {
        if (!value) return 'Wali kelas wajib dipilih';
        return null;
      }
    }
  ], [editItem, loading, guruOptions]);

  return {
    formConfig,
    refreshFormConfig: fetchGuruData,
    loading
  };
};
