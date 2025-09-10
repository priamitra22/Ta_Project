import { useState, useEffect, useMemo } from 'react';
import { getMataPelajaran } from '../../../../services/mataPelajaranService';
import { getGuruAktif } from '../../../../services/kelasService';

export const useMataPelajaranFormConfig = () => {
  const [mataPelajaranOptions, setMataPelajaranOptions] = useState([]);
  const [guruOptions, setGuruOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      // Fetch mata pelajaran
      const res = await getMataPelajaran(1, 20, search);
      const list = res?.data?.mataPelajaran || res?.data || [];
      const mapelOpts = list.map(item => ({ value: item.id, label: item.nama }));
      setMataPelajaranOptions(mapelOpts);

      // Fetch guru aktif
      const guruRes = await getGuruAktif();
      const guruData = guruRes?.data || [];
      const guruOpts = guruData.map(item => ({
        value: item.id,
        label: `${item.nama} (${item.nip})`
      }));
      setGuruOptions(guruOpts);
      
    } catch (error) {
      setMataPelajaranOptions([]);
      setGuruOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("");
  }, []);

  const formConfig = useMemo(() => [
    {
      name: 'id_mata_pelajaran',
      label: 'Mata Pelajaran',
      type: 'select',
      required: true,
      options: loading 
        ? [{ value: '', label: 'Loading...' }]
        : mataPelajaranOptions,
      customValidation: (value) => {
        if (!value) return 'Mata pelajaran wajib dipilih';
        return null;
      }
    },
    {
      name: 'id_guru',
      label: 'Guru Pengampu',
      type: 'select',
      required: true,
      options: loading 
        ? [{ value: '', label: 'Loading...' }]
        : guruOptions,
      customValidation: (value) => {
        if (!value) return 'Guru pengampu wajib dipilih';
        return null;
      }
    }
  ], [loading, mataPelajaranOptions, guruOptions]);

  // Form config khusus untuk edit (hanya guru yang bisa diubah)
  const editFormConfig = useMemo(() => [
    {
      name: 'id_guru',
      label: 'Guru Pengampu',
      type: 'select',
      required: true,
      options: loading 
        ? [{ value: '', label: 'Loading...' }]
        : guruOptions,
      customValidation: (value) => {
        if (!value) return 'Guru pengampu wajib dipilih';
        return null;
      }
    }
  ], [loading, guruOptions]);

  return {
    formConfig,
    editFormConfig,
    refreshFormConfig: fetchData,
    loading
  };
};
