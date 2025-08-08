import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-zenthra-light py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-zenthra-black mb-6">
            About ZENTHRA
          </h1>
          <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
            Crafting exceptional experiences through timeless elegance and contemporary sophistication
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-zenthra-black mb-6">
                Our Story
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Founded in 1999, ZENTHRA began as a vision to bridge the gap between traditional craftsmanship and modern women's fashion. Our founders, passionate about quality and design, set out to create a brand that would redefine premium women's fashion.
              </p>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Over the years, we have built relationships with the finest artisans and suppliers worldwide, ensuring that every piece in our collection meets our exacting standards of excellence. Our commitment to quality has made us a trusted name among discerning families who value sophistication and style.
              </p>
              <p className="text-lg text-zenthra-gray leading-relaxed">
                Today, ZENTHRA continues to evolve while staying true to our core values of elegance, quality, and empowering women through fashion.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="MORE THAN FASHION craftsmanship" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-zenthra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-zenthra-black mb-4">
              Our Values
            </h2>
            <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zenthra-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-zenthra-black mb-4">
                  Excellence
                </h3>
                <p className="text-zenthra-gray">
                  We pursue perfection in every detail, from material selection to final craftsmanship, ensuring our products exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zenthra-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-zenthra-black mb-4">
                  Family Focus
                </h3>
                <p className="text-zenthra-gray">
                  We understand that our customers are families, and we create experiences that bring people together and create lasting memories.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zenthra-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-zenthra-black mb-4">
                  Sustainability
                </h3>
                <p className="text-zenthra-gray">
                  We are committed to responsible sourcing and sustainable practices, ensuring our legacy benefits future generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-zenthra-black mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-zenthra-gray max-w-2xl mx-auto">
              The passionate individuals behind ZENTHRA's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                  alt="James Wilson"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="font-playfair text-xl font-bold text-zenthra-black mb-2">
                  James Wilson
                </h3>
                <p className="text-zenthra-gold font-semibold mb-4">Founder & CEO</p>
                <p className="text-zenthra-gray">
                  With over 25 years in luxury retail, James founded ZENTHRA with a vision to create timeless, quality products for modern families.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=200&h=200&fit=crop&crop=face" 
                  alt="Sarah Chen"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="font-playfair text-xl font-bold text-zenthra-black mb-2">
                  Sarah Chen
                </h3>
                <p className="text-zenthra-gold font-semibold mb-4">Head of Design</p>
                <p className="text-zenthra-gray">
                  Sarah brings her passion for contemporary design and family-centered aesthetics to every product in our collection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" 
                  alt="Michael Torres"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="font-playfair text-xl font-bold text-zenthra-black mb-2">
                  Michael Torres
                </h3>
                <p className="text-zenthra-gold font-semibold mb-4">Quality Director</p>
                <p className="text-zenthra-gray">
                  Michael ensures that every ZENTHRA product meets our highest standards through rigorous quality control and artisan partnerships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-zenthra-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl font-bold text-zenthra-black mb-12">
            Recognition & Awards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg">
              <div className="text-3xl">🏆</div>
              <div>
                <h3 className="font-semibold text-zenthra-black">Luxury Retail Excellence Award</h3>
                <p className="text-zenthra-gray">2023 - Industry Recognition</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg">
              <div className="text-3xl">🏅</div>
              <div>
                <h3 className="font-semibold text-zenthra-black">Customer Choice Award</h3>
                <p className="text-zenthra-gray">2022 - Family Business Excellence</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg">
              <div className="text-3xl">🌱</div>
              <div>
                <h3 className="font-semibold text-zenthra-black">Sustainability Leadership</h3>
                <p className="text-zenthra-gray">2021 - Eco-Friendly Practices</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg">
              <div className="text-3xl">💎</div>
              <div>
                <h3 className="font-semibold text-zenthra-black">Design Innovation Award</h3>
                <p className="text-zenthra-gray">2020 - Contemporary Elegance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
