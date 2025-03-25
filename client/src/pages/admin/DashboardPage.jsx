import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
    // Sample data - replace with actual data from your backend
    const stats = {
        totalSales: 128750.65,
        totalOrders: 1254,
        pendingOrders: 28,
        totalProducts: 87,
        lowStockProducts: 12,
        totalCustomers: 3842,
        recentCustomers: 128
    };

    const recentOrders = [
        { id: 'ORD-5123', customer: 'John Smith', date: '2025-03-12', total: 1299.99, status: 'Delivered', product: 'iPhone 15 Pro' },
        { id: 'ORD-5122', customer: 'Sarah Johnson', date: '2025-03-12', total: 899.99, status: 'Processing', product: 'Samsung Galaxy S24' },
        { id: 'ORD-5121', customer: 'Michael Brown', date: '2025-03-11', total: 749.99, status: 'Shipped', product: 'Google Pixel 8' },
        { id: 'ORD-5120', customer: 'Emily Davis', date: '2025-03-11', total: 1099.99, status: 'Pending', product: 'iPhone 15' },
        { id: 'ORD-5119', customer: 'Robert Wilson', date: '2025-03-10', total: 649.99, status: 'Delivered', product: 'OnePlus 12' }
    ];

    const topProducts = [
        { id: 1, name: 'iPhone 15 Pro Max', sales: 245, revenue: 367499.55, stock: 32 },
        { id: 2, name: 'Samsung Galaxy S24 Ultra', sales: 189, revenue: 226799.11, stock: 28 },
        { id: 3, name: 'Google Pixel 8 Pro', sales: 142, revenue: 142000.00, stock: 15 },
        { id: 4, name: 'OnePlus 12', sales: 118, revenue: 94399.82, stock: 22 }
    ];

    // For the sales chart
    const [timeRange, setTimeRange] = useState('week');

    return (
        <div className="dashboard-container">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sales Card */}
                <div className="bg-white rounded-lg shadow-sm p-2 border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-800">${stats.totalSales.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">
                                <span className="font-bold">↑ 12.5%</span> from last month
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-lg shadow-sm p-2 border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalOrders.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">
                                <span className="font-bold">↑ 8.2%</span> from last month
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-2 border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                            <p className="text-xs text-red-600 mt-1">
                                <span className="font-bold">{stats.lowStockProducts} products</span> low in stock
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-2 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">
                                <span className="font-bold">+{stats.recentCustomers}</span> new this month
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Chart Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setTimeRange('week')}
                            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setTimeRange('year')}
                            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                            Year
                        </button>
                    </div>
                </div>

                {/* Chart Placeholder - Replace with actual chart component */}
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-500">Sales Chart - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</p>
                    {/* You would integrate a chart library like Chart.js, Recharts, or ApexCharts here */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-xl font-bold text-gray-800">$42,389.21</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-xl font-bold text-gray-800">312</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Avg. Order Value</p>
                        <p className="text-xl font-bold text-gray-800">$135.86</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-xl font-bold text-gray-800">3.28%</p>
                    </div>
                </div>
            </div>

            {/* Two Column Layout for Recent Orders and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Showing 5 of {stats.totalOrders} orders</p>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Top Selling Products</h2>
                        <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.sales} units</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${product.revenue.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${product.stock > 20 ? 'bg-green-100 text-green-800' :
                                                    product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Showing 4 of {stats.totalProducts} products</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link to="/admin/products/new" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="bg-blue-500 p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Add New Product</p>
                        </div>
                    </Link>
                    <Link to="/admin/orders/pending" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                        <div className="bg-yellow-500 p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Process Orders</p>
                            <p className="text-xs text-gray-500">{stats.pendingOrders} pending</p>
                        </div>
                    </Link>
                    <Link to="/admin/inventory" className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <div className="bg-red-500 p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Check Inventory</p>
                            <p className="text-xs text-gray-500">{stats.lowStockProducts} low stock</p>
                        </div>
                    </Link>
                    <Link to="/admin/reports" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="bg-green-500 p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Generate Reports</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
