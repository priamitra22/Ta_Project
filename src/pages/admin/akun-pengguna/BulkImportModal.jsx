import { useState, useRef } from "react";
import { FaTimes, FaUpload, FaFileExcel, FaPlus, FaTrash, FaDownload } from "react-icons/fa";

export default function BulkImportModal({ isOpen, onClose, onSubmit }) {
  const [importMethod, setImportMethod] = useState("manual"); // "manual" or "file"
  const [accounts, setAccounts] = useState([
    { nama: "", nipnisn: "1234567890", role: "Guru", status: "Aktif" }
  ]);
  const [fileData, setFileData] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAddAccount = () => {
    setAccounts([...accounts, { nama: "", nipnisn: "", role: "Guru", status: "Aktif" }]);
  };

  const handleRemoveAccount = (index) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          return {
            nama: values[0] || "",
            nipnisn: values[1] || "",
            role: values[2] || "Guru",
            status: values[3] || "Aktif"
          };
        });
        setFileData(data);
        setAccounts(data);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi semua akun sebelum submit
    const invalidAccounts = accounts.filter(acc => {
      if (!acc.nama || !acc.nipnisn) return true;
      if (acc.nipnisn.length < 10) return true;
      if (!/^\d+$/.test(acc.nipnisn)) return true;
      return false;
    });
    
    if (invalidAccounts.length > 0) {
      alert("Beberapa akun tidak valid:\n- NIP/NISN harus minimal 10 digit\n- NIP/NISN hanya boleh berisi angka\n- Nama dan NIP/NISN wajib diisi");
      return;
    }
    
    const validAccounts = accounts.filter(acc => acc.nama && acc.nipnisn);
    if (validAccounts.length > 0) {
      onSubmit(validAccounts);
      setAccounts([{ nama: "", nipnisn: "", role: "Guru", status: "Aktif" }]);
      setFileData(null);
    }
  };

  const resetForm = () => {
    setAccounts([{ nama: "", nipnisn: "", role: "Guru", status: "Aktif" }]);
    setFileData(null);
    setImportMethod("manual");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
              <FaUpload className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Bulk Import Akun Pengguna</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Import Method Tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setImportMethod("manual")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                importMethod === "manual"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaPlus className="w-4 h-4 inline mr-2" />
              Input Manual
            </button>
            <button
              onClick={() => setImportMethod("file")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                importMethod === "file"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaFileExcel className="w-4 h-4 inline mr-2" />
              Upload File CSV
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {importMethod === "file" && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaFileExcel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload file CSV dengan format: Nama, NIP/NISN, Role, Status
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Pilih File CSV
                </button>
                {fileData && (
                  <p className="text-green-600 mt-2">
                    ✓ File berhasil diupload ({fileData.length} akun)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Accounts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Daftar Akun ({accounts.length})
              </h3>
              <button
                type="button"
                onClick={handleAddAccount}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Tambah Akun
              </button>
            </div>

            {accounts.map((account, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={account.nama}
                    onChange={(e) => handleAccountChange(index, "nama", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIP/NISN</label>
                  <input
                    type="text"
                    value={account.nipnisn}
                    onChange={(e) => handleAccountChange(index, "nipnisn", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="Minimal 10 digit"
                    minLength="10"
                    pattern="[0-9]+"
                    maxLength="20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={account.role}
                    onChange={(e) => handleAccountChange(index, "role", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={account.status}
                      onChange={(e) => handleAccountChange(index, "status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  
                  {accounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus akun"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <FaUpload className="w-4 h-4 inline mr-2" />
              Import {accounts.filter(acc => acc.nama && acc.nipnisn).length} Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
