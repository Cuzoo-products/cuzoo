import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "@/components/ui/image";
import logo1 from "@/assets/logo2.png";
import { useResetPassword } from "@/api/shared/useAuth";
import { ResetPasswordSchema } from "@/lib/zodVaildation";
import { STATIC_SITE_URL } from "@/lib/siteUrls";

const AUTH_INPUT_CLASS =
  "h-12 w-full rounded-lg border border-[var(--auth-border)] bg-[var(--auth-bg-card-alt)] px-4 text-sm text-[var(--auth-text-primary)] placeholder:text-[var(--auth-text-muted)] focus:border-[var(--auth-accent)] focus:outline-none";

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
  return "Could not reset your password. The link may be invalid or expired.";
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
    if (!token) return;

    resetPassword(
      {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: (response) => {
          const message =
            typeof response === "object" &&
            response !== null &&
            "data" in response &&
            typeof (response as { data?: { message?: string } }).data
              ?.message === "string"
              ? (response as { data: { message: string } }).data.message
              : "Password reset successfully.";
          toast.success(message);
          setIsSuccess(true);
          form.reset();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  }

  if (!token) {
    return (
      <main className="auth-portal flex min-h-screen flex-col items-center px-6 py-10 sm:py-12">
        <div className="my-auto w-full max-w-[480px] rounded-xl border border-[var(--auth-border)] bg-[var(--auth-bg-card)] p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-[var(--auth-text-primary)]">
            Invalid reset link
          </h1>
          <p className="mt-3 text-sm text-[var(--auth-text-muted)]">
            This password reset link is missing or invalid. Request a new one
            from the forgot password page.
          </p>
          <div className="mt-6 space-y-3">
            <Button
              asChild
              className="h-12 w-full bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)]"
            >
              <Link to="/forgot-password">Request new link</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <Link to="/">Back to login</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="auth-portal flex min-h-screen flex-col items-center px-6 py-10 sm:py-12">
        <div className="my-auto w-full max-w-[480px] rounded-xl border border-[var(--auth-border)] bg-[var(--auth-bg-card)] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--auth-text-primary)]">
            Password updated
          </h1>
          <p className="mt-3 text-sm text-[var(--auth-text-muted)]">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
          <Button
            asChild
            className="mt-6 h-12 w-full bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)]"
          >
            <Link to="/">Go to login</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-portal flex min-h-screen flex-col items-center px-6 py-10 sm:py-12">
      <div className="my-auto flex w-full max-w-[480px] flex-col gap-6 py-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-[var(--auth-text-muted)] transition-colors hover:text-[var(--auth-text-primary)]"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>

        <div className="w-full rounded-xl border border-[var(--auth-border)] bg-[var(--auth-bg-card)] p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center space-y-3 text-center">
            <Image
              source={logo1}
              alt="Cuzoo"
              className="h-16 w-16 rounded-2xl object-contain"
            />
            <h1 className="text-2xl font-bold text-[var(--auth-text-primary)]">
              Reset password
            </h1>
            <p className="text-sm text-[var(--auth-text-muted)]">
              Enter your new password below.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-[var(--auth-text-primary)]">
                      New password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-[var(--auth-text-primary)]">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className={`${AUTH_INPUT_CLASS} pr-11`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--auth-text-muted)] hover:text-[var(--auth-text-primary)]"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? (
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

              <Button
                type="submit"
                disabled={isPending}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)] disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Reset password"
                )}
              </Button>
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
