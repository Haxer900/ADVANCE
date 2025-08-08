import { useState } from "react";
import { Search, Package, Truck, Check, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface OrderStatus {
  id: string;
  status: string;
  total: number;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      imageUrl: string;
      price: string;
    };
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  timeline: Array<{
    status: string;
    date: string;
    description: string;
    location?: string;
  }>;
}

export default function TrackOrder() {
  const [trackingInput, setTrackingInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: orderData, isLoading, error } = useQuery({
    queryKey: ["/api/orders/track", searchTerm],
    enabled: !!searchTerm,
  });

  const handleSearch = () => {
    if (!trackingInput.trim()) {
      toast({
        title: "Please enter a tracking number",
        description: "Enter your order number or tracking number to continue",
        variant: "destructive",
      });
      return;
    }
    setSearchTerm(trackingInput.trim().toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <Check className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <Package className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
        <p className="text-muted-foreground">
          Enter your order number or tracking number to see the latest updates
        </p>
      </div>

      {/* Search */}
      <Card className="max-w-md mx-auto mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tracking">Order Number or Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="e.g., ORD-123456 or TRK789012"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Track Order"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground">
              We couldn't find an order with that number. Please check your order 
              confirmation email or contact our support team.
            </p>
          </CardContent>
        </Card>
      )}

      {orderData && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order #{orderData.id}
                </CardTitle>
                <Badge className={getStatusColor(orderData.status)}>
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Order Date</p>
                  <p className="text-muted-foreground">
                    {new Date(orderData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-muted-foreground">${orderData.total.toFixed(2)}</p>
                </div>
                {orderData.trackingNumber && (
                  <div>
                    <p className="font-medium">Tracking Number</p>
                    <p className="text-muted-foreground font-mono">
                      {orderData.trackingNumber}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(orderData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {orderData.shippingAddress && (
                <div>
                  <p className="font-medium mb-2">Shipping Address</p>
                  <div className="text-sm text-muted-foreground">
                    <p>{orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}</p>
                    <p>{orderData.shippingAddress.address}</p>
                    <p>
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.timeline?.map((event: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(event.status)}
                      {index < orderData.timeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${parseFloat(item.product.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                If you have questions about your order, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" asChild>
                  <a href="mailto:support@morethanfashion.com">Email Support</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+1-555-123-4567">Call (555) 123-4567</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}