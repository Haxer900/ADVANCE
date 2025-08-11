import { useState, useEffect, useRef } from "react";
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    <div className="min-h-screen bg-black animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden video-container">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Fallback background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zenthra-primary via-zenthra-secondary to-zenthra-gold opacity-80"></div>
          
          {/* Video Element */}
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ 
              filter: 'brightness(0.7)',
              opacity: videoLoaded ? 1 : 0
            }}
            onLoadedData={() => setVideoLoaded(true)}
            onError={(e) => {
              console.error('Video error:', e);
              setVideoLoaded(false);
            }}
          >
            <source src="https://res.cloudinary.com/dfittnogt/video/upload/v1754731899/A_high-quality__slow-motion_cinematic_video_of_a_stylish_female_fashion_model_walking_confidently_toward_the_camera_in_a_premium_indoor_studio_setting__wearing_elegant_modern_clothing_in_neutral_tones._The_backgroun_dbi0x2.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
        </div>
        
        <div 
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-reveal video-text-overlay"
        >
          <div>
            <h1 className="font-poppins text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight video-text-overlay">
              ZENTHRA
            </h1>
            <p className="text-xl md:text-3xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed video-text-overlay">
              Where premium meets perfection. Discover collections that define your lifestyle and elevate every moment.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up">
            <Link href="/products">
              <Button className="bg-white/90 backdrop-blur-sm text-zenthra-primary hover:bg-zenthra-primary hover:text-white text-xl px-16 py-8 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20">
                <ShoppingBag className="w-6 h-6 mr-3" />
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full floating-animation blur-sm"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full floating-animation blur-sm" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/15 rounded-full floating-animation blur-sm" style={{animationDelay: '4s'}}></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-zenthra-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div 
            ref={categoriesRef}
            className="text-center mb-20 scroll-reveal"
          >
            <h2 className="font-poppins text-5xl md:text-6xl font-bold text-white mb-6 relative">
              Make Your Choice
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-zenthra-secondary to-zenthra-gold rounded-full"></div>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mt-8">
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
      <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zenthra-secondary via-zenthra-gold to-rose-400 opacity-60"></div>
        <div className="absolute top-16 left-16 w-32 h-32 bg-zenthra-gold/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-16 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div 
            ref={featuredRef}
            className="text-center mb-20 scroll-reveal"
          >
            <div className="flex items-center justify-center mb-6">
              <h2 className="font-poppins text-5xl md:text-6xl font-bold text-white relative">
                Zenthra's Eternal Elegance
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-zenthra-secondary to-zenthra-gold rounded-full"></div>
              </h2>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mt-8">
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
      <section className="py-16 bg-gradient-to-bl from-gray-900 via-black to-gray-800 border-t border-gray-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-56 h-56 bg-rose-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-44 h-44 bg-zenthra-gold/20 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div 
            ref={aboutRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-reveal"
          >
            <div className="slide-in-left">
              <h2 className="font-poppins text-5xl md:text-6xl font-bold text-white mb-8 relative">
                Crafted for Excellence
                <div className="absolute -bottom-2 left-0 w-28 h-1 bg-gradient-to-r from-zenthra-secondary to-zenthra-gold rounded-full"></div>
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Every piece in our collection tells a story of excellence, from the finest materials to the most skilled artisans. We believe in creating not just products, but experiences that enrich your daily life.
              </p>
              <p className="text-lg text-white/70 mb-12 leading-relaxed">
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
      <section className="py-16 bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-gray-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-zenthra-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-52 h-52 bg-rose-400/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div 
            ref={newsletterRef}
            className="text-center scroll-reveal"
          >
            <div className="border-2 border-white/20 rounded-3xl p-12 md:p-16 shadow-lg bg-black/50 backdrop-blur-sm">
              <h2 className="font-poppins text-4xl md:text-5xl font-bold text-white mb-6 relative">
                Stay in the Loop
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-zenthra-secondary to-zenthra-gold rounded-full"></div>
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
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
              
              <p className="text-sm text-white/60 mt-6">
                Join 10,000+ subscribers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}