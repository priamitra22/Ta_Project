import { useState, useEffect } from "react";

export const useFormLogic = (getFormFields) => {
  // Form states
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({});
  const [formKey, setFormKey] = useState(0);
  const [currentFormFields, setCurrentFormFields] = useState([]);
  const [isFormReady, setIsFormReady] = useState(false);

  // Update form fields when role or data changes
  useEffect(() => {
    if (selectedRole) {
      // Check if data is ready for the selected role
      let dataReady = false;
      if (selectedRole === "admin") {
        dataReady = true;
      } else if (selectedRole === "guru") {
        // This will be set to true when teachersWithoutAccount is loaded
        dataReady = false;
      } else if (selectedRole === "orangtua") {
        // This will be set to true when anakOptions is loaded
        dataReady = false;
      }
      
      if (dataReady) {
        const newFields = getFormFields(selectedRole);
        setCurrentFormFields(newFields);
        setIsFormReady(true);
      }
    }
  }, [selectedRole, getFormFields]);

  // Reset form
  const resetForm = () => {
    setSelectedRole("");
    setFormData({});
    setFormKey(0);
    setCurrentFormFields([]);
    setIsFormReady(false);
  };

  // Update form data
  const updateFormData = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Set form ready (called from parent when data is loaded)
  const setFormReady = (ready) => {
    setIsFormReady(ready);
    if (ready && selectedRole) {
      const newFields = getFormFields(selectedRole);
      setCurrentFormFields(newFields);
    }
  };

  return {
    // States
    selectedRole,
    formData,
    formKey,
    currentFormFields,
    isFormReady,
    
    // Setters
    setSelectedRole,
    setFormData,
    setFormKey,
    setCurrentFormFields,
    setIsFormReady,
    
    // Actions
    resetForm,
    updateFormData,
    setFormReady
  };
};
