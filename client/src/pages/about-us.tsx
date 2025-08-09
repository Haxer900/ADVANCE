import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Heart, Award, Users, Globe } from "lucide-react";

export default function AboutUs() {
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
              About ZENTHRA
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Where premium meets perfection. Discover our story of craftsmanship, quality, and timeless elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-8">
                Our Story
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Founded with a vision to redefine luxury fashion, ZENTHRA has been crafting exceptional pieces that embody elegance and sophistication. Our journey began with a simple belief: that true fashion transcends trends and creates lasting impressions.
              </p>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Every piece in our collection is carefully curated and crafted with attention to detail that speaks to our commitment to excellence. We believe in creating not just clothing, but experiences that elevate your lifestyle.
              </p>
              <p className="text-lg text-zenthra-gray leading-relaxed">
                From our atelier to your wardrobe, ZENTHRA represents the pinnacle of fashion innovation, sustainability, and timeless design.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="ZENTHRA craftsmanship" 
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-6">
              Our Values
            </h2>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg">
              <Award className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Excellence
              </h3>
              <p className="text-zenthra-gray">
                We pursue perfection in every stitch, every design, and every interaction with our customers.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg">
              <Heart className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Passion
              </h3>
              <p className="text-zenthra-gray">
                Fashion is our passion, and we pour our hearts into creating pieces that inspire confidence.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg">
              <Globe className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Sustainability
              </h3>
              <p className="text-zenthra-gray">
                We're committed to sustainable practices that respect our planet and future generations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold text-zenthra-primary mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              The passionate individuals behind ZENTHRA's success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                  alt="Creative Director" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-2">
                Sarah Chen
              </h3>
              <p className="text-zenthra-gray mb-4">Creative Director</p>
              <p className="text-sm text-zenthra-gray">
                Leading our design vision with over 15 years of experience in luxury fashion.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                  alt="Head of Operations" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-2">
                Marcus Rodriguez
              </h3>
              <p className="text-zenthra-gray mb-4">Head of Operations</p>
              <p className="text-sm text-zenthra-gray">
                Ensuring every piece meets our exacting standards of quality and craftsmanship.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                  alt="Customer Experience Manager" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-2">
                Emma Thompson
              </h3>
              <p className="text-zenthra-gray mb-4">Customer Experience Manager</p>
              <p className="text-sm text-zenthra-gray">
                Dedicated to ensuring every customer feels valued and receives exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}