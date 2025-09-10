import React, { useMemo } from "react";
import ModalForm from "../../../../components/ModalForm";

export const SiswaFormModal = ({ 
  isOpen, 
  onClose, 
  editData, 
  onSubmit
}) => {
  // Form fields for add/edit (pure data siswa without kelas)
  const formFields = useMemo(() => {
    return [
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
  }, []);

  // Format initial data for edit - only include required fields (without kelas)
  const initialData = editData ? {
    nama: editData.nama || '',
    nisn: editData.nisn || '',
    nik: editData.nik || '',
    jenis_kelamin: editData.jenis_kelamin || '',
    tempat_lahir: editData.tempat_lahir || '',
    tanggal_lahir: editData.tanggal_lahir ? (() => {
      // Convert date to YYYY-MM-DD format for input[type="date"]
      try {
        const date = new Date(editData.tanggal_lahir);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error converting date for edit:', editData.tanggal_lahir, error);
        return '';
      }
    })() : '',
    alamat: editData.alamat || ''
  } : null;



  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Siswa" : "Tambah Siswa"}
      fields={formFields}
      initialData={initialData}
      submitText={editData ? "Simpan Perubahan" : "Tambah Siswa"}
      loadingText={editData ? "Menyimpan..." : "Menambahkan..."}
      onSubmit={onSubmit}
    />
  );
};
