import api from "./api";

// ===== AUTHENTICATION =====

export const login = async (username, password) => {
  const response = await api.post(`/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(`/auth/register`, userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(`/auth/profile`);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post(`/auth/logout`, {});
  } catch (error) {
    console.warn("Logout request failed:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};