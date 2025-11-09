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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "@/components/ui/image";
import { VendorRegistrationFormSchema } from "@/lib/zodVaildation";
import truck from "@/assets/truck.jpg";
import { useCreateVendor } from "@/api/vendor/auth/useAuth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { GogglePlace } from "@/components/utilities/GogglePlace";

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function VendorRegistration() {
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
      registrationNumber: "",
      dateOfIncorporation: "",
      placeOfIncorporation: "",
      businessType: "",
      logo: "",
      addressPlaceId: "",
    },
  });

  const { mutate: createVendor, isPending } = useCreateVendor();
  const navigate = useNavigate();

  function onSubmit(data: z.infer<typeof VendorRegistrationFormSchema>) {
    // Convert date to ISO string format
    const formattedData = {
      ...data,
      dateOfIncorporation: data.dateOfIncorporation
        ? new Date(data.dateOfIncorporation).toISOString()
        : "",
    };
    console.log(formattedData);
    createVendor(formattedData, {
      onSuccess: () => {
        navigate("/verify-email");
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
                  <FormItem>
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
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="RC123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfIncorporation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Incorporation</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeOfIncorporation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Incorporation</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                          placeholder="Lagos, Nigeria"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (International Format)</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="+2348000000000"
                        type="tel"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Ensure it starts with +
                          if (value && !value.startsWith("+")) {
                            value = "+" + value;
                          }
                          // Remove any non-digit characters except +
                          value = value.replace(/[^\d+]/g, "");
                          // Limit to reasonable length (15 digits max for international)
                          if (value.length > 16) {
                            // +1 + 15 digits
                            value = value.substring(0, 16);
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                    <p className="text-sm text-muted-foreground">
                      Enter phone number with country code (e.g., +234, +1, +44)
                    </p>
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-0 shadow-accent shadow-sm">
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressPlaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <GogglePlace
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter your business address"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                    <p className="text-sm text-muted-foreground">
                      Start typing to search for your business address
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const base64 = await fileToBase64(file);
                              field.onChange(base64);
                            } catch (error) {
                              toast.error("Error processing logo image");
                              console.error("Error:", error);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

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
