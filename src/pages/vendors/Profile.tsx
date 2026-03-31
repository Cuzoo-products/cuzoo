import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import Loader from "@/components/utilities/Loader";
import { useGetVendorProfile } from "@/api/vendor/auth/useAuth";
import { useSendVerificationMail } from "@/api/shared/useAuth";

type PhoneNumberPayload = {
  countryCode?: string;
  nationalFormat?: string;
  number?: string;
  internationalFormat?: string;
  countryCallingCode?: string;
};

type Asset = {
  path?: string;
  url?: string;
  type?: string;
};

type AddressGeometry = {
  location?: { lat?: number; lng?: number };
};

type AddressPayload = {
  formatted_address?: string;
  description?: string;
  placeId?: string;
  geometry?: AddressGeometry;
  landMark?: string;
  country?: string;
  state?: string;
  direction?: string;
  distance?: number;
  duration?: number;
};

type ProprietorPayload = {
  name?: string;
  nationality?: string;
  state?: string;
  residentialAddress?: string;
  declaration?: string;
};

/** Firestore Timestamp serialized in JSON (e.g. from API). */
type FirestoreTimestampLike = {
  _seconds?: number;
  _nanoseconds?: number;
  seconds?: number;
  nanoseconds?: number;
};

export type VendorProfilePayload = {
  Id?: string;
  id?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: PhoneNumberPayload;
  logo?: Asset;
  storeCode?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string | FirestoreTimestampLike;
  placeOfIncorporation?: string;
  businessType?: string;
  address?: AddressPayload;
  emailVerified?: boolean;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
  typeOfGoodsSold?: string;
  proprietor?: ProprietorPayload;
  passport?: Asset;
  certificateOfIncorporation?: Asset;
  governmentApprovedId?: Asset;
  proofOfAddress?: Asset;
  lgaPermit?: Asset;
  gphLicense?: Asset;
  nafdacRegistration?: Asset;
  createdAt?: string | FirestoreTimestampLike;
  updatedAt?: string | FirestoreTimestampLike;
};

type VendorProfileResponse = {
  success: boolean;
  statusCode: number;
  data: VendorProfilePayload;
};

const EM_DASH = "—";

function toDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && value !== null) {
    const o = value as FirestoreTimestampLike;
    const sec = o._seconds ?? o.seconds;
    if (typeof sec === "number") {
      return new Date(sec * 1000);
    }
  }
  return null;
}

function formatDate(value: unknown): string {
  const d = toDate(value);
  if (d) {
    return d.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (typeof value === "string" && value.trim() !== "") return value;
  return EM_DASH;
}

function fullName(p?: VendorProfilePayload): string {
  return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim() || EM_DASH;
}

function formatCoord(lat?: number, lng?: number): string {
  if (typeof lat === "number" && typeof lng === "number") {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
  return EM_DASH;
}

export default function VendorProfile() {
  const { data, isLoading, error } = useGetVendorProfile() as {
    data?: VendorProfileResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { mutate: sendVerificationEmail, isPending: isSendingVerification } =
    useSendVerificationMail();

  if (isLoading) return <Loader />;

  if (error || !data?.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p className="text-red-500">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  const profile = data.data;

  const sendEmail = () => {
    const email = profile.email?.trim();
    if (!email) return;
    sendVerificationEmail({ email, accountType: "vendor" });
  };

  const addr = profile.address;
  const primaryAddress =
    addr?.formatted_address?.trim() ||
    addr?.description?.trim() ||
    [addr?.landMark, addr?.state, addr?.country].filter(Boolean).join(", ") ||
    "";

  const docs: Array<[string, Asset | undefined]> = [
    ["Passport", profile.passport],
    ["Certificate of Incorporation", profile.certificateOfIncorporation],
    ["Government Approved ID", profile.governmentApprovedId],
    ["Proof of Address", profile.proofOfAddress],
    ["LGA Permit", profile.lgaPermit],
    ["GPH License", profile.gphLicense],
    ["NAFDAC Registration", profile.nafdacRegistration],
  ];

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Profile</h3>
          <p className="text-muted-foreground">Vendor profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile.logo?.url} alt={profile.businessName} />
            <AvatarFallback>
              {(profile.businessName || profile.firstName || "V")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{profile.businessName ?? EM_DASH}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.approvalStatus ?? EM_DASH}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Core account and verification details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Vendor ID</p>
              <p className="font-mono break-all">{profile.Id ?? profile.id ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Full name</p>
              <p>{fullName(profile)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Business name</p>
              <p>{profile.businessName ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p>{profile.email ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Store code</p>
              <p>{profile.storeCode ?? EM_DASH}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={profile.emailVerified ? "default" : "secondary"}>
                {profile.emailVerified ? "Email verified" : "Email not verified"}
              </Badge>
              {!profile.emailVerified ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendEmail}
                  disabled={!profile.email?.trim() || isSendingVerification}
                >
                  {isSendingVerification ? "Sending…" : "Verify email"}
                </Button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
             
              {profile.suspended ? <Badge variant="destructive">Suspended</Badge> : null}
             
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>Registration and offering details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Registration number</p>
              <p>{profile.registrationNumber ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Date of incorporation</p>
              <p>{formatDate(profile.dateOfIncorporation)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Place of incorporation</p>
              <p>{profile.placeOfIncorporation ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Business type</p>
              <p>{profile.businessType ?? EM_DASH}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs">Type of goods sold</p>
              <p>{profile.typeOfGoodsSold ?? EM_DASH}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Location and place details from your profile.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs">Primary</p>
              <p>{primaryAddress || EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Formatted address</p>
              <p>{addr?.formatted_address ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Description</p>
              <p>{addr?.description ?? EM_DASH}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-xs">Landmark</p>
              <p>{addr?.landMark ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Country</p>
              <p>{addr?.country ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">State</p>
              <p>{addr?.state ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Direction</p>
              <p>{addr?.direction ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Distance / duration</p>
              <p>
                {addr?.distance != null || addr?.duration != null
                  ? `${addr?.distance ?? EM_DASH} / ${addr?.duration ?? EM_DASH}`
                  : EM_DASH}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Coordinates (lat, lng)</p>
              <p className="font-mono text-xs">
                {formatCoord(addr?.geometry?.location?.lat, addr?.geometry?.location?.lng)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Phone numbers on file.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">International</p>
              <p>{profile.phoneNumber?.internationalFormat ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">National</p>
              <p>{profile.phoneNumber?.nationalFormat ?? EM_DASH}</p>
            </div>
           
            <div>
              <p className="text-muted-foreground text-xs">Country code</p>
              <p>{profile.phoneNumber?.countryCode ?? EM_DASH}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Proprietor</CardTitle>
            <CardDescription>Registered proprietor details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p>{profile.proprietor?.name ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Nationality</p>
              <p>{profile.proprietor?.nationality ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">State</p>
              <p>{profile.proprietor?.state ?? EM_DASH}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs">Residential address</p>
              <p>{profile.proprietor?.residentialAddress ?? EM_DASH}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs">Declaration</p>
              <p className="whitespace-pre-wrap">{profile.proprietor?.declaration ?? EM_DASH}</p>
            </div>
          </CardContent>
        </Card>

        

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Verification documents</CardTitle>
            <CardDescription>KYC assets linked to this vendor profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Path</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.filter(([, d]) => d?.url).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No document URLs on file.
                    </TableCell>
                  </TableRow>
                ) : (
                  docs
                    .filter(([, d]) => !!d?.url)
                    .map(([name, d]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{d?.type ?? EM_DASH}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[220px] truncate text-muted-foreground">
                          {d?.path ?? EM_DASH}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <a href={d?.url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Created at</p>
              <p>{formatDate(profile.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Updated at</p>
              <p>{formatDate(profile.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
