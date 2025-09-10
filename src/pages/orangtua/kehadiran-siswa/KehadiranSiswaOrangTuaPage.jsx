import { useState, useEffect, useMemo } from 'react';
import { FaCalendarAlt, FaDownload, FaChartBar } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import { useNotification } from '../../../hooks/useNotification';

export default function KehadiranSiswaOrangTuaPage() {
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
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("2024/2025");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [selectedBulan, setSelectedBulan] = useState("Januari");
  
  // State untuk data kehadiran
  const [filteredData, setFilteredData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ===== SAMPLE DATA =====
  const sampleKehadiran = useMemo(() => [
    {
      id: 1,
      tanggal: "02 Jan 2025",
      hari: "Kamis",
      status: "Hadir"
    },
    {
      id: 2,
      tanggal: "03 Jan 2025",
      hari: "Jumat",
      status: "Hadir"
    },
    {
      id: 3,
      tanggal: "06 Jan 2025",
      hari: "Senin",
      status: "Sakit"
    },
    {
      id: 4,
      tanggal: "07 Jan 2025",
      hari: "Selasa",
      status: "Hadir"
    },
    {
      id: 5,
      tanggal: "08 Jan 2025",
      hari: "Rabu",
      status: "Hadir"
    },
    {
      id: 6,
      tanggal: "09 Jan 2025",
      hari: "Kamis",
      status: "Izin"
    },
    {
      id: 7,
      tanggal: "10 Jan 2025",
      hari: "Jumat",
      status: "Hadir"
    },
    {
      id: 8,
      tanggal: "13 Jan 2025",
      hari: "Senin",
      status: "Hadir"
    },
    {
      id: 9,
      tanggal: "14 Jan 2025",
      hari: "Selasa",
      status: "Hadir"
    },
    {
      id: 10,
      tanggal: "15 Jan 2025",
      hari: "Rabu",
      status: "Hadir"
    },
    {
      id: 11,
      tanggal: "16 Jan 2025",
      hari: "Kamis",
      status: "Hadir"
    },
    {
      id: 12,
      tanggal: "17 Jan 2025",
      hari: "Jumat",
      status: "Hadir"
    },
    {
      id: 13,
      tanggal: "20 Jan 2025",
      hari: "Senin",
      status: "Hadir"
    },
    {
      id: 14,
      tanggal: "21 Jan 2025",
      hari: "Selasa",
      status: "Hadir"
    },
    {
      id: 15,
      tanggal: "22 Jan 2025",
      hari: "Rabu",
      status: "Hadir"
    },
    {
      id: 16,
      tanggal: "23 Jan 2025",
      hari: "Kamis",
      status: "Hadir"
    },
    {
      id: 17,
      tanggal: "24 Jan 2025",
      hari: "Jumat",
      status: "Hadir"
    },
    {
      id: 18,
      tanggal: "27 Jan 2025",
      hari: "Senin",
      status: "Hadir"
    },
    {
      id: 19,
      tanggal: "28 Jan 2025",
      hari: "Selasa",
      status: "Hadir"
    },
    {
      id: 20,
      tanggal: "29 Jan 2025",
      hari: "Rabu",
      status: "Hadir"
    },
    {
      id: 21,
      tanggal: "30 Jan 2025",
      hari: "Kamis",
      status: "Hadir"
    },
    {
      id: 22,
      tanggal: "31 Jan 2025",
      hari: "Jumat",
      status: "Alfa"
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    setFilteredData(sampleKehadiran);
  }, [sampleKehadiran]);

  // ===== COMPUTED VALUES =====
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hitung statistik kehadiran
  const totalHari = filteredData.length;
  const hadir = filteredData.filter(item => item.status === 'Hadir').length;
  const sakit = filteredData.filter(item => item.status === 'Sakit').length;
  const izin = filteredData.filter(item => item.status === 'Izin').length;
  const alfa = filteredData.filter(item => item.status === 'Alfa').length;

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'tanggal',
      header: 'Tanggal',
      width: '150px',
      cell: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'hari',
      header: 'Hari',
      width: '120px',
      cell: (value) => (
        <div className="text-gray-700">{value}</div>
      )
    },
    {
      key: 'status',
      header: 'Status Kehadiran',
      width: '150px',
      cell: (value) => {
        const statusColors = {
          'Hadir': 'bg-green-100 text-green-800',
          'Sakit': 'bg-red-100 text-red-800',
          'Izin': 'bg-yellow-100 text-yellow-800',
          'Alfa': 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },

  ];

  // ===== HANDLERS =====
  const handleDownloadLaporan = () => {
    showInfoMessage("Fitur download laporan akan segera tersedia");
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with StatCards */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 p-3 rounded-lg">
            <FaCalendarAlt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Kehadiran - {siswaData.nama}</h1>
            <p className="text-gray-600">Kelas {siswaData.kelas} - {siswaData.sekolah}</p>
          </div>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatCard
            title="Total Hari"
            value={totalHari}
            icon={FaChartBar}
            color="blue"
          />
          
          <StatCard
            title="Hadir"
            value={hadir}
            icon={FaCalendarAlt}
            color="green"
          />
          
          <StatCard
            title="Sakit"
            value={sakit}
            icon={FaCalendarAlt}
            color="red"
          />
          
          <StatCard
            title="Izin"
            value={izin}
            icon={FaCalendarAlt}
            color="yellow"
          />
          
          <StatCard
            title="Alfa"
            value={alfa}
            icon={FaCalendarAlt}
            color="orange"
          />
        </div>
      </div>

      {/* Filter Data Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Filter Data</h2>
          <p className="text-gray-600">Pilih tahun ajaran, semester, dan bulan untuk melihat kehadiran</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tahun Ajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun Ajaran
            </label>
            <select
              value={selectedTahunAjaran}
              onChange={(e) => setSelectedTahunAjaran(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2022/2023">2022/2023</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>

          {/* Bulan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulan
            </label>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
              <option value="Juli">Juli</option>
              <option value="Agustus">Agustus</option>
              <option value="September">September</option>
              <option value="Oktober">Oktober</option>
              <option value="November">November</option>
              <option value="Desember">Desember</option>
            </select>
          </div>
        </div>


      </div>

      {/* Data Kehadiran Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Kehadiran</h2>
            <p className="text-gray-600">
              {selectedSemester} - Tahun Ajaran {selectedTahunAjaran} - {selectedBulan}
            </p>
          </div>
          
          <button
            onClick={handleDownloadLaporan}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Download Laporan
          </button>
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
