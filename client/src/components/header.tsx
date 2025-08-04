import { Link, useLocation } from "wouter";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "./cart-store";
import zenthraLogo from "@assets/zenthra_1754316486050.png";

export default function Header() {
  const [location] = useLocation();
  const { cartCount } = useCartStore();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/products" },
    { name: "New Arrivals", href: "/products?featured=true" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="relative z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src={zenthraLogo} alt="ZENTHRA Logo" className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className={`px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                    location === item.href 
                      ? "text-zenthra-black" 
                      : "text-zenthra-gray hover:text-zenthra-gold"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-zenthra-gray hover:text-zenthra-gold">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zenthra-gray hover:text-zenthra-gold">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-zenthra-gray hover:text-zenthra-gold relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zenthra-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden text-zenthra-gray hover:text-zenthra-gold">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
