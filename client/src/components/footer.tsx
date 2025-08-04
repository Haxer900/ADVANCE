import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import zenthraLogo from "@assets/zenthra_1754316486050.png";

export default function Footer() {
  return (
    <footer className="bg-zenthra-light py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <img src={zenthraLogo} alt="ZENTHRA Logo" className="h-8 w-auto mb-6" />
            <p className="text-zenthra-gray mb-6 max-w-md">
              ZENTHRA represents the pinnacle of premium lifestyle products, crafting experiences that enrich your daily life with timeless elegance and contemporary sophistication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-zenthra-black mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/about"><span className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300 cursor-pointer">About Us</span></Link></li>
              <li><Link href="/products"><span className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300 cursor-pointer">Collections</span></Link></li>
              <li><Link href="/products?featured=true"><span className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300 cursor-pointer">New Arrivals</span></Link></li>
              <li><Link href="/contact"><span className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300 cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-zenthra-black mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">Size Guide</a></li>
              <li><a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">Shipping Info</a></li>
              <li><a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">Returns</a></li>
              <li><a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="text-zenthra-gray hover:text-zenthra-gold transition-colors duration-300">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-12 pt-8 text-center">
          <p className="text-zenthra-gray">
            © 2024 ZENTHRA. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
