import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "@/redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function KycSubmitted() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <main className="auth-portal flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-xl border border-[var(--auth-border)] bg-[var(--auth-bg-card)] p-8 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[var(--auth-accent)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--auth-text-primary)] mb-4">
            KYC submitted successfully
          </h1>

          <p className="text-[var(--auth-text-muted)] mb-6 leading-relaxed">
            Your KYC has been submitted successfully. Please wait for approval.
            You will be notified once your account has been reviewed.
          </p>

          <Button
            className="h-12 w-full rounded-lg bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)]"
            onClick={async () => {
              await signOut(auth);
              dispatch(logout());
              navigate("/");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    </main>
  );
}
