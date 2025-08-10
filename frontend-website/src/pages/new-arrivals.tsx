import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { Product } from "@shared/schema";

export default function NewArrivals() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Get the newest products (last 8)
  const newProducts = (products as Product[] || [])
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-zenthra-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-zenthra-gold mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-poppins text-5xl md:text-6xl font-bold mb-6">
              New Arrivals
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Discover the latest additions to our collection. Fresh designs, innovative styles, and timeless elegance await.
            </p>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-6">
              Latest Pieces
            </h2>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              Be the first to own our newest creations
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {newProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-6">
              Coming Soon
            </h2>
            <p className="text-xl text-zenthra-gray mb-12 max-w-3xl mx-auto">
              Stay tuned for our upcoming collections. Subscribe to our newsletter to be notified when new pieces arrive.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="w-16 h-16 bg-zenthra-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">S</span>
                </div>
                <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                  Spring Collection
                </h3>
                <p className="text-zenthra-gray">
                  Fresh, vibrant pieces perfect for the new season. Expected launch: March 2025.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="w-16 h-16 bg-zenthra-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                  Limited Edition
                </h3>
                <p className="text-zenthra-gray">
                  Exclusive pieces in limited quantities. For the truly discerning customer.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="w-16 h-16 bg-zenthra-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                  Accessories Line
                </h3>
                <p className="text-zenthra-gray">
                  Complete your look with our carefully curated accessories collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}