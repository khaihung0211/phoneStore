import api from './axiosConfig'; 

export const getCart = async () => {
    try {
        const response = await api.get('/cart');
        return response.data; 
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const removeCartItem = async (itemId) => {
    try {
        const response = await api.delete(`/cart/items/${itemId}`);
        return response.data; 
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
};

export const updateCartItem = async (itemId, data) => {
    try {
        const response = await api.put(`/cart/items/${itemId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

export const placeOrder = async (cart) => {
    try {
        const response = await api.post('/order', cart);
        return response.data; 
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
};
