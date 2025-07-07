import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
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
import Image from "@/components/ui/image";
import { FleetManagerRegFormSchema } from "@/lib/zodVaildation";
import truck from "@/assets/truck.jpg";

function VendorRegistration() {
  const form = useForm<z.infer<typeof FleetManagerRegFormSchema>>({
    resolver: zodResolver(FleetManagerRegFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof FleetManagerRegFormSchema>) {
    console.log(data);
  }

  return (
    <div>
      <div className="flex">
        <div className="flex-1 h-screen hidden md:flex">
          <Image source={truck} className="h-full w-1/2 fixed" alt="" />
        </div>
        <div className="flex-1 bg-purple-50 flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-3/4 lg:w-2/3 space-y-6 py-10"
            >
              <div>
                <h3 className="text-2xl font-bold">Sign up</h3>
                <p>Welcome to cuzoo fleet manager</p>
              </div>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="John Doe"
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        placeholder="FleetCo Ltd."
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
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="tel"
                        placeholder="+234..."
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

              <p>
                By signinh up, you agree to the terms and condition of cuzoo
                application
              </p>

              <Button
                type="submit"
                className="w-full bg-[#4D37B3] text-white mt-3"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default VendorRegistration;
