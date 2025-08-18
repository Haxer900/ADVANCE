import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Package, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useCartStore } from "@/components/cart-store";
import { CouponInput } from "@/components/coupon-input";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone number is required"),
  paymentMethod: z.enum(["card", "paypal", "apple-pay"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
  billingAddressSame: z.boolean().default(true),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const { sessionId, cartCount } = useCartStore();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
  });

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
      billingAddressSame: true,
    },
  });

  const placeOrder = useMutation({
    mutationFn: (orderData: any) => fetch(`/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${data.id} has been confirmed.`,
      });
      setLocation(`/order-confirmation/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order.",
        variant: "destructive",
      });
    },
  });

  const cartArray = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = cartArray.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value / 100) : appliedCoupon.value)
    : 0;
  const total = subtotal + shipping + tax - couponDiscount;

  const onSubmit = (data: CheckoutForm) => {
    const orderData = {
      ...data,
      sessionId,
      items: cartArray,
      subtotal,
      shipping,
      tax,
      couponDiscount,
      total,
      couponCode: appliedCoupon?.code || null,
    };
    
    placeOrder.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartArray.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart to proceed with checkout
            </p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order ({cartCount} item{cartCount !== 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: "Shipping", icon: Truck },
            { step: 2, label: "Payment", icon: CreditCard },
            { step: 3, label: "Review", icon: Check },
          ].map(({ step: stepNum, label, icon: Icon }) => (
            <div key={stepNum} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${
                step >= stepNum ? "text-primary" : "text-muted-foreground"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
              {stepNum < 3 && (
                <div className={`w-8 h-px ${
                  step > stepNum ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="your@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        placeholder="John"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        placeholder="Doe"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...form.register("address")}
                      placeholder="123 Main Street"
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...form.register("city")}
                        placeholder="New York"
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...form.register("state")}
                        placeholder="NY"
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        {...form.register("zipCode")}
                        placeholder="10001"
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      placeholder="(555) 123-4567"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      {...form.register("notes")}
                      placeholder="Any special instructions for your order..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={form.watch("paymentMethod")}
                    onValueChange={(value) => form.setValue("paymentMethod", value as any)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                        PayPal (Coming Soon)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                      <RadioGroupItem value="apple-pay" id="apple-pay" disabled />
                      <Label htmlFor="apple-pay" className="flex items-center gap-2 cursor-pointer">
                        Apple Pay (Coming Soon)
                      </Label>
                    </div>
                  </RadioGroup>

                  {form.watch("paymentMethod") === "card" && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          {...form.register("cardName")}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          {...form.register("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            {...form.register("cardExpiry")}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            {...form.register("cardCvc")}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">
                          Your payment information is encrypted and secure
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billingAddressSame"
                      checked={form.watch("billingAddressSame")}
                      onCheckedChange={(checked) => 
                        form.setValue("billingAddressSame", !!checked)
                      }
                    />
                    <Label htmlFor="billingAddressSame" className="text-sm">
                      Billing address same as shipping address
                    </Label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {form.watch("email")}</p>
                    <p><strong>Name:</strong> {form.watch("firstName")} {form.watch("lastName")}</p>
                    <p><strong>Address:</strong> {form.watch("address")}, {form.watch("city")}, {form.watch("state")} {form.watch("zipCode")}</p>
                    <p><strong>Phone:</strong> {form.watch("phone")}</p>
                    <p><strong>Payment:</strong> {form.watch("paymentMethod") === "card" ? "Credit/Debit Card" : "PayPal"}</p>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                      id="terms"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={placeOrder.isPending}
                      className="flex-1"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {placeOrder.isPending ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartArray.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Input */}
                <CouponInput
                  onCouponApplied={setAppliedCoupon}
                  onCouponRemoved={() => setAppliedCoupon(null)}
                  appliedCoupon={appliedCoupon}
                  orderTotal={subtotal}
                />

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Shipping
                      {subtotal > 100 && (
                        <Badge variant="secondary" className="text-xs">
                          Free
                        </Badge>
                      )}
                    </span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal > 100 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      You qualify for free shipping!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}