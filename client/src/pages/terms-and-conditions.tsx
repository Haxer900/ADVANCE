import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FileText className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
            <p className="text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Card>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using ZENTHRA's website and services, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
              <p className="text-muted-foreground mb-4">
                You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use our services in any way that violates applicable laws or regulations</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use of our services</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services or servers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground">
                To make purchases, you must create an account. You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Products and Pricing</h2>
              <p className="text-muted-foreground mb-4">
                All products are subject to availability. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Limit quantities of products purchased per order</li>
                <li>Discontinue products at any time</li>
                <li>Modify prices without notice</li>
                <li>Refuse any order for any reason</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We strive to display accurate product information, but we cannot guarantee that all information is error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Orders and Payments</h2>
              <p className="text-muted-foreground">
                All payments are processed securely through Razorpay. By placing an order, you authorize us to charge your 
                payment method for the total amount. We reserve the right to cancel orders if payment cannot be verified or 
                if fraudulent activity is suspected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                We will make reasonable efforts to deliver products within the estimated timeframe. However, delivery dates 
                are estimates and we are not liable for delays caused by circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Please refer to our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a> for 
                detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, is the property of ZENTHRA 
                or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or 
                create derivative works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                ZENTHRA shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting 
                from your use of or inability to use our services, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its 
                conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">ZENTHRA Women's Fashion</p>
                <p className="text-muted-foreground">Email: legal@zenthra.com</p>
                <p className="text-muted-foreground">Phone: +91 (555) 000-0000</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
