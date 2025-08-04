import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import { useState, useMemo } from "react";
import type { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFromUrl = urlParams.get('category');
  const featuredFromUrl = urlParams.get('featured');

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filter by featured if specified in URL
    if (featuredFromUrl === 'true') {
      filtered = filtered.filter((product: Product) => product.featured);
    }

    // Filter by category from URL or dropdown
    const activeCategory = categoryFromUrl || (selectedCategory !== "all" ? selectedCategory : null);
    if (activeCategory) {
      filtered = filtered.filter((product: Product) => product.category === activeCategory);
    }

    // Sort products
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, categoryFromUrl, featuredFromUrl, selectedCategory, sortBy]);

  const pageTitle = useMemo(() => {
    if (featuredFromUrl === 'true') return "New Arrivals";
    if (categoryFromUrl) return categoryFromUrl;
    return "All Products";
  }, [categoryFromUrl, featuredFromUrl]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-zenthra-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-zenthra-black text-center">
            {pageTitle}
          </h1>
          <p className="text-xl text-zenthra-gray text-center mt-4 max-w-2xl mx-auto">
            Discover our premium collection of carefully curated products
          </p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-zenthra-gray font-medium">Filter by:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-zenthra-gray font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zenthra-gray text-lg mb-4">No products found matching your criteria.</p>
                <Button onClick={() => {
                  setSelectedCategory("all");
                  setSortBy("name");
                }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="text-center mt-12">
            <p className="text-zenthra-gray">
              Showing {filteredAndSortedProducts.length} of {products?.length || 0} products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
