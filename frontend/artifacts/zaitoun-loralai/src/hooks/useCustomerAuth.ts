/**
 * Custom hook for customer authentication state
 */

import { useEffect, useState } from 'react';
import { isCustomerLoggedIn, getCustomerProfile, clearCustomerToken, type CustomerProfile } from '@/utils/customerAuth';
import { customerApi } from '@/lib/api';

interface UseCustomerAuthReturn {
  isLoggedIn: boolean;
  customer: CustomerProfile | null;
  logout: () => void;
  loading: boolean;
}

export function useCustomerAuth(): UseCustomerAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isCustomerLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setCustomer(getCustomerProfile());
      } else {
        setCustomer(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const loggedIn = isCustomerLoggedIn();
      setIsLoggedIn(loggedIn);
      if (!loggedIn) setCustomer(null);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const logout = () => {
    customerApi.logout();
    setIsLoggedIn(false);
    setCustomer(null);
  };

  return { isLoggedIn, customer, logout, loading };
}
