import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, totalItems, totalAmount } = useCart();
  console.log("🚀 ~ CheckoutPage ~ cart:", cart)
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: '',
    note: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Cart context data:", { cart, totalItems, totalAmount });
    setIsLoading(false);
    if (!isLoading && (!cart || cart.length === 0)) {
      console.log("Cart is empty, redirecting to cart page");
      navigate('/cart');
      return;
    }

    setCartItems(cart);
  }, [cart, isLoading, navigate, totalItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + 30000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: calculateSubtotal(),
        shippingPrice: 30000,
        totalPrice: calculateTotal(),
        note: formData.note
      };
      const response = await createOrder(orderData);
      localStorage.removeItem('cartItems');
      navigate('/order-success', { state: { orderInfo: response.data } });

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Thanh Toán</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form thanh toán */}
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Thông Tin Giao Hàng</h2>

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 mb-2">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 mb-2">Thành phố</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="note" className="block text-gray-700 mb-2">Ghi chú</label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              ></textarea>
            </div>

            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Phương Thức Thanh Toán</h2>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="COD"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="COD">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="BANK_TRANSFER"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="BANK_TRANSFER">Chuyển khoản ngân hàng</label>
              </div>
            </div>

            {formData.paymentMethod === 'BANK_TRANSFER' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Thông tin chuyển khoản:</h3>
                <p>Ngân hàng: Vietcombank</p>
                <p>Số tài khoản: 1234567890</p>
                <p>Chủ tài khoản: CÔNG TY TNHH MOBILESHOP</p>
                <p className="mt-2 text-sm text-gray-600">
                  Nội dung chuyển khoản: [Họ tên] - [Số điện thoại]
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-secondary hover:bg-red-700 text-white py-3 rounded-md font-semibold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Tóm Tắt Đơn Hàng</h2>

            <div className="mb-4 max-h-80 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex py-3 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100/0066cc/white?text=Product";
                    }}
                  />
                  <div className="flex-grow">
                    <p className="text-primary">{item.name}</p>
                    <div className="flex justify-between">
                      <p className="text-gray-600">SL: {item.quantity}</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-3 border-b">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(30000)}
                </span>
              </div>
            </div>

            <div className="py-3">
              <div className="flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span className="text-secondary text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Link to="/cart" className="text-primary hover:underline block text-center">
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;