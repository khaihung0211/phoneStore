import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { cart, totalItems } = useCart();
  console.log("🚀 ~ Header ~ cart:", cart)
  console.log("🚀 ~ Header ~ totalItems:", totalItems)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <span className="text-2xl font-bold text-primary">
            MobileShop 1
          </span>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary">
              Sản phẩm
            </Link>
            <Link to="/promotion" className="text-gray-700 hover:text-primary">
              Khuyến mãi
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/login" className="btn-primary">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;