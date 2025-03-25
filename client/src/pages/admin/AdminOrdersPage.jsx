import React from 'react';
import AdminOrderList from '../../components/admin/AdminOrderList';

function AdminOrdersPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Quản lý danh sách đơn hàng</p>
      </div>
      <AdminOrderList />
    </div>
  );
}

export default AdminOrdersPage;
