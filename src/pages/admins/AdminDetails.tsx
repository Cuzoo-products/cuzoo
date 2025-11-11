import { useState, useEffect, type ReactNode } from "react";
import { Mail, Clock, Calendar, UserCheck, Shield, UserX } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAdmin, useToggleReleaseAdmin } from "@/api/admin/useAdmin";
import { useParams } from "react-router";
import Loader from "@/components/utilities/Loader";

const AVAILABLE_ROLES: string[] = [
  "Admin",
  "Editor",
  "Viewer",
  "Auditor",
  "Publisher",
];

function AdminDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetAdmin(id as string);
  const { mutate: toggleReleaseAdmin } = useToggleReleaseAdmin(id as string);
  const [selectedRole, setSelectedRole] = useState(["Admin"]);
  const [isAccountActive, setIsAccountActive] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const adminData = data?.data || {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: {
      internationalFormat: "",
      nationalFormat: "",
      number: "",
      countryCode: "",
      countryCallingCode: "",
    },
    country: "",
    position: "",
    createdAt: "",
    updatedAt: "",
    referrerCode: "",
    gender: "",
    suspended: false,
  };

  useEffect(() => {
    if (data?.data) {
      setSelectedRole(["Admin"]);
      setIsAccountActive(!data.data.suspended);
    }
  }, [data]);

  const toggleAdminStatus = () => {
    setIsAccountActive(!isAccountActive);
    toggleReleaseAdmin(
      {
        id: adminData.id,
        release: adminData.suspended ? "release" : "suspend",
      },
      {
        onError: () => {
          setIsAccountActive(!isAccountActive);
        },
      }
    );
  };

  // Handler for saving changes
  const handleSaveChanges = () => {
    // In a real app, you would make an API call here to persist the changes.
    console.log("Saving changes:", {
      role: selectedRole,
      status: isAccountActive ? "Active" : "Disabled",
    });

    // Update the local state to reflect the "saved" data
    setHasChanges(false);
    // Here you might show a success toast message, e.g., using shadcn's toast component.
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center space-x-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );

  const handleRoleChange = (
    role: string,
    checked: boolean | "indeterminate"
  ) => {
    setSelectedRole((prevData) => {
      if (checked) {
        return [...prevData, role];
      } else {
        const currentRoles = prevData.filter((oldrole) => oldrole === role);
        return [...currentRoles];
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="my-6">
        <h3 className="!font-bold text-3xl">John Doe</h3>
        <p>Manage John Doe here</p>
      </div>

      <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Admin Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-secondary">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback>
                      {`${adminData.firstName?.[0] || ""}${
                        adminData.lastName?.[0] || ""
                      }`.toUpperCase() || "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">
                    {`${adminData.firstName || ""} ${
                      adminData.lastName || ""
                    }`.trim()}
                  </h2>

                  <div className="my-4 flex items-center space-x-2">
                    <Badge
                      variant={adminData.suspended ? "destructive" : "outline"}
                    >
                      {adminData.suspended ? "Suspended" : "Active"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary py-4">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoRow
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    label="Email"
                    value={adminData.email || "N/A"}
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                    label="Last Updated"
                    value={
                      adminData.updatedAt
                        ? new Date(adminData.updatedAt).toLocaleString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    icon={
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    }
                    label="Date Joined"
                    value={
                      adminData.createdAt
                        ? new Date(adminData.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                    label="Position"
                    value={adminData.position || "N/A"}
                  />
                  <InfoRow
                    icon={
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    }
                    label="Phone Number"
                    value={adminData.phoneNumber?.internationalFormat || "N/A"}
                  />
                  <InfoRow
                    icon={
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    }
                    label="Referral Code"
                    value={adminData.referrerCode || "N/A"}
                  />
                  <InfoRow
                    icon={
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    }
                    label="Country"
                    value={adminData.country || "N/A"}
                  />
                  <InfoRow
                    icon={
                      adminData.status === "Active" ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-500" />
                      )
                    }
                    label="Status"
                    value={adminData.suspended ? "Suspended" : "Active"}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions & Permissions */}
          <div className="lg:col-span-2">
            <Card className="bg-secondary py-4">
              <CardHeader>
                <CardTitle>Actions & Permissions</CardTitle>
                <CardDescription>
                  Manage this administrator's role and account status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Role Management */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-muted-foreground" />
                    Assign Role
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-lg border p-4">
                    {AVAILABLE_ROLES.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          className="border-primary"
                          id={role}
                          checked={selectedRole.includes(role)}
                          onCheckedChange={(checked) =>
                            handleRoleChange(role, checked)
                          }
                        />
                        <Label htmlFor={role} className="font-normal">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Management */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    {isAccountActive ? (
                      <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                    ) : (
                      <UserX className="w-5 h-5 mr-2 text-red-500" />
                    )}
                    Account Status
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div>
                      <Label
                        htmlFor="account-status-switch"
                        className="font-medium"
                      >
                        {isAccountActive
                          ? "Account is Active"
                          : "Account is Disabled"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {isAccountActive
                          ? "Admin has full access."
                          : "Admin cannot log in or perform actions."}
                      </p>
                    </div>
                    {/* Using shadcn Switch */}
                    <Switch
                      id="account-status-switch"
                      checked={isAccountActive}
                      onCheckedChange={toggleAdminStatus}
                      aria-label="Toggle account status"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="flex justify-end w-full">
                  <Button onClick={handleSaveChanges} disabled={!hasChanges}>
                    Save Changes
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;
