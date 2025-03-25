import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetails, cancelOrder } from '../services/orderService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiClock, FiTruck, FiPackage, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await getOrderDetails(id);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleCancelOrder = async () => {
        try {
            setCancelling(true);
            const response = await cancelOrder(id);

            if (response.success) {
                setOrder({ ...order, status: 'cancelled' });
                toast.success('Hủy đơn hàng thành công!');
            } else {
                toast.error(response.message || 'Không thể hủy đơn hàng.');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi hủy đơn hàng.');
        } finally {
            setCancelling(false);
            setShowCancelModal(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="mr-1" />
                        Chờ xác nhận
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <FiPackage className="mr-1" />
                        Đang xử lý
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        <FiTruck className="mr-1" />
                        Đang giao hàng
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" />
                        Đã giao hàng
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FiX className="mr-1" />
                        Đã hủy
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'banking':
                return 'Chuyển khoản ngân hàng';
            case 'momo':
                return 'Ví MoMo';
            case 'zalopay':
                return 'ZaloPay';
            default:
                return 'Thanh toán khi nhận hàng (COD)';
        }
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" />
                        Đã thanh toán
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiX className="mr-1" />
                        Thanh toán thất bại
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="mr-1" />
                        Chờ thanh toán
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
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
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
                <p className="mb-4">Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này.</p>
                <button
                    onClick={() => navigate('/my-orders')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Quay lại danh sách đơn hàng
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <ToastContainer />

                <div className="flex items-center mb-8">
                    <Link to="/my-orders" className="flex items-center text-blue-600 hover:text-blue-800">
                        <FiArrowLeft className="mr-2" />
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Đơn hàng #{order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Đặt ngày {formatDate(order.createdAt)}
                                </p>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center">
                                <div className="mr-4">
                                    {getStatusBadge(order.status)}
                                </div>

                                {(order.status === 'pending' || order.status === 'processing') && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="mt-2 md:mt-0 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">Thông tin giao hàng</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                                <p className="text-gray-600">{order.shippingAddress.phoneNumber}</p>
                                <p className="text-gray-600 mt-2">
                                    {order.shippingAddress.houseNumber} {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">Thông tin thanh toán</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Phương thức:</span>
                                    <span className="font-medium text-gray-800">{getPaymentMethodText(order.paymentMethod)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
                                </div>

                                {order.paymentMethod === 'banking' && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                                        <p className="font-medium text-gray-800">Thông tin chuyển khoản:</p>
                                        <p className="text-gray-600">Ngân hàng: BIDV</p>
                                        <p className="text-gray-600">Số tài khoản: 12345678900</p>
                                        <p className="text-gray-600">Chủ tài khoản: CÔNG TY ABC</p>
                                        <p className="text-gray-600">Nội dung: Thanh toán đơn hàng {order.orderNumber || order._id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Sản phẩm đã đặt</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đơn giá
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {item.product && (
                                                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                                                            <img
                                                                src={`${import.meta.env.VITE_API_URL_IMG}${item.product.image}`}
                                                                alt={item.product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.product ? item.product.name : 'Sản phẩm không còn tồn tại'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                {item.price.toLocaleString('vi-VN')}₫
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                            Tạm tính:
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            {order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString('vi-VN')}₫
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                            Phí vận chuyển:
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            {(order.totalAmount - order.items.reduce((total, item) => total + (item.price * item.quantity), 0)).toLocaleString('vi-VN')}₫
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right text-base font-semibold text-gray-900">
                                            Tổng cộng:
                                        </td>
                                        <td className="px-6 py-4 text-right text-lg font-bold text-blue-600">
                                            {order.totalAmount.toLocaleString('vi-VN')}₫
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Theo dõi đơn hàng</h2>

                        <div className="relative">
                            <div className="absolute left-5 top-0 h-full border-l-2 border-gray-200"></div>

                            <div className="flex items-start mb-6 relative">
                                <div className="flex-shrink-0 bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center z-10">
                                    <FiClock className="text-white" />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-base font-semibold text-gray-800">Đơn hàng đã đặt</h3>
                                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                                    <p className="mt-1 text-sm text-gray-500">Đơn hàng của bạn đã được tiếp nhận</p>
                                </div>
                            </div>

                            <div className={`flex items-start mb-6 relative ${order.status === 'cancelled' ? 'opacity-50' : ''}`}>
                                <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center z-10 ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    <FiPackage className={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-white' : 'text-gray-500'} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-base font-semibold text-gray-800">Đang xử lý</h3>
                                    {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                {order.updatedAt !== order.createdAt ? formatDate(order.updatedAt) : ''}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">Đơn hàng của bạn đang được chuẩn bị</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500">Đơn hàng của bạn sẽ sớm được xử lý</p>
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-start mb-6 relative ${order.status === 'cancelled' || order.status === 'pending' || order.status === 'processing' ? 'opacity-50' : ''}`}>
                                <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center z-10 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    <FiTruck className={order.status === 'shipped' || order.status === 'delivered' ? 'text-white' : 'text-gray-500'} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-base font-semibold text-gray-800">Đang giao hàng</h3>
                                    {order.status === 'shipped' || order.status === 'delivered' ? (
                                        <p className="mt-1 text-sm text-gray-500">Đơn hàng đang được vận chuyển đến bạn</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Đơn hàng sẽ sớm được giao đến bạn</p>
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-start relative ${order.status === 'cancelled' || order.status !== 'delivered' ? 'opacity-50' : ''}`}>
                                <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center z-10 ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <FiCheckCircle className={order.status === 'delivered' ? 'text-white' : 'text-gray-500'} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-base font-semibold text-gray-800">Đã giao hàng</h3>
                                    {order.status === 'delivered' ? (
                                        <p className="mt-1 text-sm text-gray-500">Đơn hàng đã được giao thành công</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Đơn hàng sẽ sớm được giao đến bạn</p>
                                    )}
                                </div>
                            </div>

                            {order.status === 'cancelled' && (
                                <div className="flex items-start mt-6 relative">
                                    <div className="flex-shrink-0 bg-red-500 rounded-full h-10 w-10 flex items-center justify-center z-10">
                                        <FiX className="text-white" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-base font-semibold text-red-600">Đơn hàng đã hủy</h3>
                                        <p className="text-sm text-gray-600">
                                            {order.updatedAt !== order.createdAt ? formatDate(order.updatedAt) : ''}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">Đơn hàng của bạn đã bị hủy</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>

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
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
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

export default OrderDetail;
