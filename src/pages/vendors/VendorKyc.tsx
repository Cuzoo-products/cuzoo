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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Header2 from "@/components/utilities/header2";

// ----------------- SCHEMA -----------------
const vendorFormSchema = z.object({
  nameOfBusiness: z.string().min(2),
  dateOfIncorporation: z.date(),
  placeOfIncorporation: z.string(),
  rcNumber: z.string(),
  typeOfBusiness: z.string(),
  officialAddress: z.string(),
  proofOfAddress: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().optional(),
  goodsSold: z.string(),
  registrationNumberForGoods: z.string().optional(),
  amountOfWares: z.string(),
  proprietorName: z.string(),
  proprietorNationality: z.string(),
  proprietorState: z.string(),
  proprietorLga: z.string(),
  proprietorAddress: z.string(),
  declaration: z.string(),
  businessCertificate: z.any(),
  passportOfProprietor: z.any(),
  idCard: z.any(),
  proofOfBusinessAddress: z.any(),
  ghpLicense: z.any().optional(),
  nafdacRegistration: z.any().optional(),
  lgaPermit: z.any().optional(),
});

// ----------------- COMPONENT -----------------
export function VendorKycForm() {
  const form = useForm<z.infer<typeof vendorFormSchema>>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      nameOfBusiness: "",
      placeOfIncorporation: "",
      rcNumber: "",
      typeOfBusiness: "",
      officialAddress: "",
      proofOfAddress: "",
      phone: "",
      email: "",
      website: "",
      goodsSold: "",
      registrationNumberForGoods: "",
      amountOfWares: "",
      proprietorName: "",
      proprietorNationality: "",
      proprietorState: "",
      proprietorLga: "",
      proprietorAddress: "",
      declaration: "",
    },
  });

  const [step, setStep] = useState(1);
  const fileRef = form.register;

  function onSubmit(values: z.infer<typeof vendorFormSchema>) {
    console.log(values);
    alert("Vendor form submitted!");
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div>
      <Header2 showLogout />

      <Card className="max-w-3xl mx-auto my-8 bg-secondary py-6">
        <CardHeader>
          <CardTitle>Vendor Registration KYC</CardTitle>
          <CardDescription>
            Step {step} of 4 — Fill all details carefully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* STEP 1: Business Info */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nameOfBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Business</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Ventures Ltd" {...field} />
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
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="p-0">
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
                    name="rcNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RC Number</FormLabel>
                        <FormControl>
                          <Input placeholder="RC123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typeOfBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Business</FormLabel>
                        <FormControl>
                          <Input placeholder="Retail / Wholesale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 2: Contact & Operations */}
              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="officialAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Market Street, Lagos"
                            {...field}
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
                        <FormLabel>Specify Proof of Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Utility Bill" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+2348012345678" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="info@vendor.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="www.vendor.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goodsSold"
                    render={({ field }) => (
                      <FormItem>
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
                  <FormField
                    control={form.control}
                    name="registrationNumberForGoods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Registration Number (if applicable)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NAFDAC / Import Reg No"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amountOfWares"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount of Wares Available</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 500 units" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 3: Proprietor */}
              {step === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="proprietorName"
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
                    name="proprietorNationality"
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
                    name="proprietorState"
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
                    name="proprietorLga"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LGA</FormLabel>
                        <FormControl>
                          <Input placeholder="Ikeja" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proprietorAddress"
                    render={({ field }) => (
                      <FormItem>
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
                    name="declaration"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Declaration / Signature</FormLabel>
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

              {/* STEP 4: Checklist */}
              {step === 4 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessCertificate"
                    render={() => (
                      <FormItem>
                        <FormLabel>Business Certificate</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            {...fileRef("businessCertificate")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passportOfProprietor"
                    render={() => (
                      <FormItem>
                        <FormLabel>Passport of Proprietor</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            {...fileRef("passportOfProprietor")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idCard"
                    render={() => (
                      <FormItem>
                        <FormLabel>ID Card</FormLabel>
                        <FormControl>
                          <Input type="file" {...fileRef("idCard")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofOfBusinessAddress"
                    render={() => (
                      <FormItem>
                        <FormLabel>Proof of Business Address</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            {...fileRef("proofOfBusinessAddress")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ghpLicense"
                    render={() => (
                      <FormItem>
                        <FormLabel>GHP License (if food vendor)</FormLabel>
                        <FormControl>
                          <Input type="file" {...fileRef("ghpLicense")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nafdacRegistration"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          NAFDAC Registration (if applicable)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            {...fileRef("nafdacRegistration")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lgaPermit"
                    render={() => (
                      <FormItem>
                        <FormLabel>LGA Permit</FormLabel>
                        <FormControl>
                          <Input type="file" {...fileRef("lgaPermit")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* NAVIGATION */}
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
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
