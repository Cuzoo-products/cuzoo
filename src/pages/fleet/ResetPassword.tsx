import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FleetManagerChangePWSchema } from "@/lib/zodVaildation";
import { Eye, EyeOff } from "lucide-react";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase";

function firebaseChangePasswordMessage(code: string): string {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/weak-password":
      return "New password is too weak. Choose a stronger password.";
    case "auth/requires-recent-login":
      return "For security, sign out and sign in again, then change your password.";
    case "auth/user-mismatch":
    case "auth/user-not-found":
      return "No signed-in user. Please log in again.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Could not update password. Please try again.";
  }
}

function ResetPassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FleetManagerChangePWSchema>>({
    resolver: zodResolver(FleetManagerChangePWSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FleetManagerChangePWSchema>) {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to change your password.");
      return;
    }

    const email = user.email;
    if (!email) {
      toast.error(
        "Your account has no email on file. Password change is not available for this sign-in method.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(email, data.oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.password);
      toast.success("Password updated successfully.");
      form.reset({
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const code =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "string"
          ? (err as { code: string }).code
          : "";
      toast.error(
        code ? firebaseChangePasswordMessage(code) : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Password</h3>
        <p>Reset your password here</p>
      </div>
      <div className="bg-secondary max-w-3xl mx-auto p-6 rounded-lg space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3] pr-12"
                        placeholder="********"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword((s) => !s)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                        aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3] pr-12"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((s) => !s)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3] pr-12"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((s) => !s)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#4D37B3] text-white mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
