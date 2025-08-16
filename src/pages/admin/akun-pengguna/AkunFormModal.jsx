import { FaTimes, FaSave, FaUser, FaIdCard, FaUserTie, FaToggleOn } from "react-icons/fa";

export default function AkunFormModal({ isOpen, onClose, onSubmit, editData }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const nipnisn = form.nipnisn.value;
    
    // Validasi NIP/NISN
    if (nipnisn.length < 10) {
      alert("NIP/NISN harus minimal 10 digit!");
      return;
    }
    
    if (!/^\d+$/.test(nipnisn)) {
      alert("NIP/NISN hanya boleh berisi angka!");
      return;
    }
    
    const akun = {
      nama: form.nama.value,
      nipnisn: nipnisn,
      role: form.role.value,
      status: form.status.value,
    };
    onSubmit(akun);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <FaUser className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {editData ? "Edit Akun Pengguna" : "Tambah Akun Baru"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaUser className="w-4 h-4 text-gray-500" />
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              defaultValue={editData?.nama || ""}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* NIP/NISN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaIdCard className="w-4 h-4 text-gray-500" />
              NIP/NISN
            </label>
            <input
              type="text"
              name="nipnisn"
              defaultValue={editData?.nipnisn || ""}
              required
              minLength="10"
              pattern="[0-9]+"
              maxLength="20"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono"
              placeholder="Minimal 10 digit angka"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimal 10 digit, maksimal 20 digit, hanya angka yang diperbolehkan
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaUserTie className="w-4 h-4 text-gray-500" />
              Role/Posisi
            </label>
            <select
              name="role"
              defaultValue={editData?.role || "Guru"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="Admin">Admin</option>
              <option value="Guru">Guru</option>
              <option value="Orang Tua">Orang Tua</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaToggleOn className="w-4 h-4 text-gray-500" />
              Status Akun
            </label>
            <select
              name="status"
              defaultValue={editData?.status || "Aktif"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium hover:shadow-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              {editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  