import React, { useMemo } from "react";
import ModalForm from "../../../../components/ModalForm";

export default function AddUserModal({
  isOpen,
  onClose,
  selectedRole,
  formData,
  formKey,
  currentFormFields,
  isFormReady,
  teachersWithoutAccount,
  anakOptions,
  getFormFields,
  onFieldChange,
  onSubmit
}) {
  return (
    <ModalForm
      key={`add-modal-${formKey}-${selectedRole}-${currentFormFields.length}-${teachersWithoutAccount.length}-${anakOptions.length}`}
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Akun Pengguna"
      fields={useMemo(() => {
        // Step-by-step form: jika belum ada role, hanya tampilkan field role
        let fields;
        if (!selectedRole || selectedRole === "") {
          fields = getFormFields("");
        } else if (isFormReady && currentFormFields.length > 0) {
          // Jika form ready dan ada currentFormFields, gunakan itu
          fields = currentFormFields;
        } else {
          // Jika role sudah dipilih tapi belum ready, tetap tampilkan field role dengan value yang dipilih
          fields = getFormFields(selectedRole);
        }
        return fields;
      }, [selectedRole, isFormReady, currentFormFields, getFormFields])}
      initialData={formData}
      submitText="Tambah Akun"
      loadingText="Menambahkan..."
      onSubmit={onSubmit}
      onFieldChange={onFieldChange}
    />
  );
}
