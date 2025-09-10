import React from "react";
import { FaUsers } from "react-icons/fa";
import StatCard from "../../../../components/StatCard";

export default function UserStats({ stats, onTotalClick, onActiveClick, onInactiveClick }) {
  const { total_users, status } = stats;
  const totalAkun = total_users || 0;
  const akunAktif = status?.aktif || 0;
  const akunNonaktif = status?.nonaktif || 0;

  const statsData = [
    {
      title: "Total Akun",
      value: totalAkun,
      icon: FaUsers,
      color: "blue",
      onClick: onTotalClick
    },
    {
      title: "Akun Aktif",
      value: akunAktif,
      icon: FaUsers,
      color: "green",
      onClick: onActiveClick
    },
    {
      title: "Akun Nonaktif",
      value: akunNonaktif,
      icon: FaUsers,
      color: "red",
      onClick: onInactiveClick
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
}
