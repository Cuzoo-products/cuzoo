import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "@/components/ui/image";
import { FleetManagerRegFormSchema } from "@/lib/zodVaildation";
import logo1 from "@/assets/logo2.png";
import { useCreateFleetManager } from "@/api/fleet/auth/useAuth";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { STATIC_SITE_URL } from "@/lib/siteUrls";

const AUTH_INPUT_CLASS =
  "h-12 w-full rounded-lg border border-[var(--auth-border)] bg-[var(--auth-bg-card-alt)] px-4 text-sm text-[var(--auth-text-primary)] placeholder:text-[var(--auth-text-muted)] focus:border-[var(--auth-accent)] focus:outline-none";

const AUTH_LABEL_CLASS =
  "text-sm font-medium text-[var(--auth-text-primary)]";

function FleetRegistration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof FleetManagerRegFormSchema>>({
    resolver: zodResolver(FleetManagerRegFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useCreateFleetManager();

  function onSubmit(data: z.infer<typeof FleetManagerRegFormSchema>) {
    mutate(data, {
      onSuccess: () => {
        navigate("/verify-email", {
          state: { email: data.email, accountType: "fleet" as const },
        });
      },
    });
  }

  return (
    <main className="auth-portal flex min-h-screen flex-col items-center px-6 py-10 sm:py-12">
      <div className="my-auto flex w-full max-w-[560px] flex-col gap-6 py-6">
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
            Create fleet account
          </h1>
          <p className="text-sm text-[var(--auth-text-muted)]">
            Welcome to Cuzoo fleet manager
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={AUTH_LABEL_CLASS}>
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={AUTH_INPUT_CLASS}
                          type="text"
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={AUTH_LABEL_CLASS}>
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={AUTH_INPUT_CLASS}
                          type="text"
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={AUTH_LABEL_CLASS}>Email</FormLabel>
                      <FormControl>
                        <Input
                          className={AUTH_INPUT_CLASS}
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
                  name="businessName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={AUTH_LABEL_CLASS}>
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={AUTH_INPUT_CLASS}
                          type="text"
                          placeholder="Acme Logistics"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={AUTH_LABEL_CLASS}>
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={AUTH_INPUT_CLASS}
                          type="tel"
                          placeholder="+2348031234567"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-[var(--auth-text-muted)]">
                        International format only, no spaces (e.g. +2348031234567)
                      </FormDescription>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={AUTH_LABEL_CLASS}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className={`${AUTH_INPUT_CLASS} pr-11`}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                  <FormItem className="space-y-2">
                    <FormLabel className={AUTH_LABEL_CLASS}>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className={`${AUTH_INPUT_CLASS} pr-11`}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
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

              <p className="text-xs leading-relaxed text-[var(--auth-text-muted)]">
                By signing up, you agree to the terms and conditions of the
                Cuzoo application.
              </p>

              <Button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--auth-accent)] font-semibold text-white hover:bg-[var(--auth-accent-hover)] disabled:opacity-70"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
        </Form>

        <p className="mt-6 text-center text-sm text-[var(--auth-text-muted)]">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-medium text-[var(--auth-accent)] hover:text-[var(--auth-accent-hover)]"
          >
            Sign in
          </Link>
        </p>

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

export default FleetRegistration;
