import { useState, useEffect, useMemo, type ReactNode } from "react";

import { toast } from "sonner";

import {
  Mail,
  Bell,
  Calendar,
  UserX,
  ShieldCheck,
  Send,
  Gift,
  Wallet,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useUser,
  useUserAccountAction,
  useUserWalletAction,
} from "@/api/admin/users/useUsers";
import { useParams } from "react-router";
import Loader from "@/components/utilities/Loader";
import { useSendOneNotification } from "@/api/admin/notification/useNotification";


type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

function UserDetails() {
  const { id } = useParams();
  const { data: userData, isLoading } = useUser(id as string);
  const userAccountMutation = useUserAccountAction(id ?? "");
  const userWalletMutation = useUserWalletAction(id ?? "");
 const { mutate: sendOneNotification, isPending: isSendingOneNotification } = useSendOneNotification();
  
  const user = userData?.data;

  const defaultAccountActive = useMemo(
    () => !user?.suspended,
    [user?.suspended],
  );
  const defaultWalletActive = useMemo(
    () => !(user?.wallet?.suspended ?? user?.suspended),
    [user?.wallet?.suspended, user?.suspended],
  );

  const [isAccountActive, setIsAccountActive] = useState(defaultAccountActive);
  const [isWalletActive, setIsWalletActive] = useState(defaultWalletActive);
  const [message, setMessage] = useState("");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [messageType, setMessageType] = useState<"email" | "push">("email");
  const [hasChanges, setHasChanges] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    setIsAccountActive(defaultAccountActive);
    setIsWalletActive(defaultWalletActive);
    setHasChanges(false);
  }, [defaultAccountActive, defaultWalletActive]);

  useEffect(() => {
    const accountChanged = isAccountActive !== defaultAccountActive;
    const walletChanged = isWalletActive !== defaultWalletActive;
    setHasChanges(accountChanged || walletChanged);
  }, [
    isAccountActive,
    isWalletActive,
    defaultAccountActive,
    defaultWalletActive,
  ]);

  const isSavingChanges =
    userAccountMutation.isPending || userWalletMutation.isPending;

  const handleSaveChanges = async () => {
    const accountChanged = isAccountActive !== defaultAccountActive;
    const walletChanged = isWalletActive !== defaultWalletActive;
    if (!accountChanged && !walletChanged) return;

    try {
      if (accountChanged) {
        await userAccountMutation.mutateAsync(
          isAccountActive ? "release" : "suspend",
        );
      }
      if (walletChanged) {
        await userWalletMutation.mutateAsync(
          isWalletActive ? "release" : "suspend",
        );
      }
      setHasChanges(false);
      toast.success("User settings updated successfully.");
    } catch {
      // hook-level toasts handle errors
    }
  };

  const handleSendMessage = () => {
    const body = message.trim();
    if (!body) {
      toast.error("Message is required.");
      return;
    }
    if (!id) return;

    const subject =
      messageType === "email"
        ? notificationSubject.trim()
        : notificationSubject.trim() || "Notification";
    if (messageType === "email" && !subject) {
      toast.error("Subject is required for email.");
      return;
    }

    sendOneNotification(
      {
        id,
        recipient: "user",
        data: {
          type: messageType,
          subject,
          message: body,
        },
      },
      {
        onSuccess: () => {
          setMessage("");
          setNotificationSubject("");
        },
      },
    );
  };

  const canSendNotification =
    Boolean(message.trim()) &&
    (messageType === "push" || Boolean(notificationSubject.trim()));

  const InfoRow = ({ icon, label, value }: InfoRowProps) => (
    <div className="flex items-start space-x-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value || "N/A"}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-secondary py-4">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-gray-200 flex items-center justify-center">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary py-4">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5" />}
                label="Join Date"
                value={formatDate(user.createdAt)}
              />
              <InfoRow
                icon={<Gift className="w-5 h-5" />}
                label="Referral Code"
                value={user.referrerCode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Send Message Card */}
          <Card className="bg-secondary py-4">
            <CardHeader>
              <CardTitle>Contact User</CardTitle>
              <CardDescription>
                Send a direct email or push notification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={messageType}
                onValueChange={(v) =>
                  setMessageType(v as "email" | "push")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="type-email" />
                  <Label htmlFor="type-email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="push" id="type-push" />
                  <Label htmlFor="type-push" className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Push Notification
                  </Label>
                </div>
              </RadioGroup>
              {messageType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="notification-subject">Subject</Label>
                  <Input
                    id="notification-subject"
                    value={notificationSubject}
                    onChange={(e) => setNotificationSubject(e.target.value)}
                    placeholder="e.g., Account update"
                  />
                </div>
              )}
              {messageType === "push" && (
                <div className="space-y-2">
                  <Label htmlFor="notification-push-subject">
                    Title (optional)
                  </Label>
                  <Input
                    id="notification-push-subject"
                    value={notificationSubject}
                    onChange={(e) => setNotificationSubject(e.target.value)}
                    placeholder="Defaults to “Notification” if empty"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notification-message">Message</Label>
                <Textarea
                  id="notification-message"
                  placeholder={`Write your ${messageType} to ${user.email}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendMessage}
                disabled={
                  !canSendNotification || isSendingOneNotification || !id
                }
              >
                <Send className="w-4 h-4 mr-2" />
                {isSendingOneNotification ? "Sending…" : "Send message"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-400 bg-secondary py-4">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Manage critical user account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label
                    htmlFor="disable-account-switch"
                    className="font-medium flex items-center"
                  >
                    {isAccountActive ? (
                      <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                    ) : (
                      <UserX className="w-5 h-5 mr-2 text-destructive" />
                    )}
                    User Account
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isAccountActive
                      ? "Disabling will prevent the user from logging in."
                      : "Enabling will restore user access."}
                  </p>
                </div>
                <Switch
                  id="disable-account-switch"
                  checked={isAccountActive}
                  onCheckedChange={setIsAccountActive}
                  disabled={isSavingChanges}
                  aria-label="Toggle account status"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-4">
                <div>
                  <Label
                    htmlFor="disable-wallet-switch"
                    className="font-medium flex items-center"
                  >
                    <Wallet className="w-5 h-5 mr-2 text-amber-600" />
                    User Wallet
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isWalletActive
                      ? "Disabling will suspend wallet transactions."
                      : "Enabling will restore wallet transactions."}
                  </p>
                </div>
                <Switch
                  id="disable-wallet-switch"
                  checked={isWalletActive}
                  onCheckedChange={setIsWalletActive}
                  disabled={isSavingChanges}
                  aria-label="Toggle wallet status"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-end w-full">
                <Button
                  variant="destructive"
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSavingChanges}
                >
                  {isSavingChanges ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
