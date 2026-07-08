import { useState } from "react";
import { useGetVendorProfile } from "@/api/vendor/auth/useAuth";
import { useGetDashboard } from "@/api/vendor/dashboard/useDashBoard";
import AdminActionItems from "@/components/admin/AdminActionItems";
import HighestSellingProducts from "@/components/utilities/Vendors/HighestSellingProducts";
import VendorChart from "@/components/utilities/Vendors/VendorChart";
import VendorSectionCard from "@/components/utilities/Vendors/VendorSectionCard";
import Loader from "@/components/utilities/Loader";
import { useVendorActionItems } from "@/hooks/useVendorActionItems";

export type HighestSellingProductsT = {
  id: number;
  productName: string;
  sales: string;
  imageUrl: string;
};

export type DashboardResponse = {
  success: boolean;
  statusCode: number;
  data: {
    finance: number;
    products: number;
    overallSales: number;
    salesThisMonth: number;
    highestSellingProducts: {
      Id: string;
      vendorId: string;
      name: string;
      image?: { path: string; url: string; type: string };
      price: number;
      stock: number;
      sales: number;
      categoryId: string;
      shortDescription: string;
      longDescription: string;
      image1?: { path: string; url: string; type: string };
      image2?: { path: string; url: string; type: string };
      image3?: { path: string; url: string; type: string };
      image4?: { path: string; url: string; type: string };
      createdAt: string;
      updatedAt: string;
    }[];
    revenueSalesGraph: { month: string; revenue: number; sales: number }[];
  };
};

const TIME_FILTERS = ["7D", "30D", "3M", "1Y"] as const;

function VendorDashboard() {
  const [timeFilter, setTimeFilter] =
    useState<(typeof TIME_FILTERS)[number]>("30D");

  const { data, isLoading, error } = useGetDashboard() as {
    data?: DashboardResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { data: vendorProfile } = useGetVendorProfile();
  const actionItems = useVendorActionItems();

  const dashboard = data?.data;
  const chartData = dashboard?.revenueSalesGraph ?? [];
  const highestSellingProducts: HighestSellingProductsT[] =
    dashboard?.highestSellingProducts?.map((p, i) => ({
      id: i + 1,
      productName: p.name,
      sales: String(p.sales),
      imageUrl: p.image1?.url ?? p.image?.url ?? "",
    })) ?? [];

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="vendor-dashboard-header">
          <div>
            <h1 className="vendor-dashboard-header__title">Dashboard</h1>
            <p className="vendor-dashboard-header__subtitle">
              Failed to load dashboard data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="vendor-dashboard-header">
        <div>
          <h1 className="vendor-dashboard-header__title">Dashboard</h1>
          <p className="vendor-dashboard-header__subtitle">
            Hello, welcome back
          </p>
        </div>
        <p className="vendor-dashboard-store-code">
          Store Code:{" "}
          <span>{vendorProfile?.data?.storeCode ?? "—"}</span>
        </p>
      </div>

      <VendorSectionCard
        finance={dashboard?.finance}
        overallSales={dashboard?.overallSales}
        salesThisMonth={dashboard?.salesThisMonth}
        products={dashboard?.products}
      />

      <AdminActionItems items={actionItems} title="Action needed" />

      <div className="vendor-dashboard-panels">
        <div className="vendor-dashboard-chart-card">
          <div className="vendor-dashboard-chart-card__header">
            <div>
              <h2 className="vendor-dashboard-chart-card__title">
                Monthly Revenue
              </h2>
              <p className="vendor-dashboard-chart-card__subtitle">
                Overview of revenue and sales performance
              </p>
            </div>
            <div className="vendor-finance-filter">
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  data-active={timeFilter === filter}
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <VendorChart chartData={chartData} />
        </div>

        <div className="vendor-dashboard-products-card">
          <h2 className="vendor-dashboard-products-card__title">
            Highest Selling Products
          </h2>
          <HighestSellingProducts data={highestSellingProducts} />
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
