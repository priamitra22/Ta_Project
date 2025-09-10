import React, { useMemo } from "react";
import ModalForm from "../../../../components/ModalForm";

export const OrangtuaFormModal = ({ 
  isOpen, 
  onClose, 
  editData, 
  onSubmit,
  anakOptions = [],
  anakLoading = false,
  anakOptionsForEdit = []
}) => {

  
  // Normalisasi anakOptions agar selalu berbentuk array
  // Gunakan anakOptionsForEdit jika edit mode, jika tidak gunakan anakOptions
  const normalizedAnakOptions = useMemo(() => {
    const sourceOptions = editData ? anakOptionsForEdit : anakOptions;
    return Array.isArray(sourceOptions)
      ? sourceOptions
      : (sourceOptions && Array.isArray(sourceOptions.data) ? sourceOptions.data : []);
  }, [editData, anakOptionsForEdit, anakOptions]);
  



  // Form fields for add/edit
  const formFields = useMemo(() => {
    const fields = [
      { name: "nama", label: "Nama", type: "text", required: true },
      { name: "nik", label: "NIK", type: "text", required: true, validation: "numbersOnly,minLength:16", helpText: "Masukkan 16 digit NIK (hanya angka, tanpa spasi atau simbol)." },
      { name: "kontak", label: "Kontak", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Masukkan nomor HP orang tua, mulai dengan 08. Contoh: 081234567890." },
    ];

    // Use normalized options from backend (support both old/new shapes)
    const finalOptions = normalizedAnakOptions.map(anak => {
      const value = anak.id_siswa ?? anak.id;
      const rightInfo = anak.nama_kelas ? anak.nama_kelas : (anak.nisn ? anak.nisn : "");
      const label = rightInfo ? `${anak.nama} (${rightInfo})` : `${anak.nama}`;
      return { value, label };
    });
    
    // Calculate selected anak ids for edit
    // Prioritas: editData.anak_ids > editData.id_anak/anak_id > filter dari normalizedAnakOptions berdasarkan selected
    const selectedAnakIds = editData ? (
      (() => {
        // 1. Jika ada anak_ids langsung dari editData (format array)
        if (editData.anak_ids && Array.isArray(editData.anak_ids)) {
          return editData.anak_ids;
        }
        
        // 2. Jika ada id_anak atau anak_id (format single ID)
        if (editData.id_anak) return [editData.id_anak];
        if (editData.anak_id) return [editData.anak_id];
        
        // 3. Filter dari normalizedAnakOptions berdasarkan status selected
        // Ini akan menangani response API yang memiliki field selected = 1
        if (normalizedAnakOptions.length > 0) {
          return normalizedAnakOptions
            .filter(anak => 
              anak.selected === 1 || anak.selected === true ||
              anak.is_selected === 1 || anak.is_selected === true
            )
            .map(anak => (anak.id_siswa ?? anak.id));
        }
        
        return [];
      })()
    ) : [];



    // Add Anak field
    fields.push({
      name: "anak_ids",
      label: "Anak",
      type: "multidropdown",
      required: true,
      maxVisibleItems: 4,
      options: finalOptions,
      // Force value for edit so chips tampil meski initialData belum ter-inject
      value: selectedAnakIds,
      helpText: editData 
        ? "Pilih satu atau lebih anak dari daftar. Anak yang sudah dipilih akan tetap terpilih."
        : normalizedAnakOptions.length > 0 
          ? "Pilih satu atau lebih anak dari daftar." 
          : "Tidak ada anak yang tersedia untuk dipilih"
    });

    // Add Relasi field
    fields.push({
      name: "relasi",
      label: "Relasi",
      type: "select",
      required: true,
      options: [
        { value: "Ayah", label: "Ayah" },
        { value: "Ibu", label: "Ibu" },
        { value: "Wali", label: "Wali" },
      ],
      helpText: "Pilih hubungan orang tua dengan anak"
    });

    return fields;
  }, [normalizedAnakOptions, editData]);

  // Format initial data for edit using useMemo
  const initialData = useMemo(() => {
    if (!editData) return null;
    
    return {
      nama: editData.nama || '',
      nik: editData.nik || '',
      kontak: editData.kontak || '',
      relasi: editData.relasi || '',
      anak_ids: (() => {
        // Try to get anak_ids from various possible fields
        if (editData.anak_ids && Array.isArray(editData.anak_ids)) {
          return editData.anak_ids;
        } else if (editData.id_anak) {
          return [editData.id_anak];
        } else if (editData.anak_id) {
          return [editData.anak_id];
        }
        
        // Fallback: get selected anak from normalizedAnakOptions
        if (normalizedAnakOptions.length > 0) {
          return normalizedAnakOptions
            .filter(anak => 
              anak.is_selected === 1 || anak.is_selected === true ||
              anak.selected === 1 || anak.selected === true
            )
            .map(anak => (anak.id_siswa ?? anak.id));
        }
        
        return [];
      })()
    };
  }, [editData, normalizedAnakOptions]);


  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Orang Tua" : "Tambah Orang Tua"}
      fields={formFields}
      initialData={initialData}
      submitText={editData ? "Simpan Perubahan" : "Tambah Orang Tua"}
      loadingText={editData ? "Menyimpan..." : "Menambahkan..."}
      onSubmit={onSubmit}
      loading={anakLoading}
      key={editData ? `edit-${editData.id}` : 'new'} // Force re-render when editData changes
    />
  );
};
