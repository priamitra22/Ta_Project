import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaSave, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

export default function ModalForm({
  // Modal props
  isOpen = false,
  onClose,
  title = "Form Modal",
  
  // Form props
  fields = [],
  initialData = null,
  onSubmit,
  
  // Customization
  submitText = "Simpan",
  cancelText = "Batal",
  loadingText = "Menyimpan...",
  
  // Validation
  validateOnBlur = true,
  validateOnSubmit = true,
  
  // Styling
  size = "md", // sm, md, lg, xl
  className = ""
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

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setIsEditMode(true);
      } else {
        // Create empty form data from fields
        const emptyData = {};
        fields.forEach(field => {
          emptyData[field.name] = field.defaultValue || "";
        });
        setFormData(emptyData);
        setIsEditMode(false);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialData, fields]);

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

      // Built-in validation helpers via `validation` string
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

      // Custom validation function provided by field definition
      if (typeof field.customValidation === "function") {
        const customError = field.customValidation(value);
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
      const fieldErrors = validateField(field, formData[field.name]);
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
    
    if (validateOnSubmit && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, isEditMode);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
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
              checked={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={field.disabled}
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.checkboxLabel || field.label}
            </label>
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
            pattern={field.pattern || (field.validation?.includes("numbersOnly") ? "[0-9]*" : undefined)}
            maxLength={field.maxLength}
            onInput={field.onInput}
          />
        );
    }
  };

  // Debug: Log when ModalForm renders
  console.log("🔍 ModalForm render:", { isOpen, fields: fields.length, title });
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop - Abu-abu gelap solid seperti di halaman akun pengguna */}
        <div 
          className="fixed inset-0 bg-gray-900 transition-opacity z-[9999]"
          onClick={onClose}
        />
        
        {/* Modal - Styling sama persis dengan halaman akun pengguna */}
        <div className={`inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className} z-[10000] relative`}>
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
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
          </form>
        </div>
      </div>
    </div>
  );
}
