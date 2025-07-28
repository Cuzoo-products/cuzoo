import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  ShieldAlert,
  Wallet,
  ClipboardSignature,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

const mockDriver = {
  id: "drv_b3e1a9f4",
  name: "Marco Reyes",
  email: "marco.reyes@example.com",
  phone: "+1 (555) 123-4567",
  avatarUrl: "https://placehold.co/100x100/f59e0b/white?text=MR",
  status: "Active", // Can be 'Active', 'Pending Approval', 'Disabled'
  walletStatus: "Active", // Can be 'Active', 'Frozen'
  dateJoined: "2023-11-20T09:15:00Z",
  licenseImageUrl:
    "https://placehold.co/600x400/e2e8f0/475569?text=Driver%27s+License+Image",
};

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

const tripsData = [
  {
    date: "July 26, 2025",
    pickup: "Murtala Muhammed Airport, Ikeja",
    dropoff: "Eko Hotel & Suites, Victoria Island",
    fare: "₦8,500.00",
    status: "Completed",
  },
  {
    date: "July 25, 2025",
    pickup: "Ikeja City Mall, Alausa",
    dropoff: "Circle Mall, Lekki",
    fare: "₦6,000.00",
    status: "Completed",
  },
  {
    date: "July 25, 2025",
    pickup: "University of Lagos, Akoka",
    dropoff: "Palms Shopping Mall, Oniru",
    fare: "₦4,500.00",
    status: "Canceled",
  },
  {
    date: "July 24, 2025",
    pickup: "Landmark Beach, Oniru",
    dropoff: "Maryland Mall, Maryland",
    fare: "₦7,200.00",
    status: "Completed",
  },
  {
    date: "July 23, 2025",
    pickup: "Computer Village, Ikeja",
    dropoff: "Surulere",
    fare: "₦3,800.00",
    status: "Completed",
  },
];

function AdminDriverDetails() {
  const [driverData, setDriverData] = useState(mockDriver);
  const [isAccountActive, setIsAccountActive] = useState(
    mockDriver.status === "Active"
  );
  const [isWalletActive, setIsWalletActive] = useState(
    mockDriver.walletStatus === "Active"
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Effect to track if there are any unsaved changes
  useEffect(() => {
    const accountStatusChanged =
      (isAccountActive ? "Active" : "Disabled") !== driverData.status;
    const walletStatusChanged =
      (isWalletActive ? "Active" : "Frozen") !== driverData.walletStatus;
    setHasChanges(accountStatusChanged || walletStatusChanged);
  }, [isAccountActive, isWalletActive, driverData]);

  const handleSaveChanges = () => {
    const newStatus = isAccountActive ? "Active" : "Disabled";
    const newWalletStatus = isWalletActive ? "Active" : "Frozen";

    console.log("Saving Changes:", {
      status: newStatus,
      walletStatus: newWalletStatus,
    });

    setDriverData((prev) => ({
      ...prev,
      status: newStatus,
      walletStatus: newWalletStatus,
    }));
    setHasChanges(false);
  };

  const InfoRow = ({ icon, label, value }: InfoRowProps) => (
    <div className="flex items-start space-x-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl !font-bold">John Doe Details</h1>
        <p>Manage John Doe, assets, and documents.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="py-6 bg-secondary">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={driverData.avatarUrl}
                    alt={driverData.name}
                  />
                  <AvatarFallback>
                    {driverData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{driverData.name}</h2>
                <p className="text-sm text-muted-foreground">{driverData.id}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge
                    variant={
                      driverData.status === "Active" ? "default" : "destructive"
                    }
                  >
                    Account: {driverData.status}
                  </Badge>
                  <Badge
                    variant={
                      driverData.walletStatus === "Active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    Wallet: {driverData.walletStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-4 bg-secondary">
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={driverData.email}
              />
              <InfoRow
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={driverData.phone}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5" />}
                label="Date Joined"
                value={new Date(driverData.dateJoined).toLocaleDateString()}
              />
            </CardContent>
          </Card>
          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardSignature className="w-5 h-5 mr-2" />
                Driver's License
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={driverData.licenseImageUrl}
                alt="Driver's License"
                className="rounded-lg w-full h-auto object-cover border"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400/e2e8f0/475569?text=Image+Not+Found";
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Dropoff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tripsData.map((trip, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trip.date}</TableCell>
                      <TableCell>{trip.pickup}</TableCell>
                      <TableCell>{trip.dropoff}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trip.status === "Completed"
                              ? "default"
                              : trip.status === "Canceled"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{trip.fare}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>
                {" "}
                <Link to={`trips`}>see more</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Manage critical driver account and wallet settings. Changes
                require saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Disable Driver Account */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label
                    htmlFor="disable-account-switch"
                    className="font-medium flex items-center"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Driver Account
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isAccountActive
                      ? "Disabling will prevent the driver from logging in."
                      : "Enabling will restore driver access."}
                  </p>
                </div>
                <Switch
                  id="disable-account-switch"
                  checked={isAccountActive}
                  onCheckedChange={setIsAccountActive}
                  aria-label="Toggle driver account status"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label
                    htmlFor="disable-wallet-switch"
                    className="font-medium flex items-center"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Driver Wallet
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isWalletActive
                      ? "Freezing will block all wallet transactions."
                      : "Unfreezing will restore wallet functionality."}
                  </p>
                </div>
                <Switch
                  id="disable-wallet-switch"
                  checked={isWalletActive}
                  onCheckedChange={setIsWalletActive}
                  aria-label="Toggle driver wallet status"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-end w-full">
                <Button
                  variant="destructive"
                  onClick={handleSaveChanges}
                  disabled={!hasChanges}
                >
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default AdminDriverDetails;
