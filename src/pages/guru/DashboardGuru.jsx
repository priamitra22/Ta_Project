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
import { FaUsers, FaStickyNote, FaTrophy, FaChartPie, FaBook, FaClipboardList, FaCalendarAlt } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardGuru() {
  const [mapel, setMapel] = useState("Matematika");

  // Dummy data
  const rankingData = [
    { nama: "Sari Indah", nilai: 98 },
    { nama: "Dimas Wibowo", nilai: 95 },
    { nama: "Iqbal Maulana", nilai: 94 },
    { nama: "Anisa Fauziyah", nilai: 92 },
    { nama: "Rizky Saputra", nilai: 90 },
    { nama: "Naufal Rahman", nilai: 88 },
    { nama: "Rian Prayoga", nilai: 85 },
    { nama: "Binda Ayu", nilai: 83 },
    { nama: "Sarah Nabila", nilai: 82 },
    { nama: "Fadli Rama", nilai: 80 },
  ];

  const kehadiranData = {
    labels: ["Hadir", "Izin", "Sakit", "Alfa"],
    datasets: [
      {
        data: [30, 1, 3, 5],
        backgroundColor: ["#22C55E", "#EAB308", "#F97316", "#EF4444"],
      },
    ],
  };

  const rankingChart = {
    labels: rankingData.map((r, i) => `${i + 1}. ${r.nama}`),
    datasets: [
      {
        label: "Nilai",
        data: rankingData.map((r) => r.nilai),
        backgroundColor: "#6EE7B7",
        borderRadius: 4,
      },
    ],
  };

  const nilaiChart = {
    labels: rankingData.map((r) => r.nama),
    datasets: [
      {
        label: "Nilai",
        data: rankingData.map((r) => r.nilai),
        backgroundColor: "#93C5FD",
        borderRadius: 4,
      },
    ],
  };

  const catatanSiswa = [
    { nama: "Muhammad Iqbal", tanggal: "08 Juli 2025", catatan: "Menunjukan Kemajuan dalam matematika" },
    { nama: "Muhammad Iqbal", tanggal: "08 Juli 2025", catatan: "Menunjukan Kemajuan dalam matematika" },
    { nama: "Muhammad Iqbal", tanggal: "08 Juli 2025", catatan: "Menunjukan Kemajuan dalam matematika" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      {/* Statistik Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Jumlah Siswa</p>
              <h2 className="text-2xl font-bold text-gray-800">28</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <FaUsers className="w-6 h-6" />
            </div>
          </div>
        </div>


        <div className="bg-purple-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Catatan Khusus</p>
              <h2 className="text-2xl font-bold text-gray-800">4</h2>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <FaStickyNote className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="flex flex-col gap-6">
          {/* Peringkat Siswa */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                  <FaTrophy className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Peringkat Siswa</h3>
              </div>
            </div>
            <div className="h-80">
              <Bar
                data={rankingChart}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      borderColor: 'rgba(34, 197, 94, 1)',
                      borderWidth: 1,
                      cornerRadius: 8,
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 12,
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 11,
                        }
                      }
                    }
                  },
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

          {/* Kehadiran Siswa */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500  rounded-lg text-white">
                  <FaChartPie className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Kehadiran Siswa</h3>
              </div>
            </div>
            <div className="h-90">
              <Pie
                data={kehadiranData}
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
                39 Total Siswa
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex flex-col gap-6">
          {/* Nilai per Mata Pelajaran */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg text-white">
                  <FaBook className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Nilai per Mata Pelajaran</h3>
              </div>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option>Matematika</option>
                <option>Bahasa Indonesia</option>
                <option>IPA</option>
                <option>IPS</option>
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
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 1,
                      cornerRadius: 8,
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 12,
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 11,
                        }
                      }
                    }
                  },
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

          {/* Catatan Siswa Terbaru */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg text-white">
                  <FaBook className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Catatan Siswa</h3>
              </div>
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
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Positif
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
                            Catatan
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
      </div>
    </div>
  );
}
