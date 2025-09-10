import React, { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({
  value,
  options = [],
  placeholder = "Pilih...",
  onChange,
  onBlur,
  disabled = false,
  hasError = false,
  uniqueKelas = [],
  searchable = true,
  filterable = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term and kelas filter
  useEffect(() => {
    let filtered = options;

    // Filter by kelas
    if (kelasFilter) {
      filtered = filtered.filter(option => 
        option.label.toLowerCase().includes(kelasFilter.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOptions(filtered);
  }, [options, searchTerm, kelasFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setKelasFilter("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        setKelasFilter("");
      }
    }
  };

  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setKelasFilter("");
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value == value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const baseClasses = `
    w-full px-3 py-2.5 border rounded-md text-sm transition-colors bg-white
    ${hasError 
      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
    }
    ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        onBlur={onBlur}
        disabled={disabled}
        className={`${baseClasses} text-left flex items-center justify-between`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {getSelectedLabel()}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search and Filter Controls */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Kelas Filter */}
              {filterable && uniqueKelas.length > 0 && (
                <div className="mt-2">
                  <select
                    value={kelasFilter}
                    onChange={(e) => setKelasFilter(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua Kelas</option>
                    {uniqueKelas.map(kelas => (
                      <option key={kelas} value={kelas}>{kelas}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                    ${option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}
                    ${value == option.value ? 'bg-blue-100 text-blue-900' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm || kelasFilter ? 'Tidak ada hasil ditemukan' : 'Tidak ada opsi tersedia'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
