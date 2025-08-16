import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { FaUserGraduate, FaSchool, FaCalendarAlt, FaChartBar, FaBook, FaChartPie, FaStickyNote, FaClipboardList } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardOrangTua() {
  const [semester, setSemester] = useState("Ganjil");

  // Data dummy nilai per mata pelajaran
  const nilaiMapel = [
    { mapel: "B. Indonesia", nilai: 88, target: 85 },
    { mapel: "Matematika", nilai: 85, target: 80 },
    { mapel: "IPA", nilai: 90, target: 85 },
    { mapel: "IPS", nilai: 82, target: 80 },
    { mapel: "PKN", nilai: 87, target: 85 },
    { mapel: "Agama", nilai: 77, target: 80 },
  ];

  // Data chart nilai
  const nilaiChart = {
    labels: nilaiMapel.map((n) => n.mapel),
    datasets: [
      {
        label: "Nilai Aktual",
        data: nilaiMapel.map((n) => n.nilai),
        backgroundColor: "#6EE7B7",
        borderRadius: 4,
      },
    ],
  };

  // Data kehadiran
  const kehadiranChart = {
    labels: ["Hadir", "Izin", "Sakit", "Alfa"],
    datasets: [
      {
        data: [68, 2, 1, 1],
        backgroundColor: ["#22C55E", "#EAB308", "#F97316", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const catatanSiswa = [
    { 
      nama: "Muhammad Iqbal", 
      tanggal: "08 Juli 2025", 
      catatan: "Menunjukan Kemajuan dalam matematika",
      kategori: "Akademik",
      status: "Positif"
    },
    { 
      nama: "Muhammad Iqbal", 
      tanggal: "05 Juli 2025", 
      catatan: "Aktif dalam diskusi kelompok",
      kategori: "Sosial",
      status: "Positif"
    },
    { 
      nama: "Muhammad Iqbal", 
      tanggal: "01 Juli 2025", 
      catatan: "Perlu latihan tambahan untuk IPA",
      kategori: "Akademik",
      status: "Perhatian"
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Positif": return "text-green-600 bg-green-100";
      case "Perhatian": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };



     return (
     <div className="min-h-screen bg-gray-50 pt-0 pb-6">
       {/* Statistik Card */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Nama Siswa</p>
              <h2 className="text-2xl font-bold text-gray-800">Muhammad Iqbal</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <FaUserGraduate className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Kelas</p>
              <h2 className="text-2xl font-bold text-gray-800">Kelas 1</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <FaSchool className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Semester</p>
              <h2 className="text-2xl font-bold text-gray-800">{semester}</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Rata-rata Nilai</p>
              <h2 className="text-2xl font-bold text-gray-800">86,5</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <FaChartBar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri - Nilai */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg text-white">
                <FaBook className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Perkembangan Nilai</h3>
            </div>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option>Ganjil</option>
              <option>Genap</option>
            </select>
          </div>
          <div className="h-80">
             <Bar
               data={nilaiChart}
               options={{
                 indexAxis: "y",
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: { 
                   legend: { 
                     display: true,
                     position: 'top',
                     labels: {
                       usePointStyle: true,
                       padding: 12,
                     }
                   } 
                 },
                 scales: { 
                   x: { 
                     beginAtZero: true, 
                     max: 100,
                     grid: {
                       color: '#f3f4f6',
                     }
                   } 
                 },
                 elements: {
                   bar: {
                     borderWidth: 0,
                   }
                 }
               }}
             />
           </div>
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium">
              ← Previous
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium">
              Next →
            </button>
          </div>
        </div>

        {/* Kolom Kanan - Kehadiran Siswa */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg text-white">
              <FaChartPie className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Kehadiran Siswa</h3>
          </div>
          <div className="h-90">
            <Pie
              data={kehadiranChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12,
                        weight: '600'
                      },
                      color: '#374151'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                  }
                }
              }}
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-lg font-bold text-gray-800 bg-gray-50 px-4 py-2 rounded-lg inline-block">
              72 Hari Sekolah
            </p>
          </div>
        </div>
      </div>

      {/* Baris Bawah - Catatan & Perkembangan */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg text-white">
            <FaClipboardList className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Catatan & Perkembangan</h3>
        </div>
        
        <div className="space-y-3">
          {catatanSiswa.map((c, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaStickyNote className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{c.nama}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{c.catatan}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {c.tanggal}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClipboardList className="w-3 h-3" />
                        {c.kategori}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Lihat Semua Catatan
          </button>
        </div>
      </div>
    </div>
  );
}
