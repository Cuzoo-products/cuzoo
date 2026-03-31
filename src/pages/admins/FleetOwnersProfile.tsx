import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Loader from "@/components/utilities/Loader";
import { ContactNotificationCard } from "@/components/utilities/Admins/ContactNotificationCard";
import {
  PayoutAccountsTable,
  type WalletPayoutAccount,
} from "@/components/utilities/Admins/PayoutAccountsTable";
import { formatApiDate } from "@/lib/utils";
import {
  useApproveFleet,
  useFleetAccountAction,
  useFleetWalletAction,
  useGetOneFleet,
} from "@/api/admin/fleet/useFleet";

type DocAsset = { path?: string; url?: string; type?: string };

type FleetPhone = {
  countryCode?: string;
  nationalFormat?: string;
  number?: string;
  internationalFormat?: string;
  countryCallingCode?: string;
};

type FleetWallet = {
  amount?: number;
  escrow?: number;
  currency?: string;
  suspended?: boolean;
  updatedAt?: string;
  payoutAccounts?: WalletPayoutAccount[];
} & Record<string, unknown>;

type FleetData = {
  Id?: string;
  id?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: FleetPhone;
  address?: string;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  tinNumber?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string;
  placeOfIncorporation?: string;
  companyType?: string;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
  directors?: string[];
  servicesRendered?: string[];
  insuranceCoverage?: string[];
  createdAt?: string;
  updatedAt?: string;
  fleets?: number;
  drivers?: number;
  wallet?: FleetWallet;
  passport?: DocAsset;
  certificateOfIncorporation?: DocAsset;
  governmentApprovedId?: DocAsset;
  proofOfAddress?: DocAsset;
  insuranceCertificate?: DocAsset;
  courierLicense?: DocAsset;
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

export default function FleetOwnersProfile() {
  const { id: routeId } = useParams();
  const { data, isLoading } = useGetOneFleet(routeId ?? "");
  const approveMutation = useApproveFleet(routeId ?? undefined);
  const accountMutation = useFleetAccountAction(routeId ?? "");
  const walletMutation = useFleetWalletAction(routeId ?? "");

  const fleet = data?.data as FleetData | undefined;

  const defaultAccountActive = useMemo(
    () => !fleet?.suspended,
    [fleet?.suspended],
  );
  const defaultWalletActive = useMemo(
    () => !(fleet?.wallet?.suspended ?? fleet?.suspended),
    [fleet?.wallet?.suspended, fleet?.suspended],
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
    ["Passport", fleet?.passport],
    ["Certificate of incorporation", fleet?.certificateOfIncorporation],
    ["Government ID", fleet?.governmentApprovedId],
    ["Proof of address", fleet?.proofOfAddress],
    ["Insurance certificate", fleet?.insuranceCertificate],
    ["Courier license", fleet?.courierLicense],
  ];

  const wallet = fleet?.wallet;

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
      toast.success("Fleet settings updated successfully.");
    } catch {
      // mutation hooks show error toast
    }
  };

  if (isLoading) return <Loader />;
  if (!fleet) return <div className="p-6">Fleet profile not found.</div>;

  const phone = fleet.phoneNumber;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-secondary lg:col-span-1 h-fit">
          <CardHeader className="py-4 flex flex-row items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 rounded-md">
              <AvatarFallback className="rounded-md text-lg">
                {(
                  (fleet.firstName?.[0] ?? "") + (fleet.lastName?.[0] ?? "")
                ).trim() ||
                  fleet.businessName?.slice(0, 2).toUpperCase() ||
                  "F"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight">
                {fleet.businessName || "Fleet manager"}
              </CardTitle>
              <CardDescription className="mt-1">
                {[fleet.firstName, fleet.lastName].filter(Boolean).join(" ") ||
                  "—"}
              </CardDescription>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {fleet.approvalStatus ? (
                  <Badge variant="secondary">{fleet.approvalStatus}</Badge>
                ) : null}
                {fleet.emailVerified ? (
                  <Badge variant="outline">Email verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Email not verified
                  </Badge>
                )}
                {fleet.phoneNumberVerified ? (
                  <Badge variant="outline">Phone verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Phone not verified
                  </Badge>
                )}
                {fleet.suspended ? (
                  <Badge variant="destructive">Suspended</Badge>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm py-2">
            <Field label="Email">{fleet.email || "—"}</Field>
            <Field label="Phone (international)">
              {phone?.internationalFormat ||
                phone?.nationalFormat ||
                phone?.number ||
                "—"}
            </Field>
            <Field label="Fleets / drivers">
              {fleet.fleets ?? 0} / {fleet.drivers ?? 0}
            </Field>
            <Field label="Created">{formatApiDate(fleet.createdAt)}</Field>
            <Field label="Profile updated">
              {formatApiDate(fleet.updatedAt)}
            </Field>
          </CardContent>
          <CardFooter className="flex-col gap-3 py-4">
            {!fleet.approved && !fleet.suspended && (
              <Button
                className="w-full"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {approveMutation.isPending ? "Approving..." : "Approve fleet"}
              </Button>
            )}
            <div className="w-full flex items-center justify-between border rounded p-3">
              <Label htmlFor="fleet-account">Account</Label>
              <Switch
                id="fleet-account"
                checked={isAccountActive}
                onCheckedChange={setIsAccountActive}
                disabled={accountMutation.isPending || walletMutation.isPending}
              />
            </div>
            <div className="w-full flex items-center justify-between border rounded p-3">
              <Label htmlFor="fleet-wallet">Wallet</Label>
              <Switch
                id="fleet-wallet"
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
            <>
              <ContactNotificationCard
                entityId={routeId}
                recipient="fleet"
                mode="email-only"
                description="Send an email to this fleet manager."
              />
              <Card className="bg-secondary">
                <CardHeader className="py-4">
                  <CardTitle>Fleet links</CardTitle>
                  <CardDescription>
                    Explore this fleet manager's riders, vehicles and rides.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                  <Button asChild variant="outline">
                    <Link to={`/admins/fleet_managers/${routeId}/riders`}>
                      Fleet riders
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={`/admins/fleet_managers/${routeId}/vehicles`}>
                      Fleet vehicles
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/admins/fleet_managers/${routeId}/rides`}>
                      Riders' rides
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : null}
          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Business &amp; registration</CardTitle>
              <CardDescription>
                Legal entity, tax, and incorporation details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
              <Field label="Company type">{fleet.companyType || "—"}</Field>
              <Field label="TIN">{fleet.tinNumber || "—"}</Field>
              <Field label="Registration number">
                {fleet.registrationNumber || "—"}
              </Field>
              <Field label="Date of incorporation">
                {formatApiDate(fleet.dateOfIncorporation)}
              </Field>
              <Field label="Place of incorporation" className="sm:col-span-2">
                {fleet.placeOfIncorporation || "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Address</CardTitle>
              <CardDescription>Primary address on file.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm py-2">
              <Field label="Address">{fleet.address || "—"}</Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Phone</CardTitle>
              <CardDescription>All fields from phoneNumber.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
              <Field label="International">
                {phone?.internationalFormat || "—"}
              </Field>
              <Field label="National">{phone?.nationalFormat || "—"}</Field>
              <Field label="Raw number">{phone?.number || "—"}</Field>
              <Field label="Country code">{phone?.countryCode || "—"}</Field>
              <Field label="Calling code">
                {phone?.countryCallingCode || "—"}
              </Field>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Directors</CardTitle>
              <CardDescription>Listed directors from the API.</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              {fleet.directors && fleet.directors.length > 0 ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {fleet.directors.map((d, i) => (
                    <li key={`${d}-${i}`}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">—</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Services &amp; insurance</CardTitle>
              <CardDescription>
                Services rendered and insurance coverage types.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 text-sm py-2">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-2">
                  Services rendered
                </p>
                {fleet.servicesRendered && fleet.servicesRendered.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {fleet.servicesRendered.map((s, i) => (
                      <Badge key={`${s}-${i}`} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p>—</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-2">
                  Insurance coverage
                </p>
                {fleet.insuranceCoverage &&
                fleet.insuranceCoverage.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {fleet.insuranceCoverage.map((s, i) => (
                      <Badge key={`${s}-${i}`} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p>—</p>
                )}
              </div>
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
                  </div>
                  {wallet.payoutAccounts != null ? (
                    <div className="space-y-2 pt-2">
                      <p className="text-muted-foreground text-xs font-medium">
                        Payout accounts
                      </p>
                      <PayoutAccountsTable accounts={wallet.payoutAccounts} />
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-muted-foreground">No wallet data.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader className="py-4">
              <CardTitle>Verification documents (KYC)</CardTitle>
              <CardDescription>
                Passports, IDs, permits, and licenses linked to this fleet
                manager.
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
