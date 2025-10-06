import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <RefreshCw className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Refund Policy</h1>
            <p className="text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Card>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Return Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                We want you to be completely satisfied with your purchase. Items may be returned within 30 days of delivery if they meet the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Items must be unused and in their original condition</li>
                <li>Items must be in original packaging with all tags attached</li>
                <li>Items must not be damaged or altered</li>
                <li>Items must not be final sale or clearance items</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Non-Returnable Items</h2>
              <p className="text-muted-foreground mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Intimate apparel and swimwear (for hygiene reasons)</li>
                <li>Personalized or customized items</li>
                <li>Items marked as "Final Sale" or "Clearance"</li>
                <li>Gift cards</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Return Process</h2>
              <p className="text-muted-foreground mb-4">
                To initiate a return:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Log in to your account and go to "My Orders"</li>
                <li>Select the order containing the item(s) you wish to return</li>
                <li>Click "Request Refund" and follow the instructions</li>
                <li>Pack the item(s) securely in original packaging</li>
                <li>Ship the return to the address provided in your return confirmation email</li>
              </ol>
              <p className="text-muted-foreground mt-4">
                <strong>Note:</strong> Customers are responsible for return shipping costs unless the return is due to our error 
                (e.g., wrong item shipped, defective product).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Refund Timeline</h2>
              <p className="text-muted-foreground">
                Once we receive your returned item(s), we will inspect them and process your refund within 5-7 business days. 
                Refunds will be credited to your original payment method. Please note that it may take an additional 5-10 business 
                days for the refund to appear in your account, depending on your payment provider.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Exchanges</h2>
              <p className="text-muted-foreground">
                We currently do not offer direct exchanges. If you need a different size or color, please return the original 
                item for a refund and place a new order. This ensures you receive your preferred item as quickly as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Damaged or Defective Items</h2>
              <p className="text-muted-foreground mb-4">
                If you receive a damaged or defective item:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Contact us within 7 days of delivery</li>
                <li>Provide photos of the damage or defect</li>
                <li>We will arrange for a replacement or full refund, including return shipping costs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Wrong Item Received</h2>
              <p className="text-muted-foreground">
                If you receive the wrong item, please contact us immediately. We will arrange for the correct item to be sent 
                to you at no additional cost and provide a prepaid return label for the incorrect item.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Late or Missing Refunds</h2>
              <p className="text-muted-foreground mb-4">
                If you haven't received a refund after 15 business days:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Check your bank account or credit card statement again</li>
                <li>Contact your credit card company or bank</li>
                <li>If you've done all of this and still haven't received your refund, contact us at refunds@zenthra.com</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Partial Refunds</h2>
              <p className="text-muted-foreground mb-4">
                Partial refunds may be granted in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Items returned after 30 days</li>
                <li>Items not in original condition or missing parts</li>
                <li>Items returned without all original packaging and tags</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For any questions about our refund policy or to initiate a return:
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">ZENTHRA Customer Service</p>
                <p className="text-muted-foreground">Email: refunds@zenthra.com</p>
                <p className="text-muted-foreground">Phone: +91 (555) 000-0000</p>
                <p className="text-muted-foreground">Hours: Monday - Friday, 9:00 AM - 6:00 PM IST</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
