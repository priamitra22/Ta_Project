export const createFormConfig = () => {
  return [
    {
      name: 'tahun',
      label: 'Tahun Ajaran',
      type: 'text',
      placeholder: '2025/2026',
      required: true,
      maxLength: 9, // 4 + / + 4 = 9 karakter
      onChange: (value) => {
        // Hanya angka
        let formattedValue = value.replace(/\D/g, '');
        
        // Auto format: tambahkan / setelah 4 angka
        if (formattedValue.length > 4) {
          formattedValue = formattedValue.substring(0, 4) + '/' + formattedValue.substring(4, 8);
        }
        
        return formattedValue;
      },
      customValidation: (value) => {
        if (!value) return 'Tahun ajaran wajib diisi';
        if (!/^\d{4}\/\d{4}$/.test(value)) return 'Format tahun ajaran harus YYYY/YYYY';
        
        // Validasi tahun yang masuk akal
        const [tahun1, tahun2] = value.split('/');
        const tahun1Num = parseInt(tahun1);
        const tahun2Num = parseInt(tahun2);
        
        if (tahun2Num !== tahun1Num + 1) {
          return 'Tahun kedua harus tahun pertama + 1';
        }
        
        const currentYear = new Date().getFullYear();
        if (tahun1Num < currentYear - 5 || tahun1Num > currentYear + 2) {
          return 'Tahun ajaran harus dalam rentang yang wajar';
        }
        
        return null;
      }
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'select',
      required: true,
      options: [
        { value: 'Ganjil', label: 'Ganjil' },
        { value: 'Genap', label: 'Genap' }
      ]
    },
    {
      name: 'tanggal_mulai',
      label: 'Tanggal Mulai',
      type: 'date',
      required: true,
      customValidation: (value) => {
        if (!value) return 'Tanggal mulai wajib diisi';
        
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          return 'Tanggal mulai tidak boleh di masa lalu';
        }
        
        return null;
      }
    },
    {
      name: 'tanggal_berakhir',
      label: 'Tanggal Berakhir',
      type: 'date',
      required: true,
      customValidation: (value) => {
        if (!value) return 'Tanggal berakhir wajib diisi';
        
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          return 'Tanggal berakhir tidak boleh di masa lalu';
        }
        
        return null;
      }
    }
  ];
};
