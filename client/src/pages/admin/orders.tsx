import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Edit, Search, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/admin/orders"],
  });

  const orders = ordersData?.orders || [];

  const updateOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
      trackingNumber,
    }: {
      orderId: string;
      status: string;
      trackingNumber?: string;
    }) => {
      return apiRequest("PUT", `/api/admin/orders/${orderId}`, {
        status,
        trackingNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
  });

  const filteredOrders = (orders as Order[]).filter((order: Order) => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userId && order.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zenthra-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                  data-testid="input-order-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {order.userId ? `User ${order.userId.substring(0, 8)}...` : "Guest"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status || "pending")}>
                      {(order.status || "pending").charAt(0).toUpperCase() + (order.status || "pending").slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                      {order.paymentStatus || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            data-testid={`button-view-order-${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Order ID</h4>
                                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Total Amount</h4>
                                  <p className="text-lg font-bold">
                                    {formatCurrency(selectedOrder.total)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Status</h4>
                                  <Badge className={getStatusColor(selectedOrder.status || "pending")}>
                                    {selectedOrder.status || "pending"}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Payment Status</h4>
                                  <Badge variant={(selectedOrder.paymentStatus || "pending") === "paid" ? "default" : "secondary"}>
                                    {selectedOrder.paymentStatus || "pending"}
                                  </Badge>
                                </div>
                              </div>
                              
                              {selectedOrder.shippingAddress && (
                                <div>
                                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <pre className="text-sm whitespace-pre-wrap">
                                      {JSON.stringify(selectedOrder.shippingAddress, null, 2) as string}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 pt-4">
                                <Select
                                  value={selectedOrder.status || "pending"}
                                  onValueChange={(status) =>
                                    updateOrderMutation.mutate({
                                      orderId: selectedOrder.id,
                                      status,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <Input
                                  placeholder="Tracking number..."
                                  defaultValue={selectedOrder.trackingNumber || ""}
                                  onBlur={(e) => {
                                    if (e.target.value !== selectedOrder.trackingNumber) {
                                      updateOrderMutation.mutate({
                                        orderId: selectedOrder.id,
                                        status: selectedOrder.status || "pending",
                                        trackingNumber: e.target.value,
                                      });
                                    }
                                  }}
                                  data-testid="input-tracking-number"
                                />
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}