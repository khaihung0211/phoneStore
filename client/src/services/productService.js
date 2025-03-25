import api from "./axiosConfig";

export const addToCart = async (productId, cartData) => {
  try {
    const response = await api.post(`/cart`, { productId, ...cartData });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
export const getCart = async () => {
  try {
    const response = await api.get(`/cart`);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProducts = async (category = null, page = 1, limit = 20) => {
  try {
    let url = "/products";
    const params = new URLSearchParams();

    if (category) {
      params.append("category", category);
    }

    if (page > 1) {
      params.append("page", page);
      params.append("limit", limit);
    }
    if (params.toString()) {
      url = `${url}?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await api.get(
      `/products/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
export const addReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/review/${productId}`, reviewData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
