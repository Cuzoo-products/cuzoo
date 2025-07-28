import { useState } from "react";

// --- UI COMPONENT IMPORTS (ASSUMED FROM SHADCN/UI) ---
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

// --- TYPESCRIPT INTERFACE ---
interface GlobalSettings {
  commissionFleet: number;
  commissionVendor: number;
  commissionRider: number;
  chargePerKm: number;
  lockAllWallets: boolean;
  lockRiderWallets: boolean;
  lockFleetWallets: boolean;
  maintenanceMode: boolean;
  notificationType: "email" | "push";
  notificationSubject: string;
  notificationBody: string;
}

const initialSettings: GlobalSettings = {
  commissionFleet: 15,
  commissionVendor: 20,
  commissionRider: 10,
  chargePerKm: 50,
  lockAllWallets: false,
  lockRiderWallets: false,
  lockFleetWallets: false,
  maintenanceMode: false,
  notificationType: "push",
  notificationSubject: "",
  notificationBody: "",
};

export default function Settings() {
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings);
  const [pendingChanges, setPendingChanges] = useState<Partial<GlobalSettings>>(
    {}
  );

  const handleValueChange = (id: keyof GlobalSettings, value: unknown) => {
    setSettings((s) => ({ ...s, [id]: value }));
    setPendingChanges((p) => ({ ...p, [id]: value }));
  };

  const handleSendNotification = () => {
    const { notificationType, notificationSubject, notificationBody } =
      settings;
    console.log("Sending Notification:", {
      type: notificationType,
      subject: notificationSubject,
      body: notificationBody,
    });
    // API call to send notification would go here
    alert(`Notification sent as ${notificationType}!`);
    // Clear fields after sending
    setSettings((s) => ({
      ...s,
      notificationSubject: "",
      notificationBody: "",
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", pendingChanges);
    // API call to save the pendingChanges would go here
    // e.g., fetch('/api/settings', { method: 'PATCH', body: JSON.stringify(pendingChanges) });
    setPendingChanges({});
    alert("Settings saved successfully!");
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

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
            disabled={!hasPendingChanges}
            className="mt-4 sm:mt-0"
          >
            Save Changes
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
                    Set commissions and delivery pricing.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="commissionFleet">Fleet Commission (%)</Label>
                <Input
                  id="commissionFleet"
                  type="number"
                  value={settings.commissionFleet}
                  onChange={(e) =>
                    handleValueChange(
                      "commissionFleet",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g., 15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionVendor">Vendor Commission (%)</Label>
                <Input
                  id="commissionVendor"
                  type="number"
                  value={settings.commissionVendor}
                  onChange={(e) =>
                    handleValueChange(
                      "commissionVendor",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRider">Rider Commission (%)</Label>
                <Input
                  id="commissionRider"
                  type="number"
                  value={settings.commissionRider}
                  onChange={(e) =>
                    handleValueChange(
                      "commissionRider",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g., 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chargePerKm">Charge Per Km (NGN)</Label>
                <Input
                  id="chargePerKm"
                  type="number"
                  value={settings.chargePerKm}
                  onChange={(e) =>
                    handleValueChange(
                      "chargePerKm",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g., 50"
                />
              </div>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Switch
                        id="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(c) =>
                          handleValueChange("maintenanceMode", c)
                        }
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will{" "}
                          {settings.maintenanceMode ? "disable" : "enable"}{" "}
                          maintenance mode. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleValueChange(
                              "maintenanceMode",
                              !settings.maintenanceMode
                            )
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
              <div
                className={`p-4 rounded-lg border ${
                  settings.lockAllWallets
                    ? "border-red-500 bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockAllWallets" className="font-semibold">
                    Lock All Wallets
                  </Label>
                  <Switch
                    id="lockAllWallets"
                    checked={settings.lockAllWallets}
                    onCheckedChange={(c) =>
                      handleValueChange("lockAllWallets", c)
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Freezes transactions for all vendors.
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  settings.lockRiderWallets
                    ? "border-red-500 bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockRiderWallets" className="font-semibold">
                    Lock Rider Wallets
                  </Label>
                  <Switch
                    id="lockRiderWallets"
                    checked={settings.lockRiderWallets}
                    onCheckedChange={(c) =>
                      handleValueChange("lockRiderWallets", c)
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Freezes transactions for all riders.
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  settings.lockFleetWallets
                    ? "border-red-500 bg-red-900/20 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockFleetWallets" className="font-semibold">
                    Lock Fleet Wallets
                  </Label>
                  <Switch
                    id="lockFleetWallets"
                    checked={settings.lockFleetWallets}
                    onCheckedChange={(c) =>
                      handleValueChange("lockFleetWallets", c)
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Freezes transactions for all fleet managers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-secondary py-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Send className="h-6 w-6 text-gray-500" />
                <div>
                  <CardTitle>Global Notifications</CardTitle>
                  <CardDescription>
                    Send a message to all users via email or push notification.
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
                    disabled={!settings.notificationBody}
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
                    <AlertDialogAction onClick={handleSendNotification}>
                      Yes, Send Now
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
