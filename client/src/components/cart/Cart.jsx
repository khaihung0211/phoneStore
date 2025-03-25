// src/components/Cart.js

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCart } from '../../productService';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();
                setCart(data.data);
            } catch (err) {
                setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleRemoveItem = async (itemId) => {
        toast.success('Sản phẩm đã được xóa khỏi giỏ hàng!');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <div className="text-center">Giỏ hàng của bạn trống.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.product} className="border p-4 mb-2 rounded">
                        <p><strong>Sản phẩm:</strong> {item.product.name}</p>
                        <p><strong>Số lượng:</strong> {item.quantity}</p>
                        <button onClick={() => handleRemoveItem(item.product)} className="btn btn-danger">Xóa</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cart;
