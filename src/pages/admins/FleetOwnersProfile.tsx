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
import { useParams } from "react-router";
import { useGetOneFleet } from "@/api/admin/useFleet";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/utilities/Loader";

interface FleetManagerDocument {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

interface FleetApiData {
  approvalStatus?: string;
  businessName?: string;
  companyType?: string;
  dateOfIncorporation?: { _seconds?: number; _nanoseconds?: number };
  drivers?: number;
  email?: string;
  fleets?: number;
  id?: string;
  lastName?: string;
  phoneNumber?: {
    internationalFormat?: string;
    nationalFormat?: string;
    number?: string;
    countryCode?: string;
    countryCallingCode?: string;
  };
  placeOfIncorporation?: string;
  registrationNumber?: string;
  tinNumber?: string;
  avatarUrl?: string;
}

// Minimal mock data only for documents and financial summary sections
const mockDocuments: FleetManagerDocument[] = [
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
];

export default function FleetOwnersProfile() {
  const { id } = useParams();
  const { data: fleetManager, isLoading } = useGetOneFleet(id!);

  const [isAccountActive, setIsAccountActive] = useState<boolean>(true);
  const api: FleetApiData | undefined = (
    fleetManager as { data?: FleetApiData } | undefined
  )?.data;

  const joinDate = api?.dateOfIncorporation?._seconds
    ? new Date(api.dateOfIncorporation._seconds * 1000).toLocaleDateString()
    : "-";

  const handleAccountToggle = (checked: boolean) => {
    setIsAccountActive(checked);
    console.log(
      `Fleet Manager account is now ${checked ? "enabled" : "disabled"}`
    );
  };

  if (isLoading) {
    return <Loader />;
  }

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
                    src={api?.avatarUrl}
                    alt={(api?.businessName || "Fleet Manager") as string}
                  />
                  <AvatarFallback>
                    {api?.avatarUrl ? (
                      (api?.businessName || "FM").substring(0, 2).toUpperCase()
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">
                      {api?.businessName || "-"}
                    </CardTitle>
                    {api?.approvalStatus && (
                      <Badge variant="secondary" className="capitalize">
                        {api.approvalStatus}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Contact: {api?.lastName || "-"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{api?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium">
                      {api?.phoneNumber?.internationalFormat ||
                        api?.phoneNumber?.number ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-medium capitalize">
                      {api?.approvalStatus || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Type</span>
                    <span className="font-medium">
                      {api?.companyType || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place of Incorporation</span>
                    <span className="font-medium">
                      {api?.placeOfIncorporation || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration No.</span>
                    <span className="font-medium">
                      {api?.registrationNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIN</span>
                    <span className="font-medium">{api?.tinNumber || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined On</span>
                    <span className="font-medium">{joinDate}</span>
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
                  <div className="text-3xl font-bold">{api?.fleets ?? 0}</div>
                </CardContent>
              </Card>
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{api?.drivers ?? 0}</div>
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
                    checked={isAccountActive}
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
                    checked={isAccountActive}
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
                    {mockDocuments.map((doc) => (
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
                {mockDocuments.length === 0 && (
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
