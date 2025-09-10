import { useState, useCallback, useMemo } from "react";
import { getTeachersWithoutAccount, getStudentsWithoutParentAccount } from "../../../../services/userService";

export const useDynamicFormFields = () => {
  // Mock data untuk testing
  const mockTeachers = useMemo(() => [], []);

  const [teachersWithoutAccount, setTeachersWithoutAccount] = useState(mockTeachers);
  const [anakOptions, setAnakOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get unique kelas from anakOptions
  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set();
    anakOptions.forEach(anak => {
      const match = anak.label.match(/\(([^)]+)\)/);
      if (match) {
        kelasSet.add(match[1]);
      }
    });
    return Array.from(kelasSet).sort();
  }, [anakOptions]);

  // Fetch teachers without account dari API
  const fetchTeachersWithoutAccount = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getTeachersWithoutAccount();
      const data = result?.data || [];
      // Normalisasi ke struktur lama
      const normalized = data.map((t) => ({ id_guru: t.id, nama: t.nama, nip: t.nip }));
      setTeachersWithoutAccount(normalized);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachersWithoutAccount([]);
    } finally {
      setLoading(false);
    }
  }, []);


  // Fetch anak options for orangtua dari API
  const fetchAnakOptionsForOrangtua = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getStudentsWithoutParentAccount();
      const data = result?.data || [];
      const options = data.map((s) => ({
        value: s.id,
        label: `${s.nama} - ${s.nama_ortu}`,
        nisn: s.nisn,
        nama_ortu: s.nama_ortu,
        id_ortu: s.id_ortu
      }));
      setAnakOptions(options);
    } catch (error) {
      console.error('Error fetching anak options:', error);
      setAnakOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFields = useCallback((selectedRole) => {
    const baseFields = [
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        options: [
          { value: "admin", label: "Admin" },
          { value: "guru", label: "Guru" },
          { value: "orangtua", label: "Orang Tua" }
        ]
      }
    ];

    // Jika belum ada role yang dipilih, hanya tampilkan field role
    if (!selectedRole || selectedRole === "") {
      return baseFields;
    }

    if (selectedRole === "admin") {
      return [
        ...baseFields,
        { name: "nama", label: "Nama", type: "text", required: true },
        {
          name: "username",
          label: "NIP/NISN",
          type: "text",
          required: true,
          validation: "numbersOnly,minLength:10",
          helpText: "Hanya angka, minimal 10 digit"
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "aktif", label: "Aktif" },
            { value: "nonaktif", label: "Nonaktif" }
          ]
        }
      ];
    }

    if (selectedRole === "guru") {
      const guruOptions = teachersWithoutAccount.length > 0 
        ? teachersWithoutAccount.map(teacher => ({
            value: teacher.id_guru,
            label: teacher.nama,
            data: teacher // Store full teacher data for auto-fill
          }))
        : [{ value: "", label: "Tidak ada guru tersedia", disabled: true }];
        
      return [
        ...baseFields,
        {
          name: "nama",
          label: "Nama Guru",
          type: "select",
          required: true,
          options: guruOptions,
          helpText: "Pilih guru yang belum memiliki akun"
        },
        {
          name: "username",
          label: "NIP",
          type: "text",
          required: true,
          readOnly: true,
          helpText: "NIP akan otomatis terisi berdasarkan guru yang dipilih"
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "aktif", label: "Aktif" },
            { value: "nonaktif", label: "Nonaktif" }
          ]
        }
      ];
    }

    if (selectedRole === "orangtua") {
      const anakOptionsForForm = anakOptions.length > 0 
        ? anakOptions
        : [{ value: "", label: "Tidak ada anak tersedia", disabled: true }];
        
      return [
        ...baseFields,
        {
          name: "anak_id",
          label: "Pilih Anak",
          type: "searchable-select",
          required: true,
          options: anakOptionsForForm,
          searchable: true,
          filterable: true,
          uniqueKelas: uniqueKelas,
          placeholder: "Cari anak berdasarkan nama atau kelas...",
          helpText: "Ketik untuk mencari atau pilih anak yang belum memiliki akun orangtua"
        },
        {
          name: "nama",
          label: "Nama Orang Tua",
          type: "text",
          required: true,
          readOnly: true,
          helpText: "Nama orangtua akan otomatis terisi berdasarkan anak yang dipilih"
        },
        {
          name: "username",
          label: "NISN Anak",
          type: "text",
          required: true,
          readOnly: true,
          helpText: "NISN akan otomatis terisi berdasarkan anak yang dipilih"
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "aktif", label: "Aktif" },
            { value: "nonaktif", label: "Nonaktif" }
          ]
        }
      ];
    }

    // Default fields (no role selected)
    console.log('Returning DEFAULT form fields');
    return [
      ...baseFields,
      { name: "nama", label: "Nama", type: "text", required: true },
      {
        name: "username",
        label: "NIP/NISN",
        type: "text",
        required: true,
        validation: "numbersOnly,minLength:10",
        helpText: "Hanya angka, minimal 10 digit"
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "aktif", label: "Aktif" },
          { value: "nonaktif", label: "Nonaktif" }
        ]
      }
    ];
  }, [teachersWithoutAccount, anakOptions, uniqueKelas]);

  // Generate dynamic form fields based on role
  const getFormFields = useCallback((selectedRole) => {
    const fields = generateFields(selectedRole);
    return fields;
  }, [generateFields]);

  return {
    teachersWithoutAccount,
    anakOptions,
    uniqueKelas,
    loading,
    fetchTeachersWithoutAccount,
    fetchAnakOptionsForOrangtua,
    getFormFields
  };
};
