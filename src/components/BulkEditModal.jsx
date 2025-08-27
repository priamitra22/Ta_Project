import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaSave, 
  FaSpinner,
  FaExclamationTriangle,
  FaUsers
} from "react-icons/fa";

export default function BulkEditModal({
  isOpen = false,
  onClose,
  selectedRows = [],
  fields = [],
  onSubmit,
  title = "Bulk Edit",
  submitText = "Simpan Perubahan",
  loadingText = "Menyimpan perubahan...",
  className = "",
  // Tambahan props untuk menampilkan data akun
  selectedData = []
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemEdits, setItemEdits] = useState({}); // { [id]: { [fieldName]: value } }

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create empty form data from fields
      const emptyData = {};
      fields.forEach(field => {
        emptyData[field.name] = field.defaultValue || "";
      });
      setFormData(emptyData);
      setErrors({});
      setIsSubmitting(false);

      // Initialize per-item edits as empty (no change by default)
      const initItemEdits = {};
      selectedData.forEach(acc => {
        initItemEdits[acc.id] = {};
      });
      setItemEdits(initItemEdits);
    }
  }, [isOpen, fields, selectedData]);

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
  };

  // Handle per-item select changes
  const handleItemEditChange = (id, field, value) => {
    setItemEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  // Validation functions
  const validateField = (field, value) => {
    const fieldErrors = [];

    // Required validation
    if (field.required && (!value || value.trim() === "")) {
      fieldErrors.push(`${field.label} harus diisi`);
    }

    // Type validation
    if (value && value.trim() !== "") {
      switch (field.type) {
        case "number": {
          if (isNaN(value) || value === "") {
            fieldErrors.push(`${field.label} harus berupa angka`);
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
        
        if (field.validation.includes("numbersOnly")) {
          const numberRegex = /^[0-9]+$/;
          if (!numberRegex.test(value)) {
            fieldErrors.push(`${field.label} hanya boleh berisi angka`);
          }
        }
      }
    }

    return fieldErrors;
  };

  // Handle field blur (validate on blur)
  const handleFieldBlur = (field) => {
    const fieldErrors = validateField(field, formData[field.name]);
    setErrors(prev => ({
      ...prev,
      [field.name]: fieldErrors.join(", ")
    }));
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.name]);
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors.join(", ");
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Filter hanya field global yang diisi (tidak kosong)
      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key].trim() !== "") {
          changedData[key] = formData[key];
        }
      });

      // Filter per-item edits: hanya kirim yang ada nilai (tidak kosong)
      const perItemChanges = {};
      Object.keys(itemEdits).forEach(id => {
        const edits = itemEdits[id] || {};
        const clean = {};
        Object.keys(edits).forEach(key => {
          if (edits[key] && String(edits[key]).trim() !== "") {
            clean[key] = edits[key];
          }
        });
        if (Object.keys(clean).length > 0) {
          perItemChanges[id] = clean;
        }
      });
      
      await onSubmit(changedData, selectedRows, perItemChanges);
      onClose();
    } catch (error) {
      console.error("Bulk edit submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const fieldValue = formData[field.name] || "";
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
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field)}
              className={`${baseInputClasses} appearance-none pr-8 cursor-pointer`}
              disabled={field.disabled}
            >
              <option value="" className="text-gray-500">Pilih {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-900">
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

      default:
        return (
          <input
            type={field.type || "text"}
            value={fieldValue}
            onChange={(e) => {
              const raw = e.target.value;
              const next = field.validation?.includes("numbersOnly")
                ? raw.replace(/[^0-9]/g, "")
                : raw;
              handleInputChange(field.name, next);
            }}
            onBlur={() => handleFieldBlur(field)}
            className={baseInputClasses}
            placeholder={field.placeholder}
            disabled={field.disabled}
            inputMode={field.validation?.includes("numbersOnly") ? "numeric" : undefined}
            pattern={field.validation?.includes("numbersOnly") ? "[0-9]*" : undefined}
          />
        );
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
        <div className={`inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-4xl w-full ${className} z-[10000] relative`}>
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Edit {selectedRows.length} data sekaligus
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selected Accounts List */}
          {selectedData.length > 0 && (
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-900">
                  Akun yang dipilih:
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {selectedData.length} akun
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedData.map((account) => (
                    <div key={account.id} className="bg-white border-2 border-blue-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-colors">
                      {/* Nama Akun */}
                      <div className="font-medium text-sm text-blue-900 mb-2 truncate" title={account.nama}>
                        {account.nama}
                      </div>
                      
                      {/* Current data and per-item editors (dynamic based on fields) */}
                      <div className="space-y-2">
                        {fields.map((field) => (
                          field.type === 'select' ? (
                            <div key={`${account.id}-${field.name}`}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">{field.label} saat ini:</span>
                                <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                  {account[field.name] ?? '-'}
                                </span>
                              </div>
                              <select
                                value={itemEdits[account.id]?.[field.name] || ""}
                                onChange={(e) => handleItemEditChange(account.id, field.name, e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Tidak diubah</option>
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 bg-gray-50">
            <div className="space-y-5">
              {fields.map((field) => (
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
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                Batal
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
          </form>
        </div>
      </div>
    </div>
  );
}
