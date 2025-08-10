import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category } from "@shared/schema";

export default function Collections() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

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
              Our Collections
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collections, each designed to elevate your style and express your unique personality.
            </p>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(categories as Category[] || []).map((category) => (
                <Link key={category.id} href={`/products?category=${category.name}`}>
                  <Card className="group border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-80">
                      <img
                        src={category.imageUrl || '/placeholder-image.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zenthra-primary/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-poppins text-3xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-lg mb-4">
                          {category.description}
                        </p>
                        <Button className="bg-white text-zenthra-primary hover:bg-zenthra-gold hover:text-white">
                          Explore Collection
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-8">
                Featured Collection
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Our seasonal highlight features the finest pieces from across all collections. Each item has been carefully selected to represent the pinnacle of design, quality, and craftsmanship.
              </p>
              <p className="text-lg text-zenthra-gray mb-8 leading-relaxed">
                From timeless classics to contemporary statements, this collection offers something extraordinary for every occasion and style preference.
              </p>
              <Link href="/products?featured=true">
                <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
                  Shop Featured Items
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Featured Collection" 
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}