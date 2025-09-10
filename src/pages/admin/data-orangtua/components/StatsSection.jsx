import React from "react";
import { FaUsers, FaMale, FaFemale, FaUserTie } from "react-icons/fa";
import StatCard from "../../../../components/StatCard";

export const StatsSection = ({ stats, onFilterChange }) => {
  // Add safety checks for stats object and onFilterChange function
  if (!stats || !onFilterChange) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const { total_orangtua = 0, relasi = {} } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <StatCard
        title="Total Orang Tua"
        value={total_orangtua}
        icon={FaUsers}
        color="blue"
        onClick={() => {
          if (onFilterChange) {
            onFilterChange("search", "");
            onFilterChange("relasi", "Semua Relasi");
          }
        }}
      />
      <StatCard
        title="Jumlah Ayah"
        value={relasi.Ayah || 0}
        icon={FaMale}
        color="green"
        onClick={() => onFilterChange && onFilterChange("relasi", "Ayah")}
      />
      <StatCard
        title="Jumlah Ibu"
        value={relasi.Ibu || 0}
        icon={FaFemale}
        color="red"
        onClick={() => onFilterChange && onFilterChange("relasi", "Ibu")}
      />
      <StatCard
        title="Jumlah Wali"
        value={relasi.Wali || 0}
        icon={FaUserTie}
        color="purple"
        onClick={() => onFilterChange && onFilterChange("relasi", "Wali")}
      />
    </div>
  );
};
