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
import { FaUsers, FaChalkboardTeacher, FaUserFriends, FaCalendarAlt, FaTrophy, FaChartBar, FaChartPie } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardAdmin() {
  const [kelas, setKelas] = useState("Kelas 1");
  const [semester, setSemester] = useState("Ganjil");
  const [tahun, setTahun] = useState("2024/2025");

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

  const jumlahSiswaKelas = [68, 15, 30, 20, 40, 10];

  const genderData = {
    labels: ["Laki Laki (180)", "Perempuan (162)"],
    datasets: [
      {
        data: [180, 162],
        backgroundColor: ["#3B82F6", "#EC4899"],
        borderColor: ["#1D4ED8", "#BE185D"],
        borderWidth: 2,
      },
    ],
  };

  const rankingChart = {
    labels: rankingData.map((r, index) => `${index + 1}. ${r.nama}`),
    datasets: [
      {
        label: "Nilai",
        data: rankingData.map((r) => r.nilai),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const jumlahSiswaChart = {
    labels: ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
    datasets: [
      {
        label: "Jumlah Siswa",
        data: jumlahSiswaKelas,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const statCards = [
    { 
      title: "Jumlah Siswa", 
      value: "342", 
      icon: FaUsers, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Jumlah Guru", 
      value: "24", 
      icon: FaChalkboardTeacher, 
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50"
    },
    { 
      title: "Orang Tua Terdaftar", 
      value: "342", 
      icon: FaUserFriends, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      title: "Tahun Ajaran Aktif", 
      value: "Ganjil - 2024/2025", 
      icon: FaCalendarAlt, 
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  return (
    <div>
      {/* Statistik Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => {
          const IconComponent = card.icon;
          return (
            <div key={i} className={`${card.bgColor} p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                  <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="flex flex-col gap-6">
          {/* Peringkat Siswa */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                  <FaTrophy className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Peringkat Siswa</h3>
              </div>
              <div className="flex gap-3">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>Ganjil</option>
                  <option>Genap</option>
                </select>
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

                     {/* Pie Chart */}
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
             <div className="flex items-center mb-6">
               <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg text-white mr-3">
                 <FaChartPie className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold text-gray-800">
                 Perbandingan Jenis Kelamin Siswa
               </h3>
             </div>
            <div className="h-64">
              <Pie 
                data={genderData}
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
                342 Total Siswa
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg text-white">
                <FaUsers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Jumlah Siswa Per Kelas</h3>
            </div>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
          </div>
          <div className=" mt-10 h-200">
            <Bar
              data={jumlahSiswaChart}
              options={{
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
                  y: {
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
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                      color: '#6B7280',
                      font: {
                        size: 12,
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
