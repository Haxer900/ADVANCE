import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useScrollAnimation, useParallax } from "@/hooks/use-scroll-animation";
import type { Product, Category } from "@shared/schema";
import ProductCard from "@/components/product-card";
import { ArrowRight, Star, Sparkles, ShoppingBag, Heart, TrendingUp } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const heroRef = useScrollAnimation();
  const featuredRef = useScrollAnimation();
  const categoriesRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const newsletterRef = useScrollAnimation();
  const parallaxRef = useParallax();

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products/featured"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const newsletterMutation = useMutation({
    mutationFn: (data: { email: string }) => 
      apiRequest("/api/newsletter", "POST", data),
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate({ email });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div 
          ref={parallaxRef}
          className="absolute inset-0 bg-white parallax-element"
        ></div>
        
        <div 
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-reveal"
        >
          <div className="floating-animation">
            <h1 className="font-poppins text-6xl md:text-8xl lg:text-9xl font-bold text-zenthra-primary mb-8 tracking-tight">
              ZENTHRA
            </h1>
            <p className="text-xl md:text-3xl text-zenthra-gray mb-12 max-w-4xl mx-auto leading-relaxed">
              Where premium meets perfection. Discover collections that define your lifestyle and elevate every moment.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up">
            <Link href="/products">
              <Button className="text-white hover:bg-zenthra-gold text-xl px-16 py-8 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl traveling-border">
                <ShoppingBag className="w-6 h-6 mr-3" />
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-zenthra-primary/10 rounded-full floating-animation blur-sm"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-zenthra-primary/5 rounded-full floating-animation blur-sm" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-zenthra-primary/15 rounded-full floating-animation blur-sm" style={{animationDelay: '4s'}}></div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={categoriesRef}
            className="text-center mb-20 scroll-reveal"
          >
            <h2 className="font-poppins text-5xl md:text-6xl font-bold text-zenthra-primary mb-6 gradient-text breathing-effect">
              Make Your Choice
            </h2>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              Curated collections for every aspect of your lifestyle
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(categories as Category[] || []).map((category, index) => (
                <Link key={category.id} href={`/products?category=${category.name}`}>
                  <Card className="group border-0 shadow-lg overflow-hidden">
                    <div className="relative h-80">
                      <img
                        src={category.imageUrl || '/placeholder-image.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zenthra-primary/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-poppins text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-4">
                          {category.description}
                        </p>
                        <Button className="btn-white text-sm">
                          Explore
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

      {/* Featured Products */}
      <section className="py-32 bg-zenthra-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={featuredRef}
            className="text-center mb-20 scroll-reveal"
          >
            <div className="flex items-center justify-center mb-6">
              <h2 className="font-poppins text-5xl md:text-6xl font-bold text-zenthra-primary gradient-text">
                Zenthra's Eternal Elegance
              </h2>
            </div>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              Hand-picked selections from our premium collection
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {(featuredProducts as Product[] || []).slice(0, 8).map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/products">
                  <Button className="btn-secondary text-lg px-12 py-6">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View All Products
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={aboutRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-reveal"
          >
            <div className="slide-in-left">
              <h2 className="font-poppins text-5xl md:text-6xl font-bold text-zenthra-primary mb-8">
                Crafted for Excellence
              </h2>
              <p className="text-xl text-zenthra-gray mb-8 leading-relaxed">
                Every piece in our collection tells a story of excellence, from the finest materials to the most skilled artisans. We believe in creating not just products, but experiences that enrich your daily life.
              </p>
              <p className="text-lg text-zenthra-gray mb-12 leading-relaxed">
                Our commitment to quality and sustainability ensures that each purchase contributes to a better world while elevating your lifestyle.
              </p>
              <Link href="/our-story">
                <Button className="text-white hover:bg-zenthra-gold text-lg px-12 py-6 rounded-3xl transition-all duration-300 traveling-border">
                  <Heart className="w-5 h-5 mr-2" />
                  Discover Our Story
                </Button>
              </Link>
            </div>
            
            <div className="slide-in-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-zenthra-primary/20 to-zenthra-gold/20 rounded-3xl blur-lg opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Premium craftsmanship" 
                  className="relative rounded-3xl shadow-2xl w-full card-3d"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={newsletterRef}
            className="text-center scroll-reveal"
          >
            <div className="border-2 border-zenthra-primary/10 rounded-3xl p-12 md:p-16 shadow-lg">
              <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-6">
                Stay in the Loop
              </h2>
              <p className="text-xl text-zenthra-gray mb-12 max-w-2xl mx-auto">
                Be the first to discover new collections, exclusive offers, and insider stories from the world of MORE THAN FASHION
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 text-lg rounded-3xl border-2 border-zenthra-primary/20 focus:border-zenthra-primary focus:ring-zenthra-primary"
                  required
                />
                <Button 
                  type="submit"
                  disabled={newsletterMutation.isPending}
                  className="bg-zenthra-primary text-white hover:bg-zenthra-gold px-8 py-4 text-lg rounded-3xl transition-all duration-300"
                >
                  {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              
              <p className="text-sm text-zenthra-gray mt-6">
                Join 10,000+ subscribers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}