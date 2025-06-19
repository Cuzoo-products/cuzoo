import { createBrowserRouter } from "react-router";
import App from "@/App";
import Registration from "@/pages/shared/Registration";
import NotFoundPage from "@/pages/shared/NotFoundPage";
import Layout from "@/pages/fleet/Layout";
import Dashboard from "@/pages/fleet/Dashboard";
import Maps from "@/pages/fleet/Maps";
import Drivers from "@/pages/fleet/Drivers";
import DriverDetails from "@/pages/fleet/DriverDetails";
import AddDriver from "@/pages/fleet/AddDriver";
import AddVehicles from "@/pages/fleet/AddVehicles";
import Fleets from "@/pages/fleet/Fleets";
import EditDriver from "@/pages/fleet/EditDriver";
import VehicleDetails from "@/pages/fleet/VehicleDetails";
import EditVehicle from "@/pages/fleet/EditVehicle";
import Trips from "@/pages/fleet/Trips";
import TripDetails from "@/pages/fleet/TripDetails";
import Profile from "@/pages/fleet/Profile";
import ResetPassword from "@/pages/fleet/ResetPassword";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/leet-registrationf",
    element: <Registration />,
  },
  {
    path: "/fleet",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "maps",
        element: <Maps />,
      },
      {
        path: "drivers",
        element: <Drivers />,
      },
      {
        path: "drivers/:id",
        element: <DriverDetails />,
      },
      {
        path: "add_driver",
        element: <AddDriver />,
      },
      {
        path: "add_vehicle",
        element: <AddVehicles />,
      },
      {
        path: "fleets",
        element: <Fleets />,
      },
      {
        path: "drivers/:id/edit",
        element: <EditDriver />,
      },
      {
        path: "fleets/:id",
        element: <VehicleDetails />,
      },
      {
        path: "fleets/:id/edit",
        element: <EditVehicle />,
      },
      {
        path: "trips",
        element: <Trips />,
      },
      {
        path: "trips/:id",
        element: <TripDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);
