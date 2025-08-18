import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingBag, Heart, Share2, ArrowLeft, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useCartStore } from "@/components/cart-store";
import { useToast } from "@/hooks/use-toast";
import { WishlistButton } from "@/components/wishlist-button";
import { ProductReviews } from "@/components/product-reviews";
import { RecentlyViewed } from "@/components/recently-viewed";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { sessionId, incrementCartCount } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Track recently viewed
  useEffect(() => {
    if (params?.id && sessionId) {
      fetch(`/api/recently-viewed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: params.id, userId: sessionId })
      }).catch(() => {}); // Silent fail
    }
  }, [params?.id, sessionId]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
  }) as { data: Product | undefined; isLoading: boolean };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        productId: params?.id,
        quantity,
        sessionId,
      });
    },
    onSuccess: () => {
      incrementCartCount();
      toast({
        title: "Added to cart!",
        description: `${quantity} ${product?.name}(s) added to your cart.`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zenthra-black mb-4">Product Not Found</h1>
          <p className="text-zenthra-gray">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
              <h1 className="font-playfair text-4xl font-bold text-zenthra-black mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-playfair font-bold text-zenthra-black mb-6">
                ₹{product.price}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-zenthra-black mb-4">Description</h2>
              <p className="text-zenthra-gray leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-zenthra-black mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-lg font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button 
                onClick={() => addToCartMutation.mutate()}
                disabled={!product.inStock || addToCartMutation.isPending}
                className="w-full btn-secondary h-14 text-lg font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? "Adding to Cart..." : "Add to Cart"}
              </Button>
              
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1 h-12 btn-rounded">
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1 h-12 btn-rounded">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zenthra-black mb-4">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zenthra-gray">Availability:</span>
                    <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zenthra-gray">Category:</span>
                    <span className="text-zenthra-black">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zenthra-gray">SKU:</span>
                    <span className="text-zenthra-black">{product.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
