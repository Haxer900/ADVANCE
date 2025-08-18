import { memo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { OptimizedImage } from './optimized-image';
import type { Product } from '@shared/schema';

interface OptimizedProductCardProps {
  product: Product;
  priority?: boolean;
}

export const OptimizedProductCard = memo(function OptimizedProductCard({ 
  product, 
  priority = false 
}: OptimizedProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 performance-optimized">
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link href={`/product/${product.id}`}>
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full"
            priority={priority}
          />
        </Link>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 text-black hover:bg-white"
            data-testid={`button-quick-add-${product.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 text-black hover:bg-white"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Sale badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">₹{product.price}</span>
          
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
});

export default OptimizedProductCard;