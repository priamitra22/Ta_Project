import React, { useMemo } from 'react';
import StatCard from '../../../../components/StatCard';
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const TahunAjaranStats = ({ stats, loading }) => {
  const loadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-100 animate-pulse rounded-xl p-6 h-24"></div>
      <div className="bg-gray-100 animate-pulse rounded-xl p-6 h-24"></div>
    </div>
  ), []);

  const statsContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Tahun Ajaran */}
      <StatCard
        title="Total Tahun Ajaran"
        value={stats.total}
        icon={FaCalendarAlt}
        color="blue"
      />

      {/* Semester Aktif */}
      <StatCard
        title="Semester Aktif"
        value={stats.active}
        icon={FaCheckCircle}
        color="green"
      />
    </div>
  ), [stats.total, stats.active]);

  if (loading) {
    return loadingSkeleton;
  }

  return statsContent;
};

export default TahunAjaranStats;
