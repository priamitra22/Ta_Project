import React from "react";
import BulkImportModal from "../../../../components/BulkImportModal";

export const SiswaBulkImportModal = ({ 
  isOpen, 
  onClose, 
  onImport
}) => {
  // Form fields for bulk import (pure data siswa without kelas)
  const formFields = [
    { name: "nama", label: "Nama Lengkap", type: "text", required: true },
    { name: "nisn", label: "NISN", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Hanya angka, minimal 10 digit" },
    { name: "nik", label: "NIK", type: "text", required: true, validation: "numbersOnly,minLength:16", helpText: "Hanya angka, minimal 16 digit" },
    { name: "jenis_kelamin", label: "Jenis Kelamin", type: "select", required: true, options: [
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" }
    ]},
    { name: "tempat_lahir", label: "Tempat Lahir", type: "text", required: true },
    { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true },
    { name: "alamat", label: "Alamat", type: "textarea", required: true }
  ];

  return (
    <BulkImportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Banyak Siswa (Manual)"
      fields={formFields}
      maxRows={100}
      onImport={onImport}
    />
  );
};
