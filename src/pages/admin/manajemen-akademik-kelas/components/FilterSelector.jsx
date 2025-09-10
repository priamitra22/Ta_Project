import React from 'react';
import { FaPlus } from 'react-icons/fa';

const FilterSelector = ({
  tahunAjaran,
  semester,
  tahunAjaranOptions = [],
  semesterOptions = [],
  onTahunAjaranChange,
  onSemesterChange,
  onTambahKelas,
  loading = false
}) => {

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-6 items-end">
        {/* Tahun Ajaran Selector */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tahun Ajaran
          </label>
          <select
            value={tahunAjaran}
            onChange={(e) => onTahunAjaranChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">{loading ? 'Loading...' : 'Pilih Tahun Ajaran'}</option>
            {tahunAjaranOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selector */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => onSemesterChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {semesterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tambah Kelas Button */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <button
            onClick={onTambahKelas}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSelector;
