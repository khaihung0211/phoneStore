import axios from "axios";
import { getAuthHeader } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      statusData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};

export const getAllOrdersByAdmin = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      fromDate,
      toDate,
      search,
      sortBy,
      sortOrder,
    } = options;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (status) queryParams.append("status", status);
    if (fromDate) queryParams.append("fromDate", fromDate);
    if (toDate) queryParams.append("toDate", toDate);
    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);

    const response = await axios.get(
      `${API_URL}/orders?${queryParams.toString()}`,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get all orders error:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng",
    };
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Get user orders error:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Get order details error:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Cancel order error:", error);
    throw error;
  }
};
