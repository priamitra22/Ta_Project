import React, { useState, useEffect, useMemo } from 'react';
import { FaUserPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { useSiswaTanpaKelas } from '../hooks/useSiswaTanpaKelas';
import { useAssignSiswa } from '../hooks/useAssignSiswa';
import { useNotification } from '../../../../hooks/useNotification';

export const AssignSiswaModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  kelasData 
}) => {
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Use custom hook untuk mengambil data siswa tanpa kelas
  const {
    data: siswaWithoutKelas,
    loading,
    error,
    search,
    refreshData
  } = useSiswaTanpaKelas({ page: 1, limit: 20 });

  // Use custom hook untuk assign siswa
  const {
    assignSiswa,
    loading: assignLoading,
    error: assignError,
    resetError
  } = useAssignSiswa();

  // Use notification hook
  const { showSuccessMessage, showErrorMessage } = useNotification();


  // Memoize selectedSiswa IDs untuk performa
  const selectedSiswaIds = useMemo(() => {
    return selectedSiswa.map(s => s.id);
  }, [selectedSiswa]);

  // Handle search dengan debounce
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        search(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      search('');
    }
  }, [searchTerm, search]);

  // Reset state saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setSelectedSiswa([]);
      setSearchTerm('');
      resetError();
    }
  }, [isOpen, resetError]);

  const handleSiswaSelect = (siswa) => {
    setSelectedSiswa(prev => {
      const isSelected = prev.find(s => s.id === siswa.id);
      if (isSelected) {
        return prev.filter(s => s.id !== siswa.id);
      } else {
        return [...prev, siswa];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSiswa.length === siswaWithoutKelas.length && siswaWithoutKelas.length > 0) {
      setSelectedSiswa([]);
    } else {
      setSelectedSiswa([...siswaWithoutKelas]);
    }
  };

  const handleConfirm = async () => {
    if (selectedSiswa.length === 0) {
      showErrorMessage('validation', 'Pilih minimal satu siswa untuk ditambahkan ke kelas');
      return;
    }

    try {
      const siswaIds = selectedSiswa.map(siswa => siswa.id);
      const result = await assignSiswa(kelasData.id, siswaIds);
      
      if (result.success) {
        // Tampilkan hasil assign
        const { success_count, error_count, errors } = result.data;
        
        if (error_count > 0) {
          // Tampilkan error detail untuk setiap siswa yang gagal
          errors.forEach(error => {
            showErrorMessage('create', `${error.nama}: ${error.error}`, 'siswa');
          });
        }
        
        // Tampilkan success message
        showSuccessMessage('create', `siswa ke kelas ${kelasData.nama} (${success_count} berhasil, ${error_count} gagal)`);
        
        // Callback ke parent component
        onConfirm(selectedSiswa, result.data);
        onClose();
      }
    } catch (error) {
      console.error('Error assigning siswa:', error);
      showErrorMessage('create', error.message, 'siswa');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tambah Siswa ke Kelas {kelasData?.nama}
              </h3>
              <p className="text-sm text-gray-600">
                Pilih siswa yang akan ditambahkan ke kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Display */}
          {assignError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-800 font-medium">Error:</span>
              </div>
              <p className="text-red-700 mt-1">{assignError}</p>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari siswa berdasarkan nama, NISN, atau nama orang tua..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Select All */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSiswa.length === siswaWithoutKelas.length && siswaWithoutKelas.length > 0}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label 
                className="text-sm font-medium text-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
              >
                Pilih Semua ({siswaWithoutKelas.length} siswa)
              </label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedSiswa.length} siswa dipilih
            </div>
          </div>

          {/* List Siswa */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Memuat data siswa...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <FaUserPlus className="w-12 h-12 mx-auto mb-4 text-red-300" />
                <p>Error: {error}</p>
                <button 
                  onClick={refreshData}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Coba Lagi
                </button>
              </div>
            ) : siswaWithoutKelas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaUserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Tidak ada siswa yang tersedia</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {siswaWithoutKelas.map((siswa) => {
                  const isSelected = selectedSiswaIds.includes(siswa.id);
                  
                  return (
                    <div
                      key={siswa.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleSiswaSelect(siswa)}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSiswaSelect(siswa);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">{siswa.nama}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              siswa.jenis_kelamin === "L" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-pink-100 text-pink-800"
                            }`}>
                              {siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <span className="font-mono">{siswa.nisn}</span> • {siswa.tempat_lahir} • {siswa.nama_ortu || 'Tidak ada data orang tua'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedSiswa.length === 0 || assignLoading}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedSiswa.length === 0 || assignLoading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {assignLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menambahkan...</span>
              </>
            ) : (
              <>
                <FaUserPlus className="w-4 h-4" />
                <span>Tambah {selectedSiswa.length} Siswa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
