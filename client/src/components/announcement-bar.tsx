import { useState } from "react";
import { X, Gift, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 px-4 relative animate-slide-in-top">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <Gift className="h-4 w-4" />
        <span>🎉 Free Shipping on Orders Over $100 | Flash Sale: 25% Off Premium Collection</span>
        <Truck className="h-4 w-4" />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-white hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}