import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import { Link } from "wouter";

export function RecentlyViewed() {
  const sessionId = localStorage.getItem("zenthra-session-id");
  
  const { data: recentlyViewed = [], isLoading } = useQuery({
    queryKey: ["/api/recently-viewed", sessionId],
    enabled: !!sessionId,
  });

  const recentlyViewedArray = Array.isArray(recentlyViewed) ? recentlyViewed : [];
  
  if (isLoading || !recentlyViewedArray.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentlyViewedArray.slice(0, 4).map((item: any) => (
            <Link key={item.id} href={`/product/${item.product.id}`} className="group">
              <div className="relative">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-24 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Recent
                  </Badge>
                </div>
              </div>
              <h4 className="font-medium text-sm mt-2 line-clamp-2 group-hover:text-primary">
                {item.product.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                ${parseFloat(item.product.price).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}