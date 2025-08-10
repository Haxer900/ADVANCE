import { Route, Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// Admin Pages
import AdminLayout from "@/pages/layout";
import AdminLogin from "@/pages/login";
import AdminDashboard from "@/pages/dashboard";
import AdminProducts from "@/pages/products";
import AdminOrders from "@/pages/orders";
import AdminUsers from "@/pages/users";
import AdminCategories from "@/pages/categories";
import AdminAnalytics from "@/pages/analytics";
import AdminSettings from "@/pages/settings";
import AdminNotifications from "@/pages/notifications";
import AdminRefunds from "@/pages/refunds";
import AdminEmailMarketing from "@/pages/email-marketing";
import AdminSMSWhatsApp from "@/pages/sms-whatsapp";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="zenthra-admin-theme">
        <Router>
          <Route path="/login" component={AdminLogin} />
          
          <Route path="/admin" nest>
            <AdminLayout>
              <Route path="/" component={AdminDashboard} />
              <Route path="/dashboard" component={AdminDashboard} />
              <Route path="/products" component={AdminProducts} />
              <Route path="/orders" component={AdminOrders} />
              <Route path="/users" component={AdminUsers} />
              <Route path="/categories" component={AdminCategories} />
              <Route path="/analytics" component={AdminAnalytics} />
              <Route path="/settings" component={AdminSettings} />
              <Route path="/notifications" component={AdminNotifications} />
              <Route path="/refunds" component={AdminRefunds} />
              <Route path="/email-marketing" component={AdminEmailMarketing} />
              <Route path="/sms-whatsapp" component={AdminSMSWhatsApp} />
            </AdminLayout>
          </Route>

          {/* Default redirect to admin dashboard */}
          <Route path="/" component={() => {
            window.location.href = "/admin/dashboard";
            return null;
          }} />
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;