import { useVerifyEmailToken } from "@/api/shared/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Could not verify your email. The link may be invalid or expired.";
}

export default function VerifyEmailLink() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const { isLoading, isSuccess, isError, error } = useVerifyEmailToken(token);

  if (!token) {
    return <Navigate to="/verify-email" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-secondary rounded-2xl p-8 text-center shadow-lg">
          {isLoading ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#4D37B3] rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Verifying your email
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Please wait while we confirm your email address.
              </p>
            </>
          ) : null}

          {isSuccess ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Email verified
              </h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your email has been verified successfully. You can now sign in to
                your account.
              </p>
              <Link to="/">
                <Button className="w-full bg-[#4D37B3] text-white hover:bg-[#3d2a8a]">
                  Go to login
                </Button>
              </Link>
            </>
          ) : null}

          {isError ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Verification failed
              </h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {getErrorMessage(error)}
              </p>
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full border-[#d6d6d6] text-foreground hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </>
          ) : null}

          <p className="text-xs text-muted-foreground mt-6">
            ©2025 Cuzoo. All Rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
