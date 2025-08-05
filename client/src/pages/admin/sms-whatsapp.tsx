import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MessageSquare,
  Phone,
  Send,
  Users,
  Settings,
  BarChart3,
  Bell,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSMSWhatsApp() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState("sms");
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const { toast } = useToast();

  const smsTemplates = [
    {
      id: "order-confirmation",
      name: "Order Confirmation",
      content: "Hi [NAME], your order #[ORDER_ID] has been confirmed. Total: ₹[AMOUNT]. Track: [LINK]",
      active: true,
    },
    {
      id: "shipping-update",
      name: "Shipping Update",
      content: "Your order #[ORDER_ID] has been shipped. Tracking: [TRACKING_NUMBER]. Expected delivery: [DATE]",
      active: true,
    },
    {
      id: "delivery-notification",
      name: "Delivery Notification",
      content: "Your order #[ORDER_ID] has been delivered! Thank you for shopping with ZENTHRA.",
      active: false,
    },
  ];

  const whatsappTemplates = [
    {
      id: "welcome-message",
      name: "Welcome Message",
      content: "Welcome to ZENTHRA! 🎉 Discover premium luxury products with exceptional quality. Shop now: [STORE_LINK]",
      active: true,
    },
    {
      id: "abandoned-cart",
      name: "Abandoned Cart",
      content: "Hi [NAME], you left items in your cart! Complete your order now and get free shipping on orders over ₹2,000. [CART_LINK]",
      active: true,
    },
    {
      id: "promotional-offer",
      name: "Promotional Offer",
      content: "🔥 Special offer for you! Get 20% off on your next purchase. Use code: SAVE20. Valid till [DATE]. Shop now: [LINK]",
      active: false,
    },
  ];

  const campaignStats = [
    {
      type: "SMS",
      sent: 1250,
      delivered: 1198,
      failed: 52,
      deliveryRate: 95.8,
    },
    {
      type: "WhatsApp",
      sent: 850,
      delivered: 830,
      failed: 20,
      deliveryRate: 97.6,
    },
  ];

  const handleConfigureService = (service: string) => {
    toast({
      title: `${service} Configuration`,
      description: `${service} service configuration saved successfully.`,
    });
    setIsConfigured(true);
  };

  const handleSendCampaign = (type: string) => {
    toast({
      title: "Campaign Sent",
      description: `${type} campaign has been sent successfully.`,
    });
    setIsCreateCampaignOpen(false);
  };

  return (
    <div className="space-y-6" data-testid="admin-sms-whatsapp">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SMS & WhatsApp Marketing</h1>
        <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="button-create-campaign">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create SMS/WhatsApp Campaign</DialogTitle>
              <DialogDescription>
                Send targeted messages to your customers via SMS or WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Campaign Type</Label>
                <Select defaultValue="sms">
                  <SelectTrigger data-testid="select-campaign-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Enter your message..."
                  rows={4}
                  data-testid="textarea-campaign-message"
                />
              </div>
              <div>
                <Label>Target Audience</Label>
                <Select defaultValue="all">
                  <SelectTrigger data-testid="select-target-audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="recent">Recent Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="abandoned">Abandoned Cart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateCampaignOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSendCampaign("SMS")}
                  data-testid="button-send-campaign"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Configuration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              SMS Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Service Status</span>
              <Badge variant={isConfigured ? "default" : "secondary"}>
                {isConfigured ? "Configured" : "Not Configured"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>SMS Provider</Label>
              <Select defaultValue="twilio">
                <SelectTrigger data-testid="select-sms-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws">AWS SNS</SelectItem>
                  <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                  <SelectItem value="textlocal">TextLocal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter your API key..."
                data-testid="input-sms-api-key"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+91 98765 43210"
                data-testid="input-sms-phone"
              />
            </div>
            <Button
              onClick={() => handleConfigureService("SMS")}
              className="w-full"
              data-testid="button-configure-sms"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure SMS
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Service Status</span>
              <Badge variant={isConfigured ? "default" : "secondary"}>
                {isConfigured ? "Configured" : "Not Configured"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Provider</Label>
              <Select defaultValue="twilio">
                <SelectTrigger data-testid="select-whatsapp-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="whatsapp-business">WhatsApp Business API</SelectItem>
                  <SelectItem value="360dialog">360Dialog</SelectItem>
                  <SelectItem value="clickatell">Clickatell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Token</Label>
              <Input
                type="password"
                placeholder="Enter your API token..."
                data-testid="input-whatsapp-token"
              />
            </div>
            <div className="space-y-2">
              <Label>Business Phone Number</Label>
              <Input
                placeholder="+91 98765 43210"
                data-testid="input-whatsapp-phone"
              />
            </div>
            <Button
              onClick={() => handleConfigureService("WhatsApp")}
              className="w-full"
              data-testid="button-configure-whatsapp"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {campaignStats.map((stat, index) => (
          <Card key={index} data-testid={`metric-${stat.type.toLowerCase()}-stats`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.type} Messages</CardTitle>
              {stat.type === "SMS" ? (
                <Phone className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.sent}</div>
              <div className="text-xs text-muted-foreground">
                {stat.deliveryRate}% delivery rate
              </div>
            </CardContent>
          </Card>
        ))}
        <Card data-testid="metric-total-reach">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,100</div>
            <div className="text-xs text-muted-foreground">
              Unique customers reached
            </div>
          </CardContent>
        </Card>
        <Card data-testid="metric-engagement-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <div className="text-xs text-muted-foreground">
              Click-through rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Management */}
      <Tabs defaultValue="sms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sms" data-testid="tab-sms-templates">
            <Phone className="h-4 w-4 mr-2" />
            SMS Templates
          </TabsTrigger>
          <TabsTrigger value="whatsapp" data-testid="tab-whatsapp-templates">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smsTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.active}
                        data-testid={`switch-sms-template-${template.id}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-sms-template-${template.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whatsappTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.active}
                        data-testid={`switch-whatsapp-template-${template.id}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-whatsapp-template-${template.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaign Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "SMS",
                message: "Order confirmation sent to 45 customers",
                status: "delivered",
                time: "2 minutes ago",
              },
              {
                type: "WhatsApp",
                message: "Promotional campaign sent to VIP customers",
                status: "pending",
                time: "15 minutes ago",
              },
              {
                type: "SMS",
                message: "Shipping updates sent to 32 customers",
                status: "delivered",
                time: "1 hour ago",
              },
              {
                type: "WhatsApp",
                message: "Abandoned cart reminder campaign",
                status: "failed",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === "SMS" ? (
                    <Phone className="h-5 w-5 text-blue-600" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.type}</Badge>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === "delivered" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {activity.status === "pending" && (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  {activity.status === "failed" && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}