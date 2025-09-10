import { useNotification } from "../../../../hooks/useNotification";
import { createSiswa, updateSiswa, deleteSiswa, bulkImportSiswa } from "../../../../services/siswaService";

export const useSiswaCRUD = (refreshData, refreshStats) => {
  const { showSuccess, showError } = useNotification();

  // Helper function to convert date to YYYY-MM-DD format
  const convertDateToAPIFormat = (dateString) => {
    if (!dateString) return null;
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(dateString)) {
      const parts = dateString.replace(/[/-]/g, '/').split('/');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // For other formats, use Date constructor but handle timezone issues
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null; // Invalid date
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error converting date to API format:', dateString, error);
      return null; // Return null if parsing fails
    }
  };

  // Add siswa (API integration)
  const addSiswaData = async (siswaData) => {
    try {
      // Validasi required fields
      if (!siswaData.nama || !siswaData.nisn || !siswaData.nik || !siswaData.jenis_kelamin) {
        showError("Error!", "Nama, NISN, NIK, dan jenis kelamin harus diisi");
        return { success: false, message: "Nama, NISN, NIK, dan jenis kelamin harus diisi" };
      }
      
      // Prepare payload for API (pure data siswa without kelas)
      const payload = {
        nisn: siswaData.nisn,
        nama: siswaData.nama,
        nik: siswaData.nik,
        jenis_kelamin: siswaData.jenis_kelamin,
        tempat_lahir: siswaData.tempat_lahir || null,
        tanggal_lahir: convertDateToAPIFormat(siswaData.tanggal_lahir),
        alamat: siswaData.alamat || null
      };
      
      const response = await createSiswa(payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Data siswa ${siswaData.nama} berhasil ditambahkan!`);
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal menambahkan data siswa');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan data siswa';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Update siswa (API integration)
  const updateSiswaData = async (idSiswa, siswaData) => {
    try {
      // Validasi required fields
      if (!siswaData.nama || !siswaData.nisn || !siswaData.nik || !siswaData.jenis_kelamin) {
        showError("Error!", "Nama, NISN, NIK, dan jenis kelamin harus diisi");
        return { success: false, message: "Nama, NISN, NIK, dan jenis kelamin harus diisi" };
      }
      
      // Prepare payload for API (pure data siswa without kelas)
      const payload = {
        nama: siswaData.nama,
        nisn: siswaData.nisn,
        nik: siswaData.nik,
        jenis_kelamin: siswaData.jenis_kelamin,
        tempat_lahir: siswaData.tempat_lahir || null,
        tanggal_lahir: convertDateToAPIFormat(siswaData.tanggal_lahir),
        alamat: siswaData.alamat || null
      };
      
      const response = await updateSiswa(idSiswa, payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || 'Data siswa berhasil diperbarui!');
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal memperbarui data siswa');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui data siswa';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Delete siswa (API integration)
  const deleteSiswaData = async (idSiswa, namaSiswa) => {
    try {
      const response = await deleteSiswa(idSiswa);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Data siswa ${namaSiswa} berhasil dihapus!`);
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal menghapus data siswa');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus data siswa';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Bulk import siswa (API integration)
  const bulkImportSiswaData = async (siswaArray) => {
    try {
      // Validasi input
      if (!siswaArray || !Array.isArray(siswaArray) || siswaArray.length === 0) {
        showError("Error!", "Data siswa tidak valid");
        return { success: false, message: "Data siswa tidak valid" };
      }

      // Validasi maksimal 50 siswa per batch
      if (siswaArray.length > 50) {
        showError("Error!", "Maksimal 50 siswa per batch");
        return { success: false, message: "Maksimal 50 siswa per batch" };
      }

      // Transform data untuk API (pure data siswa without kelas)
      const transformedData = siswaArray.map(siswa => ({
        nisn: siswa.nisn,
        nama: siswa.nama,
        nik: siswa.nik,
        jenis_kelamin: siswa.jenis_kelamin,
        tempat_lahir: siswa.tempat_lahir || null,
        tanggal_lahir: convertDateToAPIFormat(siswa.tanggal_lahir),
        alamat: siswa.alamat || null
      }));

      const response = await bulkImportSiswa(transformedData);

      if (response.success) {
        const successCount = response.data?.success_count || 0;
        const errorCount = response.data?.error_count || 0;
        
        if (errorCount > 0) {
          showError("Import Selesai", `Berhasil: ${successCount}, Gagal: ${errorCount}. Cek detail error.`);
        } else {
          showSuccess('Berhasil!', response.message || `Data siswa berhasil diimpor! ${successCount} siswa ditambahkan.`);
        }
        
        refreshData();
        refreshStats();
        return { success: true, data: response.data };
      } else {
        showError('Error!', response.message || 'Gagal mengimpor data siswa');
        return { success: false, message: response.message };
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengimpor data siswa';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  };


  return {
    addSiswaData,
    updateSiswaData,
    deleteSiswaData,
    bulkImportSiswa: bulkImportSiswaData,
    convertDateToAPIFormat
  };
};
