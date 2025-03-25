import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCart, updateCartItem, removeCartItem, placeOrder } from '../services/cartService';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  console.log("🚀 ~ CartPage ~ cart:", cart)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetched = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

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
  const handleContinue = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Giỏ hàng của bạn trống.');
      return;
    }
    navigate('/address', { state: { cart } });
  };
  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      const updatedCart = cart.items.filter(item => item._id !== itemId);
      setCart({ ...cart, items: updatedCart });
      toast.success('Sản phẩm đã được xóa khỏi giỏ hàng!');
    } catch (err) {
      toast.error('Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, { quantity });
      const updatedItems = cart.items.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      setCart({ ...cart, items: updatedItems });

    } catch (err) {
      toast.error('Không thể cập nhật số lượng. Vui lòng thử lại.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder(cart);
      toast.success('Đặt hàng thành công!');
      setCart({ items: [] });
    } catch (err) {
      toast.error('Không thể đặt hàng. Vui lòng thử lại.');
    }
  };

  const handleGoBack = () => {
    window.history.back();
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

  if (!cart || cart.length === 0) {
    return <div className="text-center">Giỏ hàng của bạn trống.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item._id} className="border p-4 mb-2 rounded flex items-center">
            <img
              src={`${import.meta.env.VITE_API_URL_IMG}${item.product.image}`}
              alt={item.product.name}
              className="w-24 h-24 object-cover mr-4 rounded"
            />
            <div className="flex-grow">
              <p><strong>Sản phẩm:</strong> {item.product.name}</p>
              <p>
                <strong>Số lượng:</strong>
                <button onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))} className="btn btn-secondary mx-2">-</button>
                {item.quantity}
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="btn btn-secondary mx-2">+</button>
              </p>
              <button onClick={() => handleRemoveItem(item._id)} className="btn btn-danger">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handleGoBack} className="btn btn-primary">Quay lại</button>
        <button onClick={handleContinue} className="btn btn-success">Tiếp tục</button>
      </div>
    </div>
  );
};

export default CartPage;
