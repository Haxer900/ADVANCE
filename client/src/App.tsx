import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { ScrollToTop } from "@/components/scroll-to-top";
import { CookieConsent } from "@/components/cookie-consent";
import { Preloader } from "@/components/preloader";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Wishlist from "@/pages/wishlist";
import Checkout from "@/pages/checkout";
import Blog from "@/pages/blog";
import TrackOrder from "@/pages/track-order";
import About from "@/pages/about";
import AboutUs from "@/pages/about-us";
import Collections from "@/pages/collections";
import NewArrivals from "@/pages/new-arrivals";
import SizeGuide from "@/pages/size-guide";
import ShippingInfo from "@/pages/shipping-info";
import Returns from "@/pages/returns";
import FAQ from "@/pages/faq";
import Support from "@/pages/support";
import Contact from "@/pages/contact";
import OurStory from "@/pages/our-story";
import NotFound from "@/pages/not-found";
// Admin imports
import AdminLogin from "@/pages/admin/login";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminUsers from "@/pages/admin/users";
import AdminCategories from "@/pages/admin/categories";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminNotifications from "@/pages/admin/notifications";
import AdminEmailMarketing from "@/pages/admin/email-marketing";
import AdminSettings from "@/pages/admin/settings";
import AdminSMSWhatsApp from "@/pages/admin/sms-whatsapp";
import AdminRefunds from "@/pages/admin/refunds";
import PaymentIntegrations from "@/pages/admin/integrations/payments";
import { useCartStore } from "@/components/cart-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function CartUpdater() {
  const { sessionId, setCartCount } = useCartStore();
  
  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart", sessionId],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(totalItems);
    }
  }, [cartItems, setCartCount]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/*">
        {() => {
          // Check if user is authenticated
          const token = localStorage.getItem("admin-token");
          if (!token) {
            window.location.href = "/admin/login";
            return null;
          }

          return (
            <AdminLayout>
              <Switch>
                <Route path="/admin/dashboard" component={AdminDashboard} />
                <Route path="/admin/products" component={AdminProducts} />
                <Route path="/admin/orders" component={AdminOrders} />
                <Route path="/admin/users" component={AdminUsers} />
                <Route path="/admin/categories" component={AdminCategories} />
                <Route path="/admin/analytics" component={AdminAnalytics} />
                <Route path="/admin/notifications" component={AdminNotifications} />
                <Route path="/admin/email-marketing" component={AdminEmailMarketing} />
                <Route path="/admin/sms-whatsapp" component={AdminSMSWhatsApp} />
                <Route path="/admin/refunds" component={AdminRefunds} />
                <Route path="/admin/settings" component={AdminSettings} />
                <Route path="/admin/integrations/payments" component={PaymentIntegrations} />
                <Route component={() => <div className="p-6"><h1 className="text-white text-2xl">Admin Page Coming Soon</h1></div>} />
              </Switch>
            </AdminLayout>
          );
        }}
      </Route>
      
      {/* Public Routes */}
      <Route>
        {() => (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/products" component={Products} />
                <Route path="/product/:id" component={ProductDetail} />
                <Route path="/cart" component={Cart} />
                <Route path="/wishlist" component={Wishlist} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/blog" component={Blog} />
                <Route path="/track-order" component={TrackOrder} />
                <Route path="/about" component={About} />
                <Route path="/about-us" component={AboutUs} />
                <Route path="/collections" component={Collections} />
                <Route path="/new-arrivals" component={NewArrivals} />
                <Route path="/size-guide" component={SizeGuide} />
                <Route path="/shipping-info" component={ShippingInfo} />
                <Route path="/returns" component={Returns} />
                <Route path="/faq" component={FAQ} />
                <Route path="/support" component={Support} />
                <Route path="/our-story" component={OurStory} />
                <Route path="/contact" component={Contact} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            <ScrollToTop />
            <CookieConsent />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="morethanfashion-ui-theme">
        <TooltipProvider>
          <Preloader />
          <CartUpdater />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
