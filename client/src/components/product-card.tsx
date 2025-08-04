import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCartStore } from "./cart-store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { sessionId, incrementCartCount } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        sessionId,
      });
    },
    onSuccess: () => {
      incrementCartCount();
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="group bg-white border border-gray-100 overflow-hidden hover-scale shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <CardContent className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-zenthra-black mb-2 hover:text-zenthra-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-zenthra-gray text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-playfair text-xl font-bold text-zenthra-black">
            ${product.price}
          </span>
          <Button 
            onClick={() => addToCartMutation.mutate()}
            disabled={!product.inStock || addToCartMutation.isPending}
            className="btn-secondary"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
