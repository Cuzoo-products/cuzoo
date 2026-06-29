import PageHeader from "@/components/admin/PageHeader";
import { FleetFileInput } from "@/components/fleet/FleetFileInput";
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
import { DatePicker } from "@/components/ui/date-picker";
import { EditDriverFormSchema } from "@/lib/zodVaildation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "@/components/ui/image";
import { useNavigate, useParams } from "react-router";
import { useGetRider, useUpdateRider } from "@/api/fleet/rider/useRiderQuery";
import { GogglePlace } from "@/components/utilities/GogglePlace";
import { toast } from "sonner";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { fileToBase64 } from "@/lib/utils";
import Loader from "@/components/utilities/Loader";
import { normalizeInternationalPhoneCompact } from "@/lib/phone";

const normalizeToE164 = (value?: string) =>
  normalizeInternationalPhoneCompact(value ?? "");

function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof EditDriverFormSchema>>({
    resolver: zodResolver(EditDriverFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male" as const,
      passport: "",
      driversLicense: "",
      address: "",
      phoneNumber: "",
      dateOfBirth: "",
      emergencyContact: "",
    },
  });

  const watchedPassport = form.watch("passport");
  const watchedDriversLicense = form.watch("driversLicense");
  const { mutate: updateDriver, isPending } = useUpdateRider();
  const { data: rider, isLoading, error } = useGetRider(id as string);

  // Populate form with existing driver data
  useEffect(() => {
    if (rider?.data) {
      const driverData = Array.isArray(rider.data) ? rider.data[0] : rider.data;
      if (driverData) {
        form.reset({
          firstName: driverData.firstName || "",
          lastName: driverData.lastName || "",
          gender: (driverData.gender as "Male" | "Female") || "Male",
          passport: driverData.passport?.url || "",
          driversLicense: driverData.driversLicense?.url || "",
          address: driverData.address?.placeId || "",
          phoneNumber: normalizeToE164(
            driverData.phoneNumber?.internationalFormat || "",
          ),
          dateOfBirth: driverData.dateOfBirth
            ? new Date(driverData.dateOfBirth).toISOString().split("T")[0]
            : "",
          emergencyContact: normalizeToE164(
            driverData.emergencyContact?.internationalFormat || "",
          ),
        });
      }
    }
  }, [rider, form]);

  function onSubmit(data: z.infer<typeof EditDriverFormSchema>) {
    if (!id) return;
    const currentDriver = Array.isArray(rider?.data)
      ? rider.data[0]
      : rider?.data;
    const initialPassport = currentDriver?.passport?.url || "";
    const initialDriversLicense = currentDriver?.driversLicense?.url || "";

    const payload: Record<string, unknown> = {
      ...data,
      phoneNumber: normalizeToE164(data.phoneNumber),
      emergencyContact: normalizeToE164(data.emergencyContact),
    };

    // Only send image fields when they were changed
    if ((data.passport || "") === initialPassport) {
      delete payload.passport;
    }
    if ((data.driversLicense || "") === initialDriversLicense) {
      delete payload.driversLicense;
    }

    updateDriver(
      { id: id as string, data: payload },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error || !rider?.data) {
    return (
      <div className="space-y-5">
        <PageHeader title="Edit driver" subtitle="Unable to load driver details" />
      </div>
    );
  }

  const driverData = Array.isArray(rider.data) ? rider.data[0] : rider.data;
  const driverName = driverData
    ? `${driverData.firstName || ""} ${driverData.lastName || ""}`.trim() ||
      "Unknown Driver"
    : "Unknown Driver";

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Edit ${driverName}`}
        subtitle={`Make changes to ${driverName}'s details`}
      />
      <div className="portal-form-panel mb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
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
                        className="h-11"
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      valueType="string"
                      buttonClassName="h-11"
                      popoverContentClassName="fleet-select-menu"
                      disableDate={(date) => date > new Date()}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="fleet-form-control w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="fleet-select-menu">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Phone Number (International Format)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+2348031234567"
                      className="h-11"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Remove all spaces and non-digit characters except +
                        value = value.replace(/[^\d+]/g, "");
                        // Ensure it starts with +
                        if (value && !value.startsWith("+")) {
                          value = "+" + value;
                        }
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
                    Enter phone number with country code (e.g., +2348031234567)
                  </p>
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
                    <GogglePlace
                      value={field.value}
                      onChange={(placeId) => {
                        field.onChange(placeId);
                      }}
                      placeholder="Enter address..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                  <p className="text-sm text-muted-foreground">
                    Select an address from the dropdown suggestions. The place
                    ID will be sent to the backend.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Emergency Contact (International Format)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+2348031234567"
                      className="h-11"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Remove all spaces and non-digit characters except +
                        value = value.replace(/[^\d+]/g, "");
                        // Ensure it starts with +
                        if (value && !value.startsWith("+")) {
                          value = "+" + value;
                        }
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
                    Enter emergency contact phone number with country code
                    (e.g., +2348031234567)
                  </p>
                </FormItem>
              )}
            />

            {watchedPassport && (
              <div>
                <h3>Passport Image</h3>
                <Image
                  source={watchedPassport}
                  alt="Passport"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="passport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Passport Image (Optional)</FormLabel>
                  <FormControl>
                    <FleetFileInput
                      onFileSelect={async (file) => {
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep the current image
                  </p>
                </FormItem>
              )}
            />

            {watchedDriversLicense && (
              <div>
                <h3>Driver's License Image</h3>
                <Image
                  source={watchedDriversLicense}
                  alt="Driver's License"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="driversLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Change Driver's License Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <FleetFileInput
                      onFileSelect={async (file) => {
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error(
                              "Error processing driver's license image",
                            );
                            console.error("Error:", error);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep the current image
                  </p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 h-11"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update Driver"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditDriver;
