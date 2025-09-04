import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fleetKycformSchema } from "@/lib/zodVaildation";
import Header2 from "@/components/utilities/header2";

// --- DUMMY DATA ---
const courierServiceOptions = [
  { id: "express", label: "Express Delivery" },
  { id: "international", label: "International Shipping" },
  { id: "standard", label: "Standard (3-5 days)" },
  { id: "local", label: "Local On-Demand" },
  { id: "specialized", label: "Specialized (e.g., Cold Chain)" },
];

export function FleetKyc() {
  const form = useForm<z.infer<typeof fleetKycformSchema>>({
    resolver: zodResolver(fleetKycformSchema),
    defaultValues: {
      companyName: "",
      companyType: "",
      placeOfIncorporation: "",
      registrationNumber: "",
      registeredAddress: "",
      taxIdNumber: "",
      dateOfIncorporation: undefined,
      insuranceCoverage: "",
      courierServices: [],
      directors: [{ name: "" }],
      authorizedRepresentative: {
        name: "",
        nationality: "",
        state: "",
        lga: "",
        address: "",
        position: "",
      },
      certificateOfIncorporation: undefined,
      passportPhotograph: undefined,
      governmentId: undefined,
      proofOfAddressDoc: undefined,
      insuranceCertificate: undefined,
      courierLicense: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "directors",
  });

  const [step, setStep] = useState(1);

  function onSubmit(values: z.infer<typeof fleetKycformSchema>) {
    console.log(values);
    alert("Form Submitted! Check console for details.");
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // File input helper
  const fileRef = form.register;

  return (
    <div>
      <Header2 />
      <Card className="max-w-4xl mx-auto my-16 bg-secondary py-6">
        <CardHeader>
          <CardTitle>Fleet Company KYC Registration</CardTitle>
          <CardDescription>
            Step {step} of 4 — Please complete all sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* -------- Step 1 -------- */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold border-b mb-5 pb-2">
                    Company Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Company Name */}
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., FastFleet Logistics"
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded bg-background border-0 shadow-accent shadow-sm">
                              <SelectItem value="private-limited">
                                Private Limited Company
                              </SelectItem>
                              <SelectItem value="public-limited">
                                Public Limited Company
                              </SelectItem>
                              <SelectItem value="business-name">
                                Business Name
                              </SelectItem>
                              <SelectItem value="llc">LLC</SelectItem>
                              <SelectItem value="incorporated-trustee">
                                Incorporated Trustee
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      name="taxIdNumber"
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
                                    !field.value && "text-muted-foreground"
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
                              className="w-auto p-0 rounded bg-background border-0 shadow-accent shadow-sm"
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
                  </div>
                </div>
              )}

              {/* -------- Step 2 -------- */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-5">
                    Address & Services
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="registeredAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Official / Registered Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Logistics Avenue, Lagos"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Insurance Coverage */}
                    <FormField
                      control={form.control}
                      name="insuranceCoverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Insurance Coverage</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select coverage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="goods-in-transit">
                                Goods-in-Transit
                              </SelectItem>
                              <SelectItem value="comprehensive">
                                Comprehensive Vehicle Insurance
                              </SelectItem>
                              <SelectItem value="marine">
                                Marine Cargo Insurance
                              </SelectItem>
                              <SelectItem value="liability">
                                Public Liability Insurance
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Courier Services */}
                    <FormField
                      control={form.control}
                      name="courierServices"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Courier Services Rendered
                          </FormLabel>
                          {courierServiceOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="courierServices"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        Array.isArray(field.value) &&
                                        field.value.includes(item.id)
                                      }
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (val) => val !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )}
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
                        name={`directors.${index}.name`}
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
                    onClick={() => append({ name: "" })}
                  >
                    Add Director
                  </Button>
                  <FormMessage>
                    {form.formState.errors.directors?.message}
                  </FormMessage>

                  {/* Authorized Rep */}

                  <h3 className="text-lg font-semibold border-b pb-2 mb-5">
                    Authorized Representative
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 mt-6">
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position / Role</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Nigerian" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State of Origin</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Anambra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.lga"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LGA</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Idemili North"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedRepresentative.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residential Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 45 Freedom Way"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                      render={() => (
                        <FormItem className="my-3">
                          <FormLabel>Certificate of Incorporation</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...fileRef("certificateOfIncorporation")}
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
                      name="passportPhotograph"
                      render={() => (
                        <FormItem className="my-3">
                          <FormLabel>Passport Photograph</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...fileRef("passportPhotograph")}
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
                      name="governmentId"
                      render={() => (
                        <FormItem>
                          <FormLabel>Government Approved ID</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef("governmentId")} />
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
                      name="proofOfAddressDoc"
                      render={() => (
                        <FormItem className="my-3">
                          <FormLabel>Proof of Address Document</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...fileRef("proofOfAddressDoc")}
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
                      render={() => (
                        <FormItem className="my-3">
                          <FormLabel>Insurance Certificate</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...fileRef("insuranceCertificate")}
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
                      render={() => (
                        <FormItem className="my-3">
                          <FormLabel>Courier License</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef("courierLicense")} />
                          </FormControl>
                          <FormDescription>
                            If applicable. PDF, JPG, PNG. Max 5MB.
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
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit KYC</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
