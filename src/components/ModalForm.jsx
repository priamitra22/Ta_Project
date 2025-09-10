import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaSave, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import SearchableSelect from "./SearchableSelect";

export default function ModalForm({
  // Modal props
  isOpen = false,
  onClose,
  title = "Form Modal",
  
  // Form props
  fields = [],
  initialData = null,
  onSubmit,
  onFieldChange, // Add onFieldChange prop
  
  // Customization
  submitText = "Simpan",
  cancelText = "Batal",
  loadingText = "Menyimpan...",
  
  // Validation
  validateOnBlur = true,
  validateOnSubmit = true,
  
  // Styling
  size = "md", // sm, md, lg, xl
  className = "",
  
  // Custom footer
  customFooter = null,
  
  // Custom header
  customHeader = null
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  // Custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 3px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      .scrollbar-thin {
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #f3f4f6;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // ✅ PERBAIKAN: Gunakan spread operator untuk memastikan object baru
        const newFormData = { ...initialData };
        setFormData(newFormData);
        setIsEditMode(true);
      } else {
        // Create empty form data from fields
        const emptyData = {};
        fields.forEach(field => {
          if (field.type === "multiselect" || field.type === "multidropdown") {
            emptyData[field.name] = field.defaultValue || [];
          } else {
            emptyData[field.name] = field.defaultValue || "";
          }
        });
        setFormData(emptyData);
        setIsEditMode(false);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  // Update form data when fields change (for dynamic values)
  useEffect(() => {
    if (isOpen && !initialData) { // ✅ PERBAIKAN: Hanya jalankan jika tidak ada initialData
      const updatedData = { ...formData };
      let hasChanges = false;
      
      fields.forEach(field => {
        if (field.value !== undefined && field.value !== formData[field.name]) {
          updatedData[field.name] = field.value;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setFormData(updatedData);
      }
    }
  }, [isOpen, initialData]); // Tambahkan initialData ke dependency

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Call onFieldChange if provided
    if (onFieldChange) {
      onFieldChange(name, value, formData);
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        dropdowns.forEach(dropdown => {
          if (!dropdown.contains(event.target)) {
            const fieldName = dropdown.getAttribute('data-dropdown');
            if (formData[`${fieldName}_open`]) {
              handleInputChange(`${fieldName}_open`, false);
            }
          }
        });
      }
    };

    // Auto-scroll to active dropdown
    const handleDropdownOpen = (fieldName) => {
      if (formData[`${fieldName}_open`]) {
        const dropdownElement = document.querySelector(`[data-dropdown="${fieldName}"]`);
        if (dropdownElement) {
          setTimeout(() => {
            dropdownElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest',
              inline: 'nearest'
            });
          }, 100);
        }
      }
    };

    // Check for open dropdowns and scroll to them
    Object.keys(formData).forEach(key => {
      if (key.endsWith('_open') && formData[key]) {
        const fieldName = key.replace('_open', '');
        handleDropdownOpen(fieldName);
      }
    });

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, formData]);

  // Validation functions
  const validateField = (field, value) => {
    const fieldErrors = [];

    // Handle multiselect and multidropdown validation
    if (field.type === "multiselect" || field.type === "multidropdown") {
      if (field.required && (!Array.isArray(value) || value.length === 0)) {
        fieldErrors.push(`${field.label} harus dipilih minimal satu`);
      }
      return fieldErrors;
    }

    // Ensure value is a string for validation
    const stringValue = value ? String(value) : "";

    // Required validation
    if (field.required && (!stringValue || stringValue.trim() === "")) {
      fieldErrors.push(`${field.label} harus diisi`);
    }

    // Type validation
    if (stringValue && stringValue.trim() !== "") {
      switch (field.type) {
        case "email": {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(stringValue)) {
            fieldErrors.push("Format email tidak valid");
          }
          break;
        }
          
        case "number": {
          if (isNaN(stringValue) || stringValue === "") {
            fieldErrors.push(`${field.label} harus berupa angka`);
          }
          break;
        }
          
        case "tel": {
          const phoneRegex = /^[0-9+\-\s()]*$/;
          if (!phoneRegex.test(stringValue)) {
            fieldErrors.push(`${field.label} hanya boleh berisi angka dan simbol +-() `);
          }
          break;
        }
      }

      // Built-in validation helpers via `validation` string
      if (field.validation) {
        if (field.validation.includes("minLength:")) {
          const minLength = parseInt(field.validation.split("minLength:")[1].split(",")[0]);
          if (stringValue.length < minLength) {
            fieldErrors.push(`${field.label} minimal ${minLength} karakter`);
          }
        }
        
        if (field.validation.includes("maxLength:")) {
          const maxLength = parseInt(field.validation.split("maxLength:")[1].split(",")[0]);
          if (stringValue.length > maxLength) {
            fieldErrors.push(`${field.label} maksimal ${maxLength} karakter`);
          }
        }
        
        if (field.validation.includes("numbersOnly")) {
          const numberRegex = /^[0-9]+$/;
          if (!numberRegex.test(stringValue)) {
            fieldErrors.push(`${field.label} hanya boleh berisi angka`);
          }
        }
      }

      // Custom validation function provided by field definition
      if (typeof field.customValidation === "function") {
        const customError = field.customValidation(stringValue);
        if (customError) {
          fieldErrors.push(customError);
        }
      }
    }

    return fieldErrors;
  };

  // Handle field blur (validate on blur)
  const handleFieldBlur = (field) => {
    if (validateOnBlur) {
      const fieldErrors = validateField(field, formData[field.name] || (field.type === "multiselect" || field.type === "multidropdown" ? [] : ""));
      setErrors(prev => ({
        ...prev,
        [field.name]: fieldErrors.join(", ")
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.name] || (field.type === "multiselect" || field.type === "multidropdown" ? [] : ""));
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors.join(", ");
        isValid = false;
      }
    });

    // Cross-field validation for tahun ajaran form
    if (formData.tanggal_mulai && formData.tanggal_berakhir) {
      const tanggalMulai = new Date(formData.tanggal_mulai);
      const tanggalBerakhir = new Date(formData.tanggal_berakhir);
      
      if (tanggalBerakhir <= tanggalMulai) {
        newErrors.tanggal_berakhir = 'Tanggal berakhir harus setelah tanggal mulai';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateOnSubmit && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, isEditMode);
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const fieldValue = formData[field.name] || (field.type === "multiselect" || field.type === "multidropdown" ? [] : "");
    const fieldError = errors[field.name];
    const hasError = !!fieldError;
    

    const baseInputClasses = `
      w-full px-3 py-2.5 border rounded-md text-sm transition-colors bg-white
      ${hasError 
        ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
      }
    `;

    switch (field.type) {
      case "select":
        return (
          <div className="relative">
            <select
              value={fieldValue}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(field.name, value);
                // Call custom onChange if provided
                if (field.onChange) {
                  field.onChange(value);
                }
              }}
              onBlur={() => handleFieldBlur(field)}
              className={`${baseInputClasses} appearance-none pr-8 cursor-pointer`}
              disabled={field.disabled}
            >
              <option value="" className="text-gray-500">
                {field.placeholder || `Pilih ${field.label}`}
              </option>
              {field.options?.map((option, index) => (
                <option key={`${option.value}-${index}`} value={option.value} className="text-gray-900">
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
        );

      case "searchable-select":
        return (
          <SearchableSelect
            value={fieldValue}
            options={field.options || []}
            placeholder={field.placeholder || `Pilih ${field.label}`}
            onChange={(value) => {
              handleInputChange(field.name, value);
              // Call custom onChange if provided
              if (field.onChange) {
                field.onChange(value);
              }
            }}
            onBlur={() => handleFieldBlur(field)}
            disabled={field.disabled}
            hasError={hasError}
            uniqueKelas={field.uniqueKelas}
            searchable={field.searchable}
            filterable={field.filterable}
          />
        );

      case "textarea":
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            className={`${baseInputClasses} resize-none`}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(fieldValue)}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={field.disabled}
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.checkboxLabel || field.label}
            </label>
          </div>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={`${option.value}-${index}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  checked={Array.isArray(fieldValue) && fieldValue.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(fieldValue) ? [...fieldValue] : [];
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
                    handleInputChange(field.name, currentValues);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={field.disabled}
                />
                <label htmlFor={`${field.name}-${option.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "multidropdown":
        return (
          <div className="relative" data-dropdown={field.name}>
            <div
              onClick={() => {
                const currentOpen = formData[`${field.name}_open`] || false;
                handleInputChange(`${field.name}_open`, !currentOpen);
              }}
              className={`
                w-full px-3 py-2.5 border rounded-md text-sm transition-colors bg-white cursor-pointer
                ${hasError 
                  ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                }
                ${Array.isArray(fieldValue) && fieldValue.length > 0 ? "text-gray-900" : "text-gray-500"}
              `}
            >
              {Array.isArray(fieldValue) && fieldValue.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {fieldValue.map((selectedValue) => {
                    const selectedOption = field.options?.find(opt => opt.value === selectedValue);
                    return (
                      <span
                        key={selectedValue}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {selectedOption?.label || selectedValue}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newValues = fieldValue.filter(v => v !== selectedValue);
                            handleInputChange(field.name, newValues);
                          }}
                          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span>Pilih {field.label}</span>
              )}
            </div>
            
            {/* Dropdown arrow */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

                                      {/* Dropdown options */}
            {formData[`${field.name}_open`] && (
              <div 
                className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{ 
                  maxHeight: field.maxVisibleItems 
                    ? `${field.maxVisibleItems * 40}px` // 40px per item
                    : '240px' // default max-h-60 (15rem = 240px)
                }}
              >
                {/* Search box for long lists */}
                {field.options && field.options.length > 6 && (
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                    <input
                      type="text"
                      placeholder="Cari anak..."
                      value={formData[`${field.name}_search`] || ""}
                      onChange={(e) => handleInputChange(`${field.name}_search`, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                
                                 {/* Filtered options */}
                 {(() => {
                   const filteredOptions = field.options?.filter(option => {
                     const searchTerm = formData[`${field.name}_search`] || "";
                     if (!searchTerm) return true;
                     return option.label.toLowerCase().includes(searchTerm.toLowerCase());
                   }) || [];
                   
                   if (filteredOptions.length === 0) {
                     return (
                       <div className="px-3 py-4 text-center text-gray-500 text-sm">
                         {formData[`${field.name}_search`] ? "Tidak ada hasil yang ditemukan" : "Tidak ada opsi tersedia"}
                       </div>
                     );
                   }
                   
                   return filteredOptions.map((option, index) => (
                     <div
                       key={`${option.value}-${index}`}
                       onClick={() => {
                         const currentValues = Array.isArray(fieldValue) ? [...fieldValue] : [];
                         if (currentValues.includes(option.value)) {
                           const newValues = currentValues.filter(v => v !== option.value);
                           handleInputChange(field.name, newValues);
                         } else {
                           currentValues.push(option.value);
                           handleInputChange(field.name, currentValues);
                         }
                       }}
                       className={`
                         px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors
                         ${Array.isArray(fieldValue) && fieldValue.includes(option.value) 
                           ? "bg-blue-50 text-blue-900" 
                           : "text-gray-900"
                         }
                       `}
                     >
                       <div className="flex items-center">
                         <div className={`
                           w-4 h-4 mr-2 rounded border-2 flex items-center justify-center
                           ${Array.isArray(fieldValue) && fieldValue.includes(option.value)
                             ? "bg-blue-600 border-blue-600"
                             : "border-gray-300"
                           }
                         `}>
                           {Array.isArray(fieldValue) && fieldValue.includes(option.value) && (
                             <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                           )}
                         </div>
                         {option.label}
                       </div>
                     </div>
                   ));
                 })()}
              </div>
            )}
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            className={baseInputClasses}
            disabled={field.disabled}
            readOnly={field.readOnly}
          />
        );

      case "custom":
        return field.render ? field.render() : null;

      default:
        return (
          <input
            type={field.type || "text"}
            value={fieldValue}
            onChange={(e) => {
              const raw = e.target.value;
              let next = field.validation?.includes("numbersOnly")
                ? raw.replace(/[^0-9]/g, "")
                : raw;
              
              // Call custom onChange if provided
              if (field.onChange) {
                next = field.onChange(next);
              }
              
              handleInputChange(field.name, next);
            }}
            onBlur={() => handleFieldBlur(field)}
            className={baseInputClasses}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            inputMode={field.validation?.includes("numbersOnly") ? "numeric" : undefined}
            pattern={field.pattern || (field.validation?.includes("numbersOnly") ? "[0-9]*" : undefined)}
            maxLength={field.maxLength}
            onInput={field.onInput}
          />
        );
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" style={{ scrollPaddingBottom: '200px' }}>
        
        {/* Backdrop - Abu-abu gelap solid seperti di halaman akun pengguna */}
        <div 
          className="fixed inset-0 bg-gray-900 transition-opacity z-[9999]"
          onClick={onClose}
        />
        
        {/* Modal - Styling sama persis dengan halaman akun pengguna */}
        <div className={`inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className} z-[10000] relative`}>
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            {customHeader ? (
              customHeader()
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? `Edit ${title}` : `Tambah ${title}`}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 bg-gray-50">
            <div className="space-y-5">
              {fields.map((field) => {
                // Optional conditional rendering support
                if (typeof field.showIf === "function") {
                  const shouldShow = field.showIf(formData);
                  if (!shouldShow) return null;
                }
                return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {renderField(field)}
                  
                  {/* Error message */}
                  {errors[field.name] && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors[field.name]}</span>
                    </div>
                  )}
                  
                  {/* Help text */}
                  {field.helpText && (
                    <p className="mt-2 text-xs text-gray-500">
                      {field.helpText}
                    </p>
                  )}
                </div>
              );})}
            </div>
            
            {/* Action buttons */}
            {customFooter ? (
              customFooter()
            ) : (
              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  {cancelText}
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      {loadingText}
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      {submitText}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
