import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  ShieldAlert,
  Wallet,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

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

import { useGetOneRider, useRiderAction, useRiderWalletAction, useRiderAccountAction } from "@/api/admin/riders/useRiders";
import Loader from "@/components/utilities/Loader";
import { ContactNotificationCard } from "@/components/utilities/Admins/ContactNotificationCard";



function toPhoneString(phoneNumber: any): string {
  if (!phoneNumber) return "—";
  return (
    phoneNumber.internationalFormat ??
    phoneNumber.number ??
    phoneNumber.nationalFormat ??
    "—"
  );
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString();
}

function getDocumentUrl(doc: any): string {
  return doc?.url ?? "";
}

export default function AdminDriverDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetOneRider(id ?? "") as {
    data?: any;
    isLoading: boolean;
    error: unknown;
  };

  
  const rider = data?.data ?? data ?? null;
  const approveMutation = useRiderAction(id ?? "", "approve");
  const declineMutation = useRiderAction(id ?? "", "decline");
  const walletMutation = useRiderWalletAction(id ?? "");
  const accountMutation = useRiderAccountAction(id ?? "");
  const isPendingAction = approveMutation.isPending || declineMutation.isPending;
  const isSavingDangerZone = walletMutation.isPending || accountMutation.isPending;
  const hasFleetOwner = Boolean(
    rider?.companyId || rider?.companyName || rider?.companyEmail,
  );
  const showWalletToggle = !hasFleetOwner;

  const driver = useMemo(() => {
    const firstName = rider?.firstName ?? "";
    const lastName = rider?.lastName ?? "";
    const name = `${firstName} ${lastName}`.trim() || rider?.Id || "";

    const approved = Boolean(rider?.approved);
    const suspended = Boolean(rider?.suspended);
    const accountActive = approved && !suspended;

    const walletRaw = rider?.wallet;
    const walletActive =
      walletRaw === "Active" ? true : walletRaw === "Frozen" ? false : accountActive;

    return {
      id: rider?.Id ?? "",
      name,
      email: rider?.email ?? "—",
      phone: toPhoneString(rider?.phoneNumber),
      avatarUrl: rider?.passport?.url ?? "",
      status: accountActive ? "Active" : "Disabled",
      walletStatus: walletActive ? "Active" : "Frozen",
      dateJoined: rider?.createdAt ?? rider?.updatedAt ?? "",
    };
  }, [rider]);

  const defaultAccountActive = driver.status === "Active";
  const defaultWalletActive = driver.walletStatus === "Active";

  const [isAccountActive, setIsAccountActive] = useState(defaultAccountActive);
  const [isWalletActive, setIsWalletActive] = useState(defaultWalletActive);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setIsAccountActive(defaultAccountActive);
    setIsWalletActive(defaultWalletActive);
    setHasChanges(false);
  }, [defaultAccountActive, defaultWalletActive]);

  useEffect(() => {
    const accountChanged = isAccountActive !== defaultAccountActive;
    const walletChanged =
      showWalletToggle && isWalletActive !== defaultWalletActive;
    setHasChanges(accountChanged || walletChanged);
  }, [
    isAccountActive,
    isWalletActive,
    defaultAccountActive,
    defaultWalletActive,
    showWalletToggle,
  ]);

  const handleSaveChanges = async () => {
    const accountChanged = isAccountActive !== defaultAccountActive;
    const walletChanged =
      showWalletToggle && isWalletActive !== defaultWalletActive;

    if (!accountChanged && !walletChanged) {
      return;
    }

    try {
      if (accountChanged) {
        await accountMutation.mutateAsync(isAccountActive ? "release" : "suspend");
      }

      if (walletChanged) {
        await walletMutation.mutateAsync(isWalletActive ? "release" : "suspend");
      }

      setHasChanges(false);
      toast.success("Driver settings updated successfully.");
    } catch {
      // per-hook toasts already show detailed failures
    }
  };

  if (isLoading) return <Loader />;
  if (error || !rider) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Driver details</h3>
          <p className="text-red-500">Failed to load driver details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl !font-bold">Driver Details</h1>
        <p>Manage driver account details and documents.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="py-6 bg-secondary">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  {driver.avatarUrl ? (
                    <AvatarImage src={driver.avatarUrl} alt={driver.name} />
                  ) : null}
                  <AvatarFallback>
                    {driver.name
                      .split(" ")
                      .filter(Boolean)
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold">{driver.name}</h2>
                <p className="text-sm text-muted-foreground">{driver.id}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Badge
                    variant={driver.status === "Active" ? "default" : "destructive"}
                  >
                    Account: {driver.status}
                  </Badge>

                  <Badge
                    variant={
                      driver.walletStatus === "Active" ? "default" : "destructive"
                    }
                  >
                    Wallet: {driver.walletStatus}
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
              <div className="flex items-start space-x-3">
                <div className="text-muted-foreground mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{driver.email}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="text-muted-foreground mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Phone Number</span>
                  <span className="text-sm font-medium">{driver.phone}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="text-muted-foreground mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Date Joined</span>
                  <span className="text-sm font-medium">
                    {driver.dateJoined
                      ? new Date(driver.dateJoined).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="text-muted-foreground mt-1">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Referral Code</span>
                  <span className="text-sm font-medium">{rider?.referralCode ?? "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium">{rider?.gender ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">{formatDate(rider?.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Marital Status</p>
                  <p className="text-sm font-medium">{rider?.maritalStatus ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Religion</p>
                  <p className="text-sm font-medium">{rider?.religion ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">State</p>
                  <p className="text-sm font-medium">{rider?.state ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-sm font-medium">{rider?.country ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!Boolean(rider?.approved) && (
            <Card className="py-4 bg-secondary">
              <CardHeader>
                <CardTitle>Approval Actions</CardTitle>
                <CardDescription>
                  Review this driver profile and approve or decline registration.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  disabled={isPendingAction}
                  onClick={() => approveMutation.mutate()}
                >
                  Approve Driver
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPendingAction}
                  onClick={() => declineMutation.mutate()}
                >
                  Decline Driver
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="py-4 bg-secondary">
            <CardHeader>
              <CardTitle>Driver Documents</CardTitle>
              <CardDescription>
                Uploaded KYC and verification documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Passport", url: getDocumentUrl(rider?.passport) },
                { label: "Driver's License", url: getDocumentUrl(rider?.driversLicense) },
                { label: "Rider Card", url: getDocumentUrl(rider?.riderCard) },
                { label: "National ID", url: getDocumentUrl(rider?.nationalId) },
                { label: "Nepa Bill", url: getDocumentUrl(rider?.nepaBill) },
                { label: "Guarantor Form", url: getDocumentUrl(rider?.gaurantorForm) },
              ].map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center justify-between border-b pb-2 last:border-b-0"
                >
                  <span className="text-sm">{doc.label}</span>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-primary"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not uploaded</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {id ? (
            <ContactNotificationCard
              entityId={id}
              recipient="rider"
              mode="email-and-push"
              description="Send an email or push notification to this rider."
            />
          ) : null}
          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle>Rider's History</CardTitle>
            </CardHeader>

            <CardContent>
             Explore the rider's history of trips and activities. View all trips requested by this rider.
            </CardContent>

            <CardFooter>
              <Button asChild>
                <Link to={`trips`}>View Trips</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">NIN Number</p>
                <p className="text-sm font-medium">{rider?.ninNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Referrer Code</p>
                <p className="text-sm font-medium">{rider?.referrerCode ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registration Complete</p>
                <p className="text-sm font-medium">
                  {rider?.regComplete ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Verified</p>
                <p className="text-sm font-medium">
                  {rider?.emailVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Home Address</p>
                <p className="text-sm font-medium">
                  {rider?.address?.formatted_address ?? rider?.address?.description ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="text-sm font-medium">
                  {rider?.vehicles?.[0]
                    ? `${rider.vehicles[0].year ?? ""} ${rider.vehicles[0].model ?? ""} (${rider.vehicles[0].plateNumber ?? "—"})`.trim()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guarantor</p>
                <p className="text-sm font-medium">
                  {rider?.gaurantor
                    ? `${rider.gaurantor.firstName ?? ""} ${rider.gaurantor.lastName ?? ""}`.trim() || "—"
                    : "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Company Details</p>
                {hasFleetOwner ? (
                  <div className="text-sm font-medium space-y-1">
                    <p>
                      Company Name: {rider?.companyName ?? "—"}
                    </p>
                    <p>
                      Company Email: {rider?.companyEmail ?? "—"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium">Not assigned to any company.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="py-6 bg-secondary">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Manage critical driver account and wallet settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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
                  disabled={isSavingDangerZone}
                  onCheckedChange={(next) => {
                    setIsAccountActive(next);
                  }}
                  aria-label="Toggle driver account status"
                />
              </div>

              {showWalletToggle && (
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
                    disabled={isSavingDangerZone}
                    onCheckedChange={(next) => {
                      setIsWalletActive(next);
                    }}
                    aria-label="Toggle driver wallet status"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t pt-6">
              <div className="flex justify-end w-full">
                <Button
                  variant="destructive"
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSavingDangerZone}
                >
                  {isSavingDangerZone ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
