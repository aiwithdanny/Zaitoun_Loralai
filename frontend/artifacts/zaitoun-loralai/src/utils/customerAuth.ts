/**
 * Customer Authentication Utilities
 * Token management for customer JWT tokens
 */

const CUSTOMER_TOKEN_KEY = "customer_token";
const CUSTOMER_PROFILE_KEY = "customer_profile";

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export function getCustomerToken(): string | null {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string): void {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
}

export function clearCustomerToken(): void {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_PROFILE_KEY);
}

export function getCustomerProfile(): CustomerProfile | null {
  const raw = localStorage.getItem(CUSTOMER_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CustomerProfile;
  } catch {
    return null;
  }
}

export function setCustomerProfile(profile: CustomerProfile): void {
  localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(profile));
}

export function isCustomerTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = parts[1];
    const padded = payload + "==".substring(0, (4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    if (!decoded.exp) return true;
    return decoded.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function isCustomerLoggedIn(): boolean {
  const token = getCustomerToken();
  if (!token) return false;
  return !isCustomerTokenExpired(token);
}
