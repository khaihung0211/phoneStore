import React, { useState, useEffect } from 'react';
import { getOrderDetails, updateOrderStatus } from '../../services/orderService';
import {
    formatCurrency,
    formatDate,
    formatOrderStatus,
    formatPaymentStatus,
    formatPaymentMethod,
    formatAddress,
    formatOrderCode
} from '../../utils/formatters';

const OrderDetailModal = ({ isOpen, onClose, orderId, onStatusUpdate }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getOrderDetails(orderId);
            if (result.success) {
                setOrder(result.data);
            } else {
                setError(result.message || 'Không thể tải thông tin đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdateLoading(true);
            const result = await updateOrderStatus(orderId, { status: newStatus });
            if (result.success) {
                setOrder({ ...order, status: newStatus });
                if (onStatusUpdate) {
                    onStatusUpdate(orderId, newStatus);
                }
            } else {
                setError(result.message || 'Không thể cập nhật trạng thái đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handlePaymentStatusChange = async (newPaymentStatus) => {
        try {
            setUpdateLoading(true);
            const result = await updateOrderStatus(orderId, { paymentStatus: newPaymentStatus });
            if (result.success) {
                setOrder({ ...order, paymentStatus: newPaymentStatus });
                if (onStatusUpdate) {
                    onStatusUpdate(orderId, order.status, newPaymentStatus);
                }
            } else {
                setError(result.message || 'Không thể cập nhật trạng thái thanh toán');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật trạng thái thanh toán');
        } finally {
            setUpdateLoading(false);
        }
    };

    const renderStatusBadge = (status, type = 'order') => {
        const statusClasses = {
            order: {
                pending: 'bg-yellow-100 text-yellow-800',
                processing: 'bg-blue-100 text-blue-800',
                shipped: 'bg-purple-100 text-purple-800',
                delivered: 'bg-green-100 text-green-800',
                cancelled: 'bg-red-100 text-red-800'
            },
            payment: {
                pending: 'bg-yellow-100 text-yellow-800',
                paid: 'bg-green-100 text-green-800',
                failed: 'bg-red-100 text-red-800'
            }
        };

        const getStatusText = type === 'order'
            ? formatOrderStatus(status)
            : formatPaymentStatus(status);

        const statusClass = type === 'order'
            ? statusClasses.order[status] || 'bg-gray-100'
            : statusClasses.payment[status] || 'bg-gray-100';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                {getStatusText}
            </span>
        );
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết đơn hàng {orderId && `#${formatOrderCode(orderId)}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : order ? (
                        <div className="p-6">
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="flex -mb-px space-x-8">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Thông tin chung
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Sản phẩm
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shipping')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Địa chỉ giao hàng
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('actions')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'actions'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Cập nhật trạng thái
                                    </button>
                                </nav>
                            </div>

                            {activeTab === 'details' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đơn hàng</h3>
                                        <dl className="space-y-3">
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Mã đơn hàng:</dt>
                                                <dd className="text-sm text-gray-900">{formatOrderCode(order._id, 12)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Ngày đặt:</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(order.createdAt, true)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Cập nhật lần cuối:</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(order.updatedAt, true)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Trạng thái:</dt>
                                                <dd>{renderStatusBadge(order.status, 'order')}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Phương thức thanh toán:</dt>
                                                <dd className="text-sm text-gray-900">{formatPaymentMethod(order.paymentMethod)}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Trạng thái thanh toán:</dt>
                                                <dd>{renderStatusBadge(order.paymentStatus, 'payment')}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Tổng tiền:</dt>
                                                <dd className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
                                        <dl className="space-y-3">
                                            {order.user ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-gray-500">Tên khách hàng:</dt>
                                                        <dd className="text-sm text-gray-900">{order.user.name || 'N/A'}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-gray-500">Email:</dt>
                                                        <dd className="text-sm text-gray-900">{order.user.email || 'N/A'}</dd>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-500">Khách hàng:</dt>
                                                    <dd className="text-sm text-gray-900">Khách không đăng nhập</dd>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Người nhận:</dt>
                                                <dd className="text-sm text-gray-900">{order.shippingAddress.name}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Số điện thoại:</dt>
                                                <dd className="text-sm text-gray-900">{order.shippingAddress.phoneNumber}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'products' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Danh sách sản phẩm</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Sản phẩm
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Đơn giá
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Số lượng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Thành tiền
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {order.items.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {item.product.image && (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_API_URL_IMG}${item.product.image}`}
                                                                        alt={item.product.name}
                                                                        className="h-10 w-10 object-cover rounded-md mr-3"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                                                    <div className="text-xs text-gray-500">Mã SP: {formatOrderCode(item.product._id)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatCurrency(item.price)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                        Tổng cộng:
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {formatCurrency(order.totalAmount)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <dl className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Người nhận:</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Số điện thoại:</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.phoneNumber}</dd>
                                                </div>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Địa chỉ chi tiết:</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {order.shippingAddress.houseNumber} {order.shippingAddress.street}
                                                </dd>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Phường/Xã:</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.ward}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Quận/Huyện:</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.district}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Tỉnh/Thành phố:</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.city}</dd>
                                                </div>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Địa chỉ đầy đủ:</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {formatAddress(order.shippingAddress)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'actions' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cập nhật trạng thái</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-700 mb-3">Trạng thái đơn hàng</h4>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Trạng thái hiện tại: {renderStatusBadge(order.status, 'order')}
                                            </p>
                                            <div className="space-y-2">
                                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(status)}
                                                        disabled={order.status === status || updateLoading}
                                                        className={`w-full text-left px-4 py-2 rounded-md text-sm ${order.status === status
                                                            ? 'bg-blue-100 text-blue-800 font-medium'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            } ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {formatOrderStatus(status)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-700 mb-3">Trạng thái thanh toán</h4>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Trạng thái hiện tại: {renderStatusBadge(order.paymentStatus, 'payment')}
                                            </p>
                                            <div className="space-y-2">
                                                {['pending', 'paid', 'failed'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handlePaymentStatusChange(status)}
                                                        disabled={order.paymentStatus === status || updateLoading}
                                                        className={`w-full text-left px-4 py-2 rounded-md text-sm ${order.paymentStatus === status
                                                            ? 'bg-blue-100 text-blue-800 font-medium'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            } ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {formatPaymentStatus(status)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {updateLoading && (
                                        <div className="mt-4 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                            <span className="text-sm text-gray-500">Đang cập nhật...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            Không tìm thấy thông tin đơn hàng
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end border-t">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
