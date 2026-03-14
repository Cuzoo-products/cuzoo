import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { FleetManagerProfileFormSchema } from "@/lib/zodVaildation";
import { useGetFleetProfile } from "@/api/fleet/profile/useProfile";

type PhoneNumberPayload = {
  internationalFormat?: string;
  nationalFormat?: string;
  number?: string;
  countryCode?: string;
  countryCallingCode?: string;
};

type FleetProfilePayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  registrationNumber?: string;
  tinNumber?: string;
  dateOfIncorporation?: {
    _seconds: number;
    _nanoseconds: number;
  };
  placeOfIncorporation?: string;
  companyType?: string;
  phoneNumber?: PhoneNumberPayload;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
};

type FleetProfileResponse = {
  success: boolean;
  statusCode: number;
  data: FleetProfilePayload;
};

function Profile() {
  const { data, isLoading, error } = useGetFleetProfile() as {
    data?: FleetProfileResponse;
    isLoading: boolean;
    error: unknown;
  };

  const form = useForm<z.infer<typeof FleetManagerProfileFormSchema>>({
    resolver: zodResolver(FleetManagerProfileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      registrationNumber: "",
      tinNumber: "",
      dateOfIncorporation: "",
      placeOfIncorporation: "",
      companyType: "",
      approvalStatus: "",
    },
  });

  useEffect(() => {
    const payload = data?.data;
    if (!payload) return;

    const fullName =
      `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim();
    const phoneNumber =
      payload.phoneNumber?.internationalFormat ||
      payload.phoneNumber?.number ||
      payload.phoneNumber?.nationalFormat ||
      "";
    const dateOfIncorporation =
      payload.dateOfIncorporation?._seconds != null
        ? new Date(payload.dateOfIncorporation._seconds * 1000)
            .toISOString()
            .slice(0, 10)
        : "";

    form.reset({
      fullName,
      email: payload.email ?? "",
      businessName: payload.businessName ?? "",
      phoneNumber,
      registrationNumber: payload.registrationNumber ?? "",
      tinNumber: payload.tinNumber ?? "",
      dateOfIncorporation,
      placeOfIncorporation: payload.placeOfIncorporation ?? "",
      companyType: payload.companyType ?? "",
      approvalStatus: payload.approvalStatus ?? "",
    });
  }, [data, form]);

  function onSubmit(values: z.infer<typeof FleetManagerProfileFormSchema>) {
    console.log(values);
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p className="text-red-500">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Profile</h3>
        <p>Edit your profile here</p>
      </div>
      <div className="bg-secondary max-w-3xl mx-auto p-6 rounded-lg space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
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
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number (RC)</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="RC123456"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tinNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN Number</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="1234567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfIncorporation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Incorporation</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      type="date"
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
                      placeholder="Lagos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="Private Limited Company"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approval Status</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

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
  );
}

export default Profile;
