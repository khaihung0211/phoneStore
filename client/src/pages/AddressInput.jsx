import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCart } from '../services/productService';
import { createOrder } from '../services';

const AddressInput = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const isFetched = useRef(false);

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const fetchCart = async () => {
            try {
                setLoading(true);
                const data = await getCart();
                setCart(data.data);

                const savedUserInfo = localStorage.getItem('userShippingInfo');
                if (savedUserInfo) {
                    const userInfo = JSON.parse(savedUserInfo);
                    setName(userInfo.name || '');
                    setPhoneNumber(userInfo.phoneNumber || '');
                    setHouseNumber(userInfo.houseNumber || '');
                    setStreet(userInfo.street || '');
                    setWard(userInfo.ward || '');
                    setDistrict(userInfo.district || '');
                    setCity(userInfo.city || '');
                }
            } catch (err) {
                setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phoneNumber || !houseNumber || !street || !ward || !district || !city) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error('Số điện thoại không hợp lệ.');
            return;
        }

        const userShippingInfo = {
            name,
            phoneNumber,
            houseNumber,
            street,
            ward,
            district,
            city
        };
        localStorage.setItem('userShippingInfo', JSON.stringify(userShippingInfo));

        const price = await calculateTotal();

        const orderData = {
            orderItems: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                qty: item.quantity
            })),
            shippingAddress: {
                name: name,
                phoneNumber: phoneNumber,
                houseNumber: houseNumber,
                street: street,
                ward: ward,
                district: district,
                city: city
            },
            paymentMethod: paymentMethod,
            itemsPrice: calculateTotal(),
            shippingPrice: 30000,
            totalPrice: price > 500000 ? calculateTotal() : calculateTotal() + 30000,
        };

        const response = await createOrder(orderData);
        if (response.success) {
            toast.success('Đặt hàng thành công!');
            navigate('/order-success', { state: { orderInfo: response.data } });
        } else {
            toast.error(response.message || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                <p className="mb-4">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <ToastContainer />

                {/* Breadcrumbs */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a href="/" className="text-gray-600 hover:text-blue-600">
                                Trang chủ
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <a href="/cart" className="text-gray-600 hover:text-blue-600 ml-1 md:ml-2">
                                    Giỏ hàng
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-blue-600 ml-1 md:ml-2 font-medium">Thông tin giao hàng</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-7/12">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h1 className="text-2xl font-bold mb-6 text-gray-800">Thông tin giao hàng</h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ tên người nhận <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Nhập họ tên"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="Nhập số điện thoại"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Số nhà <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="houseNumber"
                                        type="text"
                                        value={houseNumber}
                                        onChange={(e) => setHouseNumber(e.target.value)}
                                        placeholder="Nhập số nhà"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                                        Đường <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="street"
                                        type="text"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        placeholder="Nhập tên đường"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phường/Xã <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="ward"
                                            type="text"
                                            value={ward}
                                            onChange={(e) => setWard(e.target.value)}
                                            placeholder="Nhập phường/xã"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                            Quận/Huyện <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="district"
                                            type="text"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            placeholder="Nhập quận/huyện"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Nhập tỉnh/thành phố"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Phương thức thanh toán</h2>
                                    <div className="space-y-3 flex gap-2 flex-row">
                                        <label className="flex w-full items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => setPaymentMethod('cod')}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3">
                                                <span className="block font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                                                <span className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</span>
                                            </div>
                                        </label>

                                        <label className="flex w-full items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="banking"
                                                checked={paymentMethod === 'banking'}
                                                onChange={() => setPaymentMethod('banking')}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3">
                                                <span className="block font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                                                <span className="text-sm text-gray-500">Chuyển khoản qua tài khoản ngân hàng</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                                    >
                                        Đặt hàng
                                    </button>
                                </div>
                            </form>

                            {/* Nút quay lại */}
                            <div className="mt-4">
                                <Link to="/cart" className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300">
                                    Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-5/12">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h2>

                            <div className="border-b border-gray-200 pb-4 mb-4">
                                <div className="max-h-96 overflow-y-auto pr-2">
                                    {cart.items.map((item) => (
                                        <div key={item._id} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                                            <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL_IMG}${item.product.image}`}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.name}</h3>
                                                <div className="mt-1 flex justify-between">
                                                    <span className="text-gray-600 text-sm">
                                                        {item.quantity} x {item.product.price.toLocaleString('vi-VN')}₫
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {(item.quantity * item.product.price).toLocaleString('vi-VN')}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">{calculateTotal().toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">30.000₫</span>
                                </div>
                                {calculateTotal() > 500000 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Miễn phí vận chuyển:</span>
                                        <span>-30.000₫</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {(calculateTotal() + (calculateTotal() > 500000 ? 0 : 30000)).toLocaleString('vi-VN')}₫
                                    </span>
                                </div>

                                {calculateTotal() > 500000 && (
                                    <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                                        Bạn được miễn phí vận chuyển cho đơn hàng trên 500.000₫
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressInput;
