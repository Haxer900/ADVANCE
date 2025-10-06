import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useCartStore } from "@/components/cart-store";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, Product } from "@shared/schema";

export default function Cart() {
  const { sessionId, setCartCount } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading: cartLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item.",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      setCartCount(Math.max(0, ((cartItems as CartItem[])?.length || 1) - 1));
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });

  const cartItemsWithProducts = useMemo(() => {
    if (!cartItems || !products) return [];
    
    return (cartItems as CartItem[]).map((cartItem: CartItem) => {
      const product = (products as Product[]).find((p: Product) => p.id === cartItem.productId);
      return { ...cartItem, product };
    }).filter(item => item.product);
  }, [cartItems, products]);

  const totalPrice = useMemo(() => {
    return cartItemsWithProducts.reduce((total, item) => {
      if (!item.product) return total;
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  }, [cartItemsWithProducts]);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || (cartItems as CartItem[]).length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-zenthra-gray mx-auto mb-8" />
            <h1 className="font-playfair text-4xl font-bold text-zenthra-black mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-zenthra-gray mb-8">
              Discover our premium collections and find something you love.
            </p>
            <Link href="/products">
              <Button className="btn-primary px-8 py-4 text-lg font-semibold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-playfair text-4xl font-bold text-zenthra-black mb-8">
          Shopping Cart
        </h1>

        <div className="space-y-6">
          {cartItemsWithProducts.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-zenthra-black mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-zenthra-gray mb-2">
                      {item.product.category}
                    </p>
                    <p className="text-xl font-playfair font-bold text-zenthra-black">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => updateCartMutation.mutate({ 
                          id: item.id, 
                          quantity: Math.max(1, item.quantity - 1) 
                        })}
                        className="h-10 w-10"
                        disabled={updateCartMutation.isPending}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-lg font-semibold min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => updateCartMutation.mutate({ 
                          id: item.id, 
                          quantity: item.quantity + 1 
                        })}
                        className="h-10 w-10"
                        disabled={updateCartMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromCartMutation.mutate(item.id)}
                      className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={removeFromCartMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-playfair font-bold text-zenthra-black">
                      {formatCurrency(parseFloat(item.product.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-zenthra-black">Total:</span>
              <span className="text-3xl font-playfair font-bold text-zenthra-black">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            
            <div className="space-y-4">
              <Link href="/checkout">
                <Button className="w-full btn-secondary h-14 text-lg font-semibold" data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full h-12 btn-rounded">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
