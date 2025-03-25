import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/userService';
import UserTable from '../../components/admin/UserTable';

function AdminUsersPage() {
    const [customers, setCustomers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('customers');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await getAllUsers();
                console.log("🚀 ~ fetchUsers ~ result:", result)
                if (result.success) {
                    setCustomers(result.data.filter(user => user.role === 'user'));
                    setStaff(result.data.filter(user => user.role === 'admin'));
                } else {
                    setError(result.message || 'Không thể tải danh sách người dùng');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const renderUsersTab = () => {
        return (
            <>
                {activeTab === 'customers' && <UserTable users={customers} />}
                {activeTab === 'staff' && <UserTable users={staff} />}
            </>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý tài khoản</h1>

            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab('customers')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'customers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Khách hàng
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Nhân viên
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            ) : (
                renderUsersTab()
            )}
        </div>
    );
}

export default AdminUsersPage;
