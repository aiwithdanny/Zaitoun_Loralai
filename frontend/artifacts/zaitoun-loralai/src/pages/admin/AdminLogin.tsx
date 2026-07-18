/**
 * Admin Login Page
 * Split-screen layout: login form on the left, brand image on the right.
 * Uses our existing brand theme tokens (olive green primary, gold accent, serif font).
 */

import { Helmet } from "react-helmet-async";
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import logoImg from "@assets/Official_Logo_1782757596768.webp";
import loginImage from "@assets/admin-login-page.webp";

export default function AdminLogin() {
  const [location, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError('Please enter both username and password');
        setLoading(false);
        return;
      }

      const response = await adminApi.login({ username, password });

      toast.success(`Welcome back, ${response.user.username}!`);
      setLocation('/admin/dashboard');
    } catch (err: any) {
      const errorMessage =
        err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Helmet>
        <title>Admin Login — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Left — Login Form (40%) */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-card border border-card-border shadow-sm flex items-center justify-center mb-5">
                <img
                  src={logoImg}
                  alt="Zaitoun Loralai"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <h1 className="text-2xl font-serif text-foreground">Zaitoun Loralai</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back. Sign in to the dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-medium py-2.5 px-4 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Zaitoun Admin Dashboard</p>
            <p className="text-xs mt-1">For authorized administrators only</p>
          </div>
        </div>
      </div>

      {/* Right — Image (60%, hidden on mobile) */}
      <div className="hidden md:block md:w-[60%] relative overflow-hidden bg-muted">
        <img
          src={loginImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
        {/* Subtle welcome text on image */}
        <div className="absolute bottom-10 left-10 max-w-md">
          <p className="text-white/90 text-lg font-serif italic leading-relaxed">
            &ldquo;Extra virgin olive oil,
            <br />crafted from the finest olives
            <br />of Loralai, Balochistan.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
