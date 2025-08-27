import React from "react";

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color = "blue", 
  onClick, 
  className = "" 
}) {
  // Color schemes for different themes
  const colorSchemes = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-600",
      value: "text-blue-800",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-700"
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-600",
      value: "text-green-800",
      iconBg: "bg-green-200",
      iconColor: "text-green-700"
    },
    red: {
      bg: "from-red-50 to-red-100",
      border: "border-red-200",
      text: "text-red-600",
      value: "text-red-800",
      iconBg: "bg-red-200",
      iconColor: "text-red-700"
    },
    yellow: {
      bg: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      text: "text-yellow-600",
      value: "text-yellow-800",
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-700"
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-600",
      value: "text-purple-800",
      iconBg: "bg-purple-200",
      iconColor: "text-purple-700"
    },
    pink: {
      bg: "from-pink-50 to-pink-100",
      border: "border-pink-200",
      text: "text-pink-600",
      value: "text-pink-800",
      iconBg: "bg-pink-200",
      iconColor: "text-pink-700"
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div 
      className={`
        bg-gradient-to-r ${scheme.bg} 
        p-6 rounded-xl border ${scheme.border} 
        hover:shadow-lg transition-all duration-200 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${scheme.text} text-sm font-medium mb-1`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${scheme.value}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 ${scheme.iconBg} rounded-xl`}>
          {React.createElement(icon, { className: `w-8 h-8 ${scheme.iconColor}` })}
        </div>
      </div>
    </div>
  );
}
