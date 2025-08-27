import React, { useMemo, useState, useEffect } from "react";
import { FaChalkboardTeacher, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import StatCard from "../../../components/StatCard";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/DataTable";
import ModalForm from "../../../components/ModalForm";
import BulkActions from "../../../components/BulkActions";
import BulkEditModal from "../../../components/BulkEditModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import BulkImportModal from "../../../components/BulkImportModal";
import { useNotification } from "../../../hooks/useNotification";

export default function DataGuruPage() {
  const notification = useNotification();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("Semua Kelas");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Table selection & pagination
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("single");
  const [deleteItem, setDeleteItem] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Data
  const [data, setData] = useState([
    { id: 1, nama: "Budi Santoso", nip: "198501152010012001", kelas: "Kelas 1", status: "Aktif" },
    { id: 2, nama: "Siti Aminah", nip: "198603202010012002", kelas: "Kelas 2", status: "Aktif" },
    { id: 3, nama: "Joko Widodo", nip: "198704152010012003", kelas: "Kelas 3", status: "Nonaktif" },
    { id: 4, nama: "Rina Wati", nip: "198805102010012004", kelas: "Kelas 4", status: "Aktif" },
    { id: 5, nama: "Ahmad Hidayat", nip: "198906052010012005", kelas: "Kelas 5", status: "Aktif" },
    { id: 6, nama: "Dewi Sartika", nip: "199007152010012006", kelas: "Kelas 6", status: "Aktif" },
  ]);

  // Stats
  const totalGuru = data.length;
  const guruAktif = data.filter((i) => i.status === "Aktif").length;
  const guruNonaktif = data.filter((i) => i.status === "Nonaktif").length;

  // Auto reset page
  useEffect(() => { setCurrentPage(1); }, [searchTerm, kelasFilter, statusFilter]);

  // SearchBar config (reuse role props to carry kelas)
  const searchBarConfig = {
    searchValue: searchTerm,
    onSearchChange: (v) => { setSearchTerm(v); setCurrentPage(1); },
    searchPlaceholder: "Cari nama atau NIP...",
    roleOptions: [
      { value: "Semua Kelas", label: "Semua Kelas" },
      { value: "Kelas 1", label: "Kelas 1" },
      { value: "Kelas 2", label: "Kelas 2" },
      { value: "Kelas 3", label: "Kelas 3" },
      { value: "Kelas 4", label: "Kelas 4" },
      { value: "Kelas 5", label: "Kelas 5" },
      { value: "Kelas 6", label: "Kelas 6" },
    ],
    selectedRole: kelasFilter,
    onRoleChange: (v) => { setKelasFilter(v); setCurrentPage(1); },
    statusOptions: [
      { value: "Semua Status", label: "Semua Status" },
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
    selectedStatus: statusFilter,
    onStatusChange: (v) => { setStatusFilter(v); setCurrentPage(1); },
    onReset: () => {
      setSearchTerm("");
      setKelasFilter("Semua Kelas");
      setStatusFilter("Semua Status");
      setCurrentPage(1);
      notification.showInfoMessage("reset");
    },
    onAdd: () => setIsAddOpen(true),
    addButtonText: "Tambah Guru",
    onImport: () => setIsImportOpen(true),
    importButtonText: "Tambah Banyak Guru",
    showResetButton: true,
  };

  // Filtering & pagination
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const s = searchTerm.trim().toLowerCase();
      const matchesSearch =
        item.nama.toLowerCase().includes(s) || item.nip.includes(searchTerm.trim());
      const matchesKelas = kelasFilter === "Semua Kelas" || item.kelas === kelasFilter;
      const matchesStatus = statusFilter === "Semua Status" || item.status === statusFilter;
      return matchesSearch && matchesKelas && matchesStatus;
    });
  }, [data, searchTerm, kelasFilter, statusFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Columns
  const columns = [
    { key: "nama", header: "Nama", width: "280px" },
    { key: "nip", header: "NIP", width: "200px" },
    { key: "kelas", header: "Kelas", width: "140px" },
    { key: "status", header: "Status", width: "120px" },
    {
      key: "actions",
      header: "Aksi",
      width: "150px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => { setEditRow(row); setIsEditOpen(true); }}
          >
            <FaEdit className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Edit</span>
          </button>
        <button
            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => { setDeleteType("single"); setDeleteItem(row); setIsDeleteModalOpen(true); }}
        >
            <FaTrash className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Hapus</span>
        </button>
      </div>
      ),
    },
  ];

  // Edit fields
  const formFields = [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "nip", label: "NIP", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Hanya angka, minimal 10 digit" },
    { name: "kelas", label: "Kelas", type: "select", required: true, options: [
      { value: "Kelas 1", label: "Kelas 1" },
      { value: "Kelas 2", label: "Kelas 2" },
      { value: "Kelas 3", label: "Kelas 3" },
      { value: "Kelas 4", label: "Kelas 4" },
      { value: "Kelas 5", label: "Kelas 5" },
      { value: "Kelas 6", label: "Kelas 6" },
    ]},
    { name: "status", label: "Status", type: "select", required: true, options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ]},
  ];

  // Bulk edit fields
  const bulkFields = [
    { name: "kelas", label: "Kelas", type: "select", required: false, options: formFields.find(f=>f.name==='kelas').options },
    { name: "status", label: "Status", type: "select", required: false, options: formFields.find(f=>f.name==='status').options },
  ];

  // Bulk actions handlers
  const handleBulkEdit = () => setIsBulkEditOpen(true);
  const handleBulkDelete = () => { setDeleteType("bulk"); setIsDeleteModalOpen(true); };
  const handleClearSelection = () => setSelectedRows([]);

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Guru</h1>
            <p className="text-gray-600">Kelola data guru dan wali kelas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Total Guru"
            value={totalGuru}
            icon={FaUsers}
            color="blue"
            onClick={() => {
              setSearchTerm("");
              setKelasFilter("Semua Kelas");
              setStatusFilter("Semua Status");
              setCurrentPage(1);
            }}
          />
          <StatCard
            title="Guru Aktif"
            value={guruAktif}
            icon={FaChalkboardTeacher}
            color="green"
            onClick={() => { setStatusFilter("Aktif"); setCurrentPage(1); }}
          />
          <StatCard
            title="Guru Nonaktif"
            value={guruNonaktif}
            icon={FaChalkboardTeacher}
            color="red"
            onClick={() => { setStatusFilter("Nonaktif"); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6">
        <SearchBar {...searchBarConfig} />
      </div>

      {/* Bulk Actions */}
      <div className="mb-4">
        <BulkActions
          selectedRows={selectedRows}
          totalRows={data.length}
          onClearSelection={handleClearSelection}
          onBulkEdit={handleBulkEdit}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Table */}
      <div className="mb-6">
        <DataTable
          icon={FaChalkboardTeacher}
          title="Daftar Guru"
          description={`${filteredData.length} dari ${data.length} guru`}
          iconColor="blue"
          columns={columns}
          data={currentData}
          selectedRows={selectedRows}
          onRowSelect={setSelectedRows}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          totalItems={filteredData.length}
        />
      </div>

      {/* Add Modal */}
      <ModalForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Guru"
        fields={formFields}
        submitText="Tambah Guru"
        loadingText="Menambahkan..."
        onSubmit={async (dataForm) => {
          try {
            const nextId = (data[data.length - 1]?.id || 0) + 1;
            setData(prev => [...prev, { id: nextId, ...dataForm }]);
            notification.showSuccessMessage("create", `guru ${dataForm.nama}`);
            setIsAddOpen(false);
          } catch (e) {
            notification.showErrorMessage("create", e.message, `guru ${dataForm.nama}`);
          }
        }}
      />

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Guru"
        fields={formFields}
        initialData={editRow}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
        onSubmit={async (dataForm) => {
          try {
            setData(prev => prev.map(it => it.id === editRow.id ? { ...it, ...dataForm } : it));
            notification.showSuccessMessage("update", `guru ${editRow.nama}`);
            setIsEditOpen(false);
            setEditRow(null);
          } catch (e) {
            notification.showErrorMessage("update", e.message, `guru ${editRow?.nama || ''}`);
          }
        }}
      />

      {/* Bulk Edit */}
      <BulkEditModal
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        selectedRows={selectedRows}
        selectedData={data.filter(d => selectedRows.includes(d.id))}
        fields={bulkFields}
        title="Bulk Edit Guru"
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
        onSubmit={async (globalData, selectedIds, perItemChanges) => {
          try {
            setData(prev => prev.map(item => {
              if (!selectedIds.includes(item.id)) return item;
              const per = (perItemChanges && perItemChanges[item.id]) || {};
              const changes = { ...globalData, ...per };
              if (Object.keys(changes).length === 0) return item;
              return { ...item, ...changes };
            }));
            setSelectedRows([]);
            setIsBulkEditOpen(false);
            notification.showSuccessMessage("bulkUpdate");
          } catch (e) {
            notification.showErrorMessage("bulkUpdate", e.message);
          }
        }}
      />

      {/* Delete Confirm */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          try {
            if (deleteType === "bulk") {
              setData(prev => prev.filter(it => !selectedRows.includes(it.id)));
              setSelectedRows([]);
              notification.showSuccessMessage("bulkDelete");
            } else if (deleteItem) {
              setData(prev => prev.filter(it => it.id !== deleteItem.id));
              notification.showSuccessMessage("delete", `guru ${deleteItem.nama}`);
            }
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
          } catch (e) {
            notification.showErrorMessage("delete", e.message);
          }
        }}
        type={deleteType}
        itemName={deleteItem?.nama || ""}
        itemCount={selectedRows.length}
        title={deleteType === "bulk" ? "Konfirmasi Hapus Massal" : "Konfirmasi Hapus"}
      />

      {/* Bulk Import Manual */}
      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Tambah Banyak Guru (Manual)"
        fields={formFields}
        maxRows={100}
        onImport={async (rows) => {
          try {
            setData(prev => {
              let lastId = prev[prev.length - 1]?.id || 0;
              const mapped = rows.map(r => ({ id: ++lastId, ...r }));
              return [...prev, ...mapped];
            });
            notification.showSuccessMessage("import", `${rows.length} guru`);
            setIsImportOpen(false);
          } catch (e) {
            notification.showErrorMessage("import", e.message);
          }
        }}
      />
      </div>
    </div>
  );
}
