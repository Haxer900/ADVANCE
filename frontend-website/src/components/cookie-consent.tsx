import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings } from "lucide-react";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("morethanfashion-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("morethanfashion-cookie-consent", "accepted");
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem("morethanfashion-cookie-consent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in-bottom md:left-auto md:max-w-md">
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2">Cookie Preferences</h3>
              <p className="text-xs text-muted-foreground mb-3">
                We use cookies to enhance your experience, analyze traffic, and personalize content. 
                Your privacy is important to us.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={acceptCookies} className="flex-1">
                  Accept All
                </Button>
                <Button size="sm" variant="outline" onClick={declineCookies} className="flex-1">
                  Decline
                </Button>
                <Button size="sm" variant="ghost" className="p-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}