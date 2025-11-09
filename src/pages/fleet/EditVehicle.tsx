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
import { EditVehicleFormSchema } from "@/lib/zodVaildation";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "@/components/ui/image";
import { useParams } from "react-router";

import {
  useGetVehicle,
  useUpdateVehicle,
} from "@/api/fleet/vehicles/useVehicles";
import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import { useEffect } from "react";

// Interface for rider data structure
interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: {
    internationalFormat: string;
    nationalFormat: string;
    number: string;
  };
  approved: boolean;
  regComplete: boolean;
}

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function EditVehicle() {
  const { id } = useParams();
  const { data: vehicle, isLoading, error } = useGetVehicle(id as string);
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();
  const { data: riders } = useGetRiders();

  // Type for driver dropdown items
  interface DriverOption {
    label: string;
    value: string;
  }

  // Transform riders data for the dropdown
  const availableDrivers: DriverOption[] =
    riders?.data?.data?.map((rider: Rider) => ({
      label: `${rider.firstName} ${rider.lastName}`,
      value: rider.id,
    })) || [];

  const form = useForm<z.infer<typeof EditVehicleFormSchema>>({
    resolver: zodResolver(EditVehicleFormSchema),
    defaultValues: {
      color: "",
      type: undefined,
      model: "",
      plateNumber: "",
      riderId: "",
      image: "",
      year: new Date().getFullYear(),
      status: "available",
    },
  });

  // Populate form with existing vehicle data
  useEffect(() => {
    if (vehicle?.data) {
      const vehicleData = vehicle.data;
      form.reset({
        color: vehicleData.color || "",
        type: vehicleData.type || undefined,
        model: vehicleData.model || "",
        plateNumber: vehicleData.plateNumber || "",
        riderId: vehicleData.riderId || "",
        image: vehicleData.image?.url || "",
        year: vehicleData.year || new Date().getFullYear(),
        status: vehicleData.status || "available",
      });
    }
  }, [vehicle, form]);

  const watchedImage = form.watch("image");

  function onSubmit(data: z.infer<typeof EditVehicleFormSchema>) {
    // If no new image is selected, keep the existing image URL
    const submitData = {
      ...data,
      image: data.image || vehicle?.data?.image?.url || "",
      type: data.type || vehicle?.data?.type || "",
    };

    updateVehicle({ id, submitData });
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4D37B3]"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle?.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl text-red-600">
            Vehicle Not Found
          </h3>
          <p>Unable to load vehicle details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Edit Vehicle</h3>
        <p>Edit this vehicle</p>
      </div>
      <div className="bg-secondary md:w-3/4 mx-auto py-10 rounded-2xl mb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || vehicle?.data?.type || "car"}
                      >
                        <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                          <SelectValue placeholder="Select Vehicle type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-0 shadow-accent shadow-sm">
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="bike">Bike</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="tricycle">Tricycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Corolla, F-150, etc."
                      className="border-[rgb(214,214,214)] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      placeholder="2024"
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Red, Blue, White, etc."
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
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EKY 345 XV"
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {watchedImage && (
              <div>
                <h3>Vehicle Image</h3>
                <Image
                  source={watchedImage}
                  alt="Vehicle Image"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Vehicle Image (Optional)</FormLabel>
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
                            toast.error("Error processing vehicle image");
                            // console.error("Error:", error);
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                        <SelectValue placeholder="Select Vehicle Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-0 shadow-accent shadow-sm">
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in use">In Use</SelectItem>
                        <SelectItem value="under maintenance">
                          Under Maintenance
                        </SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riderId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign Driver (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between bg-transparent border-[#d6d6d6]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? availableDrivers.find(
                                (driver) => driver.value === field.value
                              )?.label
                            : "Select driver (optional)"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full bg-background border-0 shadow-accent shadow-sm p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search driver..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No driver found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                form.setValue("riderId", "");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              No driver assigned
                            </CommandItem>
                            {availableDrivers.map((driver) => (
                              <CommandItem
                                value={driver.label}
                                key={driver.value}
                                onSelect={() => {
                                  form.setValue("riderId", driver.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    driver.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {driver.label}
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
              className="w-full mt-3 h-11 bg-[#4D37B3] text-white"
            >
              {isPending ? "Updating..." : "Update Vehicle"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditVehicle;
