import { Navigate } from 'react-router-dom';
import type { ReactNode, FC } from 'react';
import { authStorage } from '../utils/authStorage';

interface Props {
    children: ReactNode;
}

const AuthGuard: FC<Props> = ({ children }) => {
    // Use the auth storage manager to check authentication
    const isAuthenticated = authStorage.isAuthenticated();
    
    if (!isAuthenticated) {
        console.log('🔒 User not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
};

export default AuthGuard;
