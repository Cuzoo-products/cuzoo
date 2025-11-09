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
import { Download, User2, Wallet } from "lucide-react";
import FinancialReport from "@/components/utilities/Admins/FinancialReport";
import { useParams } from "react-router";
import { useGetVendor } from "@/api/admin/useVendors";
import Loader from "@/components/utilities/Loader";

interface VendorDocument {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

// interface Vendor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   businessName: string;
//   businessType: string;
//   email: string;
//   phoneNumber: {
//     internationalFormat: string;
//     nationalFormat: string;
//     number: string;
//     countryCode: string;
//     countryCallingCode: string;
//   };
//   createdAt: string;
//   logo?: {
//     url: string;
//     path: string;
//     contentType: string;
//   };
//   approvalStatus: string;
//   approved: boolean;
//   accountDeleted: boolean;
//   placeOfIncorporation: string;
//   registrationNumber: string;
//   storeCode: string;
//   referrerCode: string;
//   dateOfIncorporation: {
//     _seconds: number;
//     _nanoseconds: number;
//   };
//   address: {
//     placeId: string;
//     formatted_address: string;
//     geometry: any;
//     country: string;
//     state: string;
//   };
//   documents?: Array<{
//     id: string;
//     name: string;
//     uploadDate: string;
//     url: string;
//   }>;
// }

export default function VendorsDetails() {
  const { id } = useParams();
  const { data: vendorDetails, isLoading } = useGetVendor(id!);
  const [isAccountActive, setIsAccountActive] = useState<boolean>(true);
  const [isWalletActive, setIsWalletActive] = useState<boolean>(true);

  const handleAccountToggle = (checked: boolean) => {
    setIsAccountActive(checked);
    console.log(`Vendor account is now ${checked ? "enabled" : "disabled"}`);
    // TODO: Add API call to update account status
  };

  const handleWalletToggle = (checked: boolean) => {
    setIsWalletActive(checked);
    console.log(`Vendor wallet is now ${checked ? "enabled" : "disabled"}`);
    // TODO: Add API call to update wallet status
  };

  const vendor = vendorDetails?.data;
  const joinDate = vendor?.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString()
    : "";

  if (isLoading || !vendor) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="my-6">
          <h1 className="!font-bold text-3xl">Vendor Details</h1>
          <p>Manage vendor profile, actions, and documents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="py-6 bg-secondary">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={vendor.logo?.url}
                    alt={`${vendor.firstName} ${vendor.lastName}`}
                  />
                  <AvatarFallback>
                    {vendor.firstName?.[0]}
                    {vendor.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {vendor.firstName} {vendor.lastName}
                  </CardTitle>
                  <CardDescription>{vendor.businessName}</CardDescription>
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {vendor.approvalStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{vendor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium">
                      {vendor.phoneNumber?.internationalFormat}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Type</span>
                    <span className="font-medium capitalize">
                      {vendor.businessType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration No.</span>
                    <span className="font-medium">
                      {vendor.registrationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place of Inc.</span>
                    <span className="font-medium">
                      {vendor.placeOfIncorporation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Store Code</span>
                    <span className="font-medium">{vendor.storeCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Code</span>
                    <span className="font-medium">{vendor.referrerCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined On</span>
                    <span className="font-medium">{joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Enable or disable vendor functionalities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User2 className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="account-status" className="font-semibold">
                      Account Status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the vendor's ability to log in.
                    </p>
                  </div>
                  <Switch
                    id="account-status"
                    checked={isAccountActive}
                    onCheckedChange={handleAccountToggle}
                    disabled={vendor.accountDeleted}
                  />
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Wallet className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="wallet-status" className="font-semibold">
                      Wallet Status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the vendor's ability to withdraw
                    </p>
                  </div>
                  <Switch
                    id="wallet-status"
                    checked={isWalletActive}
                    onCheckedChange={handleWalletToggle}
                    disabled={vendor.accountDeleted}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Vendor Documents</CardTitle>
                <CardDescription>
                  List of documents provided by the vendor for verification.
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
                    {(vendor.documents || []).map((doc: VendorDocument) => (
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
                {(!vendor.documents || vendor.documents.length === 0) && (
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
