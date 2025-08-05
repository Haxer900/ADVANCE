import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function WishlistButton({ productId, size = "default", className = "" }: WishlistButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For now, we'll use sessionId as userId since we don't have auth yet
  const sessionId = localStorage.getItem("zenthra-session-id") || 
    (() => {
      const newId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("zenthra-session-id", newId);
      return newId;
    })();

  const { data: wishlist = [] } = useQuery({
    queryKey: ["/api/wishlist", sessionId],
  });

  const isInWishlist = Array.isArray(wishlist) && wishlist.some((item: any) => item.productId === productId);

  const addToWishlist = useMutation({
    mutationFn: () => fetch(`/api/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: sessionId })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist", sessionId] });
      toast({
        title: "Added to Wishlist",
        description: "Product saved to your wishlist",
      });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: () => fetch(`/api/wishlist/${productId}`, {
      method: "DELETE"
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist", sessionId] });
      toast({
        title: "Removed from Wishlist",
        description: "Product removed from your wishlist",
      });
    },
  });

  const handleClick = () => {
    if (isInWishlist) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
      className={`${className} transition-colors duration-200`}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
      />
      <span className="sr-only">
        {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      </span>
    </Button>
  );
}