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
import { VendorRegistrationFormSchema } from "@/lib/zodVaildation";
import truck from "@/assets/truck.jpg";
import { useCreateVendor } from "@/api/vendor/auth/useAuth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

function VendorRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof VendorRegistrationFormSchema>>({
    resolver: zodResolver(VendorRegistrationFormSchema),
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

  const { mutate: createVendor, isPending } = useCreateVendor();
  const navigate = useNavigate();

  function onSubmit(data: z.infer<typeof VendorRegistrationFormSchema>) {
    createVendor(data, {
      onSuccess: () => {
        navigate("/verify-email", {
          state: { email: data.email, accountType: "vendor" as const },
        });
      },
    });
  }

  return (
    <div>
      <div className="flex">
        <div className="flex-1 h-screen hidden md:flex">
          <Image source={truck} className="h-full w-1/2 fixed" alt="" />
        </div>
        <div className="flex-1 bg-background flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-3/4 lg:w-2/3 space-y-6 py-10"
            >
              <div>
                <h3 className="text-2xl font-bold">Vendor Registration</h3>
                <p>Welcome to cuzoo Vendor Platform</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="user@example.com"
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
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="ABC Logistics Ltd"
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="+2348123000000"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter your phone number with the country code
                    </FormDescription>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3] pr-12"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
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
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                            onClick={() => setShowConfirmPassword((s) => !s)}
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
              </div>

              <p>
                By signinh up, you agree to the terms and condition of cuzoo
                application
              </p>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#4D37B3] text-white mt-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default VendorRegistration;
