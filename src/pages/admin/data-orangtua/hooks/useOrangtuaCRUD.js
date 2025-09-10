import { useState, useEffect } from "react";
import { useNotification } from "../../../../hooks/useNotification";
import { 
  createOrangtua, 
  updateOrangtua, 
  deleteOrangtua, 
  bulkImportOrangtua,
  getSiswaOptions,
  getSiswaOptionsForEdit,
  getOrangtuaById
} from "../../../../services/orangtuaService";

export const useOrangtuaCRUD = (refreshData, refreshStats) => {
  const { showSuccess, showError } = useNotification();
  
  // State for anak options
  const [anakOptions, setAnakOptions] = useState([]);
  const [anakLoading, setAnakLoading] = useState(false);
  const [anakOptionsForEdit, setAnakOptionsForEdit] = useState([]);

  // Fetch anak options for add mode (menggunakan API real)
  const fetchAnakOptions = async () => {
    setAnakLoading(true);
    try {
      const response = await getSiswaOptions();
      
      if (response.success) {
        setAnakOptions(response.data || []);
      } else {
        setAnakOptions([]);
      }
      
    } catch (error) {
      setAnakOptions([]);
    } finally {
      setAnakLoading(false);
    }
  };

  // Fetch anak options for edit mode (menggunakan API real)
  const fetchAnakOptionsForEdit = async (idOrangtua) => {
    try {
      const response = await getSiswaOptionsForEdit(idOrangtua);
      
      if (response.success) {
        setAnakOptionsForEdit(response.data || []);
        return response.data || [];
      } else {
        setAnakOptionsForEdit([]);
        return [];
      }
      
    } catch (error) {
      setAnakOptionsForEdit([]);
      return [];
    }
  };

  // Load data for edit mode
  const loadEditData = async (id) => {
    try {
      // Ambil data orangtua
      const orangtuaResponse = await getOrangtuaById(id);
      
      // ✅ PERBAIKAN: Cek response.message dan response.data
      if (orangtuaResponse.message && orangtuaResponse.data) {
        const orangtuaData = orangtuaResponse.data;

        // Ambil dropdown siswa untuk edit
        let siswaResponse = { message: null, data: [] };
        try {
          siswaResponse = await getSiswaOptionsForEdit(id);
        } catch (siswaError) {
          // Continue with empty siswa options
        }
        
        if (siswaResponse.message && siswaResponse.data) {
          setAnakOptionsForEdit(siswaResponse.data || []);
        }
        
        return {
          success: true,
          data: orangtuaData,
          anakOptions: (siswaResponse.message && siswaResponse.data) ? (siswaResponse.data || []) : []
        };
      } else {
        showError("Error!", orangtuaResponse.message || "Gagal mengambil data orangtua");
        return { success: false, message: orangtuaResponse.message || "Gagal mengambil data orangtua" };
      }
    } catch (error) {
      showError("Error!", "Gagal mengambil data untuk edit");
      return { success: false, message: "Gagal mengambil data untuk edit" };
    }
  };

  // Fetch anak options on mount
  useEffect(() => {
    fetchAnakOptions();
  }, []);

  // Add orangtua (menggunakan API real)
  const addOrangtuaData = async (orangtuaData) => {
    try {
      // Validasi input
      if (!orangtuaData.nama || !orangtuaData.nik) {
        showError("Error!", "Nama dan NIK harus diisi");
        return { success: false, message: "Nama dan NIK harus diisi" };
      }
      
      // Prepare payload sesuai backend (anak_ids array)
      const payload = {
        nama: orangtuaData.nama,
        nik: orangtuaData.nik,
        kontak: orangtuaData.kontak || null,
        relasi: orangtuaData.relasi || null,
        anak_ids: Array.isArray(orangtuaData.anak_ids) ? orangtuaData.anak_ids : []
      };
      
      const response = await createOrangtua(payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Data orangtua ${orangtuaData.nama} berhasil ditambahkan!`);
        refreshData();
        refreshStats();
        // Refresh anak options after adding
        fetchAnakOptions();
        return { success: true };
      } else {
        showError("Error!", response.message || "Gagal menambahkan data orangtua");
        return { success: false, message: response.message || "Gagal menambahkan data orangtua" };
      }
      
    } catch (error) {
      showError("Error!", "Gagal menambahkan data orangtua");
      return { success: false, message: "Gagal menambahkan data orangtua" };
    }
  };

  // Update orangtua (menggunakan API real)
  const updateOrangtuaData = async (idOrangtua, orangtuaData) => {
    try {
      // Validasi input
      if (!orangtuaData.nama || !orangtuaData.nik) {
        showError("Error!", "Nama dan NIK harus diisi");
        return { success: false, message: "Nama dan NIK harus diisi" };
      }
      
      // Prepare payload sesuai backend (anak_ids array)
      const payload = {
        nama: orangtuaData.nama,
        nik: orangtuaData.nik,
        kontak: orangtuaData.kontak || null,
        relasi: orangtuaData.relasi || null,
        anak_ids: Array.isArray(orangtuaData.anak_ids) ? orangtuaData.anak_ids : []
      };
      
      const response = await updateOrangtua(idOrangtua, payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || "Data orangtua berhasil diperbarui!");
        refreshData();
        refreshStats();
        // Refresh anak options after update
        await fetchAnakOptions();
        return { success: true };
      } else {
        showError("Error!", response.message || "Gagal memperbarui data orangtua");
        return { success: false, message: response.message || "Gagal memperbarui data orangtua" };
      }
      
    } catch (error) {
      showError("Error!", "Gagal memperbarui data orangtua");
      return { success: false, message: "Gagal memperbarui data orangtua" };
    }
  };

  // Delete orangtua (menggunakan API real)
  const deleteOrangtuaData = async (idOrangtua, namaOrangtua) => {
    try {
      const response = await deleteOrangtua(idOrangtua);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Data orangtua ${namaOrangtua} berhasil dihapus!`);
        refreshData();
        refreshStats();
        // Refresh anak options after delete
        await fetchAnakOptions();
        return { success: true };
      } else {
        showError("Error!", response.message || "Gagal menghapus data orangtua");
        return { success: false, message: response.message || "Gagal menghapus data orangtua" };
      }
      
    } catch (error) {
      showError("Error!", "Gagal menghapus data orangtua");
      return { success: false, message: "Gagal menghapus data orangtua" };
    }
  };

  // Bulk import orangtua (menggunakan API real)
  const bulkImportOrangtuaData = async (orangtuaArray) => {
    try {
      // Validasi input
      if (!Array.isArray(orangtuaArray) || orangtuaArray.length === 0) {
        showError("Error!", "Data orangtua tidak valid");
        return { success: false, message: "Data orangtua tidak valid" };
      }
      
      const response = await bulkImportOrangtua(orangtuaArray);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Data orangtua berhasil diimpor! ${orangtuaArray.length} orangtua ditambahkan.`);
        refreshData();
        refreshStats();
        // Refresh anak options after bulk import
        fetchAnakOptions();
        return { success: true };
      } else {
        showError("Error!", response.message || "Gagal mengimpor data orangtua");
        return { success: false, message: response.message || "Gagal mengimpor data orangtua" };
      }
      
    } catch (error) {
      showError("Error!", "Gagal mengimpor data orangtua");
      return { success: false, message: "Gagal mengimpor data orangtua" };
    }
  };

  return {
    addOrangtuaData,
    updateOrangtuaData,
    deleteOrangtuaData,
    bulkImportOrangtua: bulkImportOrangtuaData,
    anakOptions,
    anakLoading,
    anakOptionsForEdit,
    fetchAnakOptions,
    fetchAnakOptionsForEdit,
    loadEditData
  };
};
