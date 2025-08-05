import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
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
import Contact from "@/pages/contact";
import OurStory from "@/pages/our-story";
import NotFound from "@/pages/not-found";
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
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
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
          <Route path="/our-story" component={OurStory} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="zenthra-ui-theme">
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
