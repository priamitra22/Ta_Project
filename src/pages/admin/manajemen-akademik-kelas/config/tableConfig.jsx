import { FaCog, FaTrash, FaEdit } from 'react-icons/fa';

export const createTableConfig = ({
  handleKelola,
  handleEdit,
  handleDelete
}) => [
  {
    key: 'nama',
    header: 'NAMA KELAS',
    width: '200px',
    cell: (value) => (
      <div className="font-semibold text-gray-800">
        {value}
      </div>
    )
  },
  {
    key: 'wali_guru',
    header: 'WALI KELAS',
    width: '220px',
    cell: (value) => (
      <div className="text-gray-700">
        {value || <span className="text-gray-400 italic">Belum ditentukan</span>}
      </div>
    )
  },
  {
    key: 'jumlah_mapel',
    header: 'JUMLAH MAPEL',
    width: '140px',
    cell: (value) => (
      <div className="text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          {value || '0'}
        </span>
      </div>
    )
  },
  {
    key: 'actions',
    header: 'AKSI',
    width: '240px',
    cell: (_, row) => (
      <div className="flex gap-2 justify-center">
        <button
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
          onClick={() => handleKelola(row)}
          title="Kelola Kelas"
        >
          <FaCog className="w-4 h-4" />
          <span>Kelola</span>
        </button>
        <button
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
          onClick={() => handleEdit(row)}
          title="Edit Kelas"
        >
          <FaEdit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
          onClick={() => handleDelete(row)}
          title="Hapus Kelas"
        >
          <FaTrash className="w-4 h-4" />
          <span>Hapus</span>
        </button>
      </div>
    )
  }
];
