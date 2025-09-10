import React from "react";
import BulkImportModal from "../../../../components/BulkImportModal";

export const OrangtuaBulkImportModal = ({ 
  isOpen, 
  onClose, 
  onImport,
  anakOptions = []
}) => {
     // Form fields for bulk import
  const formFields = [
    { name: "nama", label: "Nama", type: "text", required: true },
          { name: "nik", label: "NIK", type: "text", required: true, validation: "numbersOnly,minLength:16", helpText: "Masukkan 16 digit NIK (hanya angka, tanpa spasi atau simbol)." },
    { name: "kontak", label: "Kontak", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Masukkan nomor HP orang tua, mulai dengan 08. Contoh: 081234567890." },
    { name: "relasi", label: "Relasi", type: "select", required: true, options: [
      { value: "Ayah", label: "Ayah" },
      { value: "Ibu", label: "Ibu" },
      { value: "Wali", label: "Wali" },
    ], helpText: "Pilih hubungan orang tua dengan anak" },
                  {
       name: "anak_ids",
       label: "Anak",
       type: "multiselect",
       required: true,
       options: (Array.isArray(anakOptions) ? anakOptions : []).map((anak) => {
         const value = anak.id_siswa ?? anak.id;
         const rightInfo = anak.nama_kelas ? anak.nama_kelas : (anak.nisn ? anak.nisn : "-");
         const label = `${anak.nama} (${rightInfo})`;
         return { value, label };
       }),
       helpText: Array.isArray(anakOptions) && anakOptions.length > 0 
         ? "Pilih satu atau lebih anak dari daftar (gunakan checkbox)" 
         : "Tidak ada anak yang tersedia untuk dipilih"
     }
  ];

  return (
    <BulkImportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Banyak Orang Tua (Manual)"
      fields={formFields}
      maxRows={100}
      onImport={onImport}
    />
  );
};
