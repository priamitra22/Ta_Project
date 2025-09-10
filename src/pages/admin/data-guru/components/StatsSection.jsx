import React from "react";
import { FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import StatCard from "../../../../components/StatCard";

export const StatsSection = ({ stats, onFilterChange }) => {
  const { total_guru, status } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <StatCard
        title="Total Guru"
        value={total_guru}
        icon={FaUsers}
        color="blue"
        onClick={() => {
          onFilterChange("search", "");
          onFilterChange("kelas", "Semua Kelas");
          onFilterChange("status", "Semua Status");
        }}
      />
      <StatCard
        title="Aktif"
        value={status.aktif}
        icon={FaUserCheck}
        color="green"
        onClick={() => onFilterChange("status", "aktif")}
      />
      <StatCard
        title="Nonaktif"
        value={status.nonaktif}
        icon={FaUserTimes}
        color="red"
        onClick={() => onFilterChange("status", "nonaktif")}
      />
    </div>
  );
};
