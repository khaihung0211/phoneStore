import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, getUserProfile, updateUserProfile } from '../services';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserById(currentUser._id);
        
        setProfile({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          avatar: response.data.avatar || '',
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      await updateUserProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      });
      
      setSuccess('Cập nhật thông tin thành công!');
      setUpdating(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.');
      setUpdating(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      await updateUserProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setSuccess('Đổi mật khẩu thành công!');
      setUpdating(false);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-primary">Tài khoản của tôi</h1>
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Tài khoản của tôi</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="address" className="block text-gray-700 mb-2">Địa chỉ</label>
                <textarea
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold transition-colors ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={updating}
              >
                {updating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold transition-colors ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={updating}
              >
                {updating ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Nguy hiểm</h2>
            <p className="mb-4 text-gray-700">Nếu bạn muốn đăng xuất khỏi tài khoản của mình:</p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;