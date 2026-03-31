import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Link } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
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
import { ForgotPasswordSchema } from "@/lib/zodVaildation";
import Image from "@/components/ui/image";
import logo1 from "@/assets/logo2.png";
import { auth } from "@/firebase";
import { ArrowLeft } from "lucide-react";

function firebaseResetPasswordMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn’t look valid.";
    case "auth/missing-email":
      return "Please enter your email address.";
    case "auth/user-not-found":
      return "No account found for this email.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return "Could not send reset email. Please try again.";
  }
}

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, data.email.trim());
      toast.success(
        "If an account exists for that email, we’ve sent a link to reset your password.",
      );
      form.reset({ email: "" });
    } catch (err: unknown) {
      const code =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "string"
          ? (err as { code: string }).code
          : "";
      toast.error(
        code ? firebaseResetPasswordMessage(code) : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-background min-h-screen px-3 md:px-0 flex justify-center py-10 items-center">
      <div className="w-full md:w-1/2 rounded-2xl">
        <div className="bg-secondary shadow-md py-7 rounded">
          <div className="flex justify-center items-center">
            <Image source={logo1} alt="" className="w-16 h-16" />
          </div>
          <div className="text-center mt-1 mb-10 px-4">
            <h2 className="text-2xl font-bold">Forgot password</h2>
            <p className="text-muted-foreground mt-1">
              Enter your email and we’ll send you a link to reset your password.
            </p>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="email"
                        autoComplete="email"
                        placeholder="johndoe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 h-11 bg-[#4D37B3] text-white disabled:opacity-50"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-sm text-[#4D37B3] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </div>
        <p className="text-center mt-5">©2025 Cuzoo. All Rights reserved.</p>
      </div>
    </div>
  );
}
