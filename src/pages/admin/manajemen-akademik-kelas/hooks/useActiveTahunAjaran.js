import { useState, useEffect } from 'react';
import { getTahunAjaran, getTahunAjaranAktif } from '../../../../services/tahunAjaranService';

export const useActiveTahunAjaran = () => {
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawApiData, setRawApiData] = useState([]); // Simpan data mentah dari API

  const fetchTahunAjaranData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ambil list TA untuk dropdown (ambil cukup banyak agar muat semua)
      const listRes = await getTahunAjaran(1, 200, {});
      const data = listRes?.data?.tahunAjaran || listRes?.data || [];
      
      // Simpan data mentah untuk filtering semester
      setRawApiData(data);
      
      // Extract unique tahun ajaran
      const uniqueTahunAjaran = [...new Set(data.map(item => item.tahun))];
      const tahunAjaranOpts = uniqueTahunAjaran.map(tahun => ({
        value: tahun,
        label: tahun
      }));
      setTahunAjaranOptions(tahunAjaranOpts);
      
      // Semester akan di-set berdasarkan tahun ajaran yang dipilih
      
      // Set default values if available
      if (tahunAjaranOpts.length > 0) {
        // Cari tahun ajaran aktif dari API
        const aktifRes = await getTahunAjaranAktif().catch(() => null);
        const activeTahunData = aktifRes?.data || data.find(item => item.status === 'aktif') || data[0];
        const defaultTahun = activeTahunData.tahun;
        setSelectedTahunAjaran(defaultTahun);
        
        // Filter semester untuk tahun ajaran default
        const filteredSemesterData = data.filter(item => item.tahun === defaultTahun);
        const uniqueSemester = [...new Set(filteredSemesterData.map(item => item.semester))];
        const defaultSemesterOpts = uniqueSemester.map(semester => ({
          value: semester,
          label: semester
        }));
        setSemesterOptions(defaultSemesterOpts);
        
        if (defaultSemesterOpts.length > 0) {
          // Cari semester yang aktif untuk tahun ajaran yang dipilih
          const activeSemesterData = filteredSemesterData.find(item => item.status === 'aktif') || filteredSemesterData[0];
          const defaultSemester = activeSemesterData.semester;
          setSelectedSemester(defaultSemester);
          
          // Cari id_tahun yang sesuai dengan kombinasi tahun ajaran + semester default
          const defaultTahunSemesterData = data.find(item => 
            item.tahun === defaultTahun && item.semester === defaultSemester
          );
          
          if (defaultTahunSemesterData) {
            setSelectedTahunAjaranId(defaultTahunSemesterData.id_tahun || defaultTahunSemesterData.id);
          } else {
            console.error('Default tahun-semester data not found for:', defaultTahun, defaultSemester);
          }
        }
      }
      
    } catch (err) {
      console.error('Error fetching tahun ajaran data:', err);
      setError('Gagal mengambil data tahun ajaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTahunAjaranData();
  }, []);

  // Custom setter untuk selectedTahunAjaran yang juga update selectedTahunAjaranId
  const handleTahunAjaranChange = (tahun) => {
    
    // Cari id_tahun yang sesuai dengan tahun yang dipilih
    const tahunData = tahunAjaranOptions.find(option => option.value === tahun);
    
    if (tahunData) {
      setSelectedTahunAjaran(tahun);
      
      // Filter semester berdasarkan tahun ajaran yang dipilih
      const filteredSemesterData = rawApiData.filter(item => item.tahun === tahun);
      const uniqueSemester = [...new Set(filteredSemesterData.map(item => item.semester))];
      const semesterOpts = uniqueSemester.map(semester => ({
        value: semester,
        label: semester
      }));
      
      
      setSemesterOptions(semesterOpts);
      
      // Set semester default dan id_tahun ketika tahun ajaran berubah
      if (semesterOpts.length > 0) {
        const defaultSemester = semesterOpts[0].value;
        setSelectedSemester(defaultSemester);
        
        // Cari id_tahun yang sesuai dengan kombinasi tahun ajaran + semester default
        const defaultTahunSemesterData = rawApiData.find(item => 
          item.tahun === tahun && item.semester === defaultSemester
        );
        
        if (defaultTahunSemesterData) {
          setSelectedTahunAjaranId(defaultTahunSemesterData.id_tahun || defaultTahunSemesterData.id);
        } else {
          console.error('Default tahun-semester data not found for:', tahun, defaultSemester);
        }
      } else {
        setSelectedSemester('');
        setSelectedTahunAjaranId('');
      }
    } else {
      console.error('Tahun data not found for:', tahun);
    }
  };

  // Custom setter untuk selectedSemester dengan logging
  const handleSemesterChange = (semester) => {
    
    // Cari id_tahun yang sesuai dengan kombinasi tahun ajaran + semester
    const tahunSemesterData = rawApiData.find(item => 
      item.tahun === selectedTahunAjaran && item.semester === semester
    );
    
    
    if (tahunSemesterData) {
      setSelectedTahunAjaranId(tahunSemesterData.id_tahun || tahunSemesterData.id);
    } else {
      console.error('Tahun-semester data not found for:', selectedTahunAjaran, semester);
    }
    
    setSelectedSemester(semester);
  };

  return {
    tahunAjaranOptions,
    semesterOptions,
    selectedTahunAjaran,
    selectedSemester,
    selectedTahunAjaranId,
    setSelectedTahunAjaran: handleTahunAjaranChange,
    setSelectedSemester: handleSemesterChange,
    loading,
    error,
    refreshTahunAjaranData: fetchTahunAjaranData
  };
};
