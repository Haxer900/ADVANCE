import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CouponInputProps {
  onCouponApplied: (discount: { type: string; value: number; code: string }) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: { type: string; value: number; code: string } | null;
  orderTotal: number;
}

export function CouponInput({ 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon, 
  orderTotal 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const validateCoupon = useMutation({
    mutationFn: (code: string) => fetch(`/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderTotal })
    }).then(res => res.json()),
    onSuccess: (data: any) => {
      onCouponApplied(data);
      setCouponCode("");
      setIsExpanded(false);
      toast({
        title: "Coupon Applied!",
        description: `You saved ${data.type === 'percentage' ? `${data.value}%` : `$${data.value}`}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Coupon",
        description: error.message || "This coupon code is not valid or has expired.",
        variant: "destructive",
      });
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon.mutate(couponCode.toUpperCase());
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    toast({
      title: "Coupon Removed",
      description: "The discount has been removed from your order.",
    });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (orderTotal * appliedCoupon.value) / 100;
    } else {
      return appliedCoupon.value;
    }
  };

  if (appliedCoupon) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                Coupon Applied: {appliedCoupon.code}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            You saved ${calculateDiscount().toFixed(2)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        {!isExpanded ? (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full justify-start"
          >
            <Tag className="h-4 w-4 mr-2" />
            Have a coupon code?
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Enter Coupon Code</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code (e.g., SAVE25)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || validateCoupon.isPending}
                className="min-w-[80px]"
              >
                {validateCoupon.isPending ? "..." : "Apply"}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false);
                setCouponCode("");
              }}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}