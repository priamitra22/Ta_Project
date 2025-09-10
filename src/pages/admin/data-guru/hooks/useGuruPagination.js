import { useState } from "react";
import { getGuru } from "../../../../services/guruService";

export const useGuruPagination = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    items_per_page: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchGuru = async (page, limit, filters) => {
    setLoading(true);
    try {
      // Prepare parameters for API call
      const params = {
        page: page || 1,
        limit: limit || 10,
        ...filters
      };

      const response = await getGuru(params);

      if (response?.success && response.data) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          // Direct array response
          setData(response.data);
          setPagination({
            current_page: page || 1,
            total_pages: 1,
            total_items: response.data.length,
            items_per_page: limit || 10,
          });
        } else if (response.data.data && response.data.pagination) {
          // Nested response with pagination
          setData(response.data.data);
          setPagination({
            current_page: response.data.pagination.current_page || 1,
            total_pages: response.data.pagination.total_pages || 1,
            total_items: response.data.pagination.total_items || response.data.pagination.total || 0,
            items_per_page: response.data.pagination.items_per_page || response.data.pagination.per_page || 10,
          });
        } else {
          setData([]);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
      setPagination({
        current_page: 1,
        total_pages: 0,
        total_items: 0,
        items_per_page: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    pagination,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    fetchGuru,
    uniqueKelas: [],
  };
};