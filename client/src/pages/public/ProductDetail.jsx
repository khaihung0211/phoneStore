import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addReview } from '../../services/productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { addToCart, totalItems } = useCart();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        console.log("🚀 ~ ProductDetail ~ totalItems:", totalItems)
    }, [totalItems])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(productId);
                setProduct(data.data);
                setReviews(data.data.reviews || []);
            } catch (err) {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            const response = await addToCart(productId, { quantity: 1 });
            if (response.success) {
                toast.success(`Thêm sản phẩm thành công`);
            } else {
                if (response.message = "Vui lòng đăng nhập để truy cập") {
                    toast.success(`Vui lòng đăng nhập để thêm sản phẩm vào giỏ`);
                } else {
                    toast.success(`Thêm sản phẩm thất bại, vui lòng thử lại`);
                }
            }
        } catch (error) {
            toast.error(`❌ Có lỗi xảy ra, vui lòng thử lại.`);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (newReview.trim() && reviewerName.trim()) {
            try {
                const response = await addReview(productId, {
                    content: newReview,
                    reviewerName,
                    rating
                });

                if (response.success) {
                    setReviews([...reviews, response.review]);
                    setNewReview('');
                    setReviewerName('');
                    setRating(5);
                    toast.success('✅ Đánh giá đã được thêm!');
                }
            } catch (err) {
                toast.error('⚠️ Không thể thêm đánh giá. Vui lòng thử lại sau.');
            }
        } else {
            toast.error('⚠️ Vui lòng nhập cả tên và nội dung đánh giá.');
        }
    };

    const StarRating = () => {
        return (
            <div className="flex items-center mb-3">
                <p className="mr-2 font-semibold">Đánh giá: </p>
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i} className="cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                className="hidden"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                            />
                            <FaStar
                                className="inline-block mr-1"
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                size={24}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            />
                        </label>
                    );
                })}
                <span className="ml-2 text-gray-600">({rating}/5)</span>
            </div>
        );
    };

    const DisplayStars = ({ value }) => {
        return (
            <div className="flex">
                {[...Array(5)].map((star, i) => (
                    <FaStar
                        key={i}
                        className="inline-block mr-1"
                        color={i < value ? "#ffc107" : "#e4e5e9"}
                        size={16}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!product) {
        return <div className="text-center">Không tìm thấy sản phẩm.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <ToastContainer />
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img
                        src={`${import.meta.env.VITE_API_URL_IMG}${product.image}`}
                        alt={product.name}
                        className="img-fluid rounded-lg"
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-xl text-blue-600 font-semibold mb-4">
                        {product.price?.toLocaleString('vi-VN')}₫
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-gray-400 text-sm line-through ml-2">
                                {product.originalPrice?.toLocaleString('vi-VN')}₫
                            </span>
                        )}
                    </p>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="mb-4">
                        <span className="font-semibold">Thương hiệu: </span>
                        <span className="ml-2">{product.brand}</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-semibold">Danh mục: </span>
                        <span className="ml-2">{product.category}</span>
                    </div>
                    <div className="mb-4 flex items-center">
                        <span className="font-semibold">Đánh giá: </span>
                        <span className="ml-2 flex items-center">
                            <DisplayStars value={product.rating} />
                            <span className="ml-2">({product.rating}/5 - {product.numReviews} đánh giá)</span>
                        </span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className={`btn btn-primary mt-4 ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={addingToCart}
                    >
                        {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                    </button>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
                <form onSubmit={handleAddReview} className="mb-4">
                    <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Nhập tên của bạn..."
                        className="form-control mb-2"
                        required
                    />
                    <StarRating />
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Nhập đánh giá của bạn..."
                        className="form-control mb-2"
                        rows="4"
                        required
                    />
                    <button type="submit" className="btn btn-success">Gửi đánh giá</button>
                </form>

                <div className="reviews-list">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="border p-4 mb-2 rounded">
                                <div className="flex items-center mb-2">
                                    <strong className="mr-2">{review.reviewerName}</strong>
                                    <DisplayStars value={review.rating || 5} />
                                </div>
                                <p>{review.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
