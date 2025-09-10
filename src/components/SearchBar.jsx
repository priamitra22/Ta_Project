import React from "react";
import { FaSearch, FaUpload, FaPlus, FaUsers, FaArrowUp } from "react-icons/fa";

export default function SearchBar({
  // Search props
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Cari...",
  
  // Filter props
  roleOptions = [],
  selectedRole = "Semua Role",
  onRoleChange,
  
  statusOptions = [],
  selectedStatus = "Semua Status", 
  onStatusChange,
  
  // Action props
  onReset,
  onImport,
  onAdd,
  onNaikKelas,
  
  // Customization
  importButtonText = "Import",
  addButtonText = "Tambah",
  naikKelasButtonText = "Naik Kelas",
  showResetButton = true,
  
  // Styling
  className = ""
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        
        {/* Left Section: Search, Filters & Reset */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaSearch className="h-3 w-3 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Role Filter */}
          {roleOptions.length > 0 && (
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => onRoleChange?.(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-2 py-1.5 pr-6 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          {statusOptions.length > 0 && (
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange?.(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-2 py-1.5 pr-6 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Button - Part of Left Section */}
          {showResetButton && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right Section: Action Buttons Only */}
        <div className="flex gap-2">
          {/* Naik Kelas Button */}
          {onNaikKelas && (
            <button
              onClick={onNaikKelas}
              className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <FaArrowUp className="w-3 h-3 mr-1.5" />
              {naikKelasButtonText}
            </button>
          )}

          {/* Import Button */}
          {onImport && (
            <div className="relative">
              <button
                onClick={onImport}
                className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <FaUsers className="w-3 h-3 mr-1.5" />
                {importButtonText}
              </button>
            </div>
          )}

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <FaPlus className="w-3 h-3 mr-1.5" />
              {addButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
