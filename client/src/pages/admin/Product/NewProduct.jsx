import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../../services/categoryService';
import { createProduct } from '../../../services/productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewProductPage() {
    const navigate = useNavigate();

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
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentFeature, setCurrentFeature] = useState('');
    const [currentSpecKey, setCurrentSpecKey] = useState('');
    const [currentSpecValue, setCurrentSpecValue] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await getCategories();

                if (response && response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                toast.error('Lỗi tải danh mục');
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setFormData(prevData => ({
            ...prevData,
            image: ''
        }));
        setImagePreview(null);
    };

    const handleAddSpecification = () => {
        if (currentSpecKey.trim() && currentSpecValue.trim()) {
            setFormData(prevData => ({
                ...prevData,
                specifications: {
                    ...prevData.specifications,
                    [currentSpecKey.trim()]: currentSpecValue.trim()
                }
            }));
            setCurrentSpecKey('');
            setCurrentSpecValue('');
        }
    };

    const handleRemoveSpecification = (key) => {
        setFormData(prevData => {
            const { [key]: removed, ...rest } = prevData.specifications;
            return { ...rest };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.brand || !formData.image) {
            toast.error('Điền đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const productData = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== 'gallery' && key !== 'features' && key !== 'specifications') {
                    productData.append(key, formData[key]);
                }
            });

            productData.append('features', JSON.stringify(formData.features));
            productData.append('specifications', JSON.stringify(formData.specifications));

            const response = await createProduct(productData);
            console.log('Product created:', response);

            toast.success('Thêm sản phẩm thành công!');
            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);

        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Lỗi tạo sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-product-container">
            <ToastContainer /> {/* Thêm ToastContainer vào đây */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm</h1>
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
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                    />
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
                        Tạo sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewProductPage;
