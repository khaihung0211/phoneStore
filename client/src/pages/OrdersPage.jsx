import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã xác nhận':
        return 'bg-blue-100 text-blue-800';
      case 'Đang giao hàng':
        return 'bg-purple-100 text-purple-800';
      case 'Đã giao hàng':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Đơn hàng của tôi</h1>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Đơn hàng của tôi</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link 
            to="/products" 
            className="inline-block bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn hàng</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày đặt</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tổng tiền</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-primary">#{order._id.substring(0, 8)}</td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="py-3 px-4 font-semibold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link 
                        to={`/orders/${order._id}`} 
                        className="text-primary hover:text-blue-700"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;