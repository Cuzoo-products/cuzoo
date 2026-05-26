import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, fileToBase64, omitEmptyPayloadValues } from "@/lib/utils";
import { fleetKycformSchema } from "@/lib/zodVaildation";
import Header2 from "@/components/utilities/header2";
import { useFleetKyc } from "@/api/fleet/profile/useProfile";
import { FleetFileInput } from "@/components/fleet/FleetFileInput";

// --- DUMMY DATA ---
const courierServiceOptions = [
  { id: "Express Delivery", label: "Express Delivery" },
  { id: "International Shipping", label: "International Shipping" },
  { id: "Standard (3-5 days)", label: "Standard (3-5 days)" },
  { id: "Local On-Demand", label: "Local On-Demand" },
  {
    id: "Specialized (e.g., Cold Chain)",
    label: "Specialized (e.g., Cold Chain)",
  },
];

const insuranceOptions = [
  { id: "Goods-in-Transit", label: "Goods-in-Transit" },
  {
    id: "Comprehensive Vehicle Insurance",
    label: "Comprehensive Vehicle Insurance",
  },
  { id: "Marine Cargo Insurance", label: "Marine Cargo Insurance" },
  { id: "Public Liability Insurance", label: "Public Liability Insurance" },
];

export function FleetKyc() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof fleetKycformSchema>>({
    resolver: zodResolver(fleetKycformSchema),
    defaultValues: {
      registrationNumber: "",
      tinNumber: "",
      dateOfIncorporation: undefined,
      placeOfIncorporation: "",
      companyType: "",
      directors: [""],
      servicesRendered: [],
      insuranceCoverage: [],
      passport: undefined,
      certificateOfIncorporation: undefined,
      governmentApprovedId: undefined,
      proofOfAddress: undefined,
      insuranceCertificate: undefined,
      courierLicense: undefined,
    },
  });

  const { mutate, isPending } = useFleetKyc();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "directors",
  });

  const [step, setStep] = useState(1);

  const fileFieldKeys = [
    "passport",
    "certificateOfIncorporation",
    "governmentApprovedId",
    "proofOfAddress",
    "insuranceCertificate",
    "courierLicense",
  ] as const;

  async function toBase64IfFile(
    value: FileList | File | string | undefined,
  ): Promise<string | undefined> {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "string") return value;
    const file = value instanceof FileList ? value[0] : value;
    if (!file) return undefined;
    return fileToBase64(file);
  }

  async function onSubmit(values: z.infer<typeof fleetKycformSchema>) {
    const payload = { ...values } as Record<string, unknown>;
    for (const key of fileFieldKeys) {
      const v = values[key];
      payload[key] = await toBase64IfFile(
        v as FileList | File | string | undefined,
      );
    }
    if (payload.dateOfIncorporation instanceof Date) {
      payload.dateOfIncorporation =
        payload.dateOfIncorporation.toISOString();
    }
    const cleaned = omitEmptyPayloadValues(payload);
    mutate(cleaned as z.infer<typeof fleetKycformSchema>, {
      onSuccess: async () => {
        navigate("/kyc-submitted");
      },
    });
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const step1FieldNames = [
    "registrationNumber",
    "tinNumber",
    "dateOfIncorporation",
    "placeOfIncorporation",
    "companyType",
  ] as const;

  const step2FieldNames = ["servicesRendered", "insuranceCoverage"] as const;

  async function goNext() {
    if (step === 1) {
      const ok = await form.trigger([...step1FieldNames]);
      if (ok) nextStep();
      return;
    }
    if (step === 2) {
      const ok = await form.trigger([...step2FieldNames]);
      if (ok) nextStep();
      return;
    }
    if (step === 3) {
      const directorPaths = fields.map(
        (_, i) => `directors.${i}` as const,
      ) as `directors.${number}`[];
      const ok = await form.trigger(directorPaths);
      if (ok) nextStep();
    }
  }

  return (
    <div className="fleet-portal min-h-screen">
      <Header2 showLogout />
      <main className="fleet-form-page px-4">
        <div className="fleet-form-shell fleet-form-shell--wide">
          <div className="fleet-form-header">
            <h1>Fleet Company KYC Registration</h1>
            <p>Step {step} of 4 - Please complete all sections</p>
          </div>
          <div className="fleet-form-card">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 4) {
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              className="space-y-8"
            >
              {/* -------- Step 1 -------- */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold border-b mb-5 pb-2">
                    Company Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* RC / Registration No */}
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RC / Registration No.</FormLabel>
                          <FormControl>
                            <Input placeholder="RC123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* TIN */}
                    <FormField
                      control={form.control}
                      name="tinNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Identification Number (TIN)</FormLabel>
                          <FormControl>
                            <Input placeholder="12345678-0001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Date of Incorporation */}
                    <FormField
                      control={form.control}
                      name="dateOfIncorporation"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Incorporation</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="fleet-select-menu w-auto p-0 rounded"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date: Date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Place of Incorporation */}
                    <FormField
                      control={form.control}
                      name="placeOfIncorporation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Incorporation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Lagos, Nigeria"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Company Type */}
                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Company</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="fleet-select-menu">
                              <SelectItem value="Private Limited Company">
                                Private Limited Company
                              </SelectItem>
                              <SelectItem value="Public Limited Company">
                                Public Limited Company
                              </SelectItem>
                              <SelectItem value="LLC">LLC</SelectItem>
                              <SelectItem value="Incorporated Trustee">
                                Incorporated Trustee
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* -------- Step 2 -------- */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-5">
                    Services & Insurance
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Courier Services */}
                    <FormField
                      control={form.control}
                      name="servicesRendered"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Courier Services Rendered
                          </FormLabel>
                          {courierServiceOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="servicesRendered"
                              render={({ field }) => {
                                const prev = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={prev.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...prev, item.id])
                                            : field.onChange(
                                                prev.filter(
                                                  (val) => val !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Insurance Coverage */}
                    <FormField
                      control={form.control}
                      name="insuranceCoverage"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Type of Insurance Coverage
                          </FormLabel>
                          {insuranceOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="insuranceCoverage"
                              render={({ field }) => {
                                const prev = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={prev.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...prev, item.id])
                                            : field.onChange(
                                                prev.filter(
                                                  (val) => val !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* -------- Step 3 -------- */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-5">
                    Directors
                  </h3>
                  {/* Directors */}
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`directors.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                              Director Name(s)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={`Director ${index + 1} Name`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          className="mt-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="my-3"
                    onClick={() => append("")}
                  >
                    Add Director
                  </Button>
                  <FormMessage>
                    {form.formState.errors.directors?.message}
                  </FormMessage>
                </div>
              )}

              {/* -------- Step 4 -------- */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-5">
                    Document Uploads
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="certificateOfIncorporation"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Certificate of Incorporation</FormLabel>
                          <FormControl>
                            <FleetFileInput
                              accept="image/*,.pdf"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            PDF, JPG, or PNG. Max 5MB.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passport"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Passport Photograph</FormLabel>
                          <FormControl>
                            <FleetFileInput
                              accept="image/*"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            JPG or PNG. Max 5MB.
                          </FormDescription>
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
                            <FleetFileInput
                              accept="image/*,.pdf"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            NIN, Driver's License, etc. PDF, JPG, PNG.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proofOfAddress"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Proof of Address Document</FormLabel>
                          <FormControl>
                            <FleetFileInput
                              accept="image/*,.pdf"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Utility Bill, PDF, JPG, PNG.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insuranceCertificate"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Insurance Certificate</FormLabel>
                          <FormControl>
                            <FleetFileInput
                              accept="image/*,.pdf"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            PDF, JPG, PNG. Max 5MB.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="courierLicense"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Courier License</FormLabel>
                          <FormControl>
                            <FleetFileInput
                              accept="image/*,.pdf"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            PDF, JPG, PNG. Max 5MB.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* ---- Navigation Buttons ---- */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void goNext();
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button disabled={isPending} type="submit">
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Submit KYC"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
