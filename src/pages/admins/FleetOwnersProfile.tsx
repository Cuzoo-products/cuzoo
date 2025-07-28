import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Truck, User, Users } from "lucide-react";
import FinancialReport from "@/components/utilities/Admins/FinancialReport";

interface FleetManagerDocument {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

interface FleetManager {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarUrl?: string;
  isAccountActive: boolean;
  fleetCount: number;
  driverCount: number;
  documents: FleetManagerDocument[];
}

const mockFleetManager: FleetManager = {
  id: "fltmgr_9z8y7x6w5v",
  businessName: "Logistics Kings",
  contactPerson: "John Carter",
  email: "john.carter@logisticskings.com",
  phone: "+1 (555) 987-6543",
  joinDate: "2022-11-20",
  avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=LK",
  isAccountActive: true,
  fleetCount: 42,
  driverCount: 58,
  documents: [
    {
      id: "doc_fm_1",
      name: "Company_Incorporation.pdf",
      uploadDate: "2022-11-21",
      url: "#",
    },
    {
      id: "doc_fm_2",
      name: "Insurance_Policy.pdf",
      uploadDate: "2022-11-22",
      url: "#",
    },
  ],
};

export default function FleetOwnersProfile() {
  const [manager, setManager] = useState<FleetManager>(mockFleetManager);

  const handleAccountToggle = (checked: boolean) => {
    setManager((m) => ({ ...m, isAccountActive: checked }));
    console.log(
      `Fleet Manager account is now ${checked ? "enabled" : "disabled"}`
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="my-6">
          <h1 className="text-3xl !font-bold">Fleet Manager Details</h1>
          <p>Manage fleet manager profile, assets, and documents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Manager Profile Card */}
            <Card className="py-6 bg-secondary">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={manager.avatarUrl}
                    alt={manager.businessName}
                  />
                  <AvatarFallback>
                    {manager.businessName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {manager.businessName}
                  </CardTitle>
                  <CardDescription>
                    Contact: {manager.contactPerson}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{manager.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium">{manager.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined On</span>
                    <span className="font-medium">{manager.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Fleets</CardTitle>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{manager.fleetCount}</div>
                </CardContent>
              </Card>
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {manager.driverCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Card */}
            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Enable or disable manager functionalities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="account-status" className="font-semibold">
                      Account Status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the manager's ability to log in.
                    </p>
                  </div>
                  <Switch
                    id="account-status"
                    checked={manager.isAccountActive}
                    onCheckedChange={handleAccountToggle}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="account-status" className="font-semibold">
                      Wallet Status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the manager's ability to withdraw.
                    </p>
                  </div>
                  <Switch
                    id="account-status"
                    checked={manager.isAccountActive}
                    onCheckedChange={handleAccountToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Manager Documents</CardTitle>
                <CardDescription>
                  List of documents provided by the manager for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Upload Date
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manager.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {doc.uploadDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} download>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {manager.documents.length === 0 && (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No documents have been uploaded.
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="mt-6">
              <FinancialReport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
