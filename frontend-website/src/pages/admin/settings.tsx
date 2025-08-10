import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings2,
  Palette,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  Shield,
  Bell,
  Database,
  Upload,
  Save,
  RefreshCw,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  announcementText: string;
  announcementActive: boolean;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  currency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  maintenanceMode: boolean;
  gdprCompliance: boolean;
  cookieConsent: boolean;
  termsOfService: string;
  privacyPolicy: string;
  returnPolicy: string;
  shippingPolicy: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "MORE THAN FASHION",
    siteDescription: "Premium luxury lifestyle products with exceptional quality and design",
    siteLogo: "/logo.png",
    primaryColor: "#1a1a1a",
    secondaryColor: "#d4af37",
    accentColor: "#f5f5f5",
    announcementText: "Free shipping on orders over ₹2,000",
    announcementActive: true,
    contactEmail: "support@morethanfashion.com",
    contactPhone: "+91 98765 43210",
    socialMedia: {
      facebook: "https://facebook.com/morethanfashion",
      twitter: "https://twitter.com/morethanfashion",
      instagram: "https://instagram.com/morethanfashion",
      linkedin: "https://linkedin.com/company/morethanfashion",
    },
    seo: {
      metaTitle: "MORE THAN FASHION - Premium Luxury Products",
      metaDescription: "Discover premium luxury products at MORE THAN FASHION. Quality craftsmanship, elegant design, and exceptional customer service.",
      keywords: "luxury, premium, fashion, lifestyle, quality, elegant",
    },
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en-IN",
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    gdprCompliance: true,
    cookieConsent: true,
    termsOfService: "Terms and conditions content here...",
    privacyPolicy: "Privacy policy content here...",
    returnPolicy: "Return policy content here...",
    shippingPolicy: "Shipping policy content here...",
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<SiteSettings>) => {
      return apiRequest("POST", "/api/admin/settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your site settings have been saved successfully.",
      });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleInputChange = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedInputChange = (
    parentKey: keyof SiteSettings,
    childKey: string,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey] as any, [childKey]: value }
    }));
  };

  return (
    <div className="space-y-6" data-testid="admin-settings">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
          className="btn-primary"
          data-testid="button-save-settings"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettingsMutation.isPending ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" data-testid="tab-general">
            <Settings2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" data-testid="tab-appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="contact" data-testid="tab-contact">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo">
            <Globe className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="legal" data-testid="tab-legal">
            <Shield className="h-4 w-4 mr-2" />
            Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                    data-testid="input-site-name"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  data-testid="textarea-site-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                  >
                    <SelectTrigger data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleInputChange("language", value)}
                  >
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-IN">English (India)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="hi-IN">Hindi</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  data-testid="switch-maintenance-mode"
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                {settings.maintenanceMode && (
                  <Badge variant="destructive">Site is in maintenance mode</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteLogo">Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="siteLogo"
                    value={settings.siteLogo}
                    onChange={(e) => handleInputChange("siteLogo", e.target.value)}
                    data-testid="input-logo-url"
                  />
                  <Button variant="outline" data-testid="button-upload-logo">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      className="w-20"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      placeholder="#1a1a1a"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      className="w-20"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      placeholder="#d4af37"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange("accentColor", e.target.value)}
                      className="w-20"
                      data-testid="input-accent-color"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange("accentColor", e.target.value)}
                      placeholder="#f5f5f5"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="announcementActive"
                    checked={settings.announcementActive}
                    onCheckedChange={(checked) => handleInputChange("announcementActive", checked)}
                    data-testid="switch-announcement"
                  />
                  <Label htmlFor="announcementActive">Show Announcement Bar</Label>
                </div>
                <Input
                  placeholder="Announcement text..."
                  value={settings.announcementText}
                  onChange={(e) => handleInputChange("announcementText", e.target.value)}
                  disabled={!settings.announcementActive}
                  data-testid="input-announcement-text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    data-testid="input-contact-phone"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">Social Media Links</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia.facebook}
                      onChange={(e) => handleNestedInputChange("socialMedia", "facebook", e.target.value)}
                      data-testid="input-facebook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialMedia.twitter}
                      onChange={(e) => handleNestedInputChange("socialMedia", "twitter", e.target.value)}
                      data-testid="input-twitter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia.instagram}
                      onChange={(e) => handleNestedInputChange("socialMedia", "instagram", e.target.value)}
                      data-testid="input-instagram"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.socialMedia.linkedin}
                      onChange={(e) => handleNestedInputChange("socialMedia", "linkedin", e.target.value)}
                      data-testid="input-linkedin"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.seo.metaTitle}
                  onChange={(e) => handleNestedInputChange("seo", "metaTitle", e.target.value)}
                  data-testid="input-meta-title"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.seo.metaDescription}
                  onChange={(e) => handleNestedInputChange("seo", "metaDescription", e.target.value)}
                  data-testid="textarea-meta-description"
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={settings.seo.keywords}
                  onChange={(e) => handleNestedInputChange("seo", "keywords", e.target.value)}
                  data-testid="input-keywords"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                  data-testid="switch-email-notifications"
                />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                  data-testid="switch-sms-notifications"
                />
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
                  data-testid="switch-push-notifications"
                />
                <Label htmlFor="pushNotifications">Push Notifications</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gdprCompliance"
                  checked={settings.gdprCompliance}
                  onCheckedChange={(checked) => handleInputChange("gdprCompliance", checked)}
                  data-testid="switch-gdpr"
                />
                <Label htmlFor="gdprCompliance">GDPR Compliance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cookieConsent"
                  checked={settings.cookieConsent}
                  onCheckedChange={(checked) => handleInputChange("cookieConsent", checked)}
                  data-testid="switch-cookie-consent"
                />
                <Label htmlFor="cookieConsent">Cookie Consent Banner</Label>
              </div>

              <Separator />

              <div>
                <Label htmlFor="termsOfService">Terms of Service</Label>
                <Textarea
                  id="termsOfService"
                  rows={6}
                  value={settings.termsOfService}
                  onChange={(e) => handleInputChange("termsOfService", e.target.value)}
                  data-testid="textarea-terms"
                />
              </div>
              <div>
                <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                <Textarea
                  id="privacyPolicy"
                  rows={6}
                  value={settings.privacyPolicy}
                  onChange={(e) => handleInputChange("privacyPolicy", e.target.value)}
                  data-testid="textarea-privacy"
                />
              </div>
              <div>
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  rows={4}
                  value={settings.returnPolicy}
                  onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
                  data-testid="textarea-return-policy"
                />
              </div>
              <div>
                <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                <Textarea
                  id="shippingPolicy"
                  rows={4}
                  value={settings.shippingPolicy}
                  onChange={(e) => handleInputChange("shippingPolicy", e.target.value)}
                  data-testid="textarea-shipping-policy"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}