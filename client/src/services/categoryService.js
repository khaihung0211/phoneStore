import api from "./axiosConfig";

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    throw error;
  }
};
