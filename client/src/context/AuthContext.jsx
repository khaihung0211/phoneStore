import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const user = authService.getCurrentUser();

        if (user && user._id) {
          try {
            setCurrentUser(user);
          } catch (error) {
            console.error("Failed to refresh user data:", error);
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token, user) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    }
  };

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      logout,
      updateUser,
      isAuthenticated: !!currentUser,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
