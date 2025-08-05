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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Plus,
  Send,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: "draft" | "scheduled" | "sent";
  sentAt?: Date;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

export default function AdminEmailMarketing() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["/api/admin/email-campaigns"],
  });

  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery({
    queryKey: ["/api/newsletters"],
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      subject: string;
      content: string;
      recipients: string[];
      status: string;
    }) => {
      return apiRequest("POST", "/api/admin/email-campaigns", campaignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Campaign Created",
        description: "Email campaign has been created successfully.",
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({
      campaignId,
      updates,
    }: {
      campaignId: string;
      updates: Partial<EmailCampaign>;
    }) => {
      return apiRequest("PUT", `/api/admin/email-campaigns/${campaignId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Campaign Updated",
        description: "Email campaign has been updated successfully.",
      });
    },
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      return apiRequest("POST", `/api/admin/email-campaigns/${campaignId}/send`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      toast({
        title: "Campaign Sent",
        description: "Email campaign has been sent successfully.",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      return apiRequest("DELETE", `/api/admin/email-campaigns/${campaignId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      toast({
        title: "Campaign Deleted",
        description: "Email campaign has been deleted successfully.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "sent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const allSubscriberEmails = (subscribers as NewsletterSubscriber[]).map(s => s.email);
    
    createCampaignMutation.mutate({
      name: formData.get("name") as string,
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
      recipients: allSubscriberEmails,
      status: formData.get("status") as string,
    });
  };

  const handleUpdateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    
    const formData = new FormData(e.currentTarget);
    updateCampaignMutation.mutate({
      campaignId: selectedCampaign.id,
      updates: {
        name: formData.get("name") as string,
        subject: formData.get("subject") as string,
        content: formData.get("content") as string,
        status: formData.get("status") as string,
      },
    });
  };

  const emailTemplates = [
    {
      name: "Welcome Email",
      subject: "Welcome to ZENTHRA - Your Premium Journey Begins",
      content: `
Dear [Name],

Welcome to ZENTHRA! We're thrilled to have you join our community of discerning customers who appreciate premium quality and elegant design.

As a new member, you'll enjoy:
• Exclusive access to new collections
• Premium customer support
• Special member-only offers
• Free shipping on orders over ₹2,000

Explore our latest collection and discover the perfect pieces for your lifestyle.

Best regards,
The ZENTHRA Team
      `.trim(),
    },
    {
      name: "New Collection Announcement",
      subject: "New Arrival: Discover Our Latest Premium Collection",
      content: `
Dear Valued Customer,

We're excited to introduce our newest collection, featuring carefully curated pieces that embody elegance and sophistication.

🌟 What's New:
• Premium leather goods
• Elegant jewelry pieces
• Luxury lifestyle accessories
• Limited edition items

Shop now and enjoy early access to these exclusive pieces.

Visit our store: [Store Link]

Warm regards,
ZENTHRA Team
      `.trim(),
    },
  ];

  if (campaignsLoading || subscribersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zenthra-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-email-marketing">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Email Marketing</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="button-create-campaign">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email campaign to send to your subscribers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  data-testid="input-campaign-name"
                />
              </div>
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  required 
                  data-testid="input-campaign-subject"
                />
              </div>
              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  rows={10}
                  required 
                  data-testid="textarea-campaign-content"
                />
              </div>
              <div>
                <Label>Email Templates (Click to use)</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {emailTemplates.map((template, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className="justify-start text-left h-auto p-3"
                      onClick={() => {
                        const form = document.getElementById("content") as HTMLTextAreaElement;
                        if (form) {
                          form.value = template.content;
                        }
                        const subjectForm = document.getElementById("subject") as HTMLInputElement;
                        if (subjectForm) {
                          subjectForm.value = template.subject;
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.subject}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger data-testid="select-campaign-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  This campaign will be sent to all {(subscribers as NewsletterSubscriber[]).length} newsletter subscribers.
                </p>
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
                  disabled={createCampaignMutation.isPending}
                  data-testid="button-submit-campaign"
                >
                  {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns" data-testid="tab-campaigns">
            <Mail className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="subscribers" data-testid="tab-subscribers">
            <Users className="h-4 w-4 mr-2" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-email-analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns ({(campaigns as EmailCampaign[]).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(campaigns as EmailCampaign[]).map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.recipients?.length || 0}</TableCell>
                      <TableCell>
                        {campaign.openRate ? `${(campaign.openRate * 100).toFixed(1)}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-view-campaign-${campaign.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{campaign.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Subject</h4>
                                  <p>{campaign.subject}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Content Preview</h4>
                                  <div className="bg-gray-50 p-4 rounded max-h-60 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm">
                                      {campaign.content}
                                    </pre>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Status</h4>
                                    <Badge className={getStatusColor(campaign.status)}>
                                      {campaign.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Recipients</h4>
                                    <p>{campaign.recipients?.length || 0} subscribers</p>
                                  </div>
                                </div>
                                {campaign.status === "sent" && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Open Rate</h4>
                                      <p>{campaign.openRate ? `${(campaign.openRate * 100).toFixed(1)}%` : "N/A"}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Click Rate</h4>
                                      <p>{campaign.clickRate ? `${(campaign.clickRate * 100).toFixed(1)}%` : "N/A"}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {campaign.status === "draft" && (
                            <>
                              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCampaign(campaign)}
                                    data-testid={`button-edit-campaign-${campaign.id}`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Edit Campaign</DialogTitle>
                                  </DialogHeader>
                                  {selectedCampaign && (
                                    <form onSubmit={handleUpdateCampaign} className="space-y-4">
                                      <div>
                                        <Label htmlFor="editName">Campaign Name</Label>
                                        <Input
                                          id="editName"
                                          name="name"
                                          defaultValue={selectedCampaign.name}
                                          required
                                          data-testid="input-edit-campaign-name"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="editSubject">Email Subject</Label>
                                        <Input
                                          id="editSubject"
                                          name="subject"
                                          defaultValue={selectedCampaign.subject}
                                          required
                                          data-testid="input-edit-campaign-subject"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="editContent">Email Content</Label>
                                        <Textarea
                                          id="editContent"
                                          name="content"
                                          rows={10}
                                          defaultValue={selectedCampaign.content}
                                          required
                                          data-testid="textarea-edit-campaign-content"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="editStatus">Status</Label>
                                        <Select name="status" defaultValue={selectedCampaign.status}>
                                          <SelectTrigger data-testid="select-edit-campaign-status">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setIsEditDialogOpen(false)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          type="submit"
                                          disabled={updateCampaignMutation.isPending}
                                          data-testid="button-update-campaign"
                                        >
                                          {updateCampaignMutation.isPending ? "Updating..." : "Update Campaign"}
                                        </Button>
                                      </div>
                                    </form>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendCampaignMutation.mutate(campaign.id)}
                                disabled={sendCampaignMutation.isPending}
                                data-testid={`button-send-campaign-${campaign.id}`}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                            disabled={deleteCampaignMutation.isPending}
                            data-testid={`button-delete-campaign-${campaign.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers ({(subscribers as NewsletterSubscriber[]).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(subscribers as NewsletterSubscriber[]).map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card data-testid="metric-total-subscribers">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(subscribers as NewsletterSubscriber[]).length}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card data-testid="metric-campaigns-sent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(campaigns as EmailCampaign[]).filter(c => c.status === "sent").length}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  This month
                </div>
              </CardContent>
            </Card>

            <Card data-testid="metric-avg-open-rate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  Above industry average
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}