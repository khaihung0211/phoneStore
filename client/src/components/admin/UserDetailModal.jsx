import React, { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../../services/userService';
import { formatDate } from '../../utils/formatters';

const UserDetailModal = ({ isOpen, onClose, userId, onUserUpdate }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'user',
    });

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserDetails();
        }
    }, [isOpen, userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getUserById(userId);
            if (result.success) {
                setUser(result.data);
                setFormData({
                    fullName: result.data.fullName,
                    email: result.data.email,
                    phone: result.data.phone || '',
                    role: result.data.role,
                });
            } else {
                setError(result.message || 'Không thể tải thông tin người dùng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateUser(userId, formData);
            if (result.success) {
                onUserUpdate({ ...user, ...formData });
                onClose();
            } else {
                setError(result.message || 'Không thể cập nhật thông tin người dùng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin người dùng');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-800">Chi tiết người dùng</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="user">Khách hàng</option>
                                    <option value="admin">Nhân viên</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
