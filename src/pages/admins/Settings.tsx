import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Percent, ShieldAlert, Wrench, Send } from "lucide-react";
import {
  useGeneralSetting,
  useUpdateGeneralSetting,
} from "@/api/admin/settings/useSettings";
import Loader from "@/components/utilities/Loader";
import { type GeneralSetting } from "@/api/admin/settings/settings";
import { useSendManyNotifications } from "@/api/admin/notification/useNotification";

/** Inner `data` from GET /settings (see API envelope). */
type SettingsApiData = {
  pricingPerKm?: {
    car?: number;
    van?: number;
    truck?: number;
    bike?: number;
    bicycle?: number;
    rickshaw?: number;
  };
  lockAllWallet?: boolean;
  lockAllRidersWallet?: boolean;
  lockAllVendorsWallet?: boolean;
  lockAllUsersWallet?: boolean;
  lockAllFleetManagersWallet?: boolean;
  maintenanceMode?: boolean;
  fleetCommission?: number;
  vendorCommission?: number;
  riderCommission?: number;
  searchRadius?: number;
};

type PricingPerKmForm = {
  car: number;
  van: number;
  truck: number;
  bike: number;
  bicycle: number;
  rickshaw: number;
};

/** Mirrors backend; notification fields are UI-only (not from API). */
interface SettingsForm {
  fleetCommission: number;
  vendorCommission: number;
  riderCommission: number;
  searchRadius: number;
  pricingPerKm: PricingPerKmForm;
  lockAllWallet: boolean;
  lockAllVendorsWallet: boolean;
  lockAllRidersWallet: boolean;
  lockAllUsersWallet: boolean;
  lockAllFleetManagersWallet: boolean;
  maintenanceMode: boolean;
  notificationType: "email" | "push";
  notificationSubject: string;
  notificationBody: string;
}

const emptyPricingPerKm = (): PricingPerKmForm => ({
  car: 0,
  van: 0,
  truck: 0,
  bike: 0,
  bicycle: 0,
  rickshaw: 0,
});

const emptyForm = (): SettingsForm => ({
  fleetCommission: 0,
  vendorCommission: 0,
  riderCommission: 0,
  searchRadius: 0,
  pricingPerKm: emptyPricingPerKm(),
  lockAllWallet: false,
  lockAllVendorsWallet: false,
  lockAllRidersWallet: false,
  lockAllUsersWallet: false,
  lockAllFleetManagersWallet: false,
  maintenanceMode: false,
  notificationType: "push",
  notificationSubject: "",
  notificationBody: "",
});

function mapApiToForm(api: SettingsApiData): SettingsForm {
  const p = api.pricingPerKm ?? {};
  return {
    fleetCommission: api.fleetCommission ?? 0,
    vendorCommission: api.vendorCommission ?? 0,
    riderCommission: api.riderCommission ?? 0,
    searchRadius: api.searchRadius ?? 0,
    pricingPerKm: {
      car: p.car ?? 0,
      van: p.van ?? 0,
      truck: p.truck ?? 0,
      bike: p.bike ?? 0,
      bicycle: p.bicycle ?? 0,
      rickshaw: p.rickshaw ?? 0,
    },
    lockAllWallet: api.lockAllWallet ?? false,
    lockAllVendorsWallet: api.lockAllVendorsWallet ?? false,
    lockAllRidersWallet: api.lockAllRidersWallet ?? false,
    lockAllUsersWallet: api.lockAllUsersWallet ?? false,
    lockAllFleetManagersWallet: api.lockAllFleetManagersWallet ?? false,
    maintenanceMode: api.maintenanceMode ?? false,
    notificationType: "push",
    notificationSubject: "",
    notificationBody: "",
  };
}

const PRICING_LABELS: { key: keyof PricingPerKmForm; label: string }[] = [
  { key: "car", label: "Car" },
  { key: "van", label: "Van" },
  { key: "truck", label: "Truck" },
  { key: "bike", label: "Bike" },
  { key: "bicycle", label: "Bicycle" },
  { key: "rickshaw", label: "Rickshaw" },
];

