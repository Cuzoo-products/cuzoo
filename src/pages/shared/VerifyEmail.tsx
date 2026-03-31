import { useSendVerificationMail } from "@/api/shared/useAuth";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router";

type VerifyEmailLocationState = {
  email?: string;
  accountType?: string;
};

export default function VerifyEmail() {
  const { mutate: sendVerificationMail, isPending } = useSendVerificationMail();
  const location = useLocation();
  const state = location.state as VerifyEmailLocationState | null;
  const email = state?.email?.trim();
  const accountType = state?.accountType?.trim();
  const canResend = Boolean(email && accountType);

  const handleResend = () => {
    if (!email || !accountType) return;
    sendVerificationMail({ email, accountType: "users" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-secondary rounded-2xl p-8 text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#4D37B3] rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            Check your email
          </h1>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            We&apos;ve sent a verification link to your email address. Open your
            inbox and click the link to verify your account.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              <strong>Didn&apos;t receive anything?</strong> Check your spam
              folder, wait a minute, then use{" "}
              <span className="font-medium">Resend mail</span> below and
              we&apos;ll send another verification link.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isPending}
              className="w-full bg-[#4D37B3] text-white hover:bg-[#3d2a8a] disabled:opacity-50"
            >
              {isPending ? "Sending…" : "Resend mail"}
            </Button>
            {!canResend ? (
              <p className="text-xs text-muted-foreground text-left">
                Resend needs your registration email. Return from{" "}
                <Link
                  to="/vendor-registration"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  vendor
                </Link>{" "}
                or{" "}
                <Link
                  to="/fleet-registration"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  fleet
                </Link>{" "}
                registration, or sign in if you already have an account.
              </p>
            ) : null}

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

          <p className="text-xs text-muted-foreground mt-6">
            ©2025 Cuzoo. All Rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
