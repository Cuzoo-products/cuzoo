import { useGetRider } from "@/api/fleet/rider/useRiderQuery";
import { DriverInfo } from "@/components/utilities/Fleet/DriverInfo";
import { useParams } from "react-router";

const vehicles = [
  { label: "Toyota (EKY 321 XV)", value: "1" },
  { label: "Nissan (SKU 241 Xy)", value: "2" },
  { label: "Toyota (IKJ 121 UV)", value: "3" },
  { label: "Nissan (JJJ 221 XY)", value: "4" },
];

function DriverDetails() {
  const { id } = useParams();
  const { data: rider, isLoading, error } = useGetRider(id as string);

  // Debug logging to understand the response structure
  console.log("Rider response:", rider);
  console.log("Rider data:", rider?.data);
  console.log("Rider data[0]:", rider?.data?.[0]);

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4D37B3]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl text-red-600">
            Error Loading Driver
          </h3>
          <p>Unable to load driver details: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl text-red-600">No Data Received</h3>
          <p>No driver data was received from the server</p>
        </div>
      </div>
    );
  }

  // Handle different possible response structures
  let driverData;
  if (Array.isArray(rider.data)) {
    driverData = rider.data[0];
  } else if (rider.data && typeof rider.data === "object") {
    // If data is not an array, it might be the driver object directly
    driverData = rider.data;
  } else {
    // If data is the driver object directly
    driverData = rider;
  }

  // Additional safety check for driverData
  if (!driverData) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl text-red-600">
            Driver Data Not Available
          </h3>
          <p>Driver information could not be loaded</p>
        </div>
      </div>
    );
  }

  const driverName =
    `${driverData.firstName || ""} ${driverData.lastName || ""}`.trim() ||
    "Unknown Driver";

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">{driverName}</h3>
        <p>Manage {driverName}'s bio & details</p>
      </div>
      <DriverInfo driver={driverData} availableVehicle={vehicles} />
    </div>
  );
}

export default DriverDetails;
