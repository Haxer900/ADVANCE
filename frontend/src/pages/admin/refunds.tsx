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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Eye,
  Check,
  X,
  Search,
  Filter,
  AlertTriangle,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "processed";
  customerNote?: string;
  adminNote?: string;
  requestedAt: Date;
  processedAt?: Date;
  refundMethod: "original" | "store_credit" | "bank_transfer";
}

export default function AdminRefunds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockRefunds: RefundRequest[] = [
    {
      id: "ref_001",
      orderId: "ord_12345",
      userId: "user_001",
      amount: 2500,
      reason: "Product defective",
      status: "pending",
      customerNote: "The product arrived damaged and doesn't work properly.",
      requestedAt: new Date("2025-01-02"),
      refundMethod: "original",
    },
    {
      id: "ref_002",
      orderId: "ord_12346",
      userId: "user_002",
      amount: 1800,
      reason: "Size not as expected",
      status: "approved",
      customerNote: "The size doesn't match the description.",
      adminNote: "Approved - valid size complaint",
      requestedAt: new Date("2025-01-01"),
      processedAt: new Date("2025-01-02"),
      refundMethod: "original",
    },
    {
      id: "ref_003",
      orderId: "ord_12347",
      userId: "user_003",
      amount: 3200,
      reason: "Changed mind",
      status: "rejected",
      customerNote: "I changed my mind about the purchase.",
      adminNote: "Rejected - beyond return policy period",
      requestedAt: new Date("2024-12-28"),
      processedAt: new Date("2024-12-30"),
      refundMethod: "original",
    },
  ];

  const { data: refunds = mockRefunds, isLoading } = useQuery({
    queryKey: ["/api/admin/refunds"],
    queryFn: () => Promise.resolve(mockRefunds),
  });

  const processRefundMutation = useMutation({
    mutationFn: async ({
      refundId,
      status,
      adminNote,
      refundMethod,
    }: {
      refundId: string;
      status: string;
      adminNote: string;
      refundMethod: string;
    }) => {
      return apiRequest("PUT", `/api/admin/refunds/${refundId}`, {
        status,
        adminNote,
        refundMethod,
        processedAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/refunds"] });
      setIsProcessDialogOpen(false);
      toast({
        title: "Refund Processed",
        description: "Refund request has been processed successfully.",
      });
    },
  });

  const filteredRefunds = (refunds as RefundRequest[]).filter((refund) => {
    const matchesSearch = 
      refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "processed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes("defective") || reason.toLowerCase().includes("damaged")) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <RefreshCw className="h-4 w-4 text-blue-500" />;
  };

  const handleProcessRefund = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRefund) return;
    
    const formData = new FormData(e.currentTarget);
    processRefundMutation.mutate({
      refundId: selectedRefund.id,
      status: formData.get("status") as string,
      adminNote: formData.get("adminNote") as string,
      refundMethod: formData.get("refundMethod") as string,
    });
  };

  // Calculate statistics
  const totalRefunds = refunds.length;
  const pendingRefunds = refunds.filter(r => r.status === "pending").length;
  const totalRefundAmount = refunds
    .filter(r => r.status === "processed")
    .reduce((sum, r) => sum + r.amount, 0);
  const avgProcessingTime = "2.3 days"; // Mock data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zenthra-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-refunds">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Refund Management</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card data-testid="metric-total-refunds">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRefunds}</div>
            <div className="text-xs text-muted-foreground">
              All time requests
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-pending-refunds">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRefunds}</div>
            <div className="text-xs text-muted-foreground">
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-refund-amount">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRefundAmount)}</div>
            <div className="text-xs text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-processing-time">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProcessingTime}</div>
            <div className="text-xs text-muted-foreground">
              From request to completion
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Refund Requests ({filteredRefunds.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search refunds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                  data-testid="input-refund-search"
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund: RefundRequest) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-mono text-sm">
                    {refund.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {refund.orderId}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(refund.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getReasonIcon(refund.reason)}
                      <span className="max-w-xs truncate">{refund.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(refund.status)}>
                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(refund.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRefund(refund)}
                            data-testid={`button-view-refund-${refund.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Refund Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRefund && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Refund ID</h4>
                                  <p className="font-mono text-sm">{selectedRefund.id}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Order ID</h4>
                                  <p className="font-mono text-sm">{selectedRefund.orderId}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Amount</h4>
                                  <p className="text-lg font-bold">
                                    {formatCurrency(selectedRefund.amount)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Status</h4>
                                  <Badge className={getStatusColor(selectedRefund.status)}>
                                    {selectedRefund.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Reason</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded">
                                  {selectedRefund.reason}
                                </p>
                              </div>

                              {selectedRefund.customerNote && (
                                <div>
                                  <h4 className="font-semibold mb-2">Customer Note</h4>
                                  <p className="text-sm bg-blue-50 p-3 rounded">
                                    {selectedRefund.customerNote}
                                  </p>
                                </div>
                              )}

                              {selectedRefund.adminNote && (
                                <div>
                                  <h4 className="font-semibold mb-2">Admin Note</h4>
                                  <p className="text-sm bg-yellow-50 p-3 rounded">
                                    {selectedRefund.adminNote}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Requested Date</h4>
                                  <p className="text-sm">
                                    {new Date(selectedRefund.requestedAt).toLocaleString()}
                                  </p>
                                </div>
                                {selectedRefund.processedAt && (
                                  <div>
                                    <h4 className="font-semibold">Processed Date</h4>
                                    <p className="text-sm">
                                      {new Date(selectedRefund.processedAt).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {refund.status === "pending" && (
                        <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRefund(refund)}
                              data-testid={`button-process-refund-${refund.id}`}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Process Refund Request</DialogTitle>
                              <DialogDescription>
                                Review and process this refund request.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRefund && (
                              <form onSubmit={handleProcessRefund} className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-semibold">Amount:</span> {formatCurrency(selectedRefund.amount)}
                                    </div>
                                    <div>
                                      <span className="font-semibold">Order:</span> {selectedRefund.orderId}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="font-semibold">Reason:</span> {selectedRefund.reason}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="status">Decision</Label>
                                  <Select name="status" defaultValue="approved">
                                    <SelectTrigger data-testid="select-refund-status">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="approved">Approve Refund</SelectItem>
                                      <SelectItem value="rejected">Reject Refund</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="refundMethod">Refund Method</Label>
                                  <Select name="refundMethod" defaultValue="original">
                                    <SelectTrigger data-testid="select-refund-method">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="original">Original Payment Method</SelectItem>
                                      <SelectItem value="store_credit">Store Credit</SelectItem>
                                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="adminNote">Admin Note</Label>
                                  <Textarea
                                    id="adminNote"
                                    name="adminNote"
                                    placeholder="Add a note about this decision..."
                                    required
                                    data-testid="textarea-admin-note"
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsProcessDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={processRefundMutation.isPending}
                                    data-testid="button-submit-refund"
                                  >
                                    {processRefundMutation.isPending ? "Processing..." : "Process Refund"}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
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