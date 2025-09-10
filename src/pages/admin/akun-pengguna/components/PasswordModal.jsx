import React from "react";
import ModalForm from "../../../../components/ModalForm";

export default function PasswordModal({
  isOpen,
  onClose,
  editRow,
  onSubmit
}) {
  const passwordFields = [
    {
      name: "password",
      label: "Password Baru",
      type: "password",
      required: true,
      placeholder: "Masukkan password baru"
    },
    {
      name: "confirmPassword",
      label: "Konfirmasi Password",
      type: "password",
      required: true,
      placeholder: "Konfirmasi password baru"
    }
  ];

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Password"
      fields={passwordFields}
      initialData={editRow}
      submitText="Ubah Password"
      loadingText="Mengubah password..."
      onSubmit={onSubmit}
    />
  );
}
