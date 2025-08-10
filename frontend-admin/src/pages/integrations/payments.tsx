import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Settings, CheckCircle, AlertCircle, Key, Zap } from "lucide-react";

const paymentProviders = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments worldwide with cards, wallets, and local payment methods',
    logo: '🟣',
    fields: [
      { key: 'publicKey', label: 'Publishable Key', type: 'text', placeholder: 'pk_test_...' },
      { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_test_...' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' }
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Global payment solution trusted by millions of merchants',
    logo: '🔵',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Client ID' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Client Secret' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] }
    ]
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'India\'s leading payment gateway with 100+ payment methods',
    logo: '🔷',
    fields: [
      { key: 'keyId', label: 'Key ID', type: 'text', placeholder: 'rzp_test_...' },
      { key: 'keySecret', label: 'Key Secret', type: 'password', placeholder: 'Key Secret' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', placeholder: 'Webhook Secret' }
    ]
  }
];

export default function PaymentIntegrations() {
  const [activeProvider, setActiveProvider] = useState('stripe');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations } = useQuery({
    queryKey: ["/api/admin/integrations"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("GET", "/api/admin/integrations", undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ name, config }: { name: string; config: any }) => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("PUT", `/api/admin/integrations/${name}`, {
        config,
        isActive: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/integrations"] });
      toast({
        title: "Success",
        description: `${variables.name} integration updated successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive",
      });
    },
  });

  const handleConfigChange = (provider: string, field: string, value: string) => {
    setConfigurations(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const handleSaveConfiguration = (provider: any) => {
    const config = configurations[provider.id] || {};
    updateIntegrationMutation.mutate({
      name: provider.id,
      config
    });
  };

  const getIntegrationStatus = (providerId: string) => {
    const integration = integrations?.find((i: any) => i.name === providerId);
    return integration?.isActive || false;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Payment Gateways</h1>
        <p className="text-neutral-400">Configure payment providers for your store</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Selection */}
        <div className="lg:col-span-1">
          <Card className="bg-neutral-800/50 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Providers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {paymentProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant={activeProvider === provider.id ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-4 ${
                    activeProvider === provider.id
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                      : "text-neutral-300 hover:bg-neutral-700"
                  }`}
                  onClick={() => setActiveProvider(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{provider.logo}</span>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{provider.name}</span>
                        {getIntegrationStatus(provider.id) && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs opacity-70 mt-1">{provider.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="bg-neutral-800/50 border-neutral-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Active Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{provider.logo}</span>
                      <span className="text-white text-sm">{provider.name}</span>
                    </div>
                    <Badge
                      variant={getIntegrationStatus(provider.id) ? "default" : "secondary"}
                      className={getIntegrationStatus(provider.id) ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {getIntegrationStatus(provider.id) ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          {paymentProviders.map((provider) => (
            activeProvider === provider.id && (
              <Card key={provider.id} className="bg-neutral-800/50 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <span className="mr-2">{provider.logo}</span>
                    {provider.name} Configuration
                    {getIntegrationStatus(provider.id) && (
                      <Badge className="ml-auto bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-medium">Setup Instructions</h4>
                        <p className="text-blue-300/80 text-sm mt-1">
                          {provider.description}. Configure your API credentials below to start accepting payments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="credentials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-neutral-700">
                      <TabsTrigger value="credentials" className="data-[state=active]:bg-neutral-600">
                        Credentials
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="data-[state=active]:bg-neutral-600">
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="credentials" className="space-y-4">
                      {provider.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key} className="text-neutral-200 flex items-center">
                            <Key className="w-4 h-4 mr-2" />
                            {field.label}
                          </Label>
                          {field.type === 'select' ? (
                            <select
                              id={field.key}
                              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                              value={configurations[provider.id]?.[field.key] || ''}
                              onChange={(e) => handleConfigChange(provider.id, field.key, e.target.value)}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              id={field.key}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="bg-neutral-700 border-neutral-600 text-white"
                              value={configurations[provider.id]?.[field.key] || ''}
                              onChange={(e) => handleConfigChange(provider.id, field.key, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-neutral-200">Enable in Production</Label>
                            <p className="text-sm text-neutral-400">Use this provider for live transactions</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-neutral-200">Auto-capture Payments</Label>
                            <p className="text-sm text-neutral-400">Automatically capture authorized payments</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-neutral-200">Send Payment Receipts</Label>
                            <p className="text-sm text-neutral-400">Email receipts to customers</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex space-x-3 pt-4 border-t border-neutral-700">
                    <Button
                      onClick={() => handleSaveConfiguration(provider)}
                      className="bg-amber-500 hover:bg-amber-600 text-black"
                      disabled={updateIntegrationMutation.isPending}
                    >
                      {updateIntegrationMutation.isPending ? "Saving..." : "Save Configuration"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neutral-600 text-neutral-300"
                    >
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
}