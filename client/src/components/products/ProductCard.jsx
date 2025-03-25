import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image?.includes('http')
                  ? product.image
                  : `${import.meta.env.VITE_API_URL_IMG}${product.image}`}
                alt={product.name}
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </div>
              )}
            </Link>
          </div>

          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="mb-4">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center mb-1">
                    <span className="text-gray-400 text-sm line-through">
                      {product.originalPrice?.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="ml-2 text-xs text-red-500 font-medium">
                      Tiết kiệm {(product.originalPrice - product.price).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}

                <div className="flex items-baseline">
                  <span className="text-red-600 font-bold text-xl">
                    {product.price?.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-2">
              <Link
                to={`/product/${product._id}`}
                className="flex-1 py-2.5 text-center bg-blue-50 text-blue-600 hover:text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium"
              >
                Xem chi tiết
              </Link>
              <button
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                aria-label="Thêm vào giỏ hàng"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative border border-gray-100">

      {product.originalPrice && product.originalPrice > product.price && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
            </svg>
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        </div>
      )}

      <Link to={`/product/${product._id}`}>
        <div className="relative h-52 overflow-hidden bg-gray-50">
          <img
            src={product.image?.includes('http')
              ? product.image
              : `${import.meta.env.VITE_API_URL_IMG}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm md:text-base">
            {product.name}
          </h3>

          <div className="mt-auto">
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center mb-1">
                <span className="text-gray-400 text-sm line-through">
                  {product.originalPrice?.toLocaleString('vi-VN')}₫
                </span>
                <span className="ml-2 text-xs text-red-500 font-medium">
                  Tiết kiệm {(product.originalPrice - product.price).toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}

            <div className="flex items-baseline">
              <span className="text-red-600 font-bold text-lg md:text-xl">
                {product.price?.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-1">
        <div className="flex space-x-2">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 py-2.5 text-center bg-blue-50 text-blue-600 hover:text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium text-sm"
          >
            Xem chi tiết
          </Link>
          <button
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            aria-label="Thêm vào giỏ hàng"
          >      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-yellow-600 flex items-center shadow-sm">
        <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
        {product.rating || '4.8'}
      </div>
    </div>
  );
};

export default ProductCard;