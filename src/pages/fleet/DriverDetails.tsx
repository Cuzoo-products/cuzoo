import {
  DriverInfo,
  type Driver,
} from "@/components/utilities/Fleet/DriverInfo";
// import { useParams } from "react-router";

const mockDriver: Driver = {
  id: "d123",
  name: "John Doe",
  phone: "+2348000000000",
  email: "john@fleet.com",
  status: "unassigned",
  tripHistory: [
    {
      id: "t1",
      date: "2025-06-01",
      origin: "Lagos",
      destination: "Ibadan",
      amount: "40000",
      status: "completed",
    },
    {
      id: "t2",
      date: "2025-05-25",
      origin: "Abuja",
      destination: "Kano",
      amount: "35000",
      status: "ongoing",
    },
  ],
};

const vehicles = [
  { label: "Toyota (EKY 321 XV)", value: "1" },
  { label: "Nissan (SKU 241 Xy)", value: "2" },
  { label: "Toyota (IKJ 121 UV)", value: "3" },
  { label: "Nissan (JJJ 221 XY)", value: "4" },
];

function DriverDetails() {
  //   const { id } = useParams();

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">John Doe</h3>
        <p>Manage John Doe bio & details</p>
      </div>
      <DriverInfo driver={mockDriver} availableVehicle={vehicles} />
    </div>
  );
}

export default DriverDetails;
