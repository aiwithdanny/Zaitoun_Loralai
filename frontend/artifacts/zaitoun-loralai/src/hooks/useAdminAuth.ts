/**
 * Custom hook for admin authentication state
 * Checks token validity and provides auth utilities
 */

import { useEffect, useState } from 'react';
import { isTokenValid, isTokenExpired } from '@/utils/tokenUtils';
import { adminApi, type AdminUser } from '@/lib/api';

interface UseAdminAuthReturn {
  isLoggedIn: boolean;
  isExpired: boolean;
  user: AdminUser | null;
  logout: () => void;
  loading: boolean;
}

/**
 * Hook to check admin authentication status
 * Re-validates token when window regains focus
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check token validity on mount
  useEffect(() => {
    const checkAuth = () => {
      const valid = isTokenValid();
      const expired = isTokenExpired();

      setIsLoggedIn(valid);
      setIsExpired(expired);

      if (valid) {
        const currentUser = adminApi.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Re-validate token when window regains focus (tab becomes visible)
  useEffect(() => {
    const handleFocus = () => {
      const valid = isTokenValid();
      const expired = isTokenExpired();

      setIsLoggedIn(valid);
      setIsExpired(expired);

      if (!valid) {
        setUser(null);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const logout = () => {
    adminApi.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return {
    isLoggedIn,
    isExpired,
    user,
    logout,
    loading,
  };
}
