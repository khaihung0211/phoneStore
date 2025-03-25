import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [limit] = useState(10); // Items per page
    const [categories, setCategories] = useState([
        { id: 'all', name: 'Tất cả danh mục' }
    ]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await getCategories();

                if (response && response.success && response.data) {
                    const apiCategories = response.data.map(category => ({
                        id: category.slug, 
                        name: category.name,
                        _id: category._id,
                        icon: category.icon
                    }));

                    setCategories([
                        { id: 'all', name: 'Tất cả danh mục' },
                        ...apiCategories
                    ]);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                let response;

                if (searchQuery) {
                    response = await searchProducts(searchQuery);
                } else {
                    const categoryParam = categoryFilter !== 'all' ? categoryFilter : null;
                    response = await getProducts(categoryParam, currentPage, limit);
                }

                console.log("API Response:", response);

                if (response && response.success === true) {
                    const productsArray = response.data || [];
                    setTotalCount(response.count || 0);
                    setTotalPages(response.totalPages || 1);

                    // Apply client-side sorting
                    let sortedProducts = [...productsArray];

                    switch (sortOption) {
                        case 'newest':
                            sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                            break;
                        case 'oldest':
                            sortedProducts.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                            break;
                        case 'price_high':
                            sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
                            break;
                        case 'price_low':
                            sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
                            break;
                        case 'name_asc':
                            sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                            break;
                        case 'name_desc':
                            sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                            break;
                        case 'stock_low':
                            sortedProducts.sort((a, b) =>
                                ((a.countInStock || a.stock || 0) - (b.countInStock || b.stock || 0))
                            );
                            break;
                        default:
                            break;
                    }

                    setProducts(sortedProducts);
                    setError(null);
                } else {
                    // Handle unexpected response format
                    console.error('Unexpected API response format:', response);
                    setError('Nhận được phản hồi không hợp lệ từ máy chủ.');
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Không thể tải sản phẩm. Vui lòng thử lại.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [currentPage, searchQuery, categoryFilter, sortOption, limit]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1); 
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSelectProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(product => product._id));
        }
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const deleteProduct = async () => {
        if (!productToDelete) return;

        try {
            setProducts(products.filter(p => p._id !== productToDelete._id));
            setSelectedProducts(selectedProducts.filter(id => id !== productToDelete._id));
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            console.log('Xóa sản phẩm thành công');
        } catch (err) {
            console.error('Lỗi khi xóa sản phẩm:', err);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedProducts.length === 0) return;

        try {
            if (action === 'delete') {
                // await api.post('/admin/products/bulk-delete', { productIds: selectedProducts });

                setProducts(products.filter(p => !selectedProducts.includes(p._id)));
                setSelectedProducts([]);
                console.log('Xóa nhiều sản phẩm thành công');
            } else if (action === 'activate' || action === 'deactivate') {
                const isActive = action === 'activate';

                // API call to update status
                // await api.post('/admin/products/bulk-update', { 
                //     productIds: selectedProducts,
                //     updates: { isActive }
                // });

                // Update UI
                setProducts(products.map(p => {
                    if (selectedProducts.includes(p._id)) {
                        return { ...p, isActive };
                    }
                    return p;
                }));
                console.log(`Cập nhật trạng thái sản phẩm thành công`);
            }
        } catch (err) {
            console.error(`Lỗi khi thực hiện hành động hàng loạt ${action}:`, err);
          
        }
    };

    return (
        <div className="product-management-container">

            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-gray-600">Quản lý danh sách sản phẩm, tồn kho và giá cả</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        to="/admin/products/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm sản phẩm mới
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
     
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="sr-only">Tìm kiếm sản phẩm</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Tìm kiếm theo tên, mã SKU hoặc mô tả"
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="sr-only">Danh mục</label>
                        <select
                            id="category"
                            name="category"
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                            disabled={categoriesLoading}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sort" className="sr-only">Sắp xếp</label>
                        <select
                            id="sort"
                            name="sort"
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="newest">Mới nhất trước</option>
                            <option value="oldest">Cũ nhất trước</option>
                            <option value="price_high">Giá: Cao đến thấp</option>
                            <option value="price_low">Giá: Thấp đến cao</option>
                            <option value="name_asc">Tên: A đến Z</option>
                            <option value="name_desc">Tên: Z đến A</option>
                            <option value="stock_low">Tồn kho: Thấp đến cao</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-blue-800 font-medium">Đã chọn {selectedProducts.length} sản phẩm</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleBulkAction('activate')}
                            className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Kích hoạt
                        </button>
                        <button
                            onClick={() => handleBulkAction('deactivate')}
                            className="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            Vô hiệu hóa
                        </button>
                        <button
                            onClick={() => handleBulkAction('delete')}
                            className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-2">Không tìm thấy sản phẩm nào.</p>
                        <p>Hãy điều chỉnh tìm kiếm hoặc bộ lọc, hoặc thêm sản phẩm mới.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={selectedProducts.length === products.length && products.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tồn kho
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={() => handleSelectProduct(product._id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={`${import.meta.env.VITE_API_URL_IMG}${product.image || product.images?.[0]}`}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <Link to={`/admin/products/${product._id}`} className="hover:text-blue-600">
                                                            {product.name}
                                                        </Link>
                                                    </div>
                                                    {product.sku && (
                                                        <div className="text-xs text-gray-500">
                                                            SKU: {product.sku}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(product.price || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${(product.countInStock || product.stock || 0) > 20 ? 'text-green-600' :
                                                (product.countInStock || product.stock || 0) > 5 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {(product.countInStock || product.stock || 0)} sản phẩm
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive !== false
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.isActive !== false ? 'Đang hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/admin/products/${product._id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(product)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Sau
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{products.length > 0 ? (currentPage - 1) * limit + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * limit, totalCount)}</span> trong số{' '}
                                    <span className="font-medium">{totalCount}</span> kết quả
                                </p>
                            </div>
                            {totalPages > 1 && (
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Trước</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Page numbers - limit to 5 pages for better UI */}
                                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                            // Calculate page number based on current page to show relevant page numbers
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (<button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Sau</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        {/* Center modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Xóa Sản Phẩm
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Bạn có chắc chắn muốn xóa sản phẩm <span className="font-medium text-gray-700">{productToDelete?.name}</span>? Hành động này không thể hoàn tác.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={deleteProduct}
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setProductToDelete(null);
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProductsPage;
