import api from "./axiosConfig";

/**
 * Đăng nhập người dùng
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise} - Kết quả đăng nhập
 */
const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Promise} - Kết quả đăng ký
 */
const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Đăng xuất người dùng
 */
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Lấy thông tin người dùng hiện tại từ localStorage
 * @returns {Object|null} - Thông tin người dùng hoặc null
 */
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
/**
 * Kiểm tra trạng thái đăng nhập
 * @returns {boolean} - true nếu đã đăng nhập
 */
const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Export default object chứa tất cả các function
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};

export default authService;

export {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAuthHeader,
};
