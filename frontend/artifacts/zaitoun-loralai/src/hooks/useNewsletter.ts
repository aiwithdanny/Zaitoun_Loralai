import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface NewsletterSubscription {
  email: string;
  subscribed_at: string;
}

/**
 * Hook for subscribing to newsletter
 * Falls back to local storage if API is unavailable
 */
export function useNewsletterSubscription() {
  return useMutation({
    mutationFn: async (email: string) => {
      // Validate email
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email address');
      }

      // Try API first
      try {
        const response = await fetch('http://localhost:8000/api/v1/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('API subscription failed');
        }

        return response.json();
      } catch (apiError) {
        // Fallback to local storage
        const subscriptions = JSON.parse(
          localStorage.getItem('newsletter_subscriptions') || '[]'
        );

        const exists = subscriptions.some((sub: NewsletterSubscription) => sub.email === email);
        if (exists) {
          throw new Error('Email already subscribed');
        }

        subscriptions.push({
          email,
          subscribed_at: new Date().toISOString(),
        });

        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));

        return { success: true, email };
      }
    },
    onSuccess: (data) => {
      toast.success('Thank you for subscribing! Check your email for updates.');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to subscribe';
      toast.error(message);
    },
  });
}
