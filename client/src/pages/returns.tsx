import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Returns() {
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
              Returns & Exchanges
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Your satisfaction is our priority. Learn about our return policy and how to return or exchange items.
            </p>
          </div>
        </div>
      </section>

      {/* Return Policy Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Our Return Policy
            </h2>
            <p className="text-xl text-zenthra-gray">
              Simple, hassle-free returns within 30 days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center border-0 shadow-lg">
              <Clock className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                30 Days
              </h3>
              <p className="text-zenthra-gray">
                You have 30 days from delivery to return items in original condition.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg">
              <RefreshCw className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Free Returns
              </h3>
              <p className="text-zenthra-gray">
                Free return shipping on all domestic orders. International return fees may apply.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg">
              <CheckCircle className="w-12 h-12 text-zenthra-primary mx-auto mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Easy Process
              </h3>
              <p className="text-zenthra-gray">
                Simple online return process with prepaid return labels for your convenience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              How to Return Items
            </h2>
            <p className="text-xl text-zenthra-gray">
              Follow these simple steps to return your items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-zenthra-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-poppins text-xl font-bold text-zenthra-primary mb-4">
                Start Return
              </h3>
              <p className="text-zenthra-gray">
                Log into your account and select the items you want to return from your order history.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-zenthra-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-poppins text-xl font-bold text-zenthra-primary mb-4">
                Print Label
              </h3>
              <p className="text-zenthra-gray">
                Print the prepaid return shipping label and return instructions sent to your email.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-zenthra-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-poppins text-xl font-bold text-zenthra-primary mb-4">
                Pack Items
              </h3>
              <p className="text-zenthra-gray">
                Pack items securely in original packaging with all tags attached and return slip included.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-zenthra-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-poppins text-xl font-bold text-zenthra-primary mb-4">
                Ship Back
              </h3>
              <p className="text-zenthra-gray">
                Drop off at any authorized shipping location or schedule a pickup with the carrier.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Return Conditions
            </h2>
            <p className="text-xl text-zenthra-gray">
              To ensure a smooth return process, please note these requirements
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                    Eligible for Return
                  </h3>
                  <ul className="text-zenthra-gray space-y-2">
                    <li>• Items returned within 30 days of delivery</li>
                    <li>• Items in original, unworn condition</li>
                    <li>• All original tags and packaging included</li>
                    <li>• Proof of purchase (order confirmation)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-8 h-8 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-zenthra-primary mb-2">
                    Not Eligible for Return
                  </h3>
                  <ul className="text-zenthra-gray space-y-2">
                    <li>• Worn, damaged, or altered items</li>
                    <li>• Items without original tags</li>
                    <li>• Personalized or custom-made items</li>
                    <li>• Final sale or clearance items</li>
                    <li>• Items returned after 30 days</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Exchanges */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-8">
                Exchanges
              </h2>
              <p className="text-lg text-zenthra-gray mb-6 leading-relaxed">
                Need a different size or color? We offer free exchanges on all eligible items within 30 days of delivery.
              </p>
              <p className="text-lg text-zenthra-gray mb-8 leading-relaxed">
                Simply follow the same return process and indicate that you'd like an exchange. We'll send your new item as soon as we receive your return.
              </p>
              <ul className="text-zenthra-gray space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Free size exchanges
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Color exchanges (subject to availability)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Fast processing within 2-3 business days
                </li>
              </ul>
              <Link href="/contact">
                <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
                  Contact for Exchange
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Easy exchanges" 
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Refund Information
            </h2>
            <p className="text-xl text-zenthra-gray">
              Understanding our refund timeline and process
            </p>
          </div>

          <Card className="p-8 border-0 shadow-lg">
            <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-6">
              Refund Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Processing Time
                </h4>
                <p className="text-zenthra-gray mb-4">
                  Once we receive your return, we'll inspect the items and process your refund within 3-5 business days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-zenthra-primary mb-3">
                  Refund Method
                </h4>
                <p className="text-zenthra-gray mb-4">
                  Refunds are issued to the original payment method. Credit card refunds may take 5-10 business days to appear on your statement.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
            Need Help with Your Return?
          </h2>
          <p className="text-xl text-zenthra-gray mb-12 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any questions about returns, exchanges, or refunds.
          </p>
          <Link href="/contact">
            <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
              Get Return Help
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}