import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useTahunAjaranOptions } from '../hooks/useTahunAjaranOptions';
import { useKelasMappingOptions } from '../hooks/useKelasMappingOptions';
import { useNaikKelasPreview } from '../hooks/useNaikKelasPreview';
import { useNaikKelas } from '../hooks/useNaikKelas';
import { useNotification } from '../../../../hooks/useNotification';

export const NaikKelasModal = ({ 
  isOpen, 
  onClose, 
  onConfirm
}) => {
  const [tahunAjaranTujuan, setTahunAjaranTujuan] = useState('');
  const [semesterTujuan, setSemesterTujuan] = useState('');
  const [mappingKelas, setMappingKelas] = useState({});

  // Use API untuk mendapatkan tahun ajaran options
  const { 
    options: tahunAjaranOptions, 
    loading: tahunAjaranLoading, 
    error: tahunAjaranError 
  } = useTahunAjaranOptions(true); // forNaikKelas = true

  // Get tahun ajaran tujuan ID untuk mapping kelas
  const tahunAjaranTujuanId = tahunAjaranTujuan && semesterTujuan 
    ? tahunAjaranOptions.find(
        ta => ta.tahun === tahunAjaranTujuan && ta.semester === semesterTujuan
      )?.id
    : null;

  // Use API untuk mendapatkan mapping kelas options
  const {
    kelasAsal,
    kelasTujuan,
    loading: mappingLoading,
    error: mappingError
  } = useKelasMappingOptions(tahunAjaranTujuanId);

  // Use API untuk mendapatkan preview naik kelas
  const {
    previewData,
    loading: previewLoading,
    error: previewError
  } = useNaikKelasPreview(tahunAjaranTujuanId);

  // Use API untuk proses naik kelas
  const {
    loading: naikKelasLoading,
    prosesNaikKelas
  } = useNaikKelas();

  // Use notification hook
  const { showErrorMessage } = useNotification();



  // Reset state saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setTahunAjaranTujuan('');
      setSemesterTujuan('');
      setMappingKelas({});
    }
  }, [isOpen]);

  // Update semester options berdasarkan tahun ajaran yang dipilih
  const semesterOptions = tahunAjaranOptions
    .filter(ta => ta.tahun === tahunAjaranTujuan)
    .map(ta => ta.semester);

  // Update mapping kelas berdasarkan tahun ajaran tujuan
  useEffect(() => {
    if (tahunAjaranTujuan && semesterTujuan && kelasAsal.length > 0 && kelasTujuan.length > 0) {
      // Auto-mapping jika ada kelas dengan nama yang sama
      const newMapping = {};
      kelasAsal.forEach(kelasAsalItem => {
        const kelasTujuanSama = kelasTujuan.find(
          k => k.nama === kelasAsalItem.nama
        );
        if (kelasTujuanSama) {
          newMapping[kelasAsalItem.id_kelas] = kelasTujuanSama.id_kelas;
        }
      });
      
      setMappingKelas(newMapping);
    }
  }, [tahunAjaranTujuan, semesterTujuan, kelasAsal, kelasTujuan]);

  const handleMappingChange = (kelasAsalId, kelasTujuanId) => {
    setMappingKelas(prev => ({
      ...prev,
      [kelasAsalId]: kelasTujuanId
    }));
  };

  const handleConfirm = async () => {
    if (!tahunAjaranTujuan || !semesterTujuan) {
      showErrorMessage('validation', 'Pilih tahun ajaran dan semester tujuan');
      return;
    }

    if (Object.keys(mappingKelas).length === 0) {
      showErrorMessage('validation', 'Setidaknya satu mapping kelas harus diisi');
      return;
    }

    try {
      const tahunAjaranTujuanData = tahunAjaranOptions.find(
        ta => ta.tahun === tahunAjaranTujuan && ta.semester === semesterTujuan
      );
      
      const payload = {
        tahun_ajaran_tujuan_id: tahunAjaranTujuanData.id,
        mapping_kelas: mappingKelas
      };
      
      await prosesNaikKelas(payload);
      
      // Panggil callback untuk refresh data
      if (onConfirm) {
        onConfirm(payload);
      }
      
      onClose();
    } catch (error) {
      // Error sudah dihandle di hook useNaikKelas
      console.error('Error naik kelas:', error);
    }
  };

  // Hitung total siswa yang akan dipindah
  const totalSiswa = Object.keys(mappingKelas).reduce((total, kelasAsalId) => {
    const kelasAsalItem = kelasAsal.find(k => k.id_kelas === parseInt(kelasAsalId));
    return total + (kelasAsalItem?.jumlah_siswa || 0);
  }, 0);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaGraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Naik Kelas Siswa
              </h3>
              <p className="text-sm text-gray-600">
                Pindahkan siswa ke kelas di tahun ajaran berikutnya
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
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tahun Ajaran dan Semester Tujuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Ajaran Tujuan:
              </label>
              <select
                value={tahunAjaranTujuan}
                onChange={(e) => {
                  setTahunAjaranTujuan(e.target.value);
                  setSemesterTujuan('');
                }}
                disabled={tahunAjaranLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {tahunAjaranLoading ? 'Memuat tahun ajaran...' : 'Pilih tahun ajaran'}
                </option>
                {tahunAjaranOptions.map(ta => (
                  <option key={`${ta.tahun}-${ta.semester}`} value={ta.tahun}>
                    {ta.tahun}
                  </option>
                ))}
              </select>
              {tahunAjaranError && (
                <p className="mt-1 text-sm text-red-600">{tahunAjaranError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester Tujuan:
              </label>
              <select
                value={semesterTujuan}
                onChange={(e) => setSemesterTujuan(e.target.value)}
                disabled={!tahunAjaranTujuan}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Pilih semester</option>
                {semesterOptions.map((semester, index) => (
                  <option key={`semester-${index}`} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mapping Kelas */}
          {tahunAjaranTujuan && semesterTujuan && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Mapping Kelas Asal → Kelas Tujuan
              </h4>
              <div className="space-y-4">
                {mappingLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Memuat data mapping kelas...</p>
                  </div>
                ) : mappingError ? (
                  <div className="p-8 text-center text-red-500">
                    <p>Error: {mappingError}</p>
                  </div>
                ) : kelasAsal.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Tidak ada kelas asal yang tersedia</p>
                  </div>
                ) : (
                  kelasAsal.map(kelasAsalItem => (
                    <div key={kelasAsalItem.id_kelas} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{kelasAsalItem.nama}</div>
                        <div className="text-sm text-gray-600">
                          {kelasAsalItem.tahun} - {kelasAsalItem.semester} • Wali: {kelasAsalItem.nama_wali_guru}
                        </div>
                      </div>
                      <FaArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <select
                          value={mappingKelas[kelasAsalItem.id_kelas] || ''}
                          onChange={(e) => handleMappingChange(kelasAsalItem.id_kelas, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih kelas tujuan</option>
                          {kelasTujuan.map(kelasTujuanItem => (
                            <option key={kelasTujuanItem.id_kelas} value={kelasTujuanItem.id_kelas}>
                              {kelasTujuanItem.nama} - {kelasTujuanItem.nama_wali_guru}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          {tahunAjaranTujuan && semesterTujuan && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-md font-semibold text-blue-900 mb-2">
                Preview Naik Kelas
              </h4>
              {previewLoading ? (
                <div className="text-sm text-blue-800">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                  Memuat preview...
                </div>
              ) : previewError ? (
                <div className="text-sm text-red-600">
                  Error: {previewError}
                </div>
              ) : previewData ? (
                <div className="text-sm text-blue-800">
                  <div className="mb-3">
                    <p>• {previewData.total_kelas} kelas akan dipindah</p>
                    <p>• {previewData.siswa_siap_naik} siswa siap naik kelas</p>
                    <p>• Tahun ajaran tujuan: {previewData.tahun_ajaran_tujuan.tahun} {previewData.tahun_ajaran_tujuan.semester}</p>
                  </div>
                  
                  {/* Detail per kelas */}
                  {previewData.kelas_asal && previewData.kelas_asal.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="font-medium text-blue-900 mb-2">Detail Kelas:</p>
                      <div className="space-y-1">
                        {previewData.kelas_asal.map((kelas) => (
                          <div key={kelas.id_kelas} className="flex items-center justify-between">
                            <span className="text-blue-700">
                              {kelas.nama} - Wali: {kelas.nama_wali_guru}
                            </span>
                            <span className="font-medium text-blue-900">
                              {kelas.jumlah_siswa} siswa
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Pilih tahun ajaran dan semester untuk melihat preview
                </div>
              )}
            </div>
          )}
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
            disabled={!tahunAjaranTujuan || !semesterTujuan || Object.keys(mappingKelas).length === 0 || naikKelasLoading || previewLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {naikKelasLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <FaGraduationCap className="w-4 h-4" />
                <span>Naik Kelas {previewData?.siswa_siap_naik || totalSiswa} Siswa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
