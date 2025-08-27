import React, { useEffect, useMemo, useState } from "react";
import { FaUserFriends, FaUsers, FaMale, FaFemale, FaUserTie, FaEdit, FaTrash } from "react-icons/fa";
import StatCard from "../../../components/StatCard";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/DataTable";
import ModalForm from "../../../components/ModalForm";
import BulkActions from "../../../components/BulkActions";
import BulkEditModal from "../../../components/BulkEditModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import BulkImportModal from "../../../components/BulkImportModal";
import { useNotification } from "../../../hooks/useNotification";

export default function DataOrangtuaPage() {
  const notification = useNotification();

  // Data
  const [data, setData] = useState([
    { id: 1, nama: "Ahmad Sudirman", nik: "3201123456789001", kontak: "081234567890", relasi: "Ayah", anak: "Muhammad Iqbal", alamat: "Jl. Raya Langensari No. 123, Bandung" },
    { id: 2, nama: "Siti Aminah", nik: "3201123456789002", kontak: "081234567891", relasi: "Ibu", anak: "Muhammad Iqbal", alamat: "Jl. Raya Langensari No. 123, Bandung" },
    { id: 3, nama: "Budi Santoso", nik: "3201123456789003", kontak: "081234567892", relasi: "Ayah", anak: "Siti Nurhaliza", alamat: "Jl. Cihampelas No. 45, Bandung" },
    { id: 4, nama: "Rina Wati", nik: "3201123456789004", kontak: "081234567893", relasi: "Ibu", anak: "Siti Nurhaliza", alamat: "Jl. Cihampelas No. 45, Bandung" },
    { id: 5, nama: "Joko Widodo", nik: "3201123456789005", kontak: "081234567894", relasi: "Ayah", anak: "Ahmad Rizki", alamat: "Jl. Sudirman No. 67, Jakarta" },
    { id: 6, nama: "Sri Wahyuni", nik: "3201123456789006", kontak: "081234567895", relasi: "Wali", anak: "Budi Santoso", alamat: "Jl. Gatot Subroto No. 89, Jakarta" },
  ]);

  // Stats
  const totalOrangTua = data.length;
  const jumlahAyah = data.filter(i => i.relasi === "Ayah").length;
  const jumlahIbu = data.filter(i => i.relasi === "Ibu").length;
  const jumlahWali = data.filter(i => i.relasi === "Wali").length;

  // Filters & table state
  const [searchTerm, setSearchTerm] = useState("");
  const [relasiFilter, setRelasiFilter] = useState("Semua Relasi");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("single");
  const [deleteItem, setDeleteItem] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Auto reset page on filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, relasiFilter]);

  // SearchBar config (use roleOptions for relasi)
  const searchBarConfig = {
    searchValue: searchTerm,
    onSearchChange: (v) => { setSearchTerm(v); setCurrentPage(1); },
    searchPlaceholder: "Cari nama, NIK, alamat...",
    roleOptions: [
      { value: "Semua Relasi", label: "Semua Relasi" },
      { value: "Ayah", label: "Ayah" },
      { value: "Ibu", label: "Ibu" },
      { value: "Wali", label: "Wali" },
    ],
    selectedRole: relasiFilter,
    onRoleChange: (v) => { setRelasiFilter(v); setCurrentPage(1); },
    statusOptions: [],
    selectedStatus: undefined,
    onStatusChange: undefined,
    onReset: () => {
      setSearchTerm("");
      setRelasiFilter("Semua Relasi");
      setCurrentPage(1);
      notification.showInfoMessage("reset");
    },
    onAdd: () => setIsAddOpen(true),
    addButtonText: "Tambah Orang Tua",
    onImport: () => setIsImportOpen(true),
    importButtonText: "Tambah Banyak Orang Tua",
    showResetButton: true,
  };

  // Filtering & pagination
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const s = searchTerm.trim().toLowerCase();
      const matchesSearch =
        item.nama.toLowerCase().includes(s) ||
        item.nik.includes(searchTerm.trim()) ||
        item.alamat.toLowerCase().includes(s) ||
        item.kontak.includes(searchTerm.trim());
      const matchesRelasi = relasiFilter === "Semua Relasi" || item.relasi === relasiFilter;
      return matchesSearch && matchesRelasi;
    });
  }, [data, searchTerm, relasiFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Columns
  const columns = [
    { key: "nama", header: "Nama", width: "220px" },
    { key: "nik", header: "NIK", width: "220px" },
    { key: "kontak", header: "Kontak", width: "160px" },
    { key: "relasi", header: "Relasi", width: "120px" },
    { key: "anak", header: "Anak", width: "200px" },
    { key: "alamat", header: "Alamat", width: "300px" },
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

  // Form fields
  const formFields = [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "nik", label: "NIK", type: "text", required: true, validation: "numbersOnly,minLength:16", helpText: "Hanya angka, minimal 16 digit" },
    { name: "kontak", label: "Kontak", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Hanya angka" },
    { name: "relasi", label: "Relasi", type: "select", required: true, options: [
      { value: "Ayah", label: "Ayah" },
      { value: "Ibu", label: "Ibu" },
      { value: "Wali", label: "Wali" },
    ]},
    { name: "anak", label: "Anak", type: "text", required: true },
    { name: "alamat", label: "Alamat", type: "text", required: true },
  ];

  // Bulk fields (only relasi for now)
  const bulkFields = [
    { name: "relasi", label: "Relasi", type: "select", required: false, options: formFields.find(f=>f.name==='relasi').options },
  ];

  // Bulk handlers
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
            <FaUserFriends className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Orang Tua</h1>
            <p className="text-gray-600">Kelola data orang tua siswa</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <StatCard title="Total Orang Tua" value={totalOrangTua} icon={FaUsers} color="blue" onClick={() => { setSearchTerm(""); setRelasiFilter("Semua Relasi"); setCurrentPage(1); }} />
          <StatCard title="Jumlah Ayah" value={jumlahAyah} icon={FaMale} color="green" onClick={() => { setRelasiFilter("Ayah"); setCurrentPage(1); }} />
          <StatCard title="Jumlah Ibu" value={jumlahIbu} icon={FaFemale} color="red" onClick={() => { setRelasiFilter("Ibu"); setCurrentPage(1); }} />
          <StatCard title="Jumlah Wali" value={jumlahWali} icon={FaUserTie} color="purple" onClick={() => { setRelasiFilter("Wali"); setCurrentPage(1); }} />
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
          icon={FaUserFriends}
          title="Daftar Orang Tua"
          description={`${filteredData.length} dari ${data.length} orang tua`}
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
        title="Tambah Orang Tua"
        fields={formFields}
        submitText="Tambah Orang Tua"
        loadingText="Menambahkan..."
        onSubmit={async (form) => {
          try {
            const nextId = (data[data.length - 1]?.id || 0) + 1;
            setData(prev => [...prev, { id: nextId, ...form }]);
            notification.showSuccessMessage("create", `orang tua ${form.nama}`);
            setIsAddOpen(false);
          } catch (e) {
            notification.showErrorMessage("create", e.message, `orang tua ${form.nama}`);
          }
        }}
      />

      {/* Edit Modal */}
      <ModalForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Orang Tua"
        fields={formFields}
        initialData={editRow}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
        onSubmit={async (form) => {
          try {
            setData(prev => prev.map(it => it.id === editRow.id ? { ...it, ...form } : it));
            notification.showSuccessMessage("update", `orang tua ${editRow.nama}`);
            setIsEditOpen(false);
            setEditRow(null);
          } catch (e) {
            notification.showErrorMessage("update", e.message, `orang tua ${editRow?.nama || ''}`);
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
        title="Bulk Edit Orang Tua"
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
              notification.showSuccessMessage("delete", `orang tua ${deleteItem.nama}`);
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
        title="Tambah Banyak Orang Tua (Manual)"
        fields={formFields}
        maxRows={100}
        onImport={async (rows) => {
          try {
            setData(prev => {
              let lastId = prev[prev.length - 1]?.id || 0;
              const mapped = rows.map(r => ({ id: ++lastId, ...r }));
              return [...prev, ...mapped];
            });
            notification.showSuccessMessage("import", `${rows.length} orang tua`);
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
