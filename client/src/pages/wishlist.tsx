import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useCartStore } from "@/components/cart-store";

export default function Wishlist() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addToCart } = useCartStore();

  const sessionId = localStorage.getItem("zenthra-session-id") || 
    (() => {
      const newId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("zenthra-session-id", newId);
      return newId;
    })();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["/api/wishlist", sessionId],
  });

  const removeFromWishlist = useMutation({
    mutationFn: (productId: string) => fetch(`/api/wishlist/${productId}`, {
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

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleMoveToCart = (product: any) => {
    handleAddToCart(product);
    removeFromWishlist.mutate(product.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const wishlistArray = Array.isArray(wishlistItems) ? wishlistItems : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistArray.length} item{wishlistArray.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
        </div>

        {wishlistArray.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlistArray.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love to easily find them later
            </p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Wishlist Items */
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }`}>
          {wishlistArray.map((item: any) => (
            <Card key={item.id} className={`group ${viewMode === "list" ? "flex" : ""}`}>
              <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center gap-4 flex-1" : ""}`}>
                <div className={`relative ${viewMode === "list" ? "w-24 h-24" : "aspect-square mb-4"}`}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {!item.product.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className={`font-semibold text-foreground hover:text-primary transition-colors ${
                      viewMode === "list" ? "text-lg" : "mb-2"
                    }`}>
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <p className={`text-muted-foreground text-sm ${viewMode === "list" ? "mb-2" : "mb-3"}`}>
                    {item.product.category}
                  </p>

                  <div className={`flex items-center justify-between ${viewMode === "list" ? "mb-4" : "mb-4"}`}>
                    <span className="text-lg font-bold">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                    {item.product.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>

                  <div className={`flex gap-2 ${viewMode === "list" ? "" : "flex-col"}`}>
                    <Button
                      onClick={() => handleMoveToCart(item.product)}
                      disabled={!item.product.inStock}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {viewMode === "list" ? "Add to Cart" : "Move to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist.mutate(item.product.id)}
                      disabled={removeFromWishlist.isPending}
                      className={viewMode === "list" ? "px-3" : ""}
                    >
                      <Trash2 className="h-4 w-4" />
                      {viewMode === "grid" && <span className="ml-2">Remove</span>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      {wishlistArray.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              wishlistArray.forEach((item: any) => {
                if (item.product.inStock) {
                  handleAddToCart(item.product);
                }
              });
              toast({
                title: "Items Added to Cart",
                description: `${wishlistArray.filter((item: any) => item.product.inStock).length} items moved to cart`,
              });
            }}
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add All Available Items to Cart
          </Button>
        </div>
      )}
    </div>
  );
}