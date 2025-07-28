import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

const AVAILABLE_ROLES: string[] = [
  "Admin",
  "Editor",
  "Viewer",
  "Auditor",
  "Publisher",
];

export default function AddAdmin() {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRoleChange = (
    role: string,
    checked: boolean | "indeterminate"
  ) => {
    setFormData((prevData) => {
      const currentRoles = prevData.roles;
      if (checked) {
        return { ...prevData, roles: [...currentRoles, role] };
      } else {
        return { ...prevData, roles: currentRoles.filter((r) => r !== role) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Admin:", formData);
    alert(
      `Admin "${formData.firstName} ${
        formData.lastName
      }" created with roles "${formData.roles.join(
        ", "
      )}"! Check the console for details.`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl py-6 bg-secondary">
        <CardHeader>
          <CardTitle>Create Admin</CardTitle>
          <CardDescription>
            Fill out the form below to add a new admin user to the system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name Input */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="e.g., Ada"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Last Name Input */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Lovelace"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., ada.lovelace@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Role Selection using Checkboxes */}
              <div className="md:col-span-2 space-y-3">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-lg border p-4">
                  {AVAILABLE_ROLES.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        className="border-primary"
                        id={role}
                        checked={formData.roles.includes(role)}
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit">Create Admin</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
