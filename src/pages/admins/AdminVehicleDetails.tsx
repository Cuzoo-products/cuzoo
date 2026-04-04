import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/utilities/Loader";
import { useGetVehicle } from "@/api/admin/vehicle/useVehicle";

type VehicleImage = {
  path?: string;
  url?: string;
  type?: string;
};

type VehicleDetail = {
  color?: string;
  model?: string;
  type?: string;
  plateNumber?: string;
  companyId?: string;
  image?: VehicleImage;
  year?: number;
  assigned?: boolean;
  riderId?: string;
  status?: string;
};

type VehicleDetailResponse = {
  success?: boolean;
  data?: VehicleDetail;
};

export default function AdminVehicleDetails() {
  const { id: routeId } = useParams<{ id: string }>();
  const id =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? decodeURIComponent(routeId)
      : undefined;

  const { data: payload, isLoading, isError } = useGetVehicle(id);

  const vehicle = (payload as VehicleDetailResponse | undefined)?.data;

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Vehicle details</h3>
          <p className="text-sm text-destructive">No vehicle ID in the URL.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (isError || !vehicle) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Vehicle details</h3>
          <p className="text-sm text-destructive">
            Unable to load this vehicle.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/admins/vehicles">Back to vehicles</Link>
          </Button>
        </div>
      </div>
    );
  }

  const imgUrl = vehicle.image?.url?.trim();

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Vehicle details</h3>
          <p className="text-sm text-muted-foreground">
            {vehicle.plateNumber ?? id} · {vehicle.model ?? "—"}
          </p>
        </div>
      </div>

      <div className="bg-secondary mx-auto mb-10 max-w-3xl space-y-6 rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-1 font-semibold">Plate number</h4>
            <p className="font-mono">{vehicle.plateNumber ?? "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Status</h4>
            <p>{vehicle.status ?? "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Model</h4>
            <p>{vehicle.model ?? "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Type</h4>
            <p>{vehicle.type ?? "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Year</h4>
            <p>{vehicle.year != null ? String(vehicle.year) : "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Color</h4>
            <p>{vehicle.color ?? "—"}</p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Company ID</h4>
            <p className="font-mono text-xs break-all">
              {vehicle.companyId ?? "—"}
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Rider ID</h4>
            <p className="font-mono text-xs break-all">
              {vehicle.riderId ?? "—"}
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Assigned</h4>
            <p>
              {vehicle.assigned === true
                ? "Yes"
                : vehicle.assigned === false
                  ? "No"
                  : "—"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="text-sm">
          <h4 className="mb-2 font-semibold">Image</h4>
          {imgUrl ? (
            <a
              href={imgUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <img
                src={imgUrl}
                alt={vehicle.model ?? "Vehicle"}
                className="max-h-56 max-w-full rounded-md border object-contain"
              />
            </a>
          ) : (
            <p className="text-muted-foreground">No image URL.</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" asChild>
            <Link to="/admins/vehicles">Back to vehicles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
