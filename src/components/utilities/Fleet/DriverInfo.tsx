import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import driver1 from "@/FolderToDelete/driver1.jpg";
import { Label } from "@/components/ui/label";
import { ComboboxForm, type ComboData } from "../ComboboxForm";

// --- Types ---
type DriverStatus = "assigned" | "unassigned" | "disabled";

interface PhoneNumber {
  internationalFormat: string;
  nationalFormat: string;
  number: string;
  countryCode: string;
  countryCallingCode: string;
}

interface Address {
  placeId: string;
  formatted_address: string;
  geometry: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  country: string;
  state: string;
}

interface ImageFile {
  url: string;
  path: string;
  contentType: string;
}

export interface Driver {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyEmail?: string;
  phoneNumber?: PhoneNumber;
  emergencyContact?: PhoneNumber;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  passport?: ImageFile;
  driversLicense?: ImageFile;
  approved?: boolean;
  regComplete?: boolean;
  emailVerified?: boolean;
  companyId?: string;
  companyName?: string;
  country?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: DriverStatus;
}

export const DriverInfo = ({
  driver,
  availableVehicle,
}: {
  driver: Driver;
  availableVehicle: ComboData[];
}) => {
  const [status, setStatus] = useState<DriverStatus>(
    driver.status || "unassigned"
  );

  const handleAssign = () => {
    if (status === "assigned") {
      setStatus("unassigned");
    } else {
      setStatus("assigned");
    }
  };

  const handleDisable = () => {
    setStatus("disabled");
    // Additional logic like API call
  };

  // Helper functions to format data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPhoneNumber = (phone?: PhoneNumber) => {
    if (!phone) return "Not provided";
    return phone.internationalFormat || phone.nationalFormat || phone.number;
  };

  const getDriverName = () => {
    const firstName = driver.firstName || "";
    const lastName = driver.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Driver";
  };

  const getStatusColor = () => {
    switch (status) {
      case "assigned":
        return "text-green-600";
      case "unassigned":
        return "text-yellow-600";
      case "disabled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-secondary max-w-3xl mx-auto p-6 rounded-lg">
      <div className="md:flex space-y-3 md:space-y-0 md:space-x-3">
        <div className="border border-line-1 bg-background rounded flex-1 text-center py-6">
          <h3 className="text-xl font-bold">{getDriverName()}</h3>
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
          <Image
            source={driver.passport?.url || driver1}
            alt="Driver Photo"
            className="mx-auto mt-3 w-50 h-50 border-8 border-accent rounded-full object-cover"
          />
        </div>
        <div className="border border-line-1 bg-background rounded flex-2 py-6 px-4">
          <h3>Bio & other details</h3>
          <div className="md:flex">
            <div className="flex-1">
              <div className="my-3">
                <Label>Phone Number</Label>
                <p className="text-muted-foreground text-sm">
                  {formatPhoneNumber(driver.phoneNumber)}
                </p>
              </div>

              <div className="my-3">
                <Label>Email</Label>
                <p className="text-muted-foreground text-sm">
                  {driver.email || driver.companyEmail || "Not provided"}
                </p>
              </div>

              <div className="my-3">
                <Label>Date of Birth</Label>
                <p className="text-muted-foreground text-sm">
                  {formatDate(driver.dateOfBirth)}
                </p>
              </div>

              <div className="my-3">
                <Label>Emergency Contact</Label>
                <p className="text-muted-foreground text-sm">
                  {formatPhoneNumber(driver.emergencyContact)}
                </p>
              </div>

              <div className="my-3">
                <Label>Vehicle</Label>
                <p className="text-muted-foreground text-sm">
                  {status === "assigned" ? "Assigned" : "Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="my-3">
                <Label>Home Address</Label>
                <p className="text-muted-foreground text-sm">
                  {driver.address?.formatted_address || "Not provided"}
                </p>
              </div>
              <div className="my-3">
                <Label>Gender</Label>
                <p className="text-muted-foreground text-sm">
                  {driver.gender || "Not provided"}
                </p>
              </div>

              <div className="my-3">
                <Label>Driver's License</Label>
                {driver.driversLicense?.url ? (
                  <Image
                    source={driver.driversLicense.url}
                    className="w-4/5 mt-1 rounded border"
                    alt="Driver's License"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 flex justify-end bg-background border border-line-1 p-3 rounded">
        <div>
          <div className="my-2">
            {status !== "assigned" ? (
              <div>
                <h3>Assign Vehicle</h3>
                <ComboboxForm info={availableVehicle} />
              </div>
            ) : (
              <Button onClick={handleAssign}>Unassign from Vehicle</Button>
            )}
          </div>

          <div className="my-2 flex space-x-3">
            <Link
              to="edit"
              className="text-primary flex justify-center items-center border rounded-md px-2 hover:text-accent"
            >
              Edit Driver
            </Link>

            {status !== "disabled" && (
              <Button onClick={handleDisable}>Disable Driver</Button>
            )}
          </div>
        </div>

        {/* <div>
          <h3 className="text-lg font-medium mt-6 mb-2">Trip History</h3>
          {driver.tripHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trips yet.</p>
          ) : (
            <ul className="space-y-2">
              {driver.tripHistory.map((trip) => (
                <li
                  key={trip.id}
                  className="border rounded p-3 text-sm items-center flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{trip.date}</div>
                    <div className="text-muted-foreground">
                      {trip.origin} → {trip.destination}
                    </div>
                  </div>
                  <div>₦ {trip.amount}</div>
                  <div>{trip.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div> */}
      </div>
    </div>
  );
};
