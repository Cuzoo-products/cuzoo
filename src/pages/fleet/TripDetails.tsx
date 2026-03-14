import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  MapPin,
  Truck,
  User,
  AlertTriangle,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useGetFleetTripById } from "@/api/fleet/trips/useTrips";

type TripDetailsResponse = {
  success: boolean;
  statusCode: number;
  data: {
    pickup: {
      customerName: string;
      phoneNumber: string;
      email: string;
      pickupAddress: {
        formatted_address: string;
        description: string;
        landMark: string;
        country: string;
        state: string;
      };
    };
    pickUpTime: {
      pickUpType: string;
    };
    paymentMethod: {
      method: string;
    };
    paid: boolean;
    paidAt: string;
    status: string;
    pickedUp: boolean;
    pickedUpAt: string;
    completed: boolean;
    completedAt: string;
    country: string;
    otp: string;
    userDetails: {
      userId: string;
      email: string;
      fullName: string;
    };
    cardDetails: {
      brand: string;
      last4Digit: string;
      bank: string;
    };
    chats: { message: string }[];
    cancelled: boolean;
    cancelledAt: string;
    cancelledBy: {
      role: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    transportType: string;
    rated: boolean;
    arrived: boolean;
    riderArrivedAt: string;
    riderDetails: {
      email: string;
      fullName: string;
      riderId: string;
      phoneNumber: {
        internationalFormat: string;
      };
      vehicle: {
        color: string;
        model: string;
        type: string;
        plateNumber: string;
      };
      companyName: string;
    };
    orderType: string;
    destinations: {
      recipientName: string;
      phoneNumber: string;
      email: string;
      packageDetails: {
        name: string;
        weight: number;
        weightUnit: string;
      };
      destinationAddress: {
        formatted_address: string;
        description: string;
        landMark: string;
        country: string;
        state: string;
      };
      otpRequestedAt: string;
      arrived: boolean;
      arrivedAt: string;
      delivered: boolean;
      deliveredAt: string;
      id: string;
    }[];
    percentages: {
      cuzooCompanyPercentage: number;
      cuzooPercentage: number;
    };
    amount: {
      serviceCharge: number;
      totalAmount: number;
      totalDistance: number;
      cuzooCommission: number;
    };
    riderAcceptedAt: string;
  };
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
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

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    error,
  } = useGetFleetTripById(id ?? "") as {
    data?: TripDetailsResponse;
    isLoading: boolean;
    error: unknown;
  };

  const trip = data?.data;

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Trip Details</h3>
          <p className="text-red-500">No trip ID provided.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Trip Details</h3>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Trip Details</h3>
          <p className="text-red-500">Unable to load trip details.</p>
        </div>
      </div>
    );
  }

  const primaryDestination = trip.destinations[0];

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Trip Details</h3>
          <p className="text-muted-foreground text-sm">
            Order type: {trip.orderType} • Transport: {trip.transportType}
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {trip.status}
        </Badge>
      </div>

      <div className="bg-secondary rounded-lg p-4 md:p-6 space-y-4">
        {/* Top layout: summary + payment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trip Summary */}
          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base md:text-lg">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {trip.pickup.pickupAddress.formatted_address ||
                    trip.pickup.pickupAddress.description ||
                    "Pickup"}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {primaryDestination?.destinationAddress.formatted_address ||
                    primaryDestination?.destinationAddress.description ||
                    "Destination"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                <CalendarClock className="w-4 h-4 shrink-0" />
                <span>
                  Pickup time:{" "}
                  <strong>{trip.pickUpTime.pickUpType}</strong> •{" "}
                  {formatDateTime(trip.pickedUpAt)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Status</p>
                  <p>
                    {trip.completed
                      ? "Completed"
                      : trip.cancelled
                      ? "Cancelled"
                      : trip.status}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Paid</p>
                  <p>
                    {trip.paid ? "Yes" : "No"}{" "}
                    {trip.paidAt && `• ${formatDateTime(trip.paidAt)}`}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Country</p>
                  <p>{trip.country || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment summary */}
          <Card className="border border-line-1 bg-background rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Method</span>
                <span className="font-medium text-foreground">
                  {trip.paymentMethod.method}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Amount</span>
                <span className="font-semibold text-foreground">
                  ₦{trip.amount.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span>Service Charge</span>
                <span>
                  ₦{trip.amount.serviceCharge.toLocaleString()} • Cuzoo{" "}
                  {trip.percentages.cuzooPercentage}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle layout: customer, rider, user */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <User className="w-4 h-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Name:</span>{" "}
                {trip.pickup.customerName}
              </p>
              <p>
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                {trip.pickup.phoneNumber}
              </p>
              <p className="truncate">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                {trip.pickup.email}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-foreground">
                  Pickup Address:
                </span>{" "}
                {trip.pickup.pickupAddress.formatted_address ||
                  trip.pickup.pickupAddress.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Truck className="w-4 h-4" />
                Rider & Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Rider:</span>{" "}
                {trip.riderDetails.fullName}
              </p>
              <p>
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                {trip.riderDetails.phoneNumber.internationalFormat}
              </p>
              <p>
                <span className="font-semibold text-foreground">Vehicle:</span>{" "}
                {trip.riderDetails.vehicle.model} •{" "}
                {trip.riderDetails.vehicle.color}
              </p>
              <p>
                <span className="font-semibold text-foreground">Plate:</span>{" "}
                {trip.riderDetails.vehicle.plateNumber}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-foreground">Company:</span>{" "}
                {trip.riderDetails.companyName}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">
                User Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Name:</span>{" "}
                {trip.userDetails.fullName}
              </p>
              <p>
                <span className="font-semibold text-foreground">Email:</span>{" "}
                {trip.userDetails.email}
              </p>
              <p>
                <span className="font-semibold text-foreground">User ID:</span>{" "}
                {trip.userDetails.userId}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Destinations & timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">
                Destinations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {trip.destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="border border-dashed border-line-1 rounded-md p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
                >
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-foreground">
                        Recipient:
                      </span>{" "}
                      {dest.recipientName}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        Package:
                      </span>{" "}
                      {dest.packageDetails.name} • {dest.packageDetails.weight}
                      {dest.packageDetails.weightUnit}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        Address:
                      </span>{" "}
                      {dest.destinationAddress.formatted_address ||
                        dest.destinationAddress.description}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm text-right space-y-1 min-w-[140px]">
                    <p>
                      <span className="font-semibold text-foreground">
                        Arrived:
                      </span>{" "}
                      {dest.arrived ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        Delivered:
                      </span>{" "}
                      {dest.delivered ? "Yes" : "No"}
                    </p>
                    <p>{formatDateTime(dest.deliveredAt)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">
                Trip Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Rider Accepted:
                </span>{" "}
                {formatDateTime(trip.riderAcceptedAt)}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Rider Arrived:
                </span>{" "}
                {formatDateTime(trip.riderArrivedAt)}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Picked Up:
                </span>{" "}
                {formatDateTime(trip.pickedUpAt)}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Completed:
                </span>{" "}
                {formatDateTime(trip.completedAt)}
              </p>
              {trip.cancelled && (
                <p className="text-destructive">
                  <span className="font-semibold text-foreground">
                    Cancelled:
                  </span>{" "}
                  {formatDateTime(trip.cancelledAt)} by{" "}
                  {trip.cancelledBy.firstName} {trip.cancelledBy.lastName} (
                  {trip.cancelledBy.role})
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chats & actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <Card className="border border-line-1 bg-background rounded-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <AlertTriangle className="w-4 h-4" />
                Notes & Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {trip.chats.length === 0 && <p>No messages for this trip yet.</p>}
              {trip.chats.map((chat, index) => (
                <div
                  key={index}
                  className="border border-line-1 rounded-md p-2 bg-muted/40"
                >
                  {chat.message}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 lg:items-end">
            <Link
              className="text-primary flex justify-center items-center border rounded-md px-4 py-2 hover:text-accent bg-background text-sm md:text-base"
              to="/fleet/maps"
            >
              Track Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
