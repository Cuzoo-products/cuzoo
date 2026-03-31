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
import { useGetFleetProfile } from "@/api/fleet/profile/useProfile";
import { useSendVerificationMail } from "@/api/shared/useAuth";

type PhoneNumberPayload = {
  internationalFormat?: string;
  nationalFormat?: string;
  number?: string;
  countryCode?: string;
  countryCallingCode?: string;
};

type Asset = {
  path?: string;
  url?: string;
  type?: string;
};

/** Firestore Timestamp serialized in JSON (e.g. from API). */
type FirestoreTimestampLike = {
  _seconds?: number;
  _nanoseconds?: number;
  seconds?: number;
  nanoseconds?: number;
};

type FleetProfilePayload = {
  Id?: string;
  id?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: PhoneNumberPayload;
  address?: string;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  tinNumber?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string | FirestoreTimestampLike;
  placeOfIncorporation?: string;
  companyType?: string;
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
  directors?: string[];
  servicesRendered?: string[];
  insuranceCoverage?: string[];
  passport?: Asset;
  certificateOfIncorporation?: Asset;
  governmentApprovedId?: Asset;
  proofOfAddress?: Asset;
  insuranceCertificate?: Asset;
  courierLicense?: Asset;
  createdAt?: string | FirestoreTimestampLike;
  updatedAt?: string | FirestoreTimestampLike;
};

type FleetProfileResponse = {
  success: boolean;
  statusCode: number;
  data: FleetProfilePayload;
};

const EM_DASH = "�";

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

/** Formats ISO strings or Firestore-style `{ _seconds, _nanoseconds }` timestamps. */
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

function fullName(p?: FleetProfilePayload): string {
  return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim() || EM_DASH;
}

function ArrayPills({ values }: { values?: string[] }) {
  if (!values || values.length === 0) {
    return <p className="text-sm text-muted-foreground">{EM_DASH}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v, i) => (
        <Badge key={`${v}-${i}`} variant="secondary">
          {v}
        </Badge>
      ))}
    </div>
  );
}

export default function Profile() {
  const { data, isLoading, error } = useGetFleetProfile() as {
    data?: FleetProfileResponse;
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
    sendVerificationEmail({ email, accountType: "fleet" });
  };

  const docs: Array<[string, Asset | undefined]> = [
    ["Passport", profile.passport],
    ["Certificate of Incorporation", profile.certificateOfIncorporation],
    ["Government Approved ID", profile.governmentApprovedId],
    ["Proof of Address", profile.proofOfAddress],
    ["Insurance Certificate", profile.insuranceCertificate],
    ["Courier License", profile.courierLicense],
  ];

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Profile</h3>
        <p className="text-muted-foreground">Fleet profile information</p>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Core account and verification details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            
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
           
            <div className="">
              <Badge variant={profile.emailVerified ? "default" : "secondary"}>
                {profile.emailVerified ? "Email verified" : "Email not verified"}
              </Badge>
              {
                profile.emailVerified ? null : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendEmail}
                    disabled={!profile.email?.trim() || isSendingVerification}
                  >
                    {isSendingVerification ? "Sending�" : "Verify email"}
                  </Button>
                )
              }
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
             
              {profile.suspended ? <Badge variant="destructive">Suspended</Badge> : null}
             
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Company and Contact</CardTitle>
            <CardDescription>Registration and phone information.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Registration number</p>
              <p>{profile.registrationNumber ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">TIN number</p>
              <p>{profile.tinNumber ?? EM_DASH}</p>
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
              <p className="text-muted-foreground text-xs">Company type</p>
              <p>{profile.companyType ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Phone (international)</p>
              <p>{profile.phoneNumber?.internationalFormat ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Phone (national)</p>
              <p>{profile.phoneNumber?.nationalFormat ?? EM_DASH}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Phone number</p>
              <p>{profile.phoneNumber?.number ?? EM_DASH}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>Directors, services and insurance coverage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-2">Directors</p>
              <ArrayPills values={profile.directors} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-2">Services rendered</p>
              <ArrayPills values={profile.servicesRendered} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-2">Insurance coverage</p>
              <ArrayPills values={profile.insuranceCoverage} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary py-4">
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>KYC assets linked to this fleet profile.</CardDescription>
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
                        <TableCell className="hidden md:table-cell max-w-[220px] truncate text-muted-foreground">{d?.path ?? EM_DASH}</TableCell>
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

        <Card className="bg-secondary">
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
