/**
 * JWT Token utility functions
 */

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub?: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Decode JWT token from localStorage
 */
export function getDecodedToken(): DecodedToken | null {
  try {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * Returns true if token is missing, malformed, or exp claim is in the past
 */
export function isTokenExpired(): boolean {
  const decoded = getDecodedToken();

  if (!decoded || !decoded.exp) {
    return true; // No token or no exp claim = expired
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTimeInSeconds;
}

/**
 * Get token expiry time in milliseconds (Date.now() format)
 * Returns null if token is missing or malformed
 */
export function getTokenExpiry(): number | null {
  const decoded = getDecodedToken();

  if (!decoded || !decoded.exp) {
    return null;
  }

  // Convert seconds to milliseconds
  return decoded.exp * 1000;
}

/**
 * Get time until token expires in milliseconds
 * Returns 0 if already expired, null if no token
 */
export function getTimeUntilExpiry(): number | null {
  const expiry = getTokenExpiry();

  if (expiry === null) {
    return null;
  }

  const timeRemaining = expiry - Date.now();
  return Math.max(0, timeRemaining);
}

/**
 * Check if token is valid (exists and not expired)
 */
export function isTokenValid(): boolean {
  const token = localStorage.getItem('admin_token');
  return !!token && !isTokenExpired();
}
