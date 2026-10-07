import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// Eager: core shopping flow only (landing + cart). Everything else is
// code-split below so first paint doesn't download the admin panel etc.
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Cart } from "@/pages/Cart";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CustomerProtectedRoute } from "@/components/CustomerProtectedRoute";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Lazy: admin panel (17 pages) — never in the initial bundle.
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews"));
const AdminCoupons = lazy(() => import("@/pages/admin/AdminCoupons"));
const AdminFounder = lazy(() => import("@/pages/admin/AdminFounder"));
const AdminHomepage = lazy(() => import("@/pages/admin/AdminHomepage"));
const AdminStory = lazy(() => import("@/pages/admin/AdminStory"));
const AdminRecipes = lazy(() => import("@/pages/admin/AdminRecipes"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const AdminQualityFeatures = lazy(() => import("@/pages/admin/AdminQualityFeatures"));
const AdminTastingNotes = lazy(() => import("@/pages/admin/AdminTastingNotes"));
const AdminProductAccordion = lazy(() => import("@/pages/admin/AdminProductAccordion"));
const AdminWholesale = lazy(() => import("@/pages/admin/AdminWholesale"));
const AdminSiteConfig = lazy(() => import("@/pages/admin/AdminSiteConfig"));
import { AdminLayout } from "@/components/admin/AdminLayout";

// Lazy: heavier / less-visited public pages.
const Checkout = lazy(() => import("@/pages/Checkout").then((m) => ({ default: m.Checkout })));
const ProductDetail = lazy(() => import("@/pages/ProductDetail").then((m) => ({ default: m.ProductDetail })));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const FAQs = lazy(() => import("@/pages/FAQs"));
const CustomerLogin = lazy(() => import("@/pages/CustomerLogin"));
const CustomerRegister = lazy(() => import("@/pages/CustomerRegister"));
const AccountOrders = lazy(() => import("@/pages/AccountOrders"));
const AccountWishlist = lazy(() => import("@/pages/AccountWishlist"));
const TrackOrder = lazy(() => import("@/pages/TrackOrder"));
const Founder = lazy(() => import("@/pages/Founder"));

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

function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Loading...</span>
    </div>
  );
}

// Wrap lazy pages in Suspense once (module level, not inside render).
function withPageLoader(Component: React.ComponentType<any>) {
  return function LazyPage(props: any) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Pre-wrapped protected routes (HOCs applied once at module level).
const ProtectedAdminDashboard = withPageLoader(ProtectedRoute(AdminDashboard, AdminLayout));
const ProtectedAdminProducts = withPageLoader(ProtectedRoute(AdminProducts, AdminLayout));
const ProtectedAdminOrders = withPageLoader(ProtectedRoute(AdminOrders, AdminLayout));
const ProtectedAdminReviews = withPageLoader(ProtectedRoute(AdminReviews, AdminLayout));
const ProtectedAdminCoupons = withPageLoader(ProtectedRoute(AdminCoupons, AdminLayout));
const ProtectedAdminFounder = withPageLoader(ProtectedRoute(AdminFounder, AdminLayout));
const ProtectedAdminHomepage = withPageLoader(ProtectedRoute(AdminHomepage, AdminLayout));
const ProtectedAdminStory = withPageLoader(ProtectedRoute(AdminStory, AdminLayout));
const ProtectedAdminRecipes = withPageLoader(ProtectedRoute(AdminRecipes, AdminLayout));
const ProtectedAdminTestimonials = withPageLoader(ProtectedRoute(AdminTestimonials, AdminLayout));
const ProtectedAdminQualityFeatures = withPageLoader(ProtectedRoute(AdminQualityFeatures, AdminLayout));
const ProtectedAdminTastingNotes = withPageLoader(ProtectedRoute(AdminTastingNotes, AdminLayout));
const ProtectedAdminProductAccordion = withPageLoader(ProtectedRoute(AdminProductAccordion, AdminLayout));
const ProtectedAdminWholesale = withPageLoader(ProtectedRoute(AdminWholesale, AdminLayout));
const ProtectedAdminSiteConfig = withPageLoader(ProtectedRoute(AdminSiteConfig, AdminLayout));
const ProtectedAccountOrders = withPageLoader(CustomerProtectedRoute(AccountOrders));
const ProtectedAccountWishlist = withPageLoader(CustomerProtectedRoute(AccountWishlist));

const LazyCheckout = withPageLoader(Checkout);
const LazyProductDetail = withPageLoader(ProductDetail);
const LazyPrivacyPolicy = withPageLoader(PrivacyPolicy);
const LazyTermsOfService = withPageLoader(TermsOfService);
const LazyRefundPolicy = withPageLoader(RefundPolicy);
const LazyFAQs = withPageLoader(FAQs);
const LazyCustomerLogin = withPageLoader(CustomerLogin);
const LazyCustomerRegister = withPageLoader(CustomerRegister);
const LazyTrackOrder = withPageLoader(TrackOrder);
const LazyFounder = withPageLoader(Founder);
const LazyAdminLogin = withPageLoader(AdminLogin);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:group_id" component={LazyProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={LazyCheckout} />
      <Route path="/privacy-policy" component={LazyPrivacyPolicy} />
      <Route path="/terms-of-service" component={LazyTermsOfService} />
      <Route path="/refund-policy" component={LazyRefundPolicy} />
      <Route path="/faqs" component={LazyFAQs} />
      <Route path="/founder" component={LazyFounder} />
      <Route path="/track-order" component={LazyTrackOrder} />
      <Route path="/login" component={LazyCustomerLogin} />
      <Route path="/register" component={LazyCustomerRegister} />
      <Route path="/account/orders" component={ProtectedAccountOrders} />
      <Route path="/account/wishlist" component={ProtectedAccountWishlist} />
      <Route path="/admin/login" component={LazyAdminLogin} />
      <Route path="/admin/dashboard" component={ProtectedAdminDashboard} />
      <Route path="/admin/products" component={ProtectedAdminProducts} />
      <Route path="/admin/orders" component={ProtectedAdminOrders} />
      <Route path="/admin/reviews" component={ProtectedAdminReviews} />
      <Route path="/admin/coupons" component={ProtectedAdminCoupons} />
      <Route path="/admin/founder" component={ProtectedAdminFounder} />
      <Route path="/admin/homepage" component={ProtectedAdminHomepage} />
      <Route path="/admin/story" component={ProtectedAdminStory} />
      <Route path="/admin/recipes" component={ProtectedAdminRecipes} />
      <Route path="/admin/testimonials" component={ProtectedAdminTestimonials} />
      <Route path="/admin/quality-features" component={ProtectedAdminQualityFeatures} />
      <Route path="/admin/tasting-notes" component={ProtectedAdminTastingNotes} />
      <Route path="/admin/product-accordions" component={ProtectedAdminProductAccordion} />
      <Route path="/admin/wholesale" component={ProtectedAdminWholesale} />
      <Route path="/admin/site-config" component={ProtectedAdminSiteConfig} />
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
