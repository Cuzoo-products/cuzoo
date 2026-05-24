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
import { AddVehicleFormSchema } from "@/lib/zodVaildation";
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
import { useAddVehicles } from "@/api/fleet/vehicles/useVehicles";
import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import { useNavigate } from "react-router";

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

function AddVehicles() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof AddVehicleFormSchema>>({
    resolver: zodResolver(AddVehicleFormSchema),
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

  const { mutate: addVehicles, isPending } = useAddVehicles();
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

  function onSubmit(data: z.infer<typeof AddVehicleFormSchema>) {
    addVehicles(data, {
      onSuccess: () => {
        form.reset();
        navigate("/fleet/fleets");
      },
    });
  }

  return (
    <div className="fleet-form-page">
      <div className="fleet-form-shell fleet-form-shell--wide">
        <div className="fleet-form-header">
          <h1>Add vehicle</h1>
          <p>Add to your fleet of vehicles</p>
        </div>
        <div className="fleet-form-card">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              )}
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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Image</FormLabel>
                  <FormControl>
                    <FleetFileInput
                      onFileSelect={async (file) => {
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing vehicle image");
                            console.error("Error:", error);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
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

export default AddVehicles;
