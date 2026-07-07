/**
 * Protected Route HOC for admin routes
 * Redirects to /admin/login if no valid JWT token
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  [key: string]: any;
}

/**
 * Wraps a component and protects it with JWT authentication
 * Returns a new component that checks token validity before rendering
 * Optionally wraps the protected component in a layout
 */
export function ProtectedRoute(
  Component: React.ComponentType<any>,
  Layout?: React.ComponentType<{ children: React.ReactNode }>
) {
  return function ProtectedRouteComponent(props: ProtectedRouteProps) {
    const [, setLocation] = useLocation();
    const { isLoggedIn, isExpired, loading } = useAdminAuth();

    useEffect(() => {
      if (loading) return; // Wait for auth check to complete

      if (!isLoggedIn || isExpired) {
        // Token is missing or expired
        if (isExpired) {
          toast.error('Session expired. Please log in again.');
        }
        // Redirect to login
        setLocation('/admin/login');
      }
    }, [isLoggedIn, isExpired, loading, setLocation]);

    // Show nothing while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render if not authenticated
    if (!isLoggedIn || isExpired) {
      return null;
    }

    const rendered = <Component {...props} />;

    if (Layout) {
      return <Layout>{rendered}</Layout>;
    }

    // Render protected component standalone
    return rendered;
  };
}
