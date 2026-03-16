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
import { VendorProfileFormSchema } from "@/lib/zodVaildation";
import { useGetVendorProfile, useUpdateVendorProfile } from "@/api/vendor/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/utilities/Loader";

type PhoneNumberPayload = {
  countryCode?: string;
  nationalFormat?: string;
  number?: string;
  internationalFormat?: string;
  countryCallingCode?: string;
};

type DocAsset = { path?: string; url?: string; type?: string };

type AddressPayload = {
  formatted_address?: string;
  description?: string;
  placeId?: string;
  landMark?: string;
  country?: string;
  state?: string;
  direction?: string;
  distance?: number;
  duration?: number;
};

type ProprietorPayload = {
  name?: string;
  nationality?: string;
  state?: string;
  residentialAddress?: string;
  declaration?: string;
};

export type VendorProfilePayload = {
  Id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: PhoneNumberPayload;
  logo?: DocAsset;
  storeCode?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string;
  placeOfIncorporation?: string;
  businessType?: string;
  address?: AddressPayload;
  emailVerified?: boolean;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
  typeOfGoodsSold?: string;
  proprietor?: ProprietorPayload;
  passport?: DocAsset;
  certificateOfIncorporation?: DocAsset;
  governmentApprovedId?: DocAsset;
  proofOfAddress?: DocAsset;
  lgaPermit?: DocAsset;
  gphLicense?: DocAsset;
  nafdacRegistration?: DocAsset;
  createdAt?: string;
  updatedAt?: string;
};

type VendorProfileResponse = {
  success: boolean;
  statusCode: number;
  data: VendorProfilePayload;
};

function VendorProfile() {
  const { data, isLoading, error } = useGetVendorProfile() as {
    data?: VendorProfileResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateVendorProfile();

  const form = useForm<z.infer<typeof VendorProfileFormSchema>>({
    resolver: zodResolver(VendorProfileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      storeCode: "",
      registrationNumber: "",
      dateOfIncorporation: "",
      placeOfIncorporation: "",
      businessType: "",
      address: "",
      typeOfGoodsSold: "",
      approvalStatus: "",
    },
  });

  useEffect(() => {
    const payload = data?.data;
    if (!payload) return;

    const fullName = `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim();
    const phoneNumber =
      payload.phoneNumber?.internationalFormat ??
      payload.phoneNumber?.nationalFormat ??
      payload.phoneNumber?.number ??
      "";
    const raw = payload.dateOfIncorporation as string | Date | number | { toDate: () => Date } | undefined;
    let dateOfIncorporation = "";
    if (typeof raw === "string") {
      dateOfIncorporation = raw.slice(0, 10);
    } else if (raw instanceof Date) {
      dateOfIncorporation = raw.toISOString().slice(0, 10);
    } else if (raw && typeof raw === "object" && "toDate" in raw && typeof (raw as { toDate: () => Date }).toDate === "function") {
      dateOfIncorporation = (raw as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
    } else if (typeof raw === "number") {
      dateOfIncorporation = new Date(raw).toISOString().slice(0, 10);
    }
    const address =
      payload.address?.formatted_address ??
      payload.address?.description ??
      "";

    form.reset({
      fullName,
      email: payload.email ?? "",
      businessName: payload.businessName ?? "",
      phoneNumber,
      storeCode: payload.storeCode ?? "",
      registrationNumber: payload.registrationNumber ?? "",
      dateOfIncorporation,
      placeOfIncorporation: payload.placeOfIncorporation ?? "",
      businessType: payload.businessType ?? "",
      address,
      typeOfGoodsSold: payload.typeOfGoodsSold ?? "",
      approvalStatus: payload.approvalStatus ?? "",
    });
  }, [data, form]);

  function onSubmit(values: z.infer<typeof VendorProfileFormSchema>) {
    const [firstName, ...lastParts] = (values.fullName || "").trim().split(/\s+/);
    const lastName = lastParts.join(" ") || firstName;
    updateProfile({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: values.email,
      businessName: values.businessName,
      phoneNumber: values.phoneNumber,
      storeCode: values.storeCode || undefined,
      registrationNumber: values.registrationNumber || undefined,
      dateOfIncorporation: values.dateOfIncorporation || undefined,
      placeOfIncorporation: values.placeOfIncorporation || undefined,
      businessType: values.businessType || undefined,
      typeOfGoodsSold: values.typeOfGoodsSold || undefined,
    });
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
        <Loader />
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

  const profile = data.data;

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p className="text-muted-foreground">View and edit your vendor profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile.logo?.url} alt={profile.businessName} />
            <AvatarFallback>
              {(profile.businessName || profile.firstName || "V")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{profile.businessName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.approvalStatus}
            </p>
          </div>
        </div>
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
                      placeholder="Your business name"
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
              name="storeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Code</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="Store code"
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
                      placeholder="e.g. Lagos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="e.g. Logistics, E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="Business address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeOfGoodsSold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Goods Sold</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="e.g. Cosmetics, Food, Electronics"
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
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3] bg-muted"
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
              disabled={isUpdating}
            >
              {isUpdating ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VendorProfile;
