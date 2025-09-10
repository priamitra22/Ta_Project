import api from "./api";

export const getMataPelajaran = async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  const res = await api.get(`/mata-pelajaran?${params.toString()}`);
  return res.data;
};


