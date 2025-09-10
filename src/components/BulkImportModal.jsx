import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

export default function BulkImportModal({
  // Modal props
  isOpen = false,
  onClose,
  title = "Bulk Import",
  
  // Import props
  fields = [],
  onImport,
  
  // Customization
  maxRows = 100,
  
  // Styling
  size = "xl",
  className = ""
}) {
  const [manualData, setManualData] = useState([{}]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setManualData([{}]);
      setErrors({});
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  // Handle manual input change
  const handleManualInputChange = (rowIndex, fieldName, value) => {
    const newData = [...manualData];
    newData[rowIndex] = { ...newData[rowIndex], [fieldName]: value };
    setManualData(newData);
    
    // Clear error when user starts typing
    if (errors[`manual_${rowIndex}_${fieldName}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`manual_${rowIndex}_${fieldName}`];
        return newErrors;
      });
    }
  };

  // Add new manual input row
  const addManualRow = () => {
    if (manualData.length < maxRows) {
      setManualData([...manualData, {}]);
    }
  };

  // Remove manual input row
  const removeManualRow = (index) => {
    if (manualData.length > 1) {
      const newData = manualData.filter((_, i) => i !== index);
      setManualData(newData);
      
      // Clear errors for removed row
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`manual_${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  // Validate data
  const validateData = (data) => {
    const newErrors = {};
    
    data.forEach((row, rowIndex) => {
      fields.forEach(field => {
        const value = row[field.name];
        const fieldErrors = [];

        // Required validation
        if (field.required) {
          if (field.type === "multiselect") {
            if (!Array.isArray(value) || value.length === 0) {
              fieldErrors.push(`${field.label} harus dipilih minimal satu`);
            }
          } else if (!value || value.trim() === "") {
            fieldErrors.push(`${field.label} harus diisi`);
          }
        }

        // Type validation
        if (value && field.type !== "multiselect" && value.trim() !== "") {
          switch (field.type) {
            case "email": {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                fieldErrors.push("Format email tidak valid");
              }
              break;
            }
            
            case "number": {
              if (isNaN(value) || value === "") {
                fieldErrors.push(`${field.label} harus berupa angka`);
              }
              break;
            }
            
            case "tel": {
              const phoneRegex = /^[0-9+\-\s()]*$/;
              if (!phoneRegex.test(value)) {
                fieldErrors.push(`${field.label} hanya boleh berisi angka dan simbol +-() `);
              }
              break;
            }
          }

          // Custom validation
          if (field.validation) {
            if (field.validation.includes("minLength:")) {
              const minLength = parseInt(field.validation.split("minLength:")[1].split(",")[0]);
              if (value.length < minLength) {
                fieldErrors.push(`${field.label} minimal ${minLength} karakter`);
              }
            }
            
            if (field.validation.includes("maxLength:")) {
              const maxLength = parseInt(field.validation.split("maxLength:")[1].split(",")[0]);
              if (value.length > maxLength) {
                fieldErrors.push(`${field.label} maksimal ${maxLength} karakter`);
              }
            }
            
            if (field.validation.includes("numbersOnly")) {
              const numberRegex = /^[0-9]+$/;
              if (!numberRegex.test(value)) {
                fieldErrors.push(`${field.label} hanya boleh berisi angka`);
              }
            }
          }
        }

        if (fieldErrors.length > 0) {
          newErrors[`manual_${rowIndex}_${field.name}`] = fieldErrors.join(", ");
        }
      });
    });

    return newErrors;
  };

  // Handle import
  const handleImport = async () => {
    const dataToImport = manualData.filter(row => 
      Object.keys(row).some(key => {
        const value = row[key];
        if (!value) return false;
        
        // Check if this field is multiselect
        const field = fields.find(f => f.name === key);
        if (field && field.type === "multiselect") {
          return Array.isArray(value) && value.length > 0;
        }
        
        return value.trim() !== "";
      })
    );

    if (dataToImport.length === 0) {
      setErrors({ general: "Tidak ada data yang akan diimport" });
      return;
    }

    // Validate data
    const validationErrors = validateData(dataToImport);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    try {
      await onImport(dataToImport);
      // Reset after successful import
      setManualData([{}]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Import error:", error);
      setErrors({ general: "Gagal melakukan import. Silakan coba lagi." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900 transition-opacity z-[9999]"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className} z-[10000] relative`}>
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isProcessing}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-gray-50">
            {/* Header Content - Fixed */}
            <div className="px-6 py-4 border-b border-gray-200">
              {/* General Error */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              
              {/* Manual Input Form */}
              <div className="space-y-4">
                {manualData.map((row, rowIndex) => (
                  <div key={rowIndex} className="p-4 bg-white border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Baris {rowIndex + 1}
                      </h4>
                      {manualData.length > 1 && (
                        <button
                          onClick={() => removeManualRow(rowIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={isProcessing}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                     
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {field.type === "select" ? (
                            <div className="relative">
                              <select
                                value={row[field.name] || ""}
                                onChange={(e) => handleManualInputChange(rowIndex, field.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none pr-8 cursor-pointer"
                                disabled={isProcessing}
                              >
                                <option value="">Pilih {field.label}</option>
                                {field.options?.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                                                     ) : field.type === "multiselect" ? (
                             <div className="space-y-2 border border-gray-300 rounded-md">
                               {(() => {
                                 // Get all selected children from other rows
                                 const allSelectedChildren = manualData.reduce((acc, row, idx) => {
                                   if (idx !== rowIndex && row[field.name] && Array.isArray(row[field.name])) {
                                     acc.push(...row[field.name]);
                                   }
                                   return acc;
                                 }, []);
                                 
                                 // Filter options to show only available children
                                 const availableOptions = field.options?.filter(option => 
                                   !allSelectedChildren.includes(option.value)
                                 ) || [];
                                 
                                 // Show message if no children available
                                 if (availableOptions.length === 0) {
                                   return (
                                     <div className="text-center text-gray-500 text-sm py-4">
                                       Semua anak sudah dipilih di baris lain
                                     </div>
                                   );
                                 }
                                 
                                 // Add search functionality if there are many options
                                 const searchKey = `${rowIndex}-${field.name}-search`;
                                 const searchValue = manualData[rowIndex]?.[searchKey] || "";
                                 
                                 // Filter by search term
                                 const filteredOptions = availableOptions.filter(option => {
                                   if (!searchValue) return true;
                                   return option.label.toLowerCase().includes(searchValue.toLowerCase());
                                 });
                                 
                                 return (
                                   <>
                                     {/* Search Box - Fixed at Top */}
                                     {availableOptions.length > 4 && (
                                       <div className="p-3 border-b border-gray-200 bg-gray-50">
                                         <input
                                           type="text"
                                           placeholder="Cari anak..."
                                           value={searchValue}
                                           onChange={(e) => handleManualInputChange(rowIndex, searchKey, e.target.value)}
                                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                           onClick={(e) => e.stopPropagation()}
                                         />
                                       </div>
                                     )}
                                     
                                     {/* Options List - Scrollable Below Search */}
                                     <div className="max-h-32 overflow-y-auto p-2">
                                       {filteredOptions.length === 0 ? (
                                         <div className="text-center text-gray-500 text-sm py-4">
                                           {searchValue ? "Tidak ada hasil yang ditemukan" : "Tidak ada opsi tersedia"}
                                         </div>
                                       ) : (
                                         filteredOptions.map((option, optionIndex) => (
                                           <div key={optionIndex} className="flex items-center">
                                             <input
                                               type="checkbox"
                                               id={`${rowIndex}-${field.name}-${option.value}`}
                                               checked={Array.isArray(row[field.name]) && row[field.name].includes(option.value)}
                                               onChange={(e) => {
                                                 const currentValues = Array.isArray(row[field.name]) ? [...row[field.name]] : [];
                                                 if (e.target.checked) {
                                                   if (!currentValues.includes(option.value)) {
                                                     currentValues.push(option.value);
                                                   }
                                                 } else {
                                                   const index = currentValues.indexOf(option.value);
                                                   if (index > -1) {
                                                     currentValues.splice(index, 1);
                                                   }
                                                 }
                                                 handleManualInputChange(rowIndex, field.name, currentValues);
                                               }}
                                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                               disabled={isProcessing}
                                             />
                                             <label htmlFor={`${rowIndex}-${field.name}-${option.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                               {option.label}
                                             </label>
                                           </div>
                                         ))
                                       )}
                                     </div>
                                   </>
                                 );
                               })()}
                             </div>
                          ) : (
                            <input
                              type={field.type || "text"}
                              value={row[field.name] || ""}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const next = field.validation?.includes("numbersOnly")
                                  ? raw.replace(/[^0-9]/g, "")
                                  : raw;
                                handleManualInputChange(rowIndex, field.name, next);
                              }}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              disabled={isProcessing}
                              inputMode={field.validation?.includes("numbersOnly") ? "numeric" : undefined}
                              pattern={field.validation?.includes("numbersOnly") ? "[0-9]*" : undefined}
                            />
                          )}
                          
                          {errors[`manual_${rowIndex}_${field.name}`] && (
                            <div className="text-xs text-red-600 mt-1">
                              {errors[`manual_${rowIndex}_${field.name}`]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Row Button */}
              {manualData.length < maxRows && (
                <button
                  onClick={addManualRow}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  disabled={isProcessing}
                >
                  <FaPlus className="w-4 h-4 inline mr-2" />
                  Tambah Baris Baru
                </button>
              )}

              {/* Row Count Info */}
              <div className="text-center text-sm text-gray-500 mt-4">
                {manualData.length} dari {maxRows} baris maksimal
              </div>
            </div>

            {/* Footer Content - Fixed */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={isProcessing}
                >
                  Batal
                </button>
                 
                <button
                  onClick={handleImport}
                  disabled={isProcessing || manualData.filter(row => 
                    Object.keys(row).some(key => {
                      const value = row[key];
                      if (!value) return false;
                      
                      // Check if this field is multiselect
                      const field = fields.find(f => f.name === key);
                      if (field && field.type === "multiselect") {
                        return Array.isArray(value) && value.length > 0;
                      }
                      
                      return value.trim() !== "";
                    })
                  ).length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-4 h-4" />
                      Import Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
