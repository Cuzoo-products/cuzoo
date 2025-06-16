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

function DriverDetails() {
  //   const { id } = useParams();

  return <DriverInfo driver={mockDriver} />;
}

export default DriverDetails;
