import React, { useState, useEffect } from "react";

import {
  Mail,
  Bell,
  Calendar,
  Smartphone,
  UserX,
  ShieldCheck,
  Send,
} from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const mockUser = {
  id: "usr_8c4d5e1a",
  name: "Casey Jordan",
  email: "casey.jordan@example.com",
  avatarUrl: "https://placehold.co/100x100/ec4899/white?text=CJ",
  status: "Active", // Can be 'Active', 'Invited', or 'Disabled'
  lastSeen: "2025-07-22T20:15:00Z",
  dateJoined: "2024-03-10T14:48:00Z",
  device: "iPhone 15 Pro",
};

// --- TYPE DEFINITION FOR INFOROW PROPS ---
type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function UserDetails() {
  // const { toast } = useToast(); // Uncomment when you have toast configured
  const [userData, setUserData] = useState(mockUser);
  const [isAccountActive, setIsAccountActive] = useState(
    mockUser.status === "Active"
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("email"); // 'email' or 'push'
  const [hasChanges, setHasChanges] = useState(false);

  // Effect to track if the account status has changed
  useEffect(() => {
    const statusChanged =
      (isAccountActive ? "Active" : "Disabled") !== userData.status;
    setHasChanges(statusChanged);
  }, [isAccountActive, userData.status]);

  const handleUpdateStatus = () => {
    const newStatus = isAccountActive ? "Active" : "Disabled";
    console.log("Updating status to:", newStatus);
    setUserData((prev) => ({ ...prev, status: newStatus }));
    setHasChanges(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log(`Sending ${messageType} to ${userData.email}:`, message);
    setMessage("");
  };

  const InfoRow = ({ icon, label, value }: InfoRowProps) => (
    <div className="flex items-start space-x-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-secondary py-4">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.id}</p>
                <div className="mt-4">
                  <Badge
                    variant={
                      userData.status === "Active" ? "default" : "destructive"
                    }
                  >
                    {userData.status}
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
                value={userData.email}
              />
              <InfoRow
                icon={<Calendar className="w-5 h-5" />}
                label="Date Joined"
                value={new Date(userData.dateJoined).toLocaleDateString()}
              />
              <InfoRow
                icon={<Smartphone className="w-5 h-5" />}
                label="Last Seen On"
                value={userData.device}
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
                onValueChange={setMessageType}
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
              <Textarea
                placeholder={`Write your ${messageType} to ${userData.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
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
                  aria-label="Toggle account status"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-end w-full">
                <Button
                  variant="destructive"
                  onClick={handleUpdateStatus}
                  disabled={!hasChanges}
                >
                  Update Status
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
