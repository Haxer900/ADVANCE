import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  categories: Array<{ id: string; name: string }>;
  priceRange: [number, number];
}

interface Filters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
  sortBy: string;
}

export function ProductFilters({ onFiltersChange, categories, priceRange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: priceRange,
    inStock: false,
    featured: false,
    sortBy: "newest"
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilters({ categories: newCategories });
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      categories: [],
      priceRange: priceRange,
      inStock: false,
      featured: false,
      sortBy: "newest"
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.featured ? 1 : 0) +
    (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="name">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
          max={priceRange[1]}
          min={priceRange[0]}
          step={10}
          className="w-full"
        />
      </div>

      {/* Availability */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Featured */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Special</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.featured}
            onCheckedChange={(checked) => updateFilters({ featured: !!checked })}
          />
          <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
            Featured Products
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search to find exactly what you're looking for.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.categories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <Badge key={categoryId} variant="secondary" className="cursor-pointer">
                {category?.name}
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={() => toggleCategory(categoryId)}
                />
              </Badge>
            );
          })}
          {filters.inStock && (
            <Badge variant="secondary" className="cursor-pointer">
              In Stock
              <X 
                className="h-3 w-3 ml-1" 
                onClick={() => updateFilters({ inStock: false })}
              />
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="secondary" className="cursor-pointer">
              Featured
              <X 
                className="h-3 w-3 ml-1" 
                onClick={() => updateFilters({ featured: false })}
              />
            </Badge>
          )}
        </div>
      )}
    </>
  );
}