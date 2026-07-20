import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminFounder from "@/pages/admin/AdminFounder";
import { AdminLayout } from "@/components/admin/AdminLayout";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import RefundPolicy from "@/pages/RefundPolicy";
import FAQs from "@/pages/FAQs";
import CustomerLogin from "@/pages/CustomerLogin";
import CustomerRegister from "@/pages/CustomerRegister";
import { ProductDetail } from "@/pages/ProductDetail";
import AccountOrders from "@/pages/AccountOrders";
import AccountWishlist from "@/pages/AccountWishlist";
import TrackOrder from "@/pages/TrackOrder";
import Founder from "@/pages/Founder";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CustomerProtectedRoute } from "@/components/CustomerProtectedRoute";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — data considered fresh for 5 min
      gcTime: 1000 * 60 * 30,   // 30 minutes — keep unused data in cache
      refetchOnWindowFocus: false,
      retry: 1,                 // single retry instead of default 3
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:group_id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/founder" component={Founder} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/login" component={CustomerLogin} />
      <Route path="/register" component={CustomerRegister} />
      <Route path="/account/orders" component={CustomerProtectedRoute(AccountOrders)} />
      <Route path="/account/wishlist" component={CustomerProtectedRoute(AccountWishlist)} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={ProtectedRoute(AdminDashboard, AdminLayout)} />
      <Route path="/admin/products" component={ProtectedRoute(AdminProducts, AdminLayout)} />
      <Route path="/admin/orders" component={ProtectedRoute(AdminOrders, AdminLayout)} />
      <Route path="/admin/reviews" component={ProtectedRoute(AdminReviews, AdminLayout)} />
      <Route path="/admin/coupons" component={ProtectedRoute(AdminCoupons, AdminLayout)} />
      <Route path="/admin/founder" component={ProtectedRoute(AdminFounder, AdminLayout)} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <WhatsAppButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
