import React from "react";
import BulkImportModal from "../../../../components/BulkImportModal";

export const GuruBulkImportModal = ({ 
  isOpen, 
  onClose, 
  onImport
}) => {
  // Form fields for bulk import
  const formFields = [
    { name: "nama", label: "Nama Lengkap", type: "text", required: true },
    { name: "nip", label: "NIP", type: "text", required: true, validation: "numbersOnly,minLength:8", helpText: "Hanya angka, minimal 8 digit" },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" }
    ]}
  ];

  return (
    <BulkImportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Banyak Guru (Manual)"
      fields={formFields}
      maxRows={100}
      onImport={onImport}
    />
  );
};
