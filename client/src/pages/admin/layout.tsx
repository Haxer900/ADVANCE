import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Tags, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Palette,
  Globe,
  DollarSign,
  Mail,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Truck,
  MessageSquare,
  TrendingUp,
  Shield
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    current: false,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    current: false,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    current: false,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
    current: false,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Refunds",
    href: "/admin/refunds",
    icon: RefreshCw,
    current: false,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    current: false,
  },
];

const integrations = [
  {
    name: "Payment Gateways",
    href: "/admin/integrations/payments",
    icon: CreditCard,
  },
  {
    name: "Shipping APIs",
    href: "/admin/integrations/shipping",
    icon: Truck,
  },
  {
    name: "Email Marketing",
    href: "/admin/integrations/email",
    icon: Mail,
  },
  {
    name: "SMS/WhatsApp",
    href: "/admin/integrations/messaging",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/admin/integrations/analytics",
    icon: TrendingUp,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
    window.location.href = "/admin/login";
  };

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "hidden"}`}>
        <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-neutral-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-neutral-900">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-neutral-900 border-r border-neutral-700">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">ZENTHRA</h2>
                <p className="text-xs text-neutral-400">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-amber-500/20 text-amber-400 border-r-2 border-amber-500"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) ? "text-amber-400" : "text-neutral-400 group-hover:text-neutral-300"
                    }`}
                  />
                  {item.name}
                  {item.name === "Notifications" && (
                    <Badge className="ml-auto bg-red-500 text-white">3</Badge>
                  )}
                </a>
              </Link>
            ))}

            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Integrations
              </h3>
              <div className="mt-2 space-y-1">
                {integrations.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-amber-500/20 text-amber-400 border-r-2 border-amber-500"
                          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-4 w-4 ${
                          isActive(item.href) ? "text-amber-400" : "text-neutral-400 group-hover:text-neutral-300"
                        }`}
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                System
              </h3>
              <div className="mt-2 space-y-1">
                <Link href="/admin/settings">
                  <a
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive("/admin/settings")
                        ? "bg-amber-500/20 text-amber-400 border-r-2 border-amber-500"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <Settings className="mr-3 flex-shrink-0 h-4 w-4 text-neutral-400 group-hover:text-neutral-300" />
                    Settings
                  </a>
                </Link>
              </div>
            </div>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-neutral-700 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white w-full justify-start"
          >
            <LogOut className="mr-3 flex-shrink-0 h-4 w-4 text-neutral-400 group-hover:text-neutral-300" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }
}