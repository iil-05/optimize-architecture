/**
 * Authentication Hook
 * Provides authentication state and methods
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage, AuthUser, AuthData } from '../utils/authStorage';
import { apiClient } from '../utils/apiClient';
import { toast } from 'react-toastify';

export interface UseAuthReturn {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<boolean>;
  changePassword: (passwordData: { current_password: string; new_password: string; new_password_confirmation: string }) => Promise<boolean>;
  
  // Utility methods
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  getTimeUntilExpiry: () => number | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = authStorage.getAuthData();
        const currentUser = authStorage.getUser();
        
        if (authData && currentUser && !authStorage.isTokenExpired()) {
          setUser(currentUser);
          console.log('✅ Auth initialized with existing session');
        } else {
          console.log('🔒 No valid auth session found');
          authStorage.clearAuthData();
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        authStorage.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return;

    const timeUntilExpiry = authStorage.getTimeUntilExpiry();
    if (!timeUntilExpiry) return;

    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
    
    const refreshTimer = setTimeout(async () => {
      console.log('🔄 Auto-refreshing token...');
      const refreshed = await refreshToken();
      if (!refreshed) {
        console.log('❌ Auto-refresh failed, logging out');
        await logout();
      }
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [user]);

  const login = useCallback(async (credentials: { email: string; password: string; remember?: boolean }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(credentials);
      
      // Create user object
      const authUser: AuthUser = {
        id: response.user?.id || response.id || 'user-' + Date.now(),
        name: response.user?.name || response.name || 'User',
        email: response.user?.email || response.email || credentials.email,
        avatar: response.user?.avatar || response.avatar,
        role: response.user?.role || response.role || 'user',
        permissions: response.user?.permissions || response.permissions || [],
        emailVerified: response.user?.email_verified || response.email_verified || false,
        createdAt: response.user?.created_at ? new Date(response.user.created_at) : new Date(),
        lastLoginAt: new Date(),
      };

      // Calculate expiry
      const expiresIn = response.expires_in || response.expiresIn || 24 * 60 * 60;
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Create auth data
      const authData: AuthData = {
        token: response.token || response.access_token,
        refreshToken: response.refresh_token || response.refreshToken,
        user: authUser,
        expiresAt,
        loginMethod: 'email',
        rememberMe: credentials.remember || false,
      };

      // Save to storage
      authStorage.saveAuthData(authData);
      setUser(authUser);

      toast.success('Welcome back! You are now logged in.');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string; password_confirmation: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register(userData);
      
      // Create user object
      const authUser: AuthUser = {
        id: response.user?.id || response.id || 'user-' + Date.now(),
        name: response.user?.name || response.name || userData.name,
        email: response.user?.email || response.email || userData.email,
        avatar: response.user?.avatar || response.avatar,
        role: response.user?.role || response.role || 'user',
        permissions: response.user?.permissions || response.permissions || [],
        emailVerified: response.user?.email_verified || response.email_verified || false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Calculate expiry
      const expiresIn = response.expires_in || response.expiresIn || 24 * 60 * 60;
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Create auth data
      const authData: AuthData = {
        token: response.token || response.access_token,
        refreshToken: response.refresh_token || response.refreshToken,
        user: authUser,
        expiresAt,
        loginMethod: 'email',
        rememberMe: false,
      };

      // Save to storage
      authStorage.saveAuthData(authData);
      setUser(authUser);

      toast.success('Welcome! Your account has been created successfully.');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Call logout API
      await apiClient.logout();
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear user-specific data from optimized storage
      const currentUserId = authStorage.getUser()?.id;
      if (currentUserId) {
        // Note: We don't clear user data on logout, only on account deletion
        console.log('🔄 User logged out, keeping data for next login');
      }
      
      // Clear auth data and state
      authStorage.clearAuthData();
      setUser(null);
      setError(null);
      setIsLoading(false);
      
      // Redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await authStorage.refreshAuthToken();
      if (refreshed) {
        const updatedUser = authStorage.getUser();
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<AuthUser>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.updateProfile(profileData);
      
      // Update local storage
      authStorage.updateUser(profileData);
      
      // Update state
      const updatedUser = authStorage.getUser();
      setUser(updatedUser);

      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    return authStorage.hasPermission(permission);
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return authStorage.hasRole(role);
  }, []);

  const getTimeUntilExpiry = useCallback((): number | null => {
    return authStorage.getTimeUntilExpiry();
  }, []);

  return {
    // State
    user,
    isAuthenticated: !!user && authStorage.isAuthenticated(),
    isLoading,
    error,

    // Methods
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,

    // Utility methods
    hasPermission,
    hasRole,
    getTimeUntilExpiry,
  };
};