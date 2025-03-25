import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedProducts = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product, index) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <Link to={`/product/${product._id || product.id}`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image?.includes('http')
                    ? product.image
                    : `${import.meta.env.VITE_API_URL_IMG}${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4 h-28 flex flex-col justify-between">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-blue-600 font-bold">
                    {product.price?.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-400 text-sm line-through ml-2">
                      {product.originalPrice?.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Link
                to={`/product/${product._id || product.id}`}
                className="block w-full py-2 text-center bg-blue-50 text-blue-600 hover:text-white rounded-lg hover:bg-blue-600  transition-colors duration-300 font-medium"
              >
                Xem chi tiết
              </Link>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">Không có sản phẩm nổi bật nào.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
