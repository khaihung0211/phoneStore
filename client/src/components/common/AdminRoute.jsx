import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminRoute({ children }) {
    const { currentUser, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        console.log("Access denied: User is not admin", currentUser?.role);
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default AdminRoute;
