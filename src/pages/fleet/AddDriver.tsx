import { useState } from "react";
import { FleetFileInput } from "@/components/fleet/FleetFileInput";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { AddDriverFormSchema } from "@/lib/zodVaildation";
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
import { cn, fileToBase64 } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCreateRiders } from "@/api/fleet/rider/useRiderQuery";
import { useGetFleetProfile } from "@/api/fleet/profile/useProfile";
import { GogglePlace } from "@/components/utilities/GogglePlace";
import { useGetVehicles } from "@/api/fleet/vehicles/useVehicles";
import { useNavigate } from "react-router";

type VehiclesResponse = {
  data?: {
    data?: {
      id: string;
      model?: string;
      type?: string;
      plateNumber?: string;
    }[];
  };
};

type CreateRiderResponse = {
  data?: {
    password?: string;
    message?: string;
  };
};

type FleetProfileResponse = {
  data?: {
    businessName?: string;
  };
};

function AddDriver() {
  const navigate = useNavigate();
  const [addressLabel, setAddressLabel] = useState("");
  const { data: profileResponse } = useGetFleetProfile() as {
    data?: FleetProfileResponse;
  };
  const businessName = profileResponse?.data?.businessName?.trim() ?? "";
  const { data: vehiclesResponse, isLoading: vehiclesLoading } =
    useGetVehicles() as {
      data?: VehiclesResponse;
      isLoading: boolean;
    };

  const vehicleList = vehiclesResponse?.data?.data ?? [];
  const vehicleOptions = vehicleList.map((v) => ({
    value: v.id,
    label: `${v.type || v.model || "Vehicle"} (${v.plateNumber || "N/A"})`,
  }));
  const form = useForm<z.infer<typeof AddDriverFormSchema>>({
    resolver: zodResolver(AddDriverFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      gender: undefined,
      dateOfBirth: "",
      emergencyContact: "",
      vehicleId: "",
      passport: "",
      driversLicense: "",
      address: "",
    },
  });
  const { mutate: createDriver, isPending } = useCreateRiders();

  function onSubmit(data: z.infer<typeof AddDriverFormSchema>) {
    if (!businessName) {
      toast.error("Business name is missing from your profile.");
      return;
    }

    createDriver(data, {
      onSuccess: (response: CreateRiderResponse) => {
        const password = response?.data?.password?.trim();
        if (!password) {
          toast.error("Driver created but no password was returned.");
          navigate("/fleet/drivers");
          return;
        }

        form.reset();
        navigate("/fleet/drivers/credentials", {
          replace: true,
          state: {
            firstName: data.firstName,
            lastName: data.lastName,
            businessName,
            password,
          },
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add driver. Please try again.");
      },
    });
  }

  return (
    <div className="fleet-form-page">
      <div className="fleet-form-shell fleet-form-shell--wide">
        <div className="fleet-form-header">
          <h1>Add driver</h1>
          <p>Add to your list of drivers</p>
        </div>
        <div className="fleet-form-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input className="h-11" placeholder="John" {...field} />
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
                        <Input className="h-11" placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          autoComplete="tel"
                          placeholder="+2348031234567"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        International format, no spaces (e.g. +2348031234567)
                      </FormDescription>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        autoComplete="tel"
                        placeholder="+2349021234567"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Same format as phone (compact international, no spaces)
                    </FormDescription>
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
                      <GogglePlace
                        value={field.value}
                        label={addressLabel}
                        onChange={(placeId, address) => {
                          field.onChange(placeId);
                          setAddressLabel(address);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Select an address from the dropdown suggestions.
                    </FormDescription>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="passport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Image</FormLabel>
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
                      <FormDescription>
                        Upload passport image. JPG or PNG.
                      </FormDescription>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driversLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver's License Image</FormLabel>
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
                      <FormDescription>
                        Upload driver's license image. JPG or PNG.
                      </FormDescription>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assign Vehicle (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={vehiclesLoading}
                            className={cn(
                              "fleet-form-control w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? vehicleOptions.find(
                                  (vehicle) => vehicle.value === field.value,
                                )?.label
                              : vehiclesLoading
                                ? "Loading vehicles..."
                                : "Select vehicle (optional)"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="fleet-combobox-menu w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search vehicles..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No vehicle found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  form.setValue("vehicleId", "");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    !field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                No vehicle assigned
                              </CommandItem>
                              {vehicleOptions.map((vehicle) => (
                                <CommandItem
                                  value={vehicle.label}
                                  key={vehicle.value}
                                  onSelect={() => {
                                    form.setValue("vehicleId", vehicle.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      vehicle.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {vehicle.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="fleet-form-submit mt-3"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddDriver;
