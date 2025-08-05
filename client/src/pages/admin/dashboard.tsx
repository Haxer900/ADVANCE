import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Bell,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/admin/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/admin/notifications"],
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/admin/inventory/alerts"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${dashboardData?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Total Orders",
      value: dashboardData?.totalOrders || 0,
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Total Products",
      value: dashboardData?.totalProducts || 0,
      icon: Package,
      change: "+3.1%",
      changeType: "positive"
    },
    {
      title: "Total Users",
      value: dashboardData?.totalUsers || 0,
      icon: Users,
      change: "+15.3%",
      changeType: "positive"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400">Welcome to ZENTHRA Admin Panel</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-neutral-800/50 border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">{stat.change}</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Inventory Alerts
            </CardTitle>
            <Badge variant="destructive">{dashboardData?.lowStockProducts || 0}</Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {alerts?.slice(0, 5).map((alert: any) => (
                <div key={alert.id} className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{alert.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-xs text-neutral-400">Stock: {alert.currentStock}</p>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {alert.type}
                  </Badge>
                </div>
              )) || (
                <p className="text-neutral-400 text-sm">No alerts at the moment</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Recent Notifications
            </CardTitle>
            <Badge>{notifications?.filter((n: any) => !n.isRead).length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {notifications?.slice(0, 5).map((notification: any) => (
                <div key={notification.id} className="flex items-start space-x-3 py-2 border-b border-neutral-700 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.isRead ? 'bg-neutral-500' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{notification.title}</p>
                    <p className="text-xs text-neutral-400">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-neutral-400 text-sm">No notifications</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {dashboardData?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-neutral-400">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${order.total}</p>
                    <Badge 
                      variant={order.status === 'delivered' ? 'default' : 'secondary'}
                      className={order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : ''}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-neutral-400 text-sm">No recent orders</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {dashboardData?.topProducts?.map((product: any) => (
                <div key={product.id} className="flex items-center space-x-3 py-3 border-b border-neutral-700 last:border-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-neutral-400">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${product.price}</p>
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      Featured
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-neutral-400 text-sm">No products to display</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}