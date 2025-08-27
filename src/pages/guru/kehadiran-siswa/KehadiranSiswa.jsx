import { useState, useEffect, useMemo } from 'react';
import { FaCalendarAlt, FaUsers, FaSave, FaChartBar, FaEye, FaUndo } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import { useNotification } from '../../../hooks/useNotification';

export default function KehadiranSiswa() {
  // ===== HOOKS =====
  const { showSuccessMessage, showInfoMessage } = useNotification();

  // ===== STATES =====
  // Dari admin (readonly)
  const adminTahunAjaran = "2024/2025";
  const adminSemester = "Ganjil";
  
  // Dari login guru (readonly)
  const guruKelas = "1A";
  
  // State untuk mode tampilan
  const [viewMode, setViewMode] = useState('input'); // 'input' atau 'rekap'
  
  // State untuk input kehadiran harian
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  
  // State untuk rekap kehadiran
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [summaryData, setSummaryData] = useState([]);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  
  // State untuk filter bulan di modal detail
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Pagination state untuk rekap
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ===== SAMPLE DATA =====
  const sampleStudents = useMemo(() => [
    { id: 1, nama: "Muhammad Iqbal", kelas: "1A" },
    { id: 2, nama: "Muhammad Rafl", kelas: "1A" },
    { id: 3, nama: "Muhammad Piko", kelas: "1A" },
    { id: 4, nama: "Muhammad Rizal", kelas: "1A" },
    { id: 5, nama: "Muhammad Mukti", kelas: "1A" },
    { id: 6, nama: "Ahmad Fadillah", kelas: "1A" },
    { id: 7, nama: "Siti Nurhaliza", kelas: "1A" },
    { id: 8, nama: "Rizki Pratama", kelas: "1A" },
    { id: 9, nama: "Dewi Sartika", kelas: "1A" },
    { id: 10, nama: "Budi Santoso", kelas: "1A" },
    { id: 11, nama: "Anisa Putri", kelas: "1A" },
    { id: 12, nama: "Rendi Kusuma", kelas: "1A" }
  ], []);

  // ===== INITIALIZE ATTENDANCE DATA =====
  useEffect(() => {
    // Cek apakah ada data kehadiran yang sudah tersimpan untuk tanggal ini
    const storageKey = `attendance_${guruKelas}_${selectedDate}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      // Jika ada data tersimpan, gunakan data tersebut
      const parsedData = JSON.parse(savedData);
      setAttendanceData(parsedData.data);
    } else {
      // Jika tidak ada data tersimpan, buat data baru dengan status kosong
      const initialData = sampleStudents.map(student => ({
        id: student.id,
        nama: student.nama,
        kelas: student.kelas,
        status: '', // Default status kosong
        tanggal: selectedDate
      }));
      setAttendanceData(initialData);
    }
  }, [selectedDate, guruKelas, sampleStudents]);

  // ===== SAMPLE SUMMARY DATA =====
  useEffect(() => {
    // Sample summary data
    const summary = sampleStudents.map(student => ({
      id: student.id,
      nama: student.nama,
      kelas: student.kelas,
      hadir: Math.floor(Math.random() * 20) + 80, // 80-99 days
      izin: Math.floor(Math.random() * 5) + 1,    // 1-5 days
      sakit: Math.floor(Math.random() * 3) + 1,   // 1-3 days
      alfa: Math.floor(Math.random() * 3),        // 0-2 days
    }));
    
    // Calculate attendance percentage
    summary.forEach(student => {
      const totalDays = student.hadir + student.izin + student.sakit + student.alfa;
      student.kehadiran = totalDays > 0 ? ((student.hadir / totalDays) * 100).toFixed(1) : 0;
    });
    
    setSummaryData(summary);
  }, [sampleStudents]);

  // ===== COMPUTED VALUES =====
  const paginatedSummaryData = summaryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== COLUMNS DEFINITION =====
  const inputColumns = [
    {
      key: 'nama',
      header: 'Nama',
      width: '200px'
    },
    {
      key: 'status',
      header: 'Keterangan',
      width: '400px',
      cell: (value, row) => (
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`status-${row.id}`}
              value="hadir"
              checked={value === 'hadir'}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="text-sm">Hadir</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`status-${row.id}`}
              value="izin"
              checked={value === 'izin'}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm">Izin</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`status-${row.id}`}
              value="sakit"
              checked={value === 'sakit'}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="text-sm">Sakit</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`status-${row.id}`}
              value="alfa"
              checked={value === 'alfa'}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm">Alfa</span>
          </label>
        </div>
      )
    }
  ];

  const summaryColumns = [
    {
      key: 'nama',
      header: 'Nama',
      width: '200px'
    },
    {
      key: 'hadir',
      header: 'Hadir',
      width: '80px',
      cell: (value) => (
        <div className="text-center font-semibold text-green-600">{value}</div>
      )
    },
    {
      key: 'izin',
      header: 'Izin',
      width: '80px',
      cell: (value) => (
        <div className="text-center font-semibold text-yellow-600">{value}</div>
      )
    },
    {
      key: 'sakit',
      header: 'Sakit',
      width: '80px',
      cell: (value) => (
        <div className="text-center font-semibold text-red-600">{value}</div>
      )
    },
    {
      key: 'alfa',
      header: 'Alfa',
      width: '80px',
      cell: (value) => (
        <div className="text-center font-semibold text-orange-600">{value}</div>
      )
    },
    {
      key: 'kehadiran',
      header: 'Kehadiran',
      width: '100px',
      cell: (value) => (
        <div className="text-center font-bold text-blue-600">{value}%</div>
      )
    },
    {
      key: 'detail',
      header: 'Detail',
      width: '100px',
      cell: (value, row) => (
        <button
          onClick={() => handleShowDetail(row)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Detail
        </button>
      )
    }
  ];

  // ===== HANDLERS =====
  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.id === studentId ? { ...item, status } : item
      )
    );
  };

  const handleSaveAttendance = () => {
    // Validasi: pastikan semua siswa sudah dipilih statusnya
    const unselectedStudents = attendanceData.filter(item => !item.status);
    
    if (unselectedStudents.length > 0) {
      showInfoMessage(`Mohon pilih status kehadiran untuk ${unselectedStudents.length} siswa yang belum dipilih`);
      return;
    }

    // Logic untuk menyimpan kehadiran secara permanen
    // Simpan ke localStorage untuk demo (nanti bisa diganti dengan API call)
    const savedData = {
      tanggal: selectedDate,
      kelas: guruKelas,
      data: attendanceData
    };
    
    // Simpan ke localStorage dengan key yang unik
    const storageKey = `attendance_${guruKelas}_${selectedDate}`;
    localStorage.setItem(storageKey, JSON.stringify(savedData));
    
    showSuccessMessage("Data kehadiran berhasil disimpan");
    
    // Data tidak di-reset, tetap tersimpan di state
    // Guru bisa melihat data yang sudah disimpan
  };

  const handleShowDetail = (student) => {
    setSelectedStudentDetail(student);
  };

  const handleCloseDetail = () => {
    setSelectedStudentDetail(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-3 rounded-lg">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kehadiran Siswa</h1>
            <p className="text-gray-600">Kelola kehadiran siswa kelas {guruKelas}</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'input'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalendarAlt className="inline w-4 h-4 mr-2" />
            Input Kehadiran Harian
          </button>
          <button
            onClick={() => setViewMode('rekap')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'rekap'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaChartBar className="inline w-4 h-4 mr-2" />
            Rekap Kehadiran
          </button>
        </div>
      </div>

      {/* Input Kehadiran Harian */}
      {viewMode === 'input' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Input Kehadiran Siswa - Kelas {guruKelas}
              </h2>
              <p className="text-gray-600">
                {adminSemester} - Tahun Ajaran {adminTahunAjaran}
              </p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tanggal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="mb-6">
            <DataTable
              data={attendanceData}
              columns={inputColumns}
              minWidth="600px"
              showSelection={false}
              showHeader={false}
              showPagination={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveAttendance}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              Simpan Kehadiran
            </button>
          </div>
        </div>
      )}

      {/* Rekap Kehadiran */}
      {viewMode === 'rekap' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Rekap Kehadiran Siswa - Kelas {guruKelas}
              </h2>
              <p className="text-gray-600">
                {adminSemester} - Tahun Ajaran {adminTahunAjaran}
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          </div>

          {/* Summary Table */}
          <div className="mb-6">
            <DataTable
              data={paginatedSummaryData}
              columns={summaryColumns}
              minWidth="800px"
              showSelection={false}
              showHeader={false}
              showPagination={true}
              totalItems={summaryData.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(size) => setItemsPerPage(size)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('input')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaCalendarAlt className="w-4 h-4" />
              Input Kehadiran
            </button>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Detail Kehadiran Siswa
                  </h3>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Nama:</span>
                      <span className="text-gray-800">{selectedStudentDetail.nama}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Kelas:</span>
                      <span className="text-gray-800">{selectedStudentDetail.kelas}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Semester:</span>
                      <span className="text-gray-800">{selectedSemester}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tahun Ajaran:</span>
                      <span className="text-gray-800">{adminTahunAjaran}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              
              {/* Filter Section */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Pilih Periode</h4>
                <div className="flex gap-6 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bulan
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value={1}>Januari</option>
                      <option value={2}>Februari</option>
                      <option value={3}>Maret</option>
                      <option value={4}>April</option>
                      <option value={5}>Mei</option>
                      <option value={6}>Juni</option>
                      <option value={7}>Juli</option>
                      <option value={8}>Agustus</option>
                      <option value={9}>September</option>
                      <option value={10}>Oktober</option>
                      <option value={11}>November</option>
                      <option value={12}>Desember</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Kalender Kehadiran - {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h4>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {/* Calendar headers */}
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                    <div key={day} className="font-bold text-gray-700 py-3 text-center bg-gray-50 rounded-lg">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const status = Math.random() > 0.8 ? 'izin' : 
                                     Math.random() > 0.9 ? 'sakit' : 
                                     Math.random() > 0.95 ? 'alfa' : 'hadir';
                    
                    const statusColors = {
                      hadir: 'bg-green-500 text-white',
                      izin: 'bg-yellow-500 text-white',
                      sakit: 'bg-red-500 text-white',
                      alfa: 'bg-orange-500 text-white'
                    };
                    
                    return (
                      <div
                        key={day}
                        className={`p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity font-medium ${statusColors[status]}`}
                        title={`${day} ${new Date(selectedYear, selectedMonth - 1).toLocaleDateString('id-ID', { month: 'long' })}: ${status}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Keterangan Status:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Hadir</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Izin</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Sakit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Alfa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDetail}
                  className="bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
