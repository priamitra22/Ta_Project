import { FaUsers, FaEdit, FaTrash, FaKey } from "react-icons/fa";

export const createTableConfig = (handlers) => {
  const {
    onEdit,
    onPasswordChange,
    onDelete
  } = handlers;

  return {
    icon: FaUsers,
    title: "Daftar Akun Pengguna",
    iconColor: "blue",
    showSelection: false,
    columns: [
      { key: "nama", header: "Nama" },
      { key: "username", header: "NIP/NISN" },
      { key: "role", header: "Role" },
      { key: "status", header: "Status" },
      { 
        key: "actions", 
        header: "Aksi",
        cell: (_, row) => (
          <div className="flex gap-2">
            <button
              className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1.5"
              onClick={() => onEdit(row)}
            >
              <FaEdit className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Edit</span>
            </button>
            
            <button
              className="px-2 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors flex items-center gap-1.5"
              onClick={() => onPasswordChange(row)}
            >
              <FaKey className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Ubah Password</span>
            </button>
            
            <button
              className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
              onClick={() => onDelete(row)}
            >
              <FaTrash className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Hapus</span>
            </button>
          </div>
        )
      }
    ]
  };
};
