import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
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
import car from "@/FolderToDelete/car.jpg";
import Image from "@/components/ui/image";

const drivers = [
  { label: "John Doe", value: "1" },
  { label: "Jane Doe", value: "2" },
  { label: "Barry White", value: "3" },
  { label: "David Olushegun", value: "4" },
  { label: "MurFy Doe", value: "5" },
  { label: "Emma John", value: "6" },
  { label: "Victor kenzy", value: "7" },
  { label: "Tolu Jame", value: "8" },
  { label: "Larry Blue", value: "9" },
] as const;

function EditVehicle() {
  const form = useForm<z.infer<typeof AddVehicleFormSchema>>({
    resolver: zodResolver(AddVehicleFormSchema),
    defaultValues: {
      VehicleType: "Car",
      Make: "Toyata",
      Model: "Yaris",
      Year: "2015",
      Color: "Red",
      LicensePlateNumber: "EKY 322 XU",
      AssignedDriver: "3",
      VehicleStatus: "Available",
      VehicleImage: car,
    },
  });

  const watchedFile = form.watch("VehicleImage");

  const previewUrl = watchedFile
    ? typeof watchedFile === "string"
      ? watchedFile
      : URL.createObjectURL(watchedFile)
    : null;

  function onSubmit(data: z.infer<typeof AddVehicleFormSchema>) {
    console.log(data);
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Add Vehicle</h3>
        <p>Add to your fleet of vehicles</p>
      </div>
      <div className="bg-secondary md:w-3/4 mx-auto py-10 rounded-2xl mb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="VehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                        <SelectValue placeholder="Select Vehicle type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-0 shadow-accent shadow-sm">
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="Toyota"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Corolla, F-150"
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
              name="Year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="2005"
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
              name="Color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="red"
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
              name="LicensePlateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Plate Number</FormLabel>
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

            {previewUrl && (
              <div>
                <h3>Vehicle Image</h3>
                <Image
                  source={previewUrl}
                  alt="Driver's License"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="VehicleImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Vehicle Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="VehicleStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                        <SelectValue placeholder="Select Vehicle Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-0 shadow-accent shadow-sm">
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Under Maintenance">
                          Under Maintenance
                        </SelectItem>
                        <SelectItem value="Disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="AssignedDriver"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign Driver</FormLabel>
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
                            ? drivers.find(
                                (driver) => driver.value === field.value
                              )?.label
                            : "Select drivers"}
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
                            {drivers.map((driver) => (
                              <CommandItem
                                value={driver.label}
                                key={driver.value}
                                onSelect={() => {
                                  form.setValue("AssignedDriver", driver.value);
                                }}
                              >
                                {driver.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    driver.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
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
              className="w-full mt-3 h-11 bg-[#4D37B3] text-white"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditVehicle;
