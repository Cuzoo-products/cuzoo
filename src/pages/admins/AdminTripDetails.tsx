import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { DetailShell, GridItem, Section } from "@/components/admin/DetailShell";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/utilities/Loader";
import { useGetOrderForAdmin } from "@/api/admin/orders/useOrders";
import { useParams } from "react-router";

type PhoneNumber = {
  internationalFormat?: string;
  number?: string;
};

type Address = {
  formatted_address?: string;
  description?: string;
  landMark?: string;
  country?: string;
  state?: string;
};

type TripDetailsResponse = {
  data?: {
    id?: string;
    status?: string;
    orderType?: string;
    transportType?: string;
    country?: string;
    createdAt?: string;
    otp?: string;
    paid?: boolean;
    paidAt?: string;
    pickedUp?: boolean;
    pickedUpAt?: string;
    arrived?: boolean;
    riderArrivedAt?: string;
    riderAcceptedAt?: string;
    completed?: boolean;
    completedAt?: string;
    cancelled?: boolean;
    cancelledAt?: string;
    cancelledBy?: {
      role?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    pickUpTime?: { pickUpType?: string };
    paymentMethod?: { method?: string } | string;
    pickup?: {
      customerName?: string;
      phoneNumber?: string;
      email?: string;
      pickupAddress?: Address;
    };
    userDetails?: {
      userId?: string;
      email?: string;
      fullName?: string;
      phoneNumber?: PhoneNumber;
    };
    riderDetails?: {
      email?: string;
      fullName?: string;
      riderId?: string;
      phoneNumber?: PhoneNumber;
      companyName?: string;
      vehicle?: {
        color?: string;
        model?: string;
        type?: string;
        plateNumber?: string;
      };
    };
    destinations?: Array<{
      id?: string;
      recipientName?: string;
      phoneNumber?: string;
      email?: string;
      packageDetails?: {
        name?: string;
        weight?: number;
        weightUnit?: string;
      };
      destinationAddress?: Address;
      arrived?: boolean;
      arrivedAt?: string;
      delivered?: boolean;
      deliveredAt?: string;
    }>;
    amount?: {
      serviceCharge?: number;
      totalAmount?: number;
      totalDistance?: number;
      cuzooCommission?: number;
    };
    percentages?: {
      cuzooCompanyPercentage?: number;
      cuzooPercentage?: number;
    };
    chats?: Array<{ message?: string }>;
  };
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const formatNaira = (value?: number) =>
  `₦${(value ?? 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

const formatPhone = (phone?: string | PhoneNumber) => {
  if (!phone) return "—";
  if (typeof phone === "string") return phone || "—";
  return phone.internationalFormat || phone.number || "—";
};

const formatAddress = (address?: Address) =>
  address?.formatted_address || address?.description || "—";

export default function AdminTripDetails() {
  const { id: routeId } = useParams<{ id: string }>();
  const id =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const { data: payload, isLoading, error } = useGetOrderForAdmin(id);

  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Trips", href: "/admins/trips" },
    { label: id ?? "Trip" },
  ];

  if (!id) {
    return (
      <DetailShell
        backHref="/admins/trips"
        backLabel="Trips"
        crumbs={[...crumbs.slice(0, 2), { label: "Error" }]}
      >
        <PageHeader title="Trip Details" subtitle="No trip ID provided." />
      </DetailShell>
    );
  }

  if (isLoading) return <Loader />;

  const trip = (payload as TripDetailsResponse | undefined)?.data;

  if (error || !trip) {
    return (
      <DetailShell
        backHref="/admins/trips"
        backLabel="Trips"
        crumbs={[...crumbs.slice(0, 2), { label: "Error" }]}
      >
        <PageHeader
          title="Trip Details"
          subtitle="Unable to load trip details."
        />
      </DetailShell>
    );
  }

  const paymentLabel =
    typeof trip.paymentMethod === "object" && trip.paymentMethod
      ? trip.paymentMethod.method
      : typeof trip.paymentMethod === "string"
        ? trip.paymentMethod
        : "—";

  const statusLabel = trip.completed
    ? "Completed"
    : trip.cancelled
      ? "Cancelled"
      : (trip.status ?? "—");

  const destinations = trip.destinations ?? [];
  const chats = trip.chats ?? [];
  const pickupLabel = formatAddress(trip.pickup?.pickupAddress);
  const firstDest = destinations[0];
  const dropoffLabel = formatAddress(firstDest?.destinationAddress);

  return (
    <DetailShell backHref="/admins/trips" backLabel="Trips" crumbs={crumbs}>
      <PageHeader
        title="Trip Details"
        subtitle={`${trip.orderType ?? "Package"} · ${trip.transportType ?? "Delivery"}`}
        actions={<StatusBadge status={statusLabel} />}
      />

      <div className="mx-auto max-w-5xl space-y-4">
        <Section title="Overview">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GridItem label="Trip ID" value={id} />
            <GridItem label="Created" value={formatDate(trip.createdAt)} />
            <GridItem
              label="Amount"
              value={formatNaira(trip.amount?.totalAmount)}
            />
            <GridItem
              label="Payment"
              value={`${paymentLabel} · ${trip.paid ? "Paid" : "Unpaid"}`}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-4">
              <p className="mb-1 text-[12px] uppercase tracking-wide text-[var(--admin-text-muted)]">
                Pickup
              </p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                {pickupLabel}
              </p>
              {(trip.pickup?.pickupAddress?.state ||
                trip.pickup?.pickupAddress?.country) && (
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                  {[
                    trip.pickup?.pickupAddress?.state,
                    trip.pickup?.pickupAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-4">
              <p className="mb-1 text-[12px] uppercase tracking-wide text-[var(--admin-text-muted)]">
                Primary destination
              </p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                {dropoffLabel}
              </p>
              {(firstDest?.destinationAddress?.state ||
                firstDest?.destinationAddress?.country) && (
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                  {[
                    firstDest?.destinationAddress?.state,
                    firstDest?.destinationAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </Section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Section title="Customer">
            <div className="space-y-2 text-sm">
              <GridItem
                label="Name"
                value={
                  trip.userDetails?.fullName ||
                  trip.pickup?.customerName ||
                  "—"
                }
              />
              <GridItem
                label="Email"
                value={trip.userDetails?.email || trip.pickup?.email || "—"}
              />
              <GridItem
                label="Phone"
                value={
                  formatPhone(trip.userDetails?.phoneNumber) !== "—"
                    ? formatPhone(trip.userDetails?.phoneNumber)
                    : trip.pickup?.phoneNumber || "—"
                }
              />
            </div>
          </Section>

          <Section title="Rider">
            <div className="space-y-2 text-sm">
              <GridItem
                label="Name"
                value={trip.riderDetails?.fullName || "—"}
              />
              <GridItem
                label="Phone"
                value={formatPhone(trip.riderDetails?.phoneNumber)}
              />
              <GridItem
                label="Company"
                value={trip.riderDetails?.companyName || "—"}
              />
            </div>
          </Section>

          <Section title="Vehicle">
            <div className="space-y-2 text-sm">
              <GridItem
                label="Model"
                value={
                  [
                    trip.riderDetails?.vehicle?.model,
                    trip.riderDetails?.vehicle?.color,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"
                }
              />
              <GridItem
                label="Plate"
                value={trip.riderDetails?.vehicle?.plateNumber || "—"}
              />
              <GridItem
                label="Type"
                value={trip.riderDetails?.vehicle?.type || "—"}
              />
            </div>
          </Section>
        </div>

        <Section
          title="Destinations"
          subtitle={
            destinations.length
              ? `${destinations.length} stop${destinations.length === 1 ? "" : "s"}`
              : undefined
          }
        >
          {destinations.length === 0 ? (
            <p className="text-sm text-[var(--admin-text-muted)]">
              No destinations on this trip.
            </p>
          ) : (
            <div className="space-y-3">
              {destinations.map((dest, index) => (
                <div
                  key={dest.id ?? `${dest.recipientName}-${index}`}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--admin-text-primary)]">
                      Stop {index + 1}
                      {dest.recipientName ? ` · ${dest.recipientName}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        status={dest.arrived ? "Arrived" : "Not arrived"}
                      />
                      <StatusBadge
                        status={dest.delivered ? "Delivered" : "Pending"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <GridItem
                      label="Package"
                      value={
                        dest.packageDetails?.name
                          ? `${dest.packageDetails.name}${
                              dest.packageDetails.weight != null
                                ? ` · ${dest.packageDetails.weight}${dest.packageDetails.weightUnit ?? ""}`
                                : ""
                            }`
                          : "—"
                      }
                    />
                    <GridItem
                      label="Phone"
                      value={dest.phoneNumber || "—"}
                    />
                    <GridItem
                      label="Delivered at"
                      value={formatDate(dest.deliveredAt)}
                    />
                  </div>
                  <p className="mt-3 text-sm text-[var(--admin-text-primary)]">
                    {formatAddress(dest.destinationAddress)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Section title="Payment">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <GridItem label="Method" value={paymentLabel} />
              <GridItem
                label="Paid at"
                value={formatDate(trip.paidAt)}
              />
              <GridItem
                label="Service charge"
                value={formatNaira(trip.amount?.serviceCharge)}
              />
              <GridItem
                label="Commission"
                value={formatNaira(trip.amount?.cuzooCommission)}
              />
              {trip.amount?.totalDistance != null && (
                <GridItem
                  label="Distance"
                  value={`${trip.amount.totalDistance} km`}
                />
              )}
              {trip.percentages?.cuzooPercentage != null && (
                <GridItem
                  label="Cuzoo %"
                  value={`${trip.percentages.cuzooPercentage}%`}
                />
              )}
            </div>
          </Section>

          <Section title="Timeline">
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[var(--admin-text-muted)]">
                  Pickup type:{" "}
                </span>
                {trip.pickUpTime?.pickUpType || "—"}
              </p>
              <p>
                <span className="text-[var(--admin-text-muted)]">
                  Rider accepted:{" "}
                </span>
                {formatDate(trip.riderAcceptedAt)}
              </p>
              <p>
                <span className="text-[var(--admin-text-muted)]">
                  Rider arrived:{" "}
                </span>
                {formatDate(trip.riderArrivedAt)}
              </p>
              <p>
                <span className="text-[var(--admin-text-muted)]">
                  Picked up:{" "}
                </span>
                {formatDate(trip.pickedUpAt)}
              </p>
              <p>
                <span className="text-[var(--admin-text-muted)]">
                  Completed:{" "}
                </span>
                {formatDate(trip.completedAt)}
              </p>
              {trip.cancelled && (
                <p className="text-[var(--admin-danger,#ef4444)]">
                  Cancelled {formatDate(trip.cancelledAt)}
                  {trip.cancelledBy
                    ? ` by ${[trip.cancelledBy.firstName, trip.cancelledBy.lastName]
                        .filter(Boolean)
                        .join(" ")} (${trip.cancelledBy.role ?? "—"})`
                    : ""}
                </p>
              )}
            </div>
          </Section>
        </div>

        {chats.length > 0 && (
          <Section title="Notes & Messages">
            <div className="space-y-2">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-3 text-sm text-[var(--admin-text-primary)]"
                >
                  {chat.message || "—"}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </DetailShell>
  );
}
