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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "@/api/admin/useAdmin";

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female";
  position: "SUPER_ADMIN" | "ADMIN" | "INVESTOR";
  phoneNumber: string;
  country: string;
}

export default function AddAdmin() {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    position: "SUPER_ADMIN",
    phoneNumber: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const { mutate: createAdmin, isPending } = useCreateAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Admin:", formData);
    createAdmin(formData);
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

              {/* Gender Select */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value as AdminFormData["gender"],
                    }))
                  }
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Position Select */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value as AdminFormData["position"],
                    }))
                  }
                  required
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="INVESTOR">INVESTOR</option>
                </select>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., +2348000000000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Country Input */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g., Nigeria"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button disabled={isPending} type="submit">
              {isPending ? "Creating..." : "Create Admin"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
