import React, { useState, useEffect } from 'react';
import { getAllOrdersByAdmin, updateOrderStatus } from '../../services/orderService';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import OrderDetailModal from './OrderDetailModal';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        fromDate: '',
        toDate: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const toggleDropdown = (orderId) => {
        setDropdownOpen(dropdownOpen === orderId ? null : orderId);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { page } = pagination;
            const result = await getAllOrdersByAdmin({
                page,
                limit: pagination.limit,
                ...filters
            });

            if (result.success) {
                setOrders(result.data);
                setPagination(result.pagination);
            } else {
                setError(result.message || 'Không thể tải danh sách đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

        setPagination(prev => ({
            ...prev,
            page: 1
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const result = await updateOrderStatus(orderId, { status: newStatus });
            if (result.success) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (err) {
            setError('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const renderPagination = () => {
        const { page, totalPages } = pagination;
        const pageNumbers = [];

        const maxPagesToShow = 5;
        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-4">
                <nav className="flex items-center space-x-1">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        &laquo;
                    </button>

                    {pageNumbers.map(num => (
                        <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={`px-3 py-1 rounded-md ${page === num ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        &raquo;
                    </button>
                </nav>
            </div>
        );
    };


    const handleOpenModal = (orderId) => {
        console.log("🚀 ~ handleOpenModal ~ orderId:", orderId)
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    const handleModalStatusUpdate = (orderId, newStatus, newPaymentStatus) => {
        const updatedOrders = orders.map(order => {
            if (order._id === orderId) {
                const updatedOrder = { ...order };
                if (newStatus) updatedOrder.status = newStatus;
                if (newPaymentStatus) updatedOrder.paymentStatus = newPaymentStatus;
                return updatedOrder;
            }
            return order;
        });

        setOrders(updatedOrders);
    };

    const renderStatus = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const statusLabels = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            shipped: 'Đang giao hàng',
            delivered: 'Đã giao hàng',
            cancelled: 'Đã hủy'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipped">Đang giao hàng</option>
                            <option value="delivered">Đã giao hàng</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Tìm theo tên hoặc số điện thoại người nhận..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Tìm kiếm
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFilters({
                                    status: '',
                                    fromDate: '',
                                    toDate: '',
                                    search: '',
                                    sortBy: 'createdAt',
                                    sortOrder: 'desc'
                                });
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Đặt lại
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md ">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Không tìm thấy đơn hàng nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            <Link to={`/admin/orders/${order._id}`}>
                                                #{order._id.substring(order._id.length - 8)}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.user ? (
                                                <div>
                                                    <div>{order.user.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-400">{order.user.email || 'N/A'}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div>{order.shippingAddress.name}</div>
                                                    <div className="text-xs text-gray-400">{order.shippingAddress.phoneNumber}</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatus(order.status)}
                                        </td>
                                        <td className="px-4 py-2 relative">
                                            <button
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={() => handleOpenModal(order._id)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && orders.length > 0 && renderPagination()}
            {!loading && orders.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Hiển thị {orders.length} trên tổng số {pagination.total} đơn hàng
                </div>
            )}
            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                orderId={selectedOrderId}
                onStatusUpdate={handleModalStatusUpdate}
            />
        </div>
    );
};

export default AdminOrderList;
