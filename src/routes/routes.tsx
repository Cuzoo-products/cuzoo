import { createBrowserRouter } from "react-router";
import App from "@/App";
import NotFoundPage from "@/pages/shared/NotFoundPage";
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
import FleetDashboard from "@/pages/fleet/FleetDashboard";
import VendorDashboard from "@/pages/vendors/VendorDashboard";
import FleetLayout from "@/pages/fleet/FleetLayout";
import VendorLayout from "@/pages/vendors/VendorLayout";
import VendorRegistration from "@/pages/vendors/Registration";
import FleetRegistration from "@/pages/fleet/FleetRegistration";
import Categories from "@/pages/vendors/Categories";
import EditCategory from "@/pages/vendors/EditCategory";
import AddCategory from "@/pages/vendors/AddCategory";
import AddProduct from "@/pages/vendors/AddProduct";
import Products from "@/pages/vendors/Products";
import EditProduct from "@/pages/vendors/EditProduct";
import Orders from "@/pages/vendors/Orders";
import InvoicePage from "@/pages/vendors/InvoicePage";
import VendorFinance from "@/pages/vendors/VendorFinance";
import FleetFinance from "@/pages/fleet/FleetFinance";
import AdminLayout from "@/pages/admins/AdminLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/fleet-registration",
    element: <FleetRegistration />,
  },
  {
    path: "/vendor-registration",
    element: <VendorRegistration />,
  },
  {
    path: "/fleet",
    element: <FleetLayout />,
    children: [
      {
        index: true,
        element: <FleetDashboard />,
      },
      {
        path: "dashboard",
        element: <FleetDashboard />,
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
      {
        path: "finance",
        element: <FleetFinance />,
      },
    ],
  },
  {
    path: "/vendor",
    element: <VendorLayout />,
    children: [
      {
        index: true,
        element: <VendorDashboard />,
      },
      {
        path: "dashboard",
        element: <VendorDashboard />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/:id",
        element: <EditCategory />,
      },
      {
        path: "add_category",
        element: <AddCategory />,
      },
      {
        path: "add_product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <EditProduct />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/:id",
        element: <InvoicePage />,
      },
      {
        path: "finance",
        element: <VendorFinance />,
      },
    ],
  },
  {
    path: "/admins",
    element: <AdminLayout />,
    children: [],
  },
]);
