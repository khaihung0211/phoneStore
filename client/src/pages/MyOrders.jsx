import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders, cancelOrder } from '../services/orderService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiEye, FiX, FiAlertCircle, FiCheckCircle, FiClock, FiTruck, FiPackage } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getUserOrders();
                setOrders(response.data);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;

        try {
            setCancellingOrderId(selectedOrderId);
            const response = await cancelOrder(selectedOrderId);

            if (response.success) {
                setOrders(orders.map(order =>
                    order._id === selectedOrderId
                        ? { ...order, status: 'cancelled' }
                        : order
                ));
                toast.success('Hủy đơn hàng thành công!');
            } else {
                toast.error(response.message || 'Không thể hủy đơn hàng.');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi hủy đơn hàng.');
        } finally {
            setCancellingOrderId(null);
            setShowCancelModal(false);
            setSelectedOrderId(null);
        }
    };

    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="mr-1" />
                        Chờ xác nhận
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FiPackage className="mr-1" />
                        Đang xử lý
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <FiTruck className="mr-1" />
                        Đang giao hàng
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" />
                        Đã giao hàng
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiX className="mr-1" />
                        Đã hủy
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <ToastContainer />

                <h1 className="text-3xl font-bold mb-8 text-gray-800">Đơn hàng của tôi</h1>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
                        <div className="flex items-center">
                            <FiAlertCircle className="h-5 w-5 mr-2" />
                            <p>{error}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {!error && orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Không có đơn hàng nào</h3>
                        <p className="mt-2 text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                        <div className="mt-6">
                            <Link
                                to="/products"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã đơn hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày đặt
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng tiền
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    {order.items.length > 0 && order.items[0].product && (
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                                            <img
                                                                src={`${import.meta.env.VITE_API_URL_IMG}${order.items[0].product.image}`}
                                                                alt={order.items[0].product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="ml-3">
                                                        <div className="text-sm text-gray-900">
                                                            {order.items.length > 0 && order.items[0].product
                                                                ? order.items[0].product.name
                                                                : 'Sản phẩm không xác định'}
                                                        </div>
                                                        {order.items.length > 1 && (
                                                            <div className="text-xs text-gray-500">
                                                                và {order.items.length - 1} sản phẩm khác
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {order.totalAmount.toLocaleString('vi-VN')}₫
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        to={`/orders/${order._id}`}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-full"
                                                        title="Xem chi tiết"
                                                    >
                                                        <FiEye className="h-5 w-5" />
                                                    </Link>

                                                    {(order.status === 'pending' || order.status === 'processing') && (
                                                        <button
                                                            onClick={() => openCancelModal(order._id)}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full"
                                                            title="Hủy đơn hàng"
                                                            disabled={cancellingOrderId === order._id}
                                                        >
                                                            <FiX className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal hủy đơn hàng */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <FiAlertCircle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Xác nhận hủy đơn hàng
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleCancelOrder}
                                        disabled={cancellingOrderId !== null}
                                    >
                                        {cancellingOrderId !== null ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
