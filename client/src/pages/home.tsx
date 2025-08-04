import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ArrowRight, Star } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ProductCard from "@/components/product-card";
import { testimonials } from "@/lib/data";
import type { Product, Category } from "@shared/schema";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products/featured"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380" 
            alt="Luxury fashion store interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Elevate Your Style
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
            Discover premium collections that define sophisticated living and timeless elegance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/products">
              <Button className="btn-primary px-8 py-4 text-lg font-semibold">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold btn-rounded transition-all duration-300">
                Explore Story
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-float">
          <ChevronDown className="h-8 w-8 opacity-70" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-zenthra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zenthra-black mb-4">
              Curated Collections
            </h2>
            <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
              Handpicked selections for the discerning lifestyle
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(categories as Category[])?.map((category: Category) => (
                <div key={category.id} className="group relative overflow-hidden bg-white rounded-lg shadow-lg hover-scale">
                  <img 
                    src={category.imageUrl || ""} 
                    alt={category.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-playfair text-2xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{category.description}</p>
                    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                      <button className="text-zenthra-gold font-semibold hover:underline">
                        Explore Collection <ArrowRight className="inline h-4 w-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zenthra-black mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
              Handcrafted excellence meets contemporary design
            </p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(featuredProducts as Product[])?.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="btn-secondary px-8 py-4 text-lg font-semibold">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 bg-zenthra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zenthra-black mb-6">
                The ZENTHRA Story
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Born from a passion for timeless elegance and contemporary sophistication, ZENTHRA represents the pinnacle of premium lifestyle products. Our carefully curated collections blend traditional craftsmanship with modern design sensibilities.
              </p>
              <p className="text-lg text-zenthra-gray mb-8 leading-relaxed">
                Every piece in our collection tells a story of excellence, from the finest materials to the most skilled artisans. We believe in creating not just products, but experiences that enrich your daily life.
              </p>
              <Link href="/about">
                <Button className="btn-primary px-8 py-4 text-lg font-semibold">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Elegant product display" 
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-playfair font-bold text-zenthra-black">25+</div>
                  <div className="text-sm text-zenthra-gray">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zenthra-black mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
              Trusted by families who value quality and elegance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-zenthra-light p-8 hover-scale">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="flex text-zenthra-gold mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-zenthra-gray italic mb-6">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-zenthra-black">{testimonial.name}</div>
                      <div className="text-sm text-zenthra-gray">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-zenthra-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and family-friendly events
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 text-black rounded-l-lg border-0 rounded-r-none focus:outline-none focus:ring-2 focus:ring-zenthra-gold"
                required
              />
              <Button 
                type="submit"
                disabled={newsletterMutation.isPending}
                className="btn-primary px-8 py-4 font-semibold rounded-r-2xl rounded-l-none"
              >
                {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            <p className="text-sm opacity-70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
