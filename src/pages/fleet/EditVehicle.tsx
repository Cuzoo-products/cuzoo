import PageHeader from "@/components/admin/PageHeader";
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
import Image from "@/components/ui/image";
import { useNavigate, useParams } from "react-router";

import {
  useGetVehicle,
  useUpdateVehicle,
} from "@/api/fleet/vehicles/useVehicles";
import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import { useEffect } from "react";

const VEHICLE_STATUS_VALUES = [
  "available",
  "in use",
  "under maintenance",
  "disabled",
] as const;

type VehicleStatusValue = (typeof VEHICLE_STATUS_VALUES)[number];

/** API may omit status or send ""; Zod requires a valid enum. */
function normalizeVehicleStatus(raw: unknown): VehicleStatusValue {
  if (typeof raw !== "string") return "available";
  const t = raw.trim();
  if (
    (VEHICLE_STATUS_VALUES as readonly string[]).includes(t)
  ) {
    return t as VehicleStatusValue;
  }
  return "available";
}

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

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        status: normalizeVehicleStatus(vehicleData.status),
      });
    }
  }, [vehicle, form]);

  /** Keep RHF `status` in sync with the Select: UI used normalize() but `field.value` could stay "". */
  const statusWatch = form.watch("status");
  useEffect(() => {
    const fixed = normalizeVehicleStatus(statusWatch);
    if (statusWatch !== fixed) {
      form.setValue("status", fixed, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [statusWatch, form]);

  const watchedImage = form.watch("image");

  function onSubmit(data: z.infer<typeof EditVehicleFormSchema>) {
    const vehicleData = vehicle?.data;
    const initialImage = vehicleData?.image?.url || "";
    const initialValues = {
      color: vehicleData?.color || "",
      type: vehicleData?.type || undefined,
      model: vehicleData?.model || "",
      plateNumber: vehicleData?.plateNumber || "",
      riderId: vehicleData?.riderId || "",
      image: initialImage,
      year: vehicleData?.year ?? new Date().getFullYear(),
      status: normalizeVehicleStatus(vehicleData?.status),
    };

    const resolvedImage = data.image || initialImage;
    const resolvedType = data.type || vehicleData?.type || "";

    const submitData: Record<string, unknown> = {};
    if (data.color !== initialValues.color) submitData.color = data.color;
    if (resolvedType !== (initialValues.type || ""))
      submitData.type = resolvedType;
    if (data.model !== initialValues.model) submitData.model = data.model;
    if (data.plateNumber !== initialValues.plateNumber)
      submitData.plateNumber = data.plateNumber;
    if ((data.riderId || "") !== (initialValues.riderId || ""))
      submitData.riderId = data.riderId || undefined;
    if (resolvedImage !== initialImage) submitData.image = resolvedImage;
    if (Number(data.year) !== Number(initialValues.year))
      submitData.year = data.year;
    if (data.status !== initialValues.status) submitData.status = data.status;

    if (Object.keys(submitData).length === 0) {
      toast.info("No changes to save");
      return;
    }
    if (!id) return;
    updateVehicle(
      { id: id as string, submitData },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--admin-accent)]" />
      </div>
    );
  }

  if (error || !vehicle?.data) {
    return (
      <div className="space-y-5">
        <PageHeader title="Edit vehicle" subtitle="Unable to load vehicle details" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Edit vehicle" subtitle="Edit this vehicle" />
      <div className="portal-form-panel mb-10">
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
                        <SelectTrigger className="fleet-form-control w-full">
                          <SelectValue placeholder="Select Vehicle type" />
                        </SelectTrigger>
                        <SelectContent className="fleet-select-menu">
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
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
                    <FleetFileInput
                      onFileSelect={async (file) => {
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch {
                            toast.error("Error processing vehicle image");
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
                    <Select
                      onValueChange={field.onChange}
                      value={normalizeVehicleStatus(field.value)}
                    >
                      <SelectTrigger className="fleet-form-control w-full">
                        <SelectValue placeholder="Select Vehicle Status" />
                      </SelectTrigger>
                      <SelectContent className="fleet-select-menu">
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
                            "fleet-form-control w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? availableDrivers.find(
                                (driver) => driver.value === field.value,
                              )?.label
                            : "Select driver (optional)"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="fleet-combobox-menu w-full p-0">
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
                                  !field.value ? "opacity-100" : "opacity-0",
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
                                      : "opacity-0",
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
              className="w-full mt-3 h-11"
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
