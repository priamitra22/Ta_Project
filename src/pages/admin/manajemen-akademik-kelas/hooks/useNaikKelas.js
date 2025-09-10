import { useState, useCallback } from 'react';
import { naikKelasSiswa } from '../../../../services/kelasService';
import { useNotification } from '../../../../hooks/useNotification';

export const useNaikKelas = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccessMessage, showErrorMessage } = useNotification();

  const prosesNaikKelas = useCallback(async (payload) => {
    setLoading(true);
    try {
      const response = await naikKelasSiswa(payload);
      
      // Tampilkan notifikasi sukses dengan detail
      const { data } = response;
      const totalKelas = data.total_kelas;
      const totalSiswa = data.total_siswa;
      
      showSuccessMessage(
        'update', 
        `Berhasil memproses naik kelas! ${totalKelas} kelas dengan ${totalSiswa} siswa telah dipindah ke ${data.tahun_ajaran_tujuan.tahun} ${data.tahun_ajaran_tujuan.semester}`
      );
      
      return response;
    } catch (error) {
      console.error('Error naik kelas:', error);
      
      // Handle error response
      const errorMessage = error.response?.data?.message || 'Gagal memproses naik kelas';
      const errors = error.response?.data?.errors || [];
      
      if (errors.length > 0) {
        // Tampilkan error detail jika ada
        const errorDetails = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        showErrorMessage('update', `${errorMessage}. ${errorDetails}`, 'naik kelas');
      } else {
        showErrorMessage('update', errorMessage, 'naik kelas');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showSuccessMessage, showErrorMessage]);

  return {
    loading,
    prosesNaikKelas
  };
};
