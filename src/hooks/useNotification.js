import { useNotification as useNotificationContext } from "../contexts/NotificationContext";

export function useNotification() {
  const notification = useNotificationContext();

  const showSuccessMessage = (operation, itemName = "") => {
    const messages = {
      create: `Berhasil menambahkan ${itemName}`,
      update: `Berhasil mengubah ${itemName}`,
      delete: `Berhasil menghapus ${itemName}`,
      bulkUpdate: `Berhasil mengubah data terpilih`,
      bulkDelete: `Berhasil menghapus data terpilih`,
      import: `Berhasil mengimpor data`,
      export: `Berhasil mengekspor data`,
      reset: `Berhasil mereset data`,
      save: `Berhasil menyimpan perubahan`,
      upload: `Berhasil mengunggah file`
    };

    notification.showSuccess(
      "Sukses!",
      messages[operation] || `Operasi ${operation} berhasil`,
      4000
    );
  };

  const showErrorMessage = (operation, error = "", itemName = "") => {
    const messages = {
      create: `Gagal menambahkan ${itemName}`,
      update: `Gagal mengubah ${itemName}`,
      delete: `Gagal menghapus ${itemName}`,
      bulkUpdate: `Gagal mengubah data terpilih`,
      bulkDelete: `Gagal menghapus data terpilih`,
      import: `Gagal mengimpor data`,
      export: `Gagal mengekspor data`,
      reset: `Gagal mereset data`,
      save: `Gagal menyimpan perubahan`,
      upload: `Gagal mengunggah file`,
      validation: `Validasi gagal`,
      network: `Kesalahan jaringan`,
      server: `Kesalahan server`
    };

    const message = error || messages[operation] || `Operasi ${operation} gagal`;
    
    notification.showError(
      "Error!",
      message,
      7000
    );
  };

  const showWarningMessage = (operation, message = "") => {
    const defaultMessages = {
      confirmation: "Apakah Anda yakin ingin melanjutkan?",
      unsavedChanges: "Ada perubahan yang belum disimpan",
      dataLoss: "Data yang tidak tersimpan akan hilang",
      bulkOperation: "Operasi ini akan mempengaruhi semua data terpilih"
    };

    notification.showWarning(
      "Peringatan",
      message || defaultMessages[operation] || `Peringatan: ${operation}`,
      6000
    );
  };

  const showInfoMessage = (operation, message = "") => {
    const defaultMessages = {
      processing: "Sedang memproses...",
      loading: "Memuat data...",
      saving: "Menyimpan perubahan...",
      deleting: "Menghapus data...",
      importing: "Mengimpor data...",
      exporting: "Mengekspor data..."
    };

    notification.showInfo(
      "Info",
      message || defaultMessages[operation] || `Informasi: ${operation}`,
      3000
    );
  };

  return {
    ...notification,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
    showInfoMessage
  };
}
