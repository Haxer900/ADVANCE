import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ArrowLeft, Award, Heart, Users, Target } from "lucide-react";

export default function OurStory() {
  const heroRef = useScrollAnimation();
  const storyRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const teamRef = useScrollAnimation();

  return (
    <div className="min-h-screen bg-zenthra-white">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-br from-zenthra-primary via-zenthra-primary to-zenthra-secondary min-h-screen flex items-center justify-center scroll-reveal"
      >
        <div className="absolute inset-0 morphing-bg opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="floating-animation">
            <h1 className="font-poppins text-6xl md:text-8xl font-bold text-white mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12">
              A journey of passion, innovation, and the relentless pursuit of excellence in premium lifestyle products
            </p>
          </div>
          <Link href="/">
            <Button className="btn-white mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-32 bg-zenthra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={storyRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-reveal"
          >
            <div className="slide-in-left">
              <h2 className="font-poppins text-5xl font-bold text-zenthra-primary mb-8 gradient-text">
                The Beginning
              </h2>
              <div className="space-y-6 text-lg text-zenthra-gray leading-relaxed">
                <p>
                  In 1999, MORE THAN FASHION was born from a simple yet powerful vision: to bridge the gap between traditional craftsmanship and modern luxury. Our founders recognized that in an increasingly digital world, people yearned for products that told a story, carried meaning, and reflected their personal journey.
                </p>
                <p>
                  What started as a small atelier has evolved into a global brand, but our core values remain unchanged. We believe that true luxury isn't just about price points or exclusivity—it's about the emotion a product evokes, the memories it creates, and the way it enhances your daily life.
                </p>
                <p>
                  Every piece in our collection is carefully curated, representing not just excellent design and quality, but a philosophy of mindful living and conscious consumption.
                </p>
              </div>
            </div>
            
            <div className="slide-in-right">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="ZENTHRA craftsmanship" 
                  className="rounded-3xl shadow-2xl w-full card-3d"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zenthra-primary/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-zenthra-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={valuesRef}
            className="text-center mb-20 scroll-reveal"
          >
            <h2 className="font-poppins text-5xl font-bold text-zenthra-primary mb-6 gradient-text">
              Our Core Values
            </h2>
            <p className="text-xl text-zenthra-gray max-w-3xl mx-auto">
              The principles that guide every decision we make and every product we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We pursue perfection in every detail, from material selection to final craftsmanship.",
                color: "text-zenthra-secondary"
              },
              {
                icon: Heart,
                title: "Passion",
                description: "Every product is created with love, care, and genuine enthusiasm for the craft.",
                color: "text-zenthra-accent"
              },
              {
                icon: Users,
                title: "Family",
                description: "We create products that bring families together and create lasting memories.",
                color: "text-zenthra-secondary"
              },
              {
                icon: Target,
                title: "Innovation",
                description: "We constantly evolve while respecting traditional craftsmanship techniques.",
                color: "text-zenthra-accent"
              }
            ].map((value, index) => (
              <Card key={index} className="hover-lift card-3d border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-zenthra-secondary to-zenthra-accent flex items-center justify-center`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-zenthra-gray leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 bg-gradient-to-br from-zenthra-primary to-zenthra-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            ref={teamRef}
            className="scroll-reveal"
          >
            <h2 className="font-poppins text-5xl md:text-6xl font-bold text-white mb-12">
              Our Mission
            </h2>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed mb-12">
              "To create exceptional products that elevate everyday moments into extraordinary experiences, fostering connections that last a lifetime."
            </p>
            <div className="glass-effect rounded-3xl p-8 md:p-12">
              <p className="text-lg text-white leading-relaxed">
                At MORE THAN FASHION, we don't just sell products—we curate experiences. Every item in our collection is chosen with the understanding that it will become part of someone's story, part of their family's legacy. We're committed to sustainability, ethical sourcing, and creating products that stand the test of time, both in quality and style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-zenthra-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
            Ready to Be Part of Our Story?
          </h2>
          <p className="text-xl text-zenthra-gray mb-12">
            Discover our premium collections and find your perfect piece
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products">
              <Button className="btn-primary text-lg px-12 py-6">
                Explore Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-outline text-lg px-12 py-6">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}