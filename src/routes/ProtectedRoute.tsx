import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import type { User } from "firebase/auth";

interface AuthUser {
  id: string;
  email: string;
  accountType: "fleet" | "vendor" | "admin";
  status: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedUserTypes,
}: ProtectedRouteProps) => {
  const { user: reduxUser } = useSelector((state: RootState) => state.auth) as {
    user: AuthUser | null;
  };
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4D37B3]"></div>
      </div>
    );
  }

  // Check if user is authenticated (Firebase user exists and Redux user data is loaded)
  if (!firebaseUser || !reduxUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user type is allowed for this route
  if (
    allowedUserTypes &&
    reduxUser &&
    !allowedUserTypes.includes(reduxUser.accountType)
  ) {
    // Redirect to appropriate dashboard based on user type
    switch (reduxUser.accountType) {
      case "fleet":
        return <Navigate to="/fleet/dashboard" replace />;
      case "vendor":
        return <Navigate to="/vendor/dashboard" replace />;
      case "admin":
        return <Navigate to="/admins/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Check KYC verification for fleet and vendor users (but allow access to KYC pages)
  if (
    reduxUser &&
    (reduxUser.accountType === "fleet" || reduxUser.accountType === "vendor") &&
    reduxUser.status !== "approved" &&
    !location.pathname.includes("kyc") // Allow access to KYC pages
  ) {
    // Redirect to appropriate KYC page if not verified
    switch (reduxUser.accountType) {
      case "fleet":
        return <Navigate to="/fleetkyc" replace />;
      case "vendor":
        return <Navigate to="/vendorkyc" replace />;
    }
  }

  return <>{children}</>;
};
