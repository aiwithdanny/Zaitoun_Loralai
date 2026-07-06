import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';

export interface NewsletterSubscription {
  email: string;
  subscribed_at: string;
}

/**
 * Hook for subscribing to newsletter
 * Falls back to local storage only if the backend is genuinely unreachable
 * (network error, server down). When the backend responds with a validation error
 * (e.g. duplicate email), that error message is shown to the user.
 */
export function useNewsletterSubscription() {
  return useMutation({
    mutationFn: async (email: string) => {
      // Validate email
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email address');
      }

      let response: Response;

      // Attempt the API call — only a thrown exception means the backend
      // is genuinely unreachable (network error, DNS failure, server down).
      try {
        response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {
        // Fetch itself failed to send — backend is unreachable.
        // Fall back to local storage as best-effort.
        const subscriptions: NewsletterSubscription[] = JSON.parse(
          localStorage.getItem('newsletter_subscriptions') || '[]'
        );

        const exists = subscriptions.some((sub) => sub.email === email);
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

      // Backend responded — parse the real error message if it's an error.
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to subscribe');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Thank you for subscribing! Check your email for updates.');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to subscribe';
      toast.error(message);
    },
  });
}
