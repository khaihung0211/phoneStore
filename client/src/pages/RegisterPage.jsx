import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Đăng ký</h1>
                    <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-gray-700 mb-2">Họ và tên</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 mb-2">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-primary hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;