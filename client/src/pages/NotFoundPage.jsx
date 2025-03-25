import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">404</h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Trang không tồn tại</p>
            <p className="text-gray-600 mb-8 text-center">
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
            <Link
                to="/"
                className="bg-primary hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition-colors"
            >
                Quay về trang chủ
            </Link>
        </div>
    );
};

export default NotFoundPage;