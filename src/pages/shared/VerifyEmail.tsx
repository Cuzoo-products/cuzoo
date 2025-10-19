import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-secondary rounded-2xl p-8 text-center shadow-lg">
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#4D37B3] rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Check Your Email
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Don't see the email?</strong> Check your spam folder or
              wait a few minutes for it to arrive.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-[#4D37B3] text-white hover:bg-[#3d2a8a]"
            >
              Check Again
            </Button>

            <Link to="/">
              <Button
                variant="outline"
                className="w-full border-[#d6d6d6] text-foreground hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground mt-6">
            ©2025 Cuzoo. All Rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
