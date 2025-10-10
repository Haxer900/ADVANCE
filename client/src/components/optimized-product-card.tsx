import { memo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="group overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-500 performance-optimized bg-white dark:bg-gray-950">
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link href={`/product/${product.id}`}>
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
        </Link>
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Premium Featured badge */}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase backdrop-blur-sm shadow-lg">
              Featured
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors duration-300 cursor-pointer text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">₹{product.price.toLocaleString()}</span>
          
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5 font-medium">(4.0)</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
});

export default OptimizedProductCard;