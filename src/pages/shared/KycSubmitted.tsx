import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function KycSubmitted() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-secondary rounded-2xl p-8 text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#4D37B3] rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            KYC submitted successfully
          </h1>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your KYC has been submitted successfully. Please wait for approval.
            You will be notified once your account has been reviewed.
          </p>

          <Link to="/">
            <Button
              className="w-full bg-[#4D37B3] text-white hover:bg-[#3d2a8a]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
