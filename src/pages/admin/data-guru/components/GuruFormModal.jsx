import React, { useMemo } from "react";
import ModalForm from "../../../../components/ModalForm";

export const GuruFormModal = ({ 
  isOpen, 
  onClose, 
  editData, 
  onSubmit
}) => {
  // Form fields for add/edit
  const formFields = useMemo(() => {
    return [
      { name: "nama", label: "Nama Lengkap", type: "text", required: true },
      { name: "nip", label: "NIP", type: "text", required: true, validation: "numbersOnly,minLength:8", helpText: "Hanya angka, minimal 8 digit" },
      { name: "status", label: "Status", type: "select", required: true, options: [
        { value: "aktif", label: "Aktif" },
        { value: "nonaktif", label: "Nonaktif" }
      ]}
    ];
  }, []);

  // Format initial data for edit - only include required fields
  const initialData = editData ? {
    nama: editData.nama || '',
    nip: editData.nip || '',
    status: editData.status || ''
  } : null;

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Guru" : "Tambah Guru"}
      fields={formFields}
      initialData={initialData}
      submitText={editData ? "Simpan Perubahan" : "Tambah Guru"}
      loadingText={editData ? "Menyimpan..." : "Menambahkan..."}
      onSubmit={onSubmit}
    />
  );
};
