import { Navigate } from 'react-router-dom';
import type { ReactNode, FC } from 'react';
import { authStorage } from '../utils/authStorage';
import { optimizedStorage } from '../utils/optimizedStorage';

interface Props {
    children: ReactNode;
    requireProjectAccess?: string; // Optional project ID to check access
}

const AuthGuard: FC<Props> = ({ children, requireProjectAccess }) => {
    // Use the auth storage manager to check authentication
    const isAuthenticated = authStorage.isAuthenticated();
    
    if (!isAuthenticated) {
        console.log('🔒 User not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    // If project access is required, check if user owns the project
    if (requireProjectAccess) {
        const project = optimizedStorage.getProject(requireProjectAccess);
        if (!project) {
            console.log('🔒 Project not found or access denied, redirecting to dashboard');
            return <Navigate to="/dashboard" replace />;
        }
    }
    
    return <>{children}</>;
};

export default AuthGuard;
