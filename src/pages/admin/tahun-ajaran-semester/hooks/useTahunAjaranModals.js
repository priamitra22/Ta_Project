import { useState } from 'react';

export const useTahunAjaranModals = () => {
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Modal handlers
  const openAddModal = () => {
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  const openDeleteModal = (item) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  return {
    // States
    isAddOpen,
    isDeleteModalOpen,
    deleteItem,
    
    // Handlers
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal,
    
    // Setters
    setIsAddOpen,
    setIsDeleteModalOpen,
    setDeleteItem
  };
};
