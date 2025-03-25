import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../../services/categoryService';
import { getProductById, updateProduct } from '../../../services/productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: '',
        brand: '',
        sku: '',
        gallery: [],
        features: [],
        specifications: {},
        isActive: true,
        featured: false
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setInitialLoading(true);
                const productResponse = await getProductById(id);
                if (productResponse && productResponse.success && productResponse.data) {
                    const product = productResponse.data;
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        price: product.price?.toString() || '',
                        originalPrice: product.originalPrice?.toString() || '',
                        stock: product.stock?.toString() || '',
                        category: product.category?._id || product.category || '',
                        brand: product.brand || '',
                        sku: product.sku || '',
                        gallery: product.gallery || [],
                        features: product.features || [],
                        specifications: product.specifications || {},
                        isActive: product.isActive !== undefined ? product.isActive : true,
                        featured: product.featured || false
                    });

                    if (product.image) {
                        setExistingImage(product.image);
                        setImagePreview(product.image);
                    }
                } else {
                    setError('Failed to load product data. Please try again.');
                    toast.error('Failed to load product data. Please try again.');
                }

                const categoriesResponse = await getCategories();
                if (categoriesResponse && categoriesResponse.success && categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                } else {
                    setError('Failed to load categories. Please try again.');
                    toast.error('Failed to load categories. Please try again.');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
                toast.error('Failed to load data. Please try again.');
            } finally {
                setInitialLoading(false);
                setCategoriesLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prevData => {
            const updatedData = { ...prevData };
            delete updatedData.image;
            return {
                ...updatedData,
                image: file
            };
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setImageChanged(true);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setFormData(prevData => {
            const updatedData = { ...prevData };
            delete updatedData.image;
            return updatedData;
        });
        setImagePreview(null);
        setExistingImage(null);
        setImageChanged(true);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.brand) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const productData = new FormData();

            // Add all basic fields to FormData
            Object.keys(formData).forEach(key => {
                if (key !== 'gallery' && key !== 'features' && key !== 'specifications' && key !== 'image') {
                    productData.append(key, formData[key]);
                }
            });

            productData.append('features', JSON.stringify(formData.features));
            productData.append('specifications', JSON.stringify(formData.specifications));

            if (formData.image) {
                productData.append('image', formData.image);
            }

            if (existingImage && !imagePreview) {
                productData.append('removeImage', 'true');
            }

            const response = await updateProduct(id, productData);
            console.log('Product updated:', response);

            toast.success('Cập nhật sản phẩm thành công!'); // Thông báo thành công
            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);

        } catch (err) {
            console.error('Error updating product:', err);
            toast.error('Failed to update product. Please try again.'); // Thông báo lỗi
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg font-medium text-gray-700">Đang tải...</span>
            </div>
        );
    }

    return (
        <div className="edit-product-container">
            <ToastContainer /> {/* Thêm ToastContainer vào đây */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        to="/admin/products"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Quay lại
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Thông tin sản phẩm</h2>
                </div>

                <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Giá bán <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="1000"
                                value={formData.price}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₫</span>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                            Giá nhập
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="originalPrice"
                                id="originalPrice"
                                min="0"
                                step="1000"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₫</span>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Tồn kho <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                            Thương hiệu <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="brand"
                                id="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative">
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="py-2 px-4 w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={categoriesLoading}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <fieldset className="space-y-4">
                            <legend className="text-sm font-medium text-gray-700">Trạng thái</legend>

                            <div className="relative flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="isActive"
                                        name="isActive"
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="isActive" className="font-medium text-gray-700">Hoạt động</label>
                                    <p className="text-gray-500">Sản phẩm sẽ được hiển thị và có sẵn để mua</p>
                                </div>
                            </div>

                            <div className="relative flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="featured"
                                        name="featured"
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="featured" className="font-medium text-gray-700">Nổi bật</label>
                                    <p className="text-gray-500">Sản phẩm sẽ được hiển thị trong các mục nổi bật</p>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Ảnh sản phẩm</h2>
                    <p className="text-sm text-gray-500 mb-4">Tải lên hình ảnh của sản phẩm</p>

                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tải lên hình ảnh</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V9a4 4 0 014-4h16a4 4 0 014 4v20a4 4 0 01-4 4z"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Tải lên một tập tin</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Xem trước</label>
                            <div className="mt-1 h-32 bg-gray-100 rounded-md overflow-hidden">
                                {imagePreview ? (
                                    <div className="relative h-full">
                                        <img
                                            src={`${imageChanged ? imagePreview : import.meta.env.VITE_API_URL_IMG + existingImage}`}
                                            alt="Preview"
                                            className="h-full w-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        Không có ảnh
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex justify-end border-t border-gray-200">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cập nhật sản phẩm
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default EditProductPage;
