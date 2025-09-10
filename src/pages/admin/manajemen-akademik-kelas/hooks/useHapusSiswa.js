import { useState } from 'react';
import { hapusSiswaDariKelas } from '../../../../services/kelasService';
import { useNotification } from '../../../../hooks/useNotification';

export const useHapusSiswa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const hapusSiswa = async (kelasId, siswaId, namaSiswa, onSuccess) => {
    try {
      setIsLoading(true);
      
      await hapusSiswaDariKelas(kelasId, siswaId);
      
      showSuccess(
        'Berhasil!',
        `Siswa ${namaSiswa} berhasil dihapus dari kelas`,
        3000
      );

      // Callback untuk refresh data atau update UI
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error hapus siswa dari kelas:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Terjadi kesalahan saat menghapus siswa dari kelas';
      
      showError(
        'Error!',
        errorMessage,
        5000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hapusSiswa,
    isLoading
  };
};
