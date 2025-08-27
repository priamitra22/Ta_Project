import React, { useState, useMemo, useEffect } from "react";
import { FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import StatCard from "../../../components/StatCard";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/DataTable";
import ModalForm from "../../../components/ModalForm";
import BulkActions from "../../../components/BulkActions";
import BulkEditModal from "../../../components/BulkEditModal";
import BulkImportModal from "../../../components/BulkImportModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { useNotification } from "../../../hooks/useNotification";

export default function AkunPenggunaPage() {
  // ===== HOOKS =====
  const notification = useNotification();

  // ===== CONSTANTS =====
  const totalAkun = 15;
  const akunAktif = 12;
  const akunNonaktif = 3;

  // ===== STATE MANAGEMENT =====
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Role");
  const [statusFilter, setStatusFilter] = useState("Semua Status");



  // Auto-reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Table states
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("single"); // "single" atau "bulk"
  const [deleteItem, setDeleteItem] = useState(null); // Untuk single delete
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // ===== EVENT HANDLERS =====
  // Filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Bulk actions handlers
  const handleBulkEdit = () => setIsBulkEditOpen(true);
  
  const handleBulkDelete = () => {
    setDeleteType("bulk");
    setIsDeleteModalOpen(true);
  };

  const handleSingleDelete = (item) => {
    setDeleteType("single");
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    try {
      if (deleteType === "bulk") {
        setDummyData(prevData => 
          prevData.filter(item => !selectedRows.includes(item.id))
        );
        notification.showSuccessMessage("bulkDelete");
        setSelectedRows([]);
      } else {
        setDummyData(prevData => 
          prevData.filter(item => item.id !== deleteItem.id)
        );
        notification.showSuccessMessage("delete", `akun ${deleteItem.nama}`);
      }
      
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error) {
      notification.showErrorMessage("delete", error.message);
    }
  };

  const handleClearSelection = () => setSelectedRows([]);

  // ===== CONFIGURATION =====
  // Fields for Edit Akun
  const editFields = [
    { name: "nama", label: "Nama", type: "text", required: true },
    {
      name: "nip",
      label: "NIP/NISN",
      type: "text",
      required: true,
      validation: "numbersOnly,minLength:10",
      helpText: "Hanya angka, minimal 10 digit"
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Guru", label: "Guru" },
        { value: "Orang Tua", label: "Orang Tua" }
      ]
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "Aktif", label: "Aktif" },
        { value: "Nonaktif", label: "Nonaktif" }
      ]
    }
  ];

  // ===== DATA =====
  // Dummy data untuk table
  const [dummyData, setDummyData] = useState([
    { id: 1, nama: "Ahmad Supriadi", nip: "198501152010012001", role: "Guru", status: "Aktif" },
    { id: 2, nama: "Siti Nurhaliza", nip: "198603202010012002", role: "Guru", status: "Aktif" },
    { id: 3, nama: "Budi Santoso", nip: "198704152010012003", role: "Guru", status: "Aktif" },
    { id: 4, nama: "Dewi Sartika", nip: "198805102010012004", role: "Guru", status: "Nonaktif" },
    { id: 5, nama: "Rudi Hermawan", nip: "198906052010012005", role: "Guru", status: "Aktif" },
    { id: 6, nama: "Nina Marlina", nip: "199007152010012006", role: "Guru", status: "Aktif" },
    { id: 7, nama: "Agus Setiawan", nip: "199108202010012007", role: "Guru", status: "Aktif" },
    { id: 8, nama: "Yuni Safitri", nip: "199209052010012008", role: "Guru", status: "Nonaktif" },
    { id: 9, nama: "Doni Kusuma", nip: "199310152010012009", role: "Guru", status: "Aktif" },
    { id: 10, nama: "Rina Wati", nip: "199411202010012010", role: "Guru", status: "Aktif" },
    { id: 11, nama: "Joko Widodo", nip: "199512052010012011", role: "Guru", status: "Aktif" },
    { id: 12, nama: "Sri Mulyani", nip: "199601152010012012", role: "Guru", status: "Aktif" },
    { id: 13, nama: "Bambang Brodjonegoro", nip: "199702202010012013", role: "Guru", status: "Nonaktif" },
    { id: 14, nama: "Erick Thohir", nip: "199803052010012014", role: "Guru", status: "Aktif" },
    { id: 15, nama: "Luhut Binsar Pandjaitan", nip: "199904152010012015", role: "Guru", status: "Aktif" }
  ]);

  // SearchBar configuration
  const searchBarConfig = {
    // Search props
    searchValue: searchTerm,
    onSearchChange: handleSearchChange,
    searchPlaceholder: "Cari nama atau NIP/NISN...",
    
    // Filter props
    roleOptions: [
      { value: "Semua Role", label: "Semua Role" },
      { value: "Admin", label: "Admin" },
      { value: "Guru", label: "Guru" },
      { value: "Orang Tua", label: "Orang Tua" }
    ],
    selectedRole: roleFilter,
    onRoleChange: handleRoleChange,
    
    statusOptions: [
      { value: "Semua Status", label: "Semua Status" },
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" }
    ],
    selectedStatus: statusFilter,
    onStatusChange: handleStatusChange,
    
    // Action props
    onReset: () => {
      setSearchTerm("");
      setRoleFilter("Semua Role");
      setStatusFilter("Semua Status");
      setCurrentPage(1); // Reset ke halaman pertama
      
      // Show info notification
      notification.showInfoMessage("reset");
    },
    onImport: () => setIsImportOpen(true),
    importButtonText: "Tambah Banyak Akun",
    onAdd: () => setIsAddOpen(true),
    addButtonText: "Tambah Akun",
    
    // Customization
    showResetButton: true
  };

  // ===== COMPUTED VALUES =====
  // Filter dan search logic
  const filteredData = useMemo(() => {
    return dummyData.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.nip.includes(searchTerm);
      const matchesRole = roleFilter === "Semua Role" || item.role === roleFilter;
      const matchesStatus = statusFilter === "Semua Status" || item.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter, dummyData]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);



  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
      {/* ===== HEADER SECTION ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <FaUsers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Akun Pengguna</h1>
            <p className="text-gray-600">Kelola semua akun pengguna sistem</p>
          </div>
        </div>



        {/* ===== STATISTICS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Total Akun"
            value={totalAkun}
            icon={FaUsers}
            color="blue"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("Semua Role");
              setStatusFilter("Semua Status");
              setCurrentPage(1);
              
              // Show info notification
              notification.showInfoMessage("reset", "Filter direset ke default");
            }}
          />
          
          <StatCard
            title="Akun Aktif"
            value={akunAktif}
            icon={FaUsers}
            color="green"
            onClick={() => {
              setStatusFilter("Aktif");
              setCurrentPage(1);
              
              // Show info notification
              notification.showInfoMessage("filter", "Filter: Status Aktif");
            }}
          />
          
          <StatCard
            title="Akun Nonaktif"
            value={akunNonaktif}
            icon={FaUsers}
            color="red"
            onClick={() => {
              setStatusFilter("Nonaktif");
              setCurrentPage(1);
              
              // Show info notification
              notification.showInfoMessage("filter", "Filter: Status Nonaktif");
            }}
          />
        </div>
      </div>

      {/* ===== SEARCH & FILTER TOOLBAR ===== */}
      <div className="mb-6">
        <SearchBar {...searchBarConfig} />
      </div>

      {/* ===== BULK ACTIONS ===== */}
      <div className="mb-4">
        <BulkActions
          selectedRows={selectedRows}
          totalRows={dummyData.length}
          onClearSelection={handleClearSelection}
          onBulkEdit={handleBulkEdit}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* ===== DATA TABLE ===== */}
      <div className="mb-6">
        <DataTable
          icon={FaUsers}
          title="Daftar Akun Pengguna"
          description={`${filteredData.length} dari ${dummyData.length} akun`}
          iconColor="blue"
          columns={[
            { key: "nama", header: "Nama" },
            { key: "nip", header: "NIP/NISN" },
            { key: "role", header: "Role" },
            { key: "status", header: "Status" },
            { 
              key: "actions", 
              header: "Aksi",
              cell: (_, row) => (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1.5"
                    onClick={() => {
                      setEditRow(row);
                      setIsEditOpen(true);
                    }}
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Edit</span>
                  </button>
        <button
                    className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
                    onClick={() => handleSingleDelete(row)}
        >
                    <FaTrash className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Hapus</span>
        </button>
      </div>
              )
            }
          ]}
          data={currentData}
          selectedRows={selectedRows}
          onRowSelect={setSelectedRows}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
            notification.showInfoMessage("pagination", `Menampilkan ${newItemsPerPage} item per halaman`);
          }}
          totalItems={filteredData.length}
        />
      </div>

      {/* ===== MODALS ===== */}
      {/* Bulk Import Modal (Manual Only) */}
      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Tambah Banyak Akun (Manual)"
        fields={[
          { name: "nama", label: "Nama", type: "text", required: true },
          {
            name: "nip",
            label: "NIP/NISN",
            type: "text",
            required: true,
            validation: "numbersOnly,minLength:10",
            placeholder: "Hanya angka, minimal 10 digit"
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            required: true,
            options: [
              { value: "Admin", label: "Admin" },
              { value: "Guru", label: "Guru" },
              { value: "Orang Tua", label: "Orang Tua" }
            ]
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "Aktif", label: "Aktif" },
              { value: "Nonaktif", label: "Nonaktif" }
            ]
          }
        ]}
        maxRows={100}
        onImport={async (rows) => {
          try {
            // Map rows to data shape and append to end
            setDummyData(prev => {
              let lastId = prev[prev.length - 1]?.id || 0;
              const mapped = rows.map(r => ({ id: ++lastId, ...r }));
              return [...prev, ...mapped];
            });
            notification.showSuccessMessage("import", `${rows.length} akun`);
            setIsImportOpen(false);
          } catch (error) {
            notification.showErrorMessage("import", error.message);
          }
        }}
      />
      {/* Add Modal */}
      <ModalForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Akun Pengguna"
        fields={[
          { name: "nama", label: "Nama", type: "text", required: true },
          {
            name: "nip",
            label: "NIP/NISN",
            type: "text",
            required: true,
            validation: "numbersOnly,minLength:10",
            helpText: "Hanya angka, minimal 10 digit"
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            required: true,
            options: [
              { value: "Admin", label: "Admin" },
              { value: "Guru", label: "Guru" },
              { value: "Orang Tua", label: "Orang Tua" }
            ]
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "Aktif", label: "Aktif" },
              { value: "Nonaktif", label: "Nonaktif" }
            ]
          }
        ]}
        submitText="Tambah Akun"
        loadingText="Menambahkan..."
        onSubmit={async (data) => {
          try {
            // Generate simple incremental id
            const nextId = (dummyData[dummyData.length - 1]?.id || 0) + 1;
            const newItem = { id: nextId, ...data };
            setDummyData(prev => [...prev, newItem]);
            notification.showSuccessMessage("create", `akun ${data.nama}`);
            setIsAddOpen(false);
          } catch (error) {
            notification.showErrorMessage("create", error.message, `akun ${data.nama}`);
          }
        }}
      />

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Akun Pengguna"
        fields={editFields}
        initialData={editRow}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan perubahan..."
        onSubmit={async (data) => {
          try {
            // Update data in the table
            setDummyData(prevData => 
              prevData.map(item => 
                item.id === editRow.id ? { ...item, ...data } : item
              )
            );
            
            // Show success notification
            notification.showSuccessMessage("update", `akun ${editRow.nama}`);
            
            // Close modal and reset edit state
            setIsEditOpen(false);
            setEditRow(null);
          } catch (error) {
            notification.showErrorMessage("update", error.message, `akun ${editRow.nama}`);
          }
        }}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        selectedRows={selectedRows}
        selectedData={dummyData.filter(item => selectedRows.includes(item.id))}
        fields={[
          {
            name: "role",
            label: "Role",
            type: "select",
            required: false,
            options: [
              { value: "Admin", label: "Admin" },
              { value: "Guru", label: "Guru" },
              { value: "Orang Tua", label: "Orang Tua" }
            ]
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: false,
            options: [
              { value: "Aktif", label: "Aktif" },
              { value: "Nonaktif", label: "Nonaktif" }
            ]
          }
        ]}
        title="Bulk Edit Akun Pengguna"
        submitText="Simpan Perubahan"
        loadingText="Menyimpan perubahan..."
        onSubmit={async (globalData, selectedIds, perItemChanges) => {
          try {
            setDummyData(prevData => prevData.map(item => {
              if (!selectedIds.includes(item.id)) return item;
              const per = (perItemChanges && perItemChanges[item.id]) || {};
              const changes = { ...globalData, ...per };
              if (Object.keys(changes).length === 0) return item;
              return { ...item, ...changes };
            }));
            
            // Show success notification
            notification.showSuccessMessage("bulkUpdate");
            
            setSelectedRows([]);
            setIsBulkEditOpen(false);
          } catch (error) {
            notification.showErrorMessage("bulkUpdate", error.message);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        type={deleteType}
        itemName={deleteItem?.nama || ""}
        itemCount={selectedRows.length}
        title={deleteType === "bulk" ? "Konfirmasi Hapus Massal" : "Konfirmasi Hapus"}
      />
      </div>
    </div>
  );
}
