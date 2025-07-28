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

interface VendorDocument {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

interface Vendor {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarUrl?: string;
  isAccountActive: boolean;
  isWalletActive: boolean;
  documents: VendorDocument[];
}

// --- MOCK DATA ---
const mockVendor: Vendor = {
  id: "vndr_1a2b3c4d5e",
  firstName: "Jane",
  lastName: "Doe",
  companyName: "Crafty Creations Inc.",
  email: "jane.doe@crafty.com",
  phone: "+1 (555) 123-4567",
  joinDate: "2023-05-15",
  avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=JD",
  isAccountActive: true,
  isWalletActive: true,
  documents: [
    {
      id: "doc_1",
      name: "Business_Registration.pdf",
      uploadDate: "2023-05-16",
      url: "#",
    },
    {
      id: "doc_2",
      name: "VAT_Certificate.pdf",
      uploadDate: "2023-05-18",
      url: "#",
    },
    {
      id: "doc_3",
      name: "ID_Verification.png",
      uploadDate: "2023-06-01",
      url: "#",
    },
  ],
};

export default function VendorsDetails() {
  const [vendor, setVendor] = useState<Vendor>(mockVendor);

  const handleAccountToggle = (checked: boolean) => {
    setVendor((v) => ({ ...v, isAccountActive: checked }));
    console.log(`Vendor account is now ${checked ? "enabled" : "disabled"}`);
  };

  const handleWalletToggle = (checked: boolean) => {
    setVendor((v) => ({ ...v, isWalletActive: checked }));
    console.log(`Vendor wallet is now ${checked ? "enabled" : "disabled"}`);
  };

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
                    src={vendor.avatarUrl}
                    alt={`${vendor.firstName} ${vendor.lastName}`}
                  />
                  <AvatarFallback>
                    {vendor.firstName[0]}
                    {vendor.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {vendor.firstName} {vendor.lastName}
                  </CardTitle>
                  <CardDescription>{vendor.companyName}</CardDescription>
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
                    <span className="font-medium">{vendor.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined On</span>
                    <span className="font-medium">{vendor.joinDate}</span>
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
                    checked={vendor.isAccountActive}
                    onCheckedChange={handleAccountToggle}
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
                    checked={vendor.isWalletActive}
                    onCheckedChange={handleWalletToggle}
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
                    {vendor.documents.map((doc) => (
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
                {vendor.documents.length === 0 && (
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
