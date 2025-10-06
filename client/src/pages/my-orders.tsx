import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your orders",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [setLocation, toast]);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/my-orders"],
  });

  const requestRefundMutation = useMutation({
    mutationFn: async ({ orderId, paymentId, amount, reason }: any) => {
      const token = localStorage.getItem("user-token");
      const response = await apiRequest("POST", "/api/razorpay/refund", {
        orderId,
        paymentId,
        amount,
        reason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Refund Requested",
        description: "Your refund request has been submitted successfully. We'll process it within 5-7 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Refund Request Failed",
        description: error.message || "Failed to request refund",
        variant: "destructive",
      });
    },
  });

  const handleRefundRequest = (order: any) => {
    if (!order.paymentMethod || order.paymentStatus !== "completed") {
      toast({
        title: "Refund Not Available",
        description: "Refunds are only available for completed payments",
        variant: "destructive",
      });
      return;
    }

    if (!order.razorpayPaymentId) {
      toast({
        title: "Refund Not Available",
        description: "Payment ID not found. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    requestRefundMutation.mutate({
      orderId: order.id,
      paymentId: order.razorpayPaymentId,
      amount: parseFloat(order.total),
      reason: "Customer requested refund",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      delivered: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    };
    return colors[status] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center p-8">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Failed to load orders</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-my-orders">My Orders</h1>
              <p className="text-muted-foreground">View and manage your orders</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center p-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <Button onClick={() => setLocation("/products")} data-testid="button-start-shopping">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card data-testid={`card-order-${order.id}`}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.createdAt ? format(new Date(order.createdAt), "PPP") : "Date unavailable"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)} data-testid={`status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold" data-testid={`total-${order.id}`}>
                              ₹{parseFloat(order.total).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div>
                            <p className="text-sm text-muted-foreground">Tracking Number</p>
                            <p className="font-medium">{order.trackingNumber}</p>
                          </div>
                        )}

                        <Separator />

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href={`/order-confirmation/${order.id}`}>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                              data-testid={`button-view-details-${order.id}`}
                            >
                              View Details
                            </Button>
                          </Link>
                          
                          {order.paymentStatus === "completed" && order.status !== "cancelled" && (
                            <Button
                              variant="outline"
                              onClick={() => handleRefundRequest(order)}
                              disabled={requestRefundMutation.isPending}
                              className="w-full sm:w-auto"
                              data-testid={`button-request-refund-${order.id}`}
                            >
                              <RefreshCw className="mr-2 w-4 h-4" />
                              {requestRefundMutation.isPending ? "Processing..." : "Request Refund"}
                            </Button>
                          )}

                          {order.status === "delivered" && (
                            <Link href={`/track-order?id=${order.id}`}>
                              <Button variant="secondary" className="w-full sm:w-auto">
                                Track Order
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
