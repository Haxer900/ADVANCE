import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingBag, Menu, X, Heart, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCartStore } from "./cart-store";
import { Logo } from "./logo";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { cartCount } = useCartStore();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.firstName || userData.email || "User");
      } catch {
        setUserName("User");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setLocation("/");
  };

  // Get wishlist count
  const sessionId = localStorage.getItem("morethanfashion-session-id");
  const { data: wishlist = [] } = useQuery({
    queryKey: ["/api/wishlist", sessionId],
    enabled: !!sessionId,
  });
  const wishlistArray = Array.isArray(wishlist) ? wishlist : [];

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/products" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b performance-optimized" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', contain: 'layout style' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-4 layout-stable">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo className="hover:scale-105 transition-transform duration-300" size="md" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className={`px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer hover:text-primary ${
                    location === item.href 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-4 w-4" />
                {wishlistArray.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {wishlistArray.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Hi, {userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/my-orders">
                    <DropdownMenuItem className="cursor-pointer" data-testid="link-my-orders">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" data-testid="button-login">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  <div className="border-t pt-4">
                    <Link href="/track-order">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t py-4 animate-slide-in-top">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
