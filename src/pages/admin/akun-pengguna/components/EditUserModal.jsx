import React from "react";
import ModalForm from "../../../../components/ModalForm";

export default function EditUserModal({
  isOpen,
  onClose,
  editRow,
  onSubmit
}) {
  const editFields = [
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "aktif", label: "Aktif" },
        { value: "nonaktif", label: "Nonaktif" }
      ]
    }
  ];

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Akun Pengguna"
      fields={editFields}
      initialData={editRow}
      submitText="Simpan Perubahan"
      loadingText="Menyimpan..."
      onSubmit={onSubmit}
    />
  );
}
