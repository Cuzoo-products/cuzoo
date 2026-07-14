import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormSchema } from "@/lib/zodVaildation";
import Image from "./components/ui/image";
import logo1 from "@/assets/logo2.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useGetUserDetails } from "@/api/shared/useAuth";
import { Link, useNavigate } from "react-router";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import Loader from "./components/utilities/Loader";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { hasSubmittedKyc } from "@/lib/kycStatus";
import { STATIC_SITE_URL } from "@/lib/siteUrls";

const AUTH_INPUT_CLASS =
  "h-12 w-full rounded-lg border border-[var(--auth-border)] bg-[var(--auth-bg-card-alt)] px-4 text-sm text-[var(--auth-text-primary)] placeholder:text-[var(--auth-text-muted)] focus:border-[var(--auth-accent)] focus:outline-none";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    refetch: refetchUserDetails,
  } = useGetUserDetails(user);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const handleUserLogin = async () => {
      if (user && userDetails) {
        try {
          dispatch(
            login({
              user: {
                id: userDetails.data.Id,
                email: userDetails.data.email,
                accountType: userDetails.data.type,
                status: userDetails.data.approvalStatus,
                registrationNumber: userDetails.data.registrationNumber ?? "",
                photoURL: user.photoURL ?? "",
                displayName: user.displayName ?? "",
              },
            }),
          );

          const accountType = userDetails.data.type;
          const isApproved = userDetails.data.approvalStatus === "approved";
          const kycSubmitted = hasSubmittedKyc(
            userDetails.data.registrationNumber,
          );
          const isFleetOrVendor =
            accountType === "fleet" || accountType === "vendor";

          if (isFleetOrVendor && !isApproved) {
            if (kycSubmitted) {
              navigate("/kyc-submitted");
            } else if (accountType === "fleet") {
              navigate("/fleetkyc");
            } else {
              navigate("/vendorkyc");
            }
            return;
          }

          switch (accountType) {
            case "fleet":
              navigate("/fleet/dashboard");
              break;
            case "vendor":
              navigate("/vendor/dashboard");
              break;
            case "admin":
              navigate("/admins/dashboard");
              break;
            default:
              toast.error("Unknown user type");
          }
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to get user data",
          );
        }
      }
    };

    handleUserLogin();
  }, [userDetails, dispatch, navigate, user]);

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      await refetchUserDetails();
      toast.success("Login successful! Welcome back!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || isLoadingUserDetails) {
    return <Loader />;
  }

  return (
    <main className="auth-portal flex min-h-screen flex-col items-center px-6 py-10 sm:py-12">
      <div className="my-auto flex w-full max-w-[480px] flex-col gap-6 py-6">
        <a
          href={STATIC_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-[var(--auth-text-muted)] transition-colors hover:text-[var(--auth-text-primary)]"
        >
          <ArrowLeft size={14} />
          Back to Website
        </a>

        <div className="w-full rounded-xl border border-[var(--auth-border)] bg-[var(--auth-bg-card)] p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center space-y-3 text-center">
            <Image
              source={logo1}
              alt="Cuzoo"
              className="h-16 w-16 rounded-2xl object-contain"
            />
            <h1 className="text-2xl font-bold text-[var(--auth-text-primary)]">
              Login
            </h1>
            <p className="text-sm text-[var(--auth-text-muted)]">
              Welcome back! 👋
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-[var(--auth-text-primary)]">
                      Enter mail
                    </FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="johndoe@example.com"
                        className={AUTH_INPUT_CLASS}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-[var(--auth-text-primary)]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className={`${AUTH_INPUT_CLASS} pr-11`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--auth-text-muted)] hover:text-[var(--auth-text-primary)]"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[var(--auth-accent)] hover:text-[var(--auth-accent-hover)]"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>

              {error && (
                <p className="text-center text-sm text-[var(--auth-danger)]">
                  {error}
                </p>
              )}
            </form>
          </Form>

          <p className="mt-6 text-center text-xs text-[var(--auth-text-muted)]">
            ©2025 Cuzoo. All Rights Reserved.
          </p>
        </div>

        <a
          href={STATIC_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-xs text-[var(--auth-text-muted)] transition-colors hover:text-[var(--auth-text-primary)]"
        >
          ← Back to Cuzoo website
        </a>
      </div>
    </main>
  );
}

export default App;
