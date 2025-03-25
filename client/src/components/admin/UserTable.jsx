import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import UserDetailModal from './UserDetailModal';

const UserTable = ({ users, onUserDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [updatedUser, setUpdatedUser] = useState(null);

    const handleOpenModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
        setUpdatedUser(null);
    };

    const handleUserUpdate = (user) => {
        setUpdatedUser(user);
    };

    const handleUserDelete = (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            onUserDelete(userId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Họ tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số điện thoại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                Không có dữ liệu người dùng.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.phone || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 flexx flex-row py-4 whitespace-nowrap gap-4 text-sm text-gray-500">
                                    <button
                                        onClick={() => handleOpenModal(user._id)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        onClick={() => handleUserDelete(user._id)}
                                        className="text-red-600 pl-2 hover:text-red-900 ml-4"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <UserDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                userId={selectedUserId}
                onUserUpdate={handleUserUpdate}
            />
        </div>
    );
};

export default UserTable;
