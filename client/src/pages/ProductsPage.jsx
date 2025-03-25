import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    brand: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const performSearch = useCallback(
    debounce(() => {
      let result = [...products];
      if (searchTerm) {
        result = result.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.category !== 'all') {
        result = result.filter(product => product.category === filters.category);
      }

      if (filters.priceRange !== 'all') {
        switch (filters.priceRange) {
          case 'under100':
            result = result.filter(product => product.price < 100000);
            break;
          case '100to500':
            result = result.filter(product => product.price >= 100000 && product.price <= 500000);
            break;
          case '500to1000':
            result = result.filter(product => product.price > 500000 && product.price <= 1000000);
            break;
          case 'over1000':
            result = result.filter(product => product.price > 1000000);
            break;
          default:
            break;
        }
      }

      if (filters.brand !== 'all') {
        result = result.filter(product => product.brand === filters.brand);
      }

      switch (filters.sortBy) {
        case 'newest':
          result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'price-low-high':
          result = result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          result = result.sort((a, b) => b.price - a.price);
          break;
        case 'name-a-z':
          result = result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-z-a':
          result = result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }

      setFilteredProducts(result);
      setSearchLoading(false);
    }, 500),
    [searchTerm, filters, products]
  );

  useEffect(() => {
    setSearchLoading(true);
    performSearch();
    return () => {
      performSearch.cancel && performSearch.cancel();
    };
  }, [searchTerm, filters, performSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const categories = [
    { id: 'all', name: 'Tất cả danh mục', slug: "all" },
    { id: 'smartphone', name: 'Điện thoại', slug: "dien-thoai" },
    { id: 'tablet', name: 'Máy tính bảng', slug: "may-tinh-bang" },
    { id: 'accessory', name: 'Phụ kiện', slug: "phu-kien" }
  ];

  const brands = [
    { id: 'all', name: 'Tất cả thương hiệu' },
    { id: 'apple', name: 'Apple' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'xiaomi', name: 'Xiaomi' },
    { id: 'oppo', name: 'OPPO' }
  ];

  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: 'under100', name: 'Dưới 100.000đ' },
    { id: '100to500', name: '100.000đ - 500.000đ' },
    { id: '500to1000', name: '500.000đ - 1.000.000đ' },
    { id: 'over1000', name: 'Trên 1.000.000đ' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Mới nhất' },
    { id: 'price-low-high', name: 'Giá tăng dần' },
    { id: 'price-high-low', name: 'Giá giảm dần' },
    { id: 'name-a-z', name: 'Tên A-Z' },
    { id: 'name-z-a', name: 'Tên Z-A' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-primary">Sản phẩm</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Sản phẩm</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 focus:outline-none"
            />
            <button className="bg-primary text-white px-6 py-4 hover:bg-blue-700 transition-colors">
              {searchLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold">Bộ lọc</h4>

              </div>
              <div className="mb-6">
                <h5 className="font-semibold mb-2">Danh mục</h5>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={searchLoading}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold mb-2">Khoảng giá</h5>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={searchLoading}
                >
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold mb-2">Thương hiệu</h5>
                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={searchLoading}
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold mb-2">Sắp xếp theo</h5>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={searchLoading}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setFilters({
                    category: 'all',
                    priceRange: 'all',
                    brand: 'all',
                    sortBy: 'newest'
                  });
                  setSearchTerm('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70"
                disabled={searchLoading}
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <p className="text-gray-600">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>

              </div>
            </div>
            {searchLoading ? (
              <div className="flex flex-col items-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-gray-600">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <img
                      src={import.meta.env.VITE_API_URL_IMG + product.image}
                      alt={product.name}
                      className="w-full h-52 object-cover object-center"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                      <div className="flex flex-col justify-between items-center mt-3">
                        <span className="text-primary font-bold text-lg">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                        <Link
                          to={`/product/${product._id || product.id}`}
                          className="block w-full py-2 text-center bg-blue-50 text-blue-600   transition-colors duration-300 font-medium"
                        > <button className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg">
                            Xem sản phẩm
                          </button></Link>

                      </div>
                    </div>
                  </div>

                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;