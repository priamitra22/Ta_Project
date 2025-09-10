import React from "react";
import { FaUserGraduate, FaUsers, FaMale, FaFemale } from "react-icons/fa";
import StatCard from "../../../../components/StatCard";

export const StatsSection = ({ stats, onFilterChange }) => {
  const { total_siswa, laki_laki, perempuan } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <StatCard
        title="Total Siswa"
        value={total_siswa}
        icon={FaUsers}
        color="blue"
        onClick={() => {
          onFilterChange("search", "");
          onFilterChange("kelas", "Semua Kelas");
          onFilterChange("jk", "Semua JK");
        }}
      />
      <StatCard
        title="Laki-laki"
        value={laki_laki}
        icon={FaMale}
        color="green"
        onClick={() => onFilterChange("jk", "L")}
      />
      <StatCard
        title="Perempuan"
        value={perempuan}
        icon={FaFemale}
        color="pink"
        onClick={() => onFilterChange("jk", "P")}
      />
    </div>
  );
};
