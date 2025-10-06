import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { RefreshCw } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAdminAuth = async () => {
      const token = localStorage.getItem("admin-token");
      
      if (!token) {
        setIsVerifying(false);
        setLocation("/admin/login");
        return;
      }

      try {
        // Verify token with backend by making an authenticated request
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("admin-token");
          localStorage.removeItem("admin-user");
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-user");
        setLocation("/admin/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdminAuth();
  }, [setLocation]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
