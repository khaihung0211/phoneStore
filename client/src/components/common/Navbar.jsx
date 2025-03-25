import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const { cart, totalItems } = useCart();
  console.log("🚀 ~ Navbar ~ cart:", cart.length)
  console.log("🚀 ~ Navbar ~ totalItems:", totalItems)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <span className="text-2xl font-bold text-black">MobileShop</span>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-secondary no-underline font-bold"
                  : "text-primary hover:text-secondary transition-colors no-underline font-bold"
              }
              end
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) => isActive
                ? "text-secondary font-bold"
                : "text-primary hover:text-secondary transition-colors font-bold"
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to="/promotion"
              className={({ isActive }) => isActive
                ? "text-secondary font-bold"
                : "text-primary hover:text-secondary transition-colors font-bold"
              }
            >
              Khuyến mãi
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive
                ? "text-secondary font-bold"
                : "text-primary hover:text-secondary transition-colors font-bold"
              }
            >
              Liên hệ
            </NavLink>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="text-primary hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="text-primary hover:text-secondary relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            </Link>

            {/* User */}
            {currentUser ? (
              <div className="relative">
                <button
                  className="flex items-center text-primary hover:text-secondary"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="mr-2">{currentUser.fullName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đơn hàng
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-primary hover:text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) => isActive
                  ? "text-secondary font-medium"
                  : "text-primary hover:text-secondary transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
                end
              >
                Trang chủ
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => isActive
                  ? "text-secondary font-medium"
                  : "text-primary hover:text-secondary transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </NavLink>
              <NavLink
                to="/promotion"
                className={({ isActive }) => isActive
                  ? "text-secondary font-medium"
                  : "text-primary hover:text-secondary transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Khuyến mãi
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => isActive
                  ? "text-secondary font-medium"
                  : "text-primary hover:text-secondary transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </NavLink>

              <div className="border-t border-gray-200 pt-3">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="block py-2 text-primary hover:text-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="block py-2 text-primary hover:text-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                    <button
                      className="block py-2 text-primary hover:text-secondary"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block py-2 text-primary hover:text-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="flex items-center py-2 text-primary hover:text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">Giỏ hàng</span>
                  <span className="bg-secondary text-white text-xs px-2 rounded-full">
                    {cart.length}
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;