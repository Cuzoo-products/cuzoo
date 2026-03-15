import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Truck, Users, FileCheck, ShieldAlert, CheckCircle } from "lucide-react";
import { useParams } from "react-router";
import { useGetOneFleet, useApproveFleet } from "@/api/admin/useFleet";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/utilities/Loader";

interface DocumentAsset {
  path: string;
  url: string;
  type: string;
}

interface FleetManagerPhone {
  countryCode?: string;
  nationalFormat?: string;
  number?: string;
  internationalFormat?: string;
  countryCallingCode?: string;
}

export interface FleetManagerData {
  Id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: FleetManagerPhone;
  address: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  tinNumber: string;
  registrationNumber: string;
  dateOfIncorporation: string;
  placeOfIncorporation: string;
  companyType: string;
  approvalStatus: string;
  approved: boolean;
  suspended: boolean;
  directors: string[];
  servicesRendered: string[];
  insuranceCoverage: string[];
  passport?: DocumentAsset;
  certificateOfIncorporation?: DocumentAsset;
  governmentApprovedId?: DocumentAsset;
  proofOfAddress?: DocumentAsset;
  insuranceCertificate?: DocumentAsset;
  courierLicense?: DocumentAsset;
  createdAt: string;
  updatedAt: string;
  wallet: string;
  fleets: number;
  drivers: number;
}

const DOCUMENT_LABELS: Record<string, string> = {
  passport: "Passport",
  certificateOfIncorporation: "Certificate of Incorporation",
  governmentApprovedId: "Government Approved ID",
  proofOfAddress: "Proof of Address",
  insuranceCertificate: "Insurance Certificate",
  courierLicense: "Courier License",
};

function buildDocumentsList(
  data: FleetManagerData | undefined,
): { key: string; label: string; doc?: DocumentAsset }[] {
  if (!data) return [];
  return [
    { key: "passport", label: DOCUMENT_LABELS.passport, doc: data.passport },
    {
      key: "certificateOfIncorporation",
      label: DOCUMENT_LABELS.certificateOfIncorporation,
      doc: data.certificateOfIncorporation,
    },
    {
      key: "governmentApprovedId",
      label: DOCUMENT_LABELS.governmentApprovedId,
      doc: data.governmentApprovedId,
    },
    {
      key: "proofOfAddress",
      label: DOCUMENT_LABELS.proofOfAddress,
      doc: data.proofOfAddress,
    },
    {
      key: "insuranceCertificate",
      label: DOCUMENT_LABELS.insuranceCertificate,
      doc: data.insuranceCertificate,
    },
    {
      key: "courierLicense",
      label: DOCUMENT_LABELS.courierLicense,
      doc: data.courierLicense,
    },
  ].filter((row) => row.doc?.url);
}

export default function FleetOwnersProfile() {
  const { id } = useParams();
  const { data: response, isLoading } = useGetOneFleet(id!);
  const approveFleetMutation = useApproveFleet(id ?? undefined);
  const [isAccountActive, setIsAccountActive] = useState<boolean>(true);

  const api = (response as { data?: FleetManagerData } | undefined)?.data;
  const documents = buildDocumentsList(api);

  const displayName = api
    ? [api.firstName, api.lastName].filter(Boolean).join(" ") ||
      api.businessName
    : "-";
  const phoneDisplay =
    api?.phoneNumber?.internationalFormat ||
    api?.phoneNumber?.nationalFormat ||
    api?.phoneNumber?.number ||
    "-";
  const joinDate = api?.createdAt
    ? new Date(api.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";
  const incorporationDate = api?.dateOfIncorporation
    ? new Date(api.dateOfIncorporation).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

  const handleAccountToggle = (checked: boolean) => {
    setIsAccountActive(checked);
  };

  const handleApprove = () => {
    if (id) approveFleetMutation.mutate();
  };

  const canApprove = api && !api.approved && !api.suspended && api.approvalStatus?.toLowerCase() !== "approved";

  if (isLoading) {
    return <Loader />;
  }

  if (!api) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
        <p className="text-muted-foreground">Fleet manager not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="my-6">
          <h1 className="text-3xl !font-bold">Fleet Manager Details</h1>
          <p>Manage fleet manager profile, documents, and status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="py-6 bg-secondary">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {(api.businessName || "FM").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl">
                      {api.businessName || "-"}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {api.approvalStatus}
                    </Badge>
                    {api.suspended && (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                    {api.approved && !api.suspended && (
                      <Badge variant="default">Approved</Badge>
                    )}
                  </div>
                  <CardDescription>{displayName}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{api.email || "-"}</span>
                  </div>
                  {api.emailVerified !== undefined && (
                    <div className="flex justify-between items-center">
                      <span>Email verified</span>
                      {api.emailVerified ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-600"
                        >
                          No
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium">{phoneDisplay}</span>
                  </div>
                  {api.phoneNumberVerified !== undefined && (
                    <div className="flex justify-between items-center">
                      <span>Phone verified</span>
                      {api.phoneNumberVerified ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-600"
                        >
                          No
                        </Badge>
                      )}
                    </div>
                  )}
                  {api.address && (
                    <div className="flex justify-between">
                      <span>Address</span>
                      <span className="font-medium max-w-[60%] text-right">
                        {api.address}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Company type</span>
                    <span className="font-medium">
                      {api.companyType || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Place of incorporation</span>
                    <span className="font-medium">
                      {api.placeOfIncorporation || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration No.</span>
                    <span className="font-medium">
                      {api.registrationNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIN</span>
                    <span className="font-medium">{api.tinNumber || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date of incorporation</span>
                    <span className="font-medium">{incorporationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined on</span>
                    <span className="font-medium">{joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Fleets</CardTitle>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{api.fleets ?? 0}</div>
                </CardContent>
              </Card>
              <Card className="py-3 bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{api.drivers ?? 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Approve the account or enable or disable manager access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {canApprove && (
                  <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold">Approve account</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Approve this fleet manager so they can use the platform.
                      </p>
                    </div>
                    <Button
                      onClick={handleApprove}
                      disabled={approveFleetMutation.isPending}
                    >
                      {approveFleetMutation.isPending ? "Approving…" : "Approve account"}
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <ShieldAlert className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor="account-status" className="font-semibold">
                      Account status
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Disable the manager&apos;s ability to log in.
                    </p>
                  </div>
                  <Switch
                    id="account-status"
                    checked={isAccountActive}
                    onCheckedChange={handleAccountToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {(api.servicesRendered?.length > 0 ||
              api.insuranceCoverage?.length > 0 ||
              api.directors?.length > 0) && (
              <Card className="py-6 bg-secondary">
                <CardHeader>
                  <CardTitle>Company details</CardTitle>
                  <CardDescription>
                    Services, insurance, and directors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {api.servicesRendered?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Services rendered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {api.servicesRendered.map((s, i) => (
                          <Badge key={i} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {api.insuranceCoverage?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Insurance coverage
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {api.insuranceCoverage.map((c, i) => (
                          <Badge key={i} variant="outline">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {api.directors?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Directors
                      </p>
                      <ul className="text-sm list-disc list-inside space-y-0.5">
                        {api.directors.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="py-6 bg-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Manager documents
                </CardTitle>
                <CardDescription>
                  Documents provided for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map(({ key, label, doc }) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{label}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {doc?.type || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={doc?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View / Download
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {documents.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    No documents have been uploaded.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <FinancialReport /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
