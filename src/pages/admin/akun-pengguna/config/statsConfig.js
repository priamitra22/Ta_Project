import { FaUsers } from "react-icons/fa";

export const createStatsConfig = (stats, handlers) => {
  const {
    onTotalClick,
    onActiveClick,
    onInactiveClick
  } = handlers;

  const { total_users, status } = stats;
  const totalAkun = total_users || 0;
  const akunAktif = status?.aktif || 0;
  const akunNonaktif = status?.nonaktif || 0;

  return [
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
};
