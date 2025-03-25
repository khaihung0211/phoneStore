import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Banner from '../components/home/Banner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { getCategories, getFeaturedProducts } from '../services';
import { FiArrowRight, FiShoppingBag, FiTruck, FiCreditCard, FiHeadphones } from 'react-icons/fi';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getFeaturedProducts(),
                    getCategories()
                ]);

                setFeaturedProducts(Array.isArray(productsData) ? productsData :
                    (productsData?.data && Array.isArray(productsData.data)) ? productsData.data : []);

                setCategories(Array.isArray(categoriesData) ? categoriesData :
                    (categoriesData?.data && Array.isArray(categoriesData.data)) ? categoriesData.data : []);
            } catch (error) {
                console.error('Error loading data, using mock data instead:', error);
                setFeaturedProducts([
                    {
                        id: '1',
                        name: 'iPhone 15 Pro Max',
                        price: 32990000,
                        originalPrice: 34990000,
                        image: 'https://placehold.co/300x300/0066cc/white?text=iPhone+15'
                    },
                    {
                        id: '2',
                        name: 'Samsung Galaxy S23 Ultra',
                        price: 23990000,
                        originalPrice: 26990000,
                        image: 'https://placehold.co/300x300/0066cc/white?text=Galaxy+S23'
                    },
                    {
                        id: '3',
                        name: 'iPad Pro M2',
                        price: 21990000,
                        originalPrice: 24990000,
                        image: 'https://placehold.co/300x300/0066cc/white?text=iPad+Pro'
                    },
                    {
                        id: '4',
                        name: 'MacBook Air M3',
                        price: 28990000,
                        originalPrice: 31990000,
                        image: 'https://placehold.co/300x300/0066cc/white?text=MacBook+Air'
                    },
                ]);

                setCategories([
                    { id: '1', name: 'Smartphone', image: 'https://placehold.co/300x200/0066cc/white?text=Smartphones', slug: 'smartphones' },
                    { id: '2', name: 'Tablet', image: 'https://placehold.co/300x200/0066cc/white?text=Tablets', slug: 'tablets' },
                    { id: '3', name: 'Laptop', image: 'https://placehold.co/300x200/0066cc/white?text=Laptops', slug: 'laptops' },
                    { id: '4', name: 'Phụ kiện', image: 'https://placehold.co/300x200/0066cc/white?text=Accessories', slug: 'accessories' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleEmailSubscribe = (e) => {
        e.preventDefault();
        alert(`Cảm ơn bạn đã đăng ký với email: ${email}`);
        setEmail('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <section className="relative overflow-hidden">
                <Banner />
            </section>

            <section className="py-8 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
                        >
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FiTruck className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-center">Giao hàng miễn phí</h3>
                                <p className="text-sm text-gray-500 text-center">Cho đơn hàng từ 500.000đ</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="flex flex-col  items-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
                        >
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FiShoppingBag className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-center">Đổi trả dễ dàng</h3>
                                <p className="text-sm text-gray-500 text-center">Trong vòng 30 ngày</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="flex items-center  flex-col p-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
                        >
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FiHeadphones className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-center">Hỗ trợ 24/7</h3>
                                <p className="text-sm text-gray-500 text-center">Luôn sẵn sàng giúp đỡ</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh mục sản phẩm</h2>
                        <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category, index) => (
                                <motion.div
                                    key={category.id || category._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Link to={`/category/${category.slug}`} className="group block">
                                        <div className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">

                                            <div className="p-4 text-center">
                                                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-500">Không có danh mục sản phẩm nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between items-center mb-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sản phẩm nổi bật</h2>
                            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <Link
                            to="/products"
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Xem tất cả
                            <FiArrowRight className="ml-2" />
                        </Link>
                    </motion.div>

                    <FeaturedProducts products={featuredProducts} />
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-lg">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 p-8 lg:p-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">iPhone 15 Series</h2>
                                    <p className="text-blue-100 mb-6 text-lg">
                                        Khám phá dòng sản phẩm mới nhất với công nghệ tối tân và thiết kế đột phá
                                    </p>
                                    <Link
                                        to="/products/iphone-15"
                                        className="inline-block bg-white text-blue-700 py-3 px-8 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-md"
                                    >
                                        Khám phá ngay
                                    </Link>
                                </div>
                                <div className="md:w-1/2 p-4 flex justify-center">
                                    <img
                                        src="https://placehold.co/600x400/003366/ffffff?text=iPhone+15+Series"
                                        alt="iPhone 15 Series"
                                        className="max-h-80 object-contain transform -rotate-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Nhận thông báo ưu đãi</h2>
                        <p className="text-gray-600 mb-8">
                            Đăng ký nhận email để không bỏ lỡ các chương trình khuyến mãi hấp dẫn và thông tin sản phẩm mới nhất
                        </p>

                        <form onSubmit={handleEmailSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Khách hàng nói gì về chúng tôi</h2>
                        <div className="w-20 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                initials: "NT",
                                name: "Nguyễn Thành",
                                rating: 5,
                                comment: "Sản phẩm chất lượng, giao hàng nhanh, nhân viên tư vấn nhiệt tình. Tôi rất hài lòng với trải nghiệm mua hàng tại đây."
                            },
                            {
                                initials: "LH",
                                name: "Lê Hương",
                                rating: 5,
                                comment: "Giá cả hợp lý, chế độ bảo hành tốt, đặc biệt dịch vụ chăm sóc khách hàng rất chu đáo. Sẽ tiếp tục ủng hộ shop."
                            },
                            {
                                initials: "TĐ",
                                name: "Trần Đức",
                                rating: 4,
                                comment: "Sản phẩm đúng như mô tả, đóng gói cẩn thận. Rất hài lòng với chính sách đổi trả linh hoạt của cửa hàng."
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-blue-600 font-bold">{testimonial.initials}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                        <div className="flex text-yellow-400">
                                            {"★".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "{testimonial.comment}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
