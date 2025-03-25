import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderInfo = location.state?.orderInfo;
  if (!orderInfo) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý ngay.
          </p>
        </div>

        <div className="border-t border-b py-4 my-4">
          <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
          <p><span className="font-semibold">Mã đơn hàng:</span> {orderInfo._id}</p>
          <p><span className="font-semibold">Ngày đặt hàng:</span> {new Date(orderInfo.createdAt).toLocaleDateString('vi-VN')}</p>
          <p><span className="font-semibold">Tổng tiền:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.totalAmount)}</p>
          <p><span className="font-semibold">Phương thức thanh toán:</span> {orderInfo.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
        </div>

        <div className="text-center mt-6 space-y-4">
          <Link
            to={`/orders/${orderInfo._id}`}
            className="block bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            Xem chi tiết đơn hàng
          </Link>

          <Link
            to="/"
            className="block text-primary hover:text-blue-700"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;