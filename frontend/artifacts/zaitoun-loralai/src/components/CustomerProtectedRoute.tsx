/**
 * Protected Route HOC for customer routes
 * Redirects to /login if no valid customer JWT token
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { toast } from 'sonner';

interface CustomerProtectedRouteProps {
  [key: string]: any;
}

export function CustomerProtectedRoute(Component: React.ComponentType<any>) {
  return function ProtectedRouteComponent(props: CustomerProtectedRouteProps) {
    const [_, setLocation] = useLocation();
    const { isLoggedIn, loading } = useCustomerAuth();

    useEffect(() => {
      if (loading) return;
      if (!isLoggedIn) {
        toast.error('Please log in to access your account');
        setLocation('/login');
      }
    }, [isLoggedIn, loading, setLocation]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4" />
        </div>
      );
    }

    if (!isLoggedIn) return null;

    return <Component {...props} />;
  };
}
