import { useState, useEffect, useMemo } from 'react';
import { FaStickyNote, FaQuestionCircle } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import { useNotification } from '../../../hooks/useNotification';

export default function CatatanKhususOrangTuaPage() {
  // ===== HOOKS =====
  const { showInfoMessage } = useNotification();

  // ===== STATES =====
  // Dari login orang tua (readonly)
  const [siswaData] = useState({
    nama: "Muhamad Iqbal",
    kelas: "1",
    sekolah: "SDN 1 Langensari"
  });
  
  // State untuk filter
  const [selectedKategori, setSelectedKategori] = useState("Semua Kategori");
  
  // State untuk data catatan
  const [filteredData, setFilteredData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ===== SAMPLE DATA =====
  const sampleCatatan = useMemo(() => [
    {
      id: 1,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      catatan: "Baik dalam Pelajaran",
      status: "Positif"
    },
    {
      id: 2,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      catatan: "Kurang Fokus",
      status: "Perhatian"
    },
    {
      id: 3,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      catatan: "Menyelesaikan tugas tepat waktu",
      status: "Positif"
    },
    {
      id: 4,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      catatan: "Tidak Mengerjakan PR",
      status: "Perhatian"
    },
    {
      id: 5,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      catatan: "Aktif Menjawab",
      status: "Positif"
    },
    {
      id: 6,
      tanggal: "03 Jan 2025",
      hari: "Jumat",
      catatan: "Membantu teman yang kesulitan",
      status: "Positif"
    },
    {
      id: 7,
      tanggal: "03 Jan 2025",
      hari: "Jumat",
      catatan: "Terlambat masuk kelas",
      status: "Perhatian"
    },
    {
      id: 8,
      tanggal: "06 Jan 2025",
      hari: "Senin",
      catatan: "Berprestasi dalam olahraga",
      status: "Positif"
    },
    {
      id: 9,
      tanggal: "06 Jan 2025",
      hari: "Senin",
      catatan: "Kurang rapi dalam menulis",
      status: "Perhatian"
    },
    {
      id: 10,
      tanggal: "07 Jan 2025",
      hari: "Selasa",
      catatan: "Mengikuti instruksi dengan baik",
      status: "Positif"
    },
    {
      id: 11,
      tanggal: "07 Jan 2025",
      hari: "Selasa",
      catatan: "Tidak membawa buku pelajaran",
      status: "Perhatian"
    },
    {
      id: 12,
      tanggal: "08 Jan 2025",
      hari: "Rabu",
      catatan: "Berani presentasi di depan kelas",
      status: "Positif"
    },
    {
      id: 13,
      tanggal: "08 Jan 2025",
      hari: "Rabu",
      catatan: "Mengganggu teman saat belajar",
      status: "Perhatian"
    },
    {
      id: 14,
      tanggal: "09 Jan 2025",
      hari: "Kamis",
      catatan: "Menyelesaikan tugas dengan teliti",
      status: "Positif"
    },
    {
      id: 15,
      tanggal: "09 Jan 2025",
      hari: "Kamis",
      catatan: "Kurang percaya diri",
      status: "Perhatian"
    },
    {
      id: 16,
      tanggal: "10 Jan 2025",
      hari: "Jumat",
      catatan: "Berpartisipasi aktif dalam diskusi",
      status: "Positif"
    },
    {
      id: 17,
      tanggal: "10 Jan 2025",
      hari: "Jumat",
      catatan: "Tidak mengumpulkan tugas tepat waktu",
      status: "Perhatian"
    },
    {
      id: 18,
      tanggal: "13 Jan 2025",
      hari: "Senin",
      catatan: "Membantu guru membersihkan kelas",
      status: "Positif"
    },
    {
      id: 19,
      tanggal: "13 Jan 2025",
      hari: "Senin",
      catatan: "Kurang disiplin dalam antrian",
      status: "Perhatian"
    },
    {
      id: 20,
      tanggal: "14 Jan 2025",
      hari: "Selasa",
      catatan: "Berhasil menyelesaikan ujian dengan baik",
      status: "Positif"
    },
    {
      id: 21,
      tanggal: "14 Jan 2025",
      hari: "Selasa",
      catatan: "Tidak mengikuti aturan sekolah",
      status: "Perhatian"
    },
    {
      id: 22,
      tanggal: "15 Jan 2025",
      hari: "Rabu",
      catatan: "Menjadi ketua kelompok yang baik",
      status: "Positif"
    },
    {
      id: 23,
      tanggal: "15 Jan 2025",
      hari: "Rabu",
      catatan: "Kurang sopan kepada guru",
      status: "Perhatian"
    },
    {
      id: 24,
      tanggal: "16 Jan 2025",
      hari: "Kamis",
      catatan: "Berhasil memenangkan lomba matematika",
      status: "Positif"
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    setFilteredData(sampleCatatan);
  }, [sampleCatatan]);

  // ===== COMPUTED VALUES =====
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hitung statistik catatan
  const totalCatatan = filteredData.length;
  const positif = filteredData.filter(item => item.status === 'Positif').length;
  const perluPerhatian = filteredData.filter(item => item.status === 'Perhatian').length;

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'no',
      header: 'No',
      width: '60px',
      cell: (value, row, index) => (currentPage - 1) * itemsPerPage + index + 1
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      width: '120px',
      cell: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'hari',
      header: 'Hari',
      width: '100px',
      cell: (value) => (
        <div className="text-gray-700">{value}</div>
      )
    },
    {
      key: 'catatan',
      header: 'Catatan',
      width: '300px',
      cell: (value) => (
        <div className="text-gray-600 text-sm">{value}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      cell: (value) => {
        const statusColors = {
          'Positif': 'bg-green-100 text-green-800',
          'Perhatian': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Aksi',
      width: '120px',
      cell: (value, row) => (
        <button
          onClick={() => handleTanyaGuru(row)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1"
        >
          <FaQuestionCircle className="w-3 h-3" />
          Tanya Guru
        </button>
      )
    }
  ];

  // ===== HANDLERS =====
  const handleFilterKategori = (kategori) => {
    setSelectedKategori(kategori);
    if (kategori === "Semua Kategori") {
      setFilteredData(sampleCatatan);
    } else {
      const filtered = sampleCatatan.filter(item => item.status === kategori);
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const handleTanyaGuru = (catatan) => {
    showInfoMessage(`Fitur tanya guru untuk catatan: "${catatan.catatan}" akan segera tersedia`);
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with StatCards */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 p-3 rounded-lg">
            <FaStickyNote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catatan Khusus - {siswaData.nama}</h1>
            <p className="text-gray-600">Kelas {siswaData.kelas} - {siswaData.sekolah}</p>
          </div>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Catatan"
            value={totalCatatan}
            icon={FaStickyNote}
            color="blue"
          />
          
          <StatCard
            title="Positif"
            value={positif}
            icon={FaStickyNote}
            color="green"
          />
          
          <StatCard
            title="Perlu Perhatian"
            value={perluPerhatian}
            icon={FaStickyNote}
            color="yellow"
          />
        </div>
      </div>

      {/* Filter Data Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Filter Data</h2>
          <p className="text-gray-600">Pilih kategori catatan untuk melihat data yang spesifik</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => handleFilterKategori(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Positif">Positif</option>
              <option value="Perhatian">Perhatian</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Catatan Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Catatan</h2>
            <p className="text-gray-600">
              Menampilkan {filteredData.length} catatan {selectedKategori !== "Semua Kategori" ? `dengan status ${selectedKategori}` : ''}
            </p>
          </div>
        </div>

        <DataTable
          data={paginatedData}
          columns={columns}
          minWidth="800px"
          showSelection={false}
          showHeader={false}
          showPagination={true}
          totalItems={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(size) => setItemsPerPage(size)}
        />
      </div>
    </div>
  );
}
