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
  Bell,
  Plus,
  Eye,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminNotification {
  id: string;
  type: "order" | "user" | "product" | "system" | "inventory";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  relatedId?: string;
  createdAt: Date;
}

export default function AdminNotifications() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/admin/notifications"],
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (notificationData: {
      type: string;
      title: string;
      message: string;
      priority: string;
      relatedId?: string;
    }) => {
      return apiRequest("POST", "/api/admin/notifications", notificationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Notification Created",
        description: "New notification has been created successfully.",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PUT", `/api/admin/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/admin/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({
        title: "All notifications marked as read",
        description: "All notifications have been marked as read.",
      });
    },
  });

  const filteredNotifications = (notifications as AdminNotification[]).filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const unreadCount = (notifications as AdminNotification[]).filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <CheckCircle className="h-4 w-4" />;
      case "user":
        return <Bell className="h-4 w-4" />;
      case "product":
        return <Info className="h-4 w-4" />;
      case "inventory":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-green-600";
      case "user":
        return "text-blue-600";
      case "product":
        return "text-purple-600";
      case "inventory":
        return "text-red-600";
      case "system":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateNotification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createNotificationMutation.mutate({
      type: formData.get("type") as string,
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      priority: formData.get("priority") as string,
      relatedId: formData.get("relatedId") as string || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zenthra-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-notifications">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" data-testid="unread-count">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            data-testid="button-mark-all-read"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" data-testid="button-create-notification">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to the admin dashboard.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="system">
                      <SelectTrigger data-testid="select-notification-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="normal">
                      <SelectTrigger data-testid="select-notification-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    required 
                    data-testid="input-notification-title"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    data-testid="textarea-notification-message"
                  />
                </div>
                <div>
                  <Label htmlFor="relatedId">Related ID (optional)</Label>
                  <Input 
                    id="relatedId" 
                    name="relatedId" 
                    placeholder="Order ID, User ID, etc."
                    data-testid="input-related-id"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createNotificationMutation.isPending}
                    data-testid="button-submit-notification"
                  >
                    {createNotificationMutation.isPending ? "Creating..." : "Create Notification"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Notifications ({filteredNotifications.length})</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]" data-testid="select-priority-filter">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification: AdminNotification) => (
                <TableRow 
                  key={notification.id}
                  className={!notification.isRead ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={notification.isRead ? "text-gray-400" : "text-blue-600"}>
                        {notification.isRead ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {notification.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-notification-${notification.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <div className={getTypeColor(notification.type)}>
                                {getTypeIcon(notification.type)}
                              </div>
                              {notification.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority} priority
                              </Badge>
                              <Badge variant="outline">
                                {notification.type}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Message</h4>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                            {notification.relatedId && (
                              <div>
                                <h4 className="font-semibold mb-2">Related ID</h4>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {notification.relatedId}
                                </code>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold mb-2">Created</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          data-testid={`button-mark-read-${notification.id}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
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