import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/utilities/Loader";
import { ContactNotificationCard } from "@/components/utilities/Admins/ContactNotificationCard";
import { formatApiDate } from "@/lib/utils";
import {
  useApproveVendor,
  useGetVendor,
  useVendorAccountAction,
  useVendorWalletAction,
} from "@/api/admin/vendors/useVendors";

type DocAsset = { path?: string; url?: string; type?: string };

type VendorPhone = {
  countryCode?: string;
  nationalFormat?: string;
  number?: string;
  internationalFormat?: string;
  countryCallingCode?: string;
};

type VendorLogo = { path?: string; url?: string; type?: string };

type VendorAddress = {
  formatted_address?: string;
  description?: string;
  placeId?: string;
  geometry?: {
    location?: { lat?: number; lng?: number };
  };
  landMark?: string;
  country?: string;
  state?: string;
  direction?: string;
  distance?: number;
  duration?: number;
};

type VendorProprietor = {
  name?: string;
  nationality?: string;
  state?: string;
  residentialAddress?: string;
  declaration?: string;
};

/** Extra keys on wallet beyond the common ones we render first. */
type VendorWallet = {
  amount?: number;
  escrow?: number;
  currency?: string;
  suspended?: boolean;
  updatedAt?: string;
  payoutAccounts?: unknown[];
} & Record<string, unknown>;

type VendorUploadedDoc = {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
};

type VendorData = {
  Id?: string;
  id?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: VendorPhone;
  logo?: VendorLogo;
  storeCode?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string;
  placeOfIncorporation?: string;
  businessType?: string;
  address?: VendorAddress;
  emailVerified?: boolean;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
  typeOfGoodsSold?: string;
  proprietor?: VendorProprietor;
  createdAt?: string;
  updatedAt?: string;
  documents?: VendorUploadedDoc[];
  wallet?: VendorWallet;
  passport?: DocAsset;
  certificateOfIncorporation?: DocAsset;
  governmentApprovedId?: DocAsset;
  proofOfAddress?: DocAsset;
  lgaPermit?: DocAsset;
  gphLicense?: DocAsset;
  nafdacRegistration?: DocAsset;
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="break-words mt-0.5">{children}</p>
    </div>
  );
}

function formatWalletValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function VendorsDetails() {
  const { id: routeId } = useParams();
  const { data, isLoading } = useGetVendor(routeId ?? "");
  const approveMutation = useApproveVendor(routeId ?? "");
  const accountMutation = useVendorAccountAction(routeId ?? "");
  const walletMutation = useVendorWalletAction(routeId ?? "");

  const vendor = data?.data as VendorData | undefined;

  const defaultAccountActive = useMemo(
    () => !vendor?.suspended,
    [vendor?.suspended],
  );
  const defaultWalletActive = useMemo(
    () => !(vendor?.wallet?.suspended ?? vendor?.suspended),
    [vendor?.wallet?.suspended, vendor?.suspended],
  );

  const [isAccountActive, setIsAccountActive] = useState(true);
  const [isWalletActive, setIsWalletActive] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setIsAccountActive(defaultAccountActive);
    setIsWalletActive(defaultWalletActive);
    setHasChanges(false);
  }, [defaultAccountActive, defaultWalletActive]);

  useEffect(() => {
    setHasChanges(
      isAccountActive !== defaultAccountActive ||
        isWalletActive !== defaultWalletActive,
    );
  }, [
    isAccountActive,
    isWalletActive,
    defaultAccountActive,
    defaultWalletActive,
  ]);

  const docs: Array<[string, DocAsset | undefined]> = [
    ["Passport", vendor?.passport],
    ["Certificate of incorporation", vendor?.certificateOfIncorporation],
    ["Government ID", vendor?.governmentApprovedId],
    ["Proof of address", vendor?.proofOfAddress],
    ["LGA permit", vendor?.lgaPermit],
    ["GPH license", vendor?.gphLicense],
    ["NAFDAC registration", vendor?.nafdacRegistration],
  ];

  const wallet = vendor?.wallet;

  const onSave = async () => {
    try {
      if (isAccountActive !== defaultAccountActive) {
        await accountMutation.mutateAsync(
          isAccountActive ? "release" : "suspend",
        );
      }
      if (isWalletActive !== defaultWalletActive) {
        await walletMutation.mutateAsync(
          isWalletActive ? "release" : "suspend",
        );
      }
      setHasChanges(false);
      toast.success("Vendor settings updated successfully.");
    } catch {
      // mutation hooks show error toast
    }
  };

  if (isLoading) return <Loader />;
  if (!vendor) return <div className="p-6">Vendor not found.</div>;

  const phone = vendor.phoneNumber;
  const addr = vendor.address;
  const prop = vendor.proprietor;
  const loc = addr?.geometry?.location;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-secondary lg:col-span-1 h-fit">
          <CardHeader className="py-4 flex flex-row items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 rounded-md">
              <AvatarImage
                src={vendor.logo?.url}
                alt={vendor.businessName || "Vendor logo"}
              />
              <AvatarFallback className="rounded-md text-lg">
                {(
                  (vendor.firstName?.[0] ?? "") + (vendor.lastName?.[0] ?? "")
                ).trim() ||
                  vendor.businessName?.slice(0, 2).toUpperCase() ||
                  "V"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight">
                {vendor.businessName || "Vendor"}
              </CardTitle>
              <CardDescription className="mt-1">
                {[vendor.firstName, vendor.lastName].filter(Boolean).join(" ") ||
                  "—"}
              </CardDescription>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vendor.approvalStatus ? (
                  <Badge variant="secondary">{vendor.approvalStatus}</Badge>
                ) : null}
                {vendor.emailVerified ? (
                  <Badge variant="outline">Email verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Email not verified
                  </Badge>
                )}
                {vendor.suspended ? (
                  <Badge variant="destructive">Suspended</Badge>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm py-2">
            <Field label="Email">{vendor.email || "—"}</Field>
            <Field label="Phone (international)">
              {phone?.internationalFormat || phone?.nationalFormat || phone?.number || "—"}
            </Field>
            <Field label="Store code">{vendor.storeCode || "—"}</Field>
            <Field label="Created">{formatApiDate(vendor.createdAt)}</Field>
            <Field label="Profile updated">{formatApiDate(vendor.updatedAt)}</Field>
            {vendor.logo?.type ? (
              <Field label="Logo type">{vendor.logo.type}</Field>
            ) : null}
          </CardContent>
          <CardFooter className="flex-col gap-3 py-4">
            {!vendor.approved && !vendor.suspended && (
              <Button
                className="w-full"
                onClick={() => routeId && approveMutation.mutate(routeId)}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {approveMutation.isPending ? "Approving..." : "Approve vendor"}
              </Button>
            )}
            <div className="w-full flex items-center justify-between border rounded p-3">
              <Label htmlFor="vendor-account">Account</Label>
              <Switch
                id="vendor-account"
                checked={isAccountActive}
                onCheckedChange={setIsAccountActive}
                disabled={accountMutation.isPending || walletMutation.isPending}
              />
            </div>
            <div className="w-full flex items-center justify-between border rounded p-3">
              <Label htmlFor="vendor-wallet">Wallet</Label>
              <Switch
                id="vendor-wallet"
                checked={isWalletActive}
                onCheckedChange={setIsWalletActive}
                disabled={accountMutation.isPending || walletMutation.isPending}
              />
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={onSave}
              disabled={
                !hasChanges ||
                accountMutation.isPending ||
                walletMutation.isPending
              }
            >
              Save changes
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {routeId ? (
            <ContactNotificationCard
              entityId={routeId}
              recipient="vendor"
              mode="email-only"
              description="Send an email to this vendor."
            />
          ) : null}
          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Business &amp; registration</CardTitle>
              <CardDescription>
                Legal entity and what the vendor sells.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
              <Field label="Business type">{vendor.businessType || "—"}</Field>
              <Field label="Registration number">
                {vendor.registrationNumber || "—"}
              </Field>
              <Field label="Date of incorporation">
                {formatApiDate(vendor.dateOfIncorporation)}
              </Field>
              <Field label="Place of incorporation">
                {vendor.placeOfIncorporation || "—"}
              </Field>
              <Field label="Type of goods sold" className="sm:col-span-2">
                {vendor.typeOfGoodsSold || "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Phone</CardTitle>
              <CardDescription>All fields from phoneNumber.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
              <Field label="International">{phone?.internationalFormat || "—"}</Field>
              <Field label="National">{phone?.nationalFormat || "—"}</Field>
              <Field label="Raw number">{phone?.number || "—"}</Field>
              <Field label="Country code">{phone?.countryCode || "—"}</Field>
              <Field label="Calling code">{phone?.countryCallingCode || "—"}</Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Address</CardTitle>
              <CardDescription>Structured address from the API.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm py-2">
              <Field label="Formatted address">
                {addr?.formatted_address || "—"}
              </Field>
              <Field label="Description">{addr?.description || "—"}</Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Landmark">{addr?.landMark || "—"}</Field>
                <Field label="Country">{addr?.country || "—"}</Field>
                <Field label="State">{addr?.state || "—"}</Field>
                <Field label="Direction">{addr?.direction || "—"}</Field>
                <Field label="Distance">
                  {addr?.distance != null ? String(addr.distance) : "—"}
                </Field>
                <Field label="Duration">
                  {addr?.duration != null ? String(addr.duration) : "—"}
                </Field>
              </div>
              <Field label="Coordinates">
                {loc?.lat != null && loc?.lng != null
                  ? `${loc.lat}, ${loc.lng}`
                  : "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Proprietor</CardTitle>
              <CardDescription>Owner / signatory details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
              <Field label="Name">{prop?.name || "—"}</Field>
              <Field label="Nationality">{prop?.nationality || "—"}</Field>
              <Field label="State">{prop?.state || "—"}</Field>
              <Field label="Residential address" className="sm:col-span-2">
                {prop?.residentialAddress || "—"}
              </Field>
              <Field label="Declaration" className="sm:col-span-2">
                {prop?.declaration || "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Wallet</CardTitle>
              <CardDescription>
                Balance, escrow, and payout account info from the API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm py-2">
              {wallet && Object.keys(wallet).length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Status">
                      {wallet.suspended ? "Suspended" : "Active"}
                    </Field>
                    <Field label="Currency">{wallet.currency ?? "NGN"}</Field>
                    <Field label="Amount">
                      {(wallet.amount ?? 0).toLocaleString()}
                    </Field>
                    <Field label="Escrow">
                      {(wallet.escrow ?? 0).toLocaleString()}
                    </Field>
                    <Field label="Wallet updated">
                      {formatApiDate(wallet.updatedAt)}
                    </Field>
                    {wallet.payoutAccounts != null ? (
                      <Field label="Payout accounts" className="sm:col-span-2">
                        {formatWalletValue(wallet.payoutAccounts)}
                      </Field>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No wallet data.</p>
              )}
            </CardContent>
          </Card>

          {(vendor.documents?.length ?? 0) > 0 ? (
            <Card className="bg-secondary">
              <CardHeader className="py-4">
                <CardTitle>Uploaded documents</CardTitle>
                <CardDescription>Files from the documents array.</CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Uploaded</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(vendor.documents ?? []).map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
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
              </CardContent>
            </Card>
          ) : null}

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Verification documents (KYC)</CardTitle>
              <CardDescription>
                Passport, IDs, permits, and licenses linked to this vendor.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Path</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs
                    .filter(([, d]) => !!d?.url)
                    .map(([name, d]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {d?.type || "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground">
                          {d?.path || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={d?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {docs.every(([, d]) => !d?.url) ? (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  No KYC documents with URLs on file.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
