import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn, fileToBase64 } from "@/lib/utils";
import Header2 from "@/components/utilities/header2";
import { GogglePlace } from "@/components/utilities/GogglePlace";
import { useUpdateVendorProfile } from "@/api/vendor/auth/useAuth";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const BUSINESS_TYPES = [
  "Logistics",
  "E-commerce",
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Services",
  "Other",
] as const;

const vendorKycSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  dateOfIncorporation: z.date({
    required_error: "Date of incorporation is required",
  }),
  placeOfIncorporation: z.string().min(1, "Place of incorporation is required"),
  businessType: z.enum(BUSINESS_TYPES, {
    required_error: "Business type is required",
  }),
  logo: z.union([z.string(), z.any()]).optional(),
  addressPlaceId: z.string().min(1, "Business address is required"),
  typeOfGoodsSold: z.string().min(1, "Type of goods sold is required"),
  proprietor: z.object({
    name: z.string().min(1, "Proprietor name is required"),
    nationality: z.string().min(1, "Nationality is required"),
    state: z.string().min(1, "State is required"),
    residentialAddress: z.string().min(1, "Residential address is required"),
    declaration: z.string().min(1, "Declaration is required"),
  }),
  passport: z.any().optional(),
  certificateOfIncorporation: z.any().optional(),
  governmentApprovedId: z.any().optional(),
  proofOfAddress: z.any().optional(),
  lgaPermit: z.any().optional(),
  gphLicense: z.any().optional(),
  nafdacRegistration: z.any().optional(),
});

type VendorKycFormValues = z.infer<typeof vendorKycSchema>;

async function toBase64(
  value: FileList | File | string | undefined,
): Promise<string | undefined> {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  const file = value instanceof FileList ? value[0] : value;
  if (!file) return undefined;
  return fileToBase64(file);
}

export function VendorKycForm() {
  const { mutate: updateVendorProfile, isPending: isUpdatingProfile } =
    useUpdateVendorProfile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<VendorKycFormValues>({
    resolver: zodResolver(vendorKycSchema),
    defaultValues: {
      registrationNumber: "",
      dateOfIncorporation: undefined,
      placeOfIncorporation: "",
      businessType: undefined,
      logo: "",
      addressPlaceId: "",
      typeOfGoodsSold: "",
      proprietor: {
        name: "",
        nationality: "",
        state: "",
        residentialAddress: "",
        declaration: "",
      },
      passport: undefined,
      certificateOfIncorporation: undefined,
      governmentApprovedId: undefined,
      proofOfAddress: undefined,
      lgaPermit: undefined,
      gphLicense: undefined,
      nafdacRegistration: undefined,
    },
  });

  const [step, setStep] = useState(1);

  async function onSubmit(values: VendorKycFormValues) {
    const payload = {
      registrationNumber: values.registrationNumber,
      dateOfIncorporation: values.dateOfIncorporation
        ? new Date(values.dateOfIncorporation).toISOString()
        : "",
      placeOfIncorporation: values.placeOfIncorporation,
      businessType: values.businessType ?? "",
      logo:
        (typeof values.logo === "string"
          ? values.logo
          : await toBase64(values.logo as FileList | File)) ?? "",
      addressPlaceId: values.addressPlaceId,
      typeOfGoodsSold: values.typeOfGoodsSold,
      proprietor: values.proprietor,
      passport:
        (await toBase64(
          values.passport as FileList | File | string | undefined,
        )) ?? "",
      certificateOfIncorporation:
        (await toBase64(
          values.certificateOfIncorporation as
            | FileList
            | File
            | string
            | undefined,
        )) ?? "",
      governmentApprovedId:
        (await toBase64(
          values.governmentApprovedId as FileList | File | string | undefined,
        )) ?? "",
      proofOfAddress:
        (await toBase64(
          values.proofOfAddress as FileList | File | string | undefined,
        )) ?? "",
      lgaPermit:
        (await toBase64(
          values.lgaPermit as FileList | File | string | undefined,
        )) ?? "",
      gphLicense:
        (await toBase64(
          values.gphLicense as FileList | File | string | undefined,
        )) ?? "",
      nafdacRegistration:
        (await toBase64(
          values.nafdacRegistration as FileList | File | string | undefined,
        )) ?? "",
    };
    updateVendorProfile(payload, {
      onSuccess: async () => {
        await signOut(auth);
        dispatch(logout());
        navigate("/kyc-submitted");
      },
    });
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div>
      <Header2 showLogout />

      <Card className="max-w-3xl mx-auto my-8 bg-secondary py-6">
        <CardHeader>
          <CardTitle>Vendor Registration KYC</CardTitle>
          <CardDescription>
            Step {step} of 3 — Fill all details carefully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 3) {
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              className="space-y-8"
            >
              {/* STEP 1: Business info */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number (RC)</FormLabel>
                        <FormControl>
                          <Input placeholder="RC123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfIncorporation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Incorporation</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="p-0 bg-background"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
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
                          <Input placeholder="Lagos, Nigeria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {BUSINESS_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await fileToBase64(file);
                                field.onChange(base64);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressPlaceId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <GogglePlace
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter business address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typeOfGoodsSold"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Type of Goods Sold</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cosmetics, Food, Electronics..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 2: Proprietor */}
              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="proprietor.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Proprietor</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proprietor.nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="Nigerian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proprietor.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proprietor.residentialAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="45 Freedom Way, Lagos"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proprietor.declaration"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Declaration</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I hereby declare..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 3: Documents */}
              {step === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="passport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passport</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certificateOfIncorporation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate of Incorporation</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="governmentApprovedId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Government Approved ID</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofOfAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proof of Address</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lgaPermit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LGA Permit</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gphLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPH License (if applicable)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nafdacRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          NAFDAC Registration (if applicable)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                  >
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextStep();
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
