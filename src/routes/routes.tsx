import { createBrowserRouter } from "react-router";
import App from "@/App";
import NotFoundPage from "@/pages/shared/NotFoundPage";
import VerifyEmail from "@/pages/shared/VerifyEmail";
import ForgotPassword from "@/pages/shared/ForgotPassword";
import KycSubmitted from "@/pages/shared/KycSubmitted";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
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
import OrderDetailsPage from "@/pages/vendors/OrderDetails";
import InvoicePage from "@/pages/vendors/InvoicePage";
import VendorFinance from "@/pages/vendors/VendorFinance";
import FleetFinance from "@/pages/fleet/FleetFinance";
import Banks from "@/pages/fleet/Banks";
import AdminLayout from "@/pages/admins/AdminLayout";
import FleetOwners from "@/pages/admins/FleetOwners";
import FleetOwnersProfile from "@/pages/admins/FleetOwnersProfile";
import Admins from "@/pages/admins/Admins";
import AdminDetails from "@/pages/admins/AdminDetails";
import Users from "@/pages/admins/Users";
import UserDetails from "@/pages/admins/UserDetails";
import AdminUserOrdersByUser from "@/pages/admins/AdminUserOrdersByUser";
import AdminUserRidesByUser from "@/pages/admins/AdminUserRidesByUser";
import DriversInAdmin from "@/pages/admins/Drivers";
import Map from "@/pages/admins/Map";
import AdminDriverDetails from "@/pages/admins/AdminDriverDetails";
import AdminTrips from "@/pages/admins/AdminTrips";
import AdminTripDetails from "@/pages/admins/AdminTripDetails";
import AddAdmin from "@/pages/admins/AddAdmin";
import AdminVendor from "@/pages/admins/AdminVendors";
import VendorsDetails from "@/pages/admins/VendorsDetails";
import Settings from "@/pages/admins/Settings";
import AdminDashboard from "@/pages/admins/AdminDashboard";
import AdminFinance from "@/pages/admins/AdminFinance";
import IndivdualDriverTrips from "@/pages/admins/IndivdualDriverTrips";
import IndividualDriverTipDetails from "@/pages/admins/IndividualDriverTipDetails";
import AdminRidersPayouts from "@/pages/admins/AdminRidersPayouts";
import AdminVendorsPayouts from "@/pages/admins/AdminVendorsPayouts";
import AdminFleetsPayouts from "@/pages/admins/AdminFleetsPayouts";
import AdminPayoutDetails from "@/pages/admins/AdminPayoutDetails";
import AdminOrders from "@/pages/admins/AdminOrders";
import AdminOrderDetails from "@/pages/admins/AdminOrderDetails";
import AdminVendorOrdersByVendor from "@/pages/admins/AdminVendorOrdersByVendor";
import AdminFleetRidersByFleet from "@/pages/admins/AdminFleetRidersByFleet";
import AdminFleetVehiclesByFleet from "@/pages/admins/AdminFleetVehiclesByFleet";
import AdminFleetRidesByFleet from "@/pages/admins/AdminFleetRidesByFleet";
import AdminResetPassword from "@/pages/admins/ResetPassword";
import { FleetKyc } from "@/pages/fleet/FleetKyc";
import { VendorKycForm } from "@/pages/vendors/VendorKyc";
import VendorBanks from "@/pages/vendors/Banks";
import Coupons from "@/pages/vendors/Coupons";
import VendorPayouts from "@/pages/vendors/Payouts";
import VendorPayoutDetails from "@/pages/vendors/PayoutDetails";
import VendorProfile from "@/pages/vendors/Profile";
import VendorResetPassword from "@/pages/vendors/ResetPassword";
import FleetPayouts from "@/pages/fleet/Payouts";
import FleetPayoutDetails from "@/pages/fleet/PayoutDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/kyc-submitted",
    element: <KycSubmitted />,
  },
  {
    path: "/fleet-registration",
    element: <FleetRegistration />,
  },
  {
    path: "/fleetkyc",
    element: (
      <ProtectedRoute allowedUserTypes={["fleet"]}>
        <FleetKyc />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vendorkyc",
    element: (
      <ProtectedRoute allowedUserTypes={["vendor"]}>
        <VendorKycForm />
      </ProtectedRoute>
    ),
  },

  {
    path: "/vendor-registration",
    element: <VendorRegistration />,
  },
  {
    path: "/fleet",
    element: (
      <ProtectedRoute allowedUserTypes={["fleet"]}>
        <FleetLayout />
      </ProtectedRoute>
    ),
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
      {
        path: "banks",
        element: <Banks />,
      },
      {
        path: "payouts",
        element: <FleetPayouts />,
      },
      {
        path: "payouts/:id",
        element: <FleetPayoutDetails />,
      },
    ],
  },
  {
    path: "/vendor",
    element: (
      <ProtectedRoute allowedUserTypes={["vendor"]}>
        <VendorLayout />
      </ProtectedRoute>
    ),
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
        element: <OrderDetailsPage />,
      },
      {
        path: "orders/:id/invoice",
        element: <InvoicePage />,
      },
      {
        path: "finance",
        element: <VendorFinance />,
      },
      {
        path: "banks",
        element: <VendorBanks />,
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "payouts",
        element: <VendorPayouts />,
      },
      {
        path: "payouts/:id",
        element: <VendorPayoutDetails />,
      },
      {
        path: "profile",
        element: <VendorProfile />,
      },
      {
        path: "reset-password",
        element: <VendorResetPassword />,
      },
    ],
  },
  {
    path: "/admins",
    element: (
      <ProtectedRoute allowedUserTypes={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "fleet_managers",
        element: <FleetOwners />,
      },
      {
        path: "fleet_managers/:id",
        element: <FleetOwnersProfile />,
      },
      {
        path: "fleet_managers/:id/riders",
        element: <AdminFleetRidersByFleet />,
      },
      {
        path: "fleet_managers/:id/vehicles",
        element: <AdminFleetVehiclesByFleet />,
      },
      {
        path: "fleet_managers/:id/rides",
        element: <AdminFleetRidesByFleet />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
      {
        path: "admins/:id",
        element: <AdminDetails />,
      },
      {
        path: "users/",
        element: <Users />,
      },
      {
        path: "users/:id",
        element: <UserDetails />,
      },
      {
        path: "users/:id/orders",
        element: <AdminUserOrdersByUser />,
      },
      {
        path: "users/:id/rides",
        element: <AdminUserRidesByUser />,
      },
      {
        path: "drivers",
        element: <DriversInAdmin />,
      },
      {
        path: "drivers",
        element: <DriversInAdmin />,
      },
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "drivers/:id",
        element: <AdminDriverDetails />,
      },
      {
        path: "trips",
        element: <AdminTrips />,
      },
      {
        path: "trips/:id",
        element: <AdminTripDetails />,
      },
      {
        path: "add_admin",
        element: <AddAdmin />,
      },
      {
        path: "vendors",
        element: <AdminVendor />,
      },
      {
        path: "vendors/:id",
        element: <VendorsDetails />,
      },
      {
        path: "vendors/:id/orders",
        element: <AdminVendorOrdersByVendor />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:id",
        element: <AdminOrderDetails />,
      },
      {
        path: "financials",
        element: <AdminFinance />,
      },
      {
        path: "payouts/riders",
        element: <AdminRidersPayouts />,
      },
      {
        path: "payouts/vendors",
        element: <AdminVendorsPayouts />,
      },
      {
        path: "payouts/fleets",
        element: <AdminFleetsPayouts />,
      },
      {
        path: "payouts/:type/:id",
        element: <AdminPayoutDetails />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "reset-password",
        element: <AdminResetPassword />,
      },
      {
        path: "drivers/:id/trips",
        element: <IndivdualDriverTrips />,
      },
      {
        path: "drivers/:id/trips/:id",
        element: <IndividualDriverTipDetails />,
      },
    ],
  },
]);

