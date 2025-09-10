import { useState } from "react";

export const useUserModals = () => {
  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Modal handlers
  const openEditModal = (row) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditRow(null);
  };

  const openDeleteModal = (item) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  const openAddModal = () => {
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  const openPasswordModal = (row) => {
    setEditRow(row);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setEditRow(null);
  };

  return {
    // States
    isEditOpen,
    editRow,
    isDeleteModalOpen,
    deleteItem,
    isAddOpen,
    isPasswordModalOpen,
    
    // Handlers
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openAddModal,
    closeAddModal,
    openPasswordModal,
    closePasswordModal,
    
    // Setters (for direct state updates)
    setIsEditOpen,
    setEditRow,
    setIsDeleteModalOpen,
    setDeleteItem,
    setIsAddOpen,
    setIsPasswordModalOpen
  };
};
