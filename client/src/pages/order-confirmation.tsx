import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const [, setLocation] = useLocation();
  const orderId = params?.id;

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId) {
      setLocation("/");
    }
  }, [orderId, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Button onClick={() => setLocation("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                </motion.div>
              </div>
              <CardTitle className="text-3xl font-bold" data-testid="text-order-confirmed">
                Order Confirmed!
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b">
                  <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Order Details</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Order ID: <span className="text-foreground font-medium" data-testid="text-order-id">{order.id}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Status: <span className="text-foreground font-medium capitalize">{order.status}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Payment: <span className="text-foreground font-medium capitalize">{order.paymentStatus}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Total: <span className="text-foreground font-bold text-lg">₹{parseFloat(order.total).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {shippingAddress && (
                  <div className="flex items-start gap-4 pb-6 border-b">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Shipping Address</h3>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p className="text-foreground font-medium">{shippingAddress.fullName}</p>
                        <p>{shippingAddress.address}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                        <p>{shippingAddress.country}</p>
                        {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <CreditCard className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Payment Method</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.paymentMethod || "Razorpay"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setLocation("/my-orders")}
                  className="flex-1"
                  data-testid="button-view-orders"
                >
                  View All Orders
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-continue-shopping"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What's Next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You'll receive a confirmation email with your order details</li>
                    <li>• We'll notify you when your order ships</li>
                    <li>• Track your order anytime from your orders page</li>
                    <li>• Questions? Visit our <Link href="/support"><a className="text-primary hover:underline">support page</a></Link></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
