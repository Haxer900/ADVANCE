import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCartStore } from "./cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
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
    <Card className="group overflow-hidden hover-lift card-3d border-0 shadow-lg bg-zenthra-white">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-zenthra-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-zenthra-secondary to-zenthra-accent text-white px-4 py-2 rounded-full text-sm font-semibold pulse-glow">
              Featured
            </span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-poppins text-xl font-semibold text-zenthra-primary mb-2 group-hover:gradient-text transition-all duration-300 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-zenthra-gray text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-poppins text-2xl font-bold text-zenthra-primary gradient-text">
            {formatCurrency(product.price)}
          </span>
          <Button 
            onClick={() => addToCartMutation.mutate()}
            disabled={!product.inStock || addToCartMutation.isPending}
            className="btn-primary text-sm px-6 py-3"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
