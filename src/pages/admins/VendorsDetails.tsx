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
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Wallet,
  CheckCircle,
  FileCheck,
  ShieldAlert,
  Store,
  Gift,
} from "lucide-react";
import FinancialReport from "@/components/utilities/Admins/FinancialReport";
import { useParams } from "react-router";
import { useApproveVendor, useGetVendor } from "@/api/admin/useVendors";
import Loader from "@/components/utilities/Loader";

interface VendorDocument {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

export default function VendorsDetails() {
  const { id } = useParams();
  const { data: vendorDetails, isLoading } = useGetVendor(id!);
  const [isAccountActive, setIsAccountActive] = useState<boolean>(true);
  const [isWalletActive, setIsWalletActive] = useState<boolean>(true);
  const approveVendorMutation = useApproveVendor(id!);

  const handleAccountToggle = (checked: boolean) => {
    setIsAccountActive(checked);
  };

  const handleWalletToggle = (checked: boolean) => {
    setIsWalletActive(checked);
  };

  const handleApprove = () => {
    if (id) approveVendorMutation.mutate(id);
  };

  const vendor = vendorDetails?.data;
  const joinDate = vendor?.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

  const displayName = vendor
    ? [vendor.firstName, vendor.lastName].filter(Boolean).join(" ") ||
      vendor.businessName
    : "-";
  const phoneDisplay =
    vendor?.phoneNumber?.internationalFormat ||
    vendor?.phoneNumber?.nationalFormat ||
    vendor?.phoneNumber?.number ||
    "-";

  const canApprove =
    vendor &&
    vendor.approvalStatus?.toLowerCase() !== "approved" &&
    !vendor.accountDeleted;

  if (isLoading) {
    return <Loader />;
  }

  if (!vendor) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
        <p className="text-muted-foreground">Vendor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="my-6">
          <h1 className="text-3xl !font-bold">Vendor Details</h1>
          <p>Manage vendor profile, documents, and status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="py-6 bg-secondary">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={vendor.logo?.url} alt={displayName} />
                  <AvatarFallback>
                    {(vendor.businessName || "V").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl">
                      {vendor.businessName || "-"}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {vendor.approvalStatus}
                    </Badge>
                    {vendor.approvalStatus?.toLowerCase() === "approved" && (
                      <Badge variant="default">Approved</Badge>
                    )}
                  </div>
                  <CardDescription>{displayName}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{vendor.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium">{phoneDisplay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business type</span>
                    <span className="font-medium capitalize">
                      {vendor.businessType || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration No.</span>
                    <span className="font-medium">
                      {vendor.registrationNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place of Inc.</span>
                    <span className="font-medium">
                      {vendor.placeOfIncorporation || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Store code</span>
                    <span className="font-medium">
                      {vendor.storeCode || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral code</span>
                    <span className="font-medium">
                      {vendor.referrerCode || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined on</span>
                    <span className="font-medium">{joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Store</CardTitle>
                  <Store className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-lg font-bold truncate"
                    title={vendor.storeCode}
                  >
                    {vendor.storeCode || "—"}
                  </div>
                </CardContent>
              </Card>
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Referral
                  </CardTitle>
                  <Gift className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-lg font-bold truncate"
                    title={vendor.referrerCode}
                  >
                    {vendor.referrerCode || "—"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Approve the account or enable or disable vendor access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {canApprove && (
                  <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold">Approve account</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Approve this vendor so they can use the platform.
                      </p>
                    </div>
                    <Button
                      onClick={handleApprove}
                      disabled={approveVendorMutation.isPending}
                    >
                      {approveVendorMutation.isPending
                        ? "Approving…"
                        : "Approve account"}
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <ShieldAlert className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="account-status" className="font-semibold">
                      Account status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the vendor&apos;s ability to log in.
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
                      Wallet status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the vendor&apos;s ability to withdraw.
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

          <div className="lg:col-span-2 space-y-6">
            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Vendor documents
                </CardTitle>
                <CardDescription>
                  Documents provided for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Upload date
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
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {doc.uploadDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View / Download
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!vendor.documents || vendor.documents.length === 0) && (
                  <div className="text-center py-10 text-muted-foreground">
                    No documents have been uploaded.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <FinancialReport /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
