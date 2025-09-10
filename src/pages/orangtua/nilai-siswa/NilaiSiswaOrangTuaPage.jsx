import { useState, useEffect, useMemo } from 'react';
import { FaBook, FaDownload, FaChartLine } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import { useNotification } from '../../../hooks/useNotification';

export default function NilaiSiswaOrangTuaPage() {
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
  
  // State untuk data nilai
  const [filteredData, setFilteredData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ===== SAMPLE DATA =====
  const sampleNilai = useMemo(() => [
    {
      id: 1,
      mataPelajaran: "Matematika",
      tugas1: 85,
      tugas2: 90,
      tugas3: 88,
      ulangan: 92,
      nilaiAkhir: 89,
      keterangan: "Baik"
    },
    {
      id: 2,
      mataPelajaran: "Bahasa Indonesia",
      tugas1: 88,
      tugas2: 85,
      tugas3: 90,
      ulangan: 87,
      nilaiAkhir: 88,
      keterangan: "Baik"
    },
    {
      id: 3,
      mataPelajaran: "Bahasa Inggris",
      tugas1: 90,
      tugas2: 88,
      tugas3: 85,
      ulangan: 89,
      nilaiAkhir: 88,
      keterangan: "Baik"
    },
    {
      id: 4,
      mataPelajaran: "IPA",
      tugas1: 87,
      tugas2: 92,
      tugas3: 89,
      ulangan: 90,
      nilaiAkhir: 90,
      keterangan: "Baik"
    },
    {
      id: 5,
      mataPelajaran: "IPS",
      tugas1: 89,
      tugas2: 86,
      tugas3: 91,
      ulangan: 88,
      nilaiAkhir: 89,
      keterangan: "Baik"
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    setFilteredData(sampleNilai);
  }, [sampleNilai]);

  // ===== COMPUTED VALUES =====
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'mataPelajaran',
      header: 'Mata Pelajaran',
      width: '200px'
    },
    {
      key: 'tugas1',
      header: 'Tugas 1',
      width: '100px',
      cell: (value) => (
        <div className="text-center font-semibold text-blue-600">{value}</div>
      )
    },
    {
      key: 'tugas2',
      header: 'Tugas 2',
      width: '100px',
      cell: (value) => (
        <div className="text-center font-semibold text-blue-600">{value}</div>
      )
    },
    {
      key: 'tugas3',
      header: 'Tugas 3',
      width: '100px',
      cell: (value) => (
        <div className="text-center font-semibold text-blue-600">{value}</div>
      )
    },
    {
      key: 'ulangan',
      header: 'Ulangan',
      width: '100px',
      cell: (value) => (
        <div className="text-center font-semibold text-green-600">{value}</div>
      )
    },
    {
      key: 'nilaiAkhir',
      header: 'Nilai Akhir',
      width: '120px',
      cell: (value) => (
        <div className="text-center font-bold text-purple-600 text-lg">{value}</div>
      )
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      width: '120px',
      cell: (value) => {
        const statusColors = {
          'Sangat Baik': 'bg-green-100 text-green-800',
          'Baik': 'bg-blue-100 text-blue-800',
          'Cukup': 'bg-yellow-100 text-yellow-800',
          'Kurang': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    }
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
          <div className="bg-purple-500 p-3 rounded-lg">
            <FaBook className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perkembangan Akademik - {siswaData.nama}</h1>
            <p className="text-gray-600">Kelas {siswaData.kelas} - {siswaData.sekolah}</p>
          </div>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Rata-rata Nilai"
            value={filteredData.length > 0 
              ? (filteredData.reduce((sum, item) => sum + item.nilaiAkhir, 0) / filteredData.length).toFixed(1)
              : 0
            }
            icon={FaChartLine}
            color="blue"
          />
          
          <StatCard
            title="Total Mata Pelajaran"
            value={filteredData.length}
            icon={FaBook}
            color="green"
          />
          
          <StatCard
            title="Nilai Tertinggi"
            value={filteredData.length > 0 
              ? Math.max(...filteredData.map(item => item.nilaiAkhir))
              : 0
            }
            icon={FaChartLine}
            color="yellow"
          />
          
          <StatCard
            title="Status"
            value={filteredData.length > 0 
              ? filteredData.every(item => item.keterangan === 'Baik' || item.keterangan === 'Sangat Baik')
                ? 'Baik'
                : 'Perlu Perhatian'
              : '-'
            }
            icon={FaBook}
            color="purple"
          />
        </div>
      </div>

      {/* Filter Data Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
            <p className="text-gray-600">Pilih tahun ajaran dan semester untuk melihat nilai</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Tahun Ajaran Dropdown */}
          <div>
            <select
              value={selectedTahunAjaran}
              onChange={(e) => setSelectedTahunAjaran(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2022/2023">2022/2023</option>
            </select>
          </div>

          {/* Semester Dropdown */}
          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>
        </div>


      </div>

      {/* Data Nilai Siswa Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Nilai Siswa</h2>
            <p className="text-gray-600">
              {selectedSemester} - Tahun Ajaran {selectedTahunAjaran}
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

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <DataTable
            data={paginatedData}
            columns={columns}
            minWidth="1000px"
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
    </div>
  );
}
