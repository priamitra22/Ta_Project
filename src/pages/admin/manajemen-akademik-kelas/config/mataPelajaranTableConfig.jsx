import { FaEdit, FaTrash } from 'react-icons/fa';

export const createMataPelajaranTableConfig = ({
  handleEdit,
  handleDelete
}) => [
  {
    key: 'nama_mata_pelajaran',
    header: 'MATA PELAJARAN',
    width: '300px',
    cell: (value) => (
      <div className="font-semibold text-gray-800">
        {value}
      </div>
    )
  },
  {
    key: 'guru_pengampu',
    header: 'GURU PENGAMPU',
    width: '250px',
    cell: (value) => (
      <div className="text-gray-700">
        {value || <span className="text-gray-400 italic">Belum ditentukan</span>}
      </div>
    )
  },
  {
    key: 'actions',
    header: 'AKSI',
    width: '180px',
    cell: (_, row) => (
      <div className="flex gap-2 justify-center">
        <button
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
          onClick={() => handleEdit(row)}
          title="Edit Mata Pelajaran"
        >
          <FaEdit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
          onClick={() => handleDelete(row)}
          title="Hapus Mata Pelajaran"
        >
          <FaTrash className="w-4 h-4" />
          <span>Hapus</span>
        </button>
      </div>
    )
  }
];