export default function Settings() {
  const { data, isLoading, isError } = useGeneralSetting();
  const [settings, setSettings] = useState<SettingsForm>(() => emptyForm());
  const [pendingChanges, setPendingChanges] = useState<Partial<SettingsForm>>(
    {},
  );
  const { mutate: updateGeneralSetting, isPending } = useUpdateGeneralSetting();
  const { mutate: sendManyNotifications, isPending: isSendingManyNotifications } = useSendManyNotifications();

  useEffect(() => {
    const backend = (data as { data?: SettingsApiData } | undefined)?.data;
    if (!backend) return;

    setSettings((prev) => {
      const fromApi = mapApiToForm(backend);
      return {
        ...fromApi,
        notificationType: prev.notificationType,
        notificationSubject: prev.notificationSubject,
        notificationBody: prev.notificationBody,
      };
    });
    setPendingChanges({});
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen p-6">
        <p className="text-destructive">Failed to load settings.</p>
      </div>
    );
  }

  const handleValueChange = (id: keyof SettingsForm, value: unknown) => {
    setSettings((s) => ({ ...s, [id]: value }));
    setPendingChanges((p) => ({ ...p, [id]: value }));
  };

  const handlePricingChange = (key: keyof PricingPerKmForm, raw: string) => {
    const num = raw === "" ? 0 : Number(raw);
    const v = Number.isNaN(num) ? 0 : num;
    setSettings((s) => ({
      ...s,
      pricingPerKm: { ...s.pricingPerKm, [key]: v },
    }));
    setPendingChanges((p) => ({
      ...p,
      pricingPerKm: {
        ...(p.pricingPerKm ?? settings.pricingPerKm),
        [key]: v,
      },
    }));
  };

  const handleSendNotification = () => {
    const message = settings.notificationBody.trim();
    if (!message) {
      toast.error("Message is required.");
      return;
    }
    const subject =
      settings.notificationType === "email"
        ? settings.notificationSubject.trim()
        : settings.notificationSubject.trim() || "Notification";
    if (settings.notificationType === "email" && !subject) {
      toast.error("Subject is required for email.");
      return;
    }

    sendManyNotifications(
      {
        type: settings.notificationType,
        subject,
        message,
      },
      {
        onSuccess: () => {
          setSettings((s) => ({
            ...s,
            notificationSubject: "",
            notificationBody: "",
          }));
        },
      },
    );
  };

  const handleSaveChanges = () => {
    setPendingChanges({});
    updateGeneralSetting(settings as GeneralSetting);
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const canSendNotification =
    Boolean(settings.notificationBody.trim()) &&
    (settings.notificationType === "push" ||
      Boolean(settings.notificationSubject.trim()));

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="my-6">
            <h3 className="!font-bold text-3xl">Global Settings</h3>
            <p>Manage platform-wide configurations and controls.</p>
          </div>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasPendingChanges || isPending}
            className="mt-4 sm:mt-0"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-secondary py-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Percent className="h-6 w-6 text-gray-500" />
                <div>
                  <CardTitle>Financials</CardTitle>
                  <CardDescription>
                    Commissions, search radius, and pricing per km from the API.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fleetCommission">Fleet Commission (%)</Label>
                <Input
                  id="fleetCommission"
                  type="number"
                  value={settings.fleetCommission}
                  onChange={(e) =>
                    handleValueChange(
                      "fleetCommission",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorCommission">Vendor Commission (%)</Label>
                <Input
                  id="vendorCommission"
                  type="number"
                  value={settings.vendorCommission}
                  onChange={(e) =>
                    handleValueChange(
                      "vendorCommission",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riderCommission">Rider Commission (%)</Label>
                <Input
                  id="riderCommission"
                  type="number"
                  value={settings.riderCommission}
                  onChange={(e) =>
                    handleValueChange(
                      "riderCommission",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchRadius">Search radius</Label>
                <Input
                  id="searchRadius"
                  type="number"
                  value={settings.searchRadius}
                  onChange={(e) =>
                    handleValueChange(
                      "searchRadius",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                />
              </div>
            </CardContent>
            <CardHeader className="pt-2">
              <CardTitle className="text-base">Pricing per km (NGN)</CardTitle>
              <CardDescription>
                One amount per vehicle type (pricing per km, NGN).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRICING_LABELS.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`price-${key}`}>{label}</Label>
                  <Input
                    id={`price-${key}`}
                    type="number"
                    value={settings.pricingPerKm[key]}
                    onChange={(e) => handlePricingChange(key, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-secondary py-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Wrench className="h-6 w-6 text-gray-500" />
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Control application state.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  settings.maintenanceMode
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="font-semibold">
                      Maintenance Mode
                    </Label>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(c) =>
                      handleValueChange("maintenanceMode", c)
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Temporarily disable public access to the app.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-secondary py-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <div>
                  <CardTitle>Global Wallet Controls</CardTitle>
                  <CardDescription>
                    These are high-impact actions. Use with caution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <WalletToggle
                id="lockAllWallet"
                label="Lock all wallets"
                description="lockAllWallet"
                checked={settings.lockAllWallet}
                onCheckedChange={(c) => handleValueChange("lockAllWallet", c)}
              />
              <WalletToggle
                id="lockAllVendorsWallet"
                label="Lock vendor wallets"
                description="lockAllVendorsWallet"
                checked={settings.lockAllVendorsWallet}
                onCheckedChange={(c) =>
                  handleValueChange("lockAllVendorsWallet", c)
                }
              />
              <WalletToggle
                id="lockAllRidersWallet"
                label="Lock rider wallets"
                description="lockAllRidersWallet"
                checked={settings.lockAllRidersWallet}
                onCheckedChange={(c) =>
                  handleValueChange("lockAllRidersWallet", c)
                }
              />
              <WalletToggle
                id="lockAllUsersWallet"
                label="Lock user wallets"
                description="lockAllUsersWallet"
                checked={settings.lockAllUsersWallet}
                onCheckedChange={(c) =>
                  handleValueChange("lockAllUsersWallet", c)
                }
              />
              <WalletToggle
                id="lockAllFleetManagersWallet"
                label="Lock fleet manager wallets"
                description="lockAllFleetManagersWallet"
                checked={settings.lockAllFleetManagersWallet}
                onCheckedChange={(c) =>
                  handleValueChange("lockAllFleetManagersWallet", c)
                }
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-secondary py-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Send className="h-6 w-6 text-gray-500" />
                <div>
                  <CardTitle>Global Notifications</CardTitle>
                  <CardDescription>
                    Send General Notifications to all users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Notification Type</Label>
                <RadioGroup
                  value={settings.notificationType}
                  onValueChange={(value: "email" | "push") =>
                    handleValueChange("notificationType", value)
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="push" id="r-push" />
                    <Label htmlFor="r-push">Push Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="r-email" />
                    <Label htmlFor="r-email">Email</Label>
                  </div>
                </RadioGroup>
              </div>
              {settings.notificationType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="notificationSubject">Subject</Label>
                  <Input
                    id="notificationSubject"
                    value={settings.notificationSubject}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        notificationSubject: e.target.value,
                      }))
                    }
                    placeholder="e.g., Important Platform Update"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notificationBody">Message</Label>
                <Textarea
                  id="notificationBody"
                  value={settings.notificationBody}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      notificationBody: e.target.value,
                    }))
                  }
                  placeholder="Type your message here. This will be sent to all users."
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    disabled={!canSendNotification || isSendingManyNotifications}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Notification</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to send a "{settings.notificationType}" to
                      all users. This action cannot be undone. Are you sure you
                      want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSendNotification}
                      disabled={isSendingManyNotifications}
                    >
                      {isSendingManyNotifications ? "Sending…" : "Yes, send now"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WalletToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        checked
          ? "border-red-500 bg-red-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-semibold">
          {label}
        </Label>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  );
}
