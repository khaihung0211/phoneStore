import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
    const { currentUser, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-800 to-blue-600 text-white transition-all duration-300 ease-in-out`}>
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen ? (
                        <h1 className="text-2xl font-bold">Admin</h1>
                    ) : (
                        <h1 className="text-2xl font-bold">AP</h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-blue-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                        </svg>
                    </button>
                </div>

                <nav className="mt-6">
                    <div className="px-4 py-2">
                        <div className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} mb-6`}>
                            <img
                                src={currentUser.avatar || "/images/default-avatar.png"}
                                alt="Admin"
                                className="h-10 w-10 rounded-full border-2 border-white"
                            />
                            {sidebarOpen && (
                                <div className="ml-3">
                                    <p className="font-medium">{currentUser.fullName}</p>
                                    <p className="text-xs text-blue-200">{currentUser.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <ul className="space-y-2 px-2">
                        <li>
                            <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                {sidebarOpen && <span className="ml-3">Dashboard</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/products" className="flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                                {sidebarOpen && <span className="ml-3">Sản phẩm</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orders" className="flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                                {sidebarOpen && <span className="ml-3">Đơn hàng</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/users" className="flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                {sidebarOpen && <span className="ml-3">Tài khoản</span>}
                            </Link>
                        </li>
                    </ul>

                    <div className=" mt-8 pt-6 border-t border-blue-700">
                        <ul className="">
                            <li>
                                <Link to="/" className="flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    {sidebarOpen && <span className="ml-3">Trang chủ</span>}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 5a1 1 0 10-2 0v4a1 1 0 102 0V8zm-2-7a1 1 0 100 2h4a1 1 0 100-2h-4z" clipRule="evenodd" />
                                    </svg>
                                    {sidebarOpen && <span className="ml-3">Đăng xuất</span>}
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <h2 className="text-xl font-semibold text-gray-800"></h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            </div>

                            <div className="border-r border-gray-300 h-8"></div>

                            <div className="flex items-center">
                                <img
                                    src={currentUser.avatar || "/images/default-avatar.png"}
                                    alt="Admin"
                                    className="h-8 w-8 rounded-full"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">{currentUser.fullName}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="container mx-auto">
                        <Outlet />
                    </div>
                </main>


            </div>
        </div>
    );
}

export default AdminLayout;
