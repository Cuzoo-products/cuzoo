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
import { Input } from "@/components/ui/input";
import { LoginFormSchema } from "@/lib/zodVaildation";
import Image from "./components/ui/image";
import logo1 from "@/assets/logo2.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useGetUserDetails } from "@/api/shared/useAuth";
import { useNavigate } from "react-router";

import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import Loader from "./components/utilities/Loader";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user details after Firebase authentication
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
          // Dispatch Redux login action with user data only
          // Token is handled directly by Firebase in axios interceptor
          dispatch(
            login({
              user: {
                id: userDetails.data.Id,
                email: userDetails.data.email,
                accountType: userDetails.data.type,
                status: userDetails.data.approvalStatus,
              },
            })
          );

          // Check if user needs KYC verification (only for fleet and vendor)
          const needsKyc =
            userDetails.data.approvalStatus !== "approved" &&
            (userDetails.data.type === "fleet" ||
              userDetails.data.type === "vendor");

          // Navigate based on user type and verification status
          if (needsKyc) {
            // Redirect to KYC page if not verified
            switch (userDetails.data.type) {
              case "fleet":
                navigate("/fleetkyc");
                break;
              case "vendor":
                navigate("/vendorkyc");
                break;
            }
          } else {
            // Navigate to dashboard if verified or admin
            switch (userDetails.data.type) {
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
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to get user data"
          );
        }
      }
    };

    handleUserLogin();
  }, [userDetails, dispatch, navigate, user]);

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    try {
      setIsSubmitting(true);
      setError(null); // Clear previous errors
      await signInWithEmailAndPassword(auth, data.email, data.password);
      await refetchUserDetails();
      toast.success("Login successful! Welcome back!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state while checking authentication
  if (loading || isLoadingUserDetails) {
    return <Loader />;
  }

  // If user is authenticated, they will be redirected by useEffect
  // So we only show login form for unauthenticated users

  return (
    <div className="bg-background h-screen px-3 md:px-0 flex justify-center my-10 items-center">
      <div className="w-full md:w-1/2 rounded-2xl">
        <div className="bg-secondary shadow-md py-7 rounded">
          <div className="flex justify-center items-center">
            <Image source={logo1} alt="" className="w-16 h-16" />
          </div>
          <div className="text-center mt-1 mb-10">
            <h2 className="text-2xl font-bold">Login</h2>
            <p>Welcome back!👋🏽</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-3/4 lg:w-2/3 space-y-6 mx-auto"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter mail</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="email"
                        placeholder="johndoe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full mt-3 h-11 bg-[#4D37B3] text-white disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </Form>
        </div>
        <p className="text-center mt-5">©2025 Cuzoo. All Rights reserved.</p>
      </div>
    </div>
  );
}

export default App;
