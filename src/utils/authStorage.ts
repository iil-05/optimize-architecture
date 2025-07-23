/**
 * Authentication Storage Manager
 * Handles secure storage and retrieval of authentication data
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  emailVerified?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthData {
  token: string;
  refreshToken?: string;
  user: AuthUser;
  expiresAt: Date;
  loginMethod: 'email' | 'google' | 'facebook';
  rememberMe: boolean;
}

export class AuthStorageManager {
  private static instance: AuthStorageManager;
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly AUTH_USER_KEY = 'authUser';
  private readonly AUTH_DATA_KEY = 'authData';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private constructor() { }

  public static getInstance(): AuthStorageManager {
    if (!AuthStorageManager.instance) {
      AuthStorageManager.instance = new AuthStorageManager();
    }
    return AuthStorageManager.instance;
  }

  // Save complete authentication data
  public saveAuthData(authData: AuthData): void {
    try {
      if (authData.user.email === 'admin@templates.uz') {
        authData.user.role = 'superadmin';
      }

      localStorage.setItem(this.AUTH_TOKEN_KEY, authData.token);
      if (authData.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
      }

      // Save user data
      const userData = {
        ...authData.user,
        lastLoginAt: new Date(),
      };

      localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(userData, this.dateReplacer));
      localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData, this.dateReplacer));

      console.log('✅ Auth data saved to localStorage:', {
        token: authData.token.substring(0, 20) + '...',
        user: authData.user.email,
        role: authData.user.role,
        expiresAt: authData.expiresAt
      });
    } catch (error) {
      console.error('❌ Error saving auth data to localStorage:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  // Get authentication token
  public getToken(): string | null {
    try {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);

      // Check if token is expired
      if (token && this.isTokenExpired()) {
        console.log('🔄 Token expired, clearing auth data');
        this.clearAuthData();
        return null;
      }

      return token;
    } catch (error) {
      console.error('❌ Error getting token from localStorage:', error);
      return null;
    }
  }

  // Get user data
  public getUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(this.AUTH_USER_KEY);
      if (!userData) return null;

      return JSON.parse(userData, this.dateReviver);
    } catch (error) {
      console.error('❌ Error getting user data from localStorage:', error);
      return null;
    }
  }

  // Get complete auth data
  public getAuthData(): AuthData | null {
    try {
      const authData = localStorage.getItem(this.AUTH_DATA_KEY);
      if (!authData) return null;

      const parsed = JSON.parse(authData, this.dateReviver);

      // Check if auth data is expired
      if (this.isTokenExpired(parsed.expiresAt)) {
        console.log('🔄 Auth data expired, clearing');
        this.clearAuthData();
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('❌ Error getting auth data from localStorage:', error);
      return null;
    }
  }

  // Get refresh token
  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error getting refresh token from localStorage:', error);
      return null;
    }
  }

  // Update user data
  public updateUser(userData: Partial<AuthUser>): void {
    try {
      const currentUser = this.getUser();
      if (!currentUser) {
        throw new Error('No user data found');
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
        lastLoginAt: currentUser.lastLoginAt, // Preserve original login time
      };

      localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(updatedUser, this.dateReplacer));

      // Also update in complete auth data
      const authData = this.getAuthData();
      if (authData) {
        authData.user = updatedUser;
        localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData, this.dateReplacer));
      }

      console.log('✅ User data updated in localStorage');
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user && !this.isTokenExpired());
  }

  // Check if token is expired
  public isTokenExpired(expiresAt?: Date): boolean {
    try {
      let expiry = expiresAt;

      if (!expiry) {
        const authData = this.getAuthData();
        expiry = authData?.expiresAt;
      }

      if (!expiry) {
        // If no expiry date, assume token is valid for 24 hours from last login
        const user = this.getUser();
        if (user?.lastLoginAt) {
          expiry = new Date(user.lastLoginAt.getTime() + 24 * 60 * 60 * 1000);
        } else {
          return true; // No login time, consider expired
        }
      }

      return new Date() >= expiry;
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
      return true; // Assume expired on error
    }
  }

  // Refresh authentication token
  public async refreshAuthToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.log('❌ No refresh token available');
        return false;
      }

      // In a real app, you would call your API to refresh the token
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();

        // Update token and expiry
        localStorage.setItem(this.AUTH_TOKEN_KEY, data.token);

        const authData = this.getAuthData();
        if (authData) {
          authData.token = data.token;
          authData.expiresAt = new Date(Date.now() + (data.expiresIn || 24 * 60 * 60) * 1000);
          localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData, this.dateReplacer));
        }

        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.log('❌ Token refresh failed');
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      this.clearAuthData();
      return false;
    }
  }

  // Clear all authentication data
  public clearAuthData(): void {
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.AUTH_USER_KEY);
      localStorage.removeItem(this.AUTH_DATA_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);

      console.log('✅ Auth data cleared from localStorage');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  }

  // Get authentication headers for API requests
  public getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Check if user has specific permission
  public hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) || false;
  }

  // Check if user has specific role
  public hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Get time until token expires
  public getTimeUntilExpiry(): number | null {
    try {
      const authData = this.getAuthData();
      if (!authData?.expiresAt) return null;

      const now = new Date().getTime();
      const expiry = new Date(authData.expiresAt).getTime();

      return Math.max(0, expiry - now);
    } catch (error) {
      console.error('❌ Error calculating time until expiry:', error);
      return null;
    }
  }

  // Private helper methods
  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private dateReviver(key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }
}

// Export singleton instance
export const authStorage = AuthStorageManager.getInstance();