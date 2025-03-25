import api from "./axiosConfig";

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch("/users/profile", userData);
    if (userData.fullName || userData.phone || userData.address) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          fullName: userData.fullName || currentUser.fullName,
          phone: userData.phone || currentUser.phone,
          address: userData.address || currentUser.address,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.patch("/users/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
