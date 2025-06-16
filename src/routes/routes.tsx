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

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/fleet-registration",
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
    ],
  },
]);
