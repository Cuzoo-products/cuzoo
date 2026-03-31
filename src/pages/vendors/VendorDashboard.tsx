import { useGetVendorProfile } from "@/api/vendor/auth/useAuth";
import { useGetDashboard } from "@/api/vendor/dashboard/useDashBoard";
import HighestSellingProducts from "@/components/utilities/Vendors/HighestSellingProducts";
import VendorChart from "@/components/utilities/Vendors/VendorChart";
import VendorSectionCard from "@/components/utilities/Vendors/VendorSectionCard";
import Loader from "@/components/utilities/Loader";

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

function VendorDashboard() {
  const { data, isLoading, error } = useGetDashboard() as {
    data?: DashboardResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { data: vendorProfile } = useGetVendorProfile();

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
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Dashboard</h3>
          <p className="text-red-500">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="flex justify-between items-center">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Dashboard</h3>
          <p>Hello, welcome back</p>
        </div>
        <div>
          <h3 className="!font-bold text-xl text-muted-foreground">
            Store Code: {vendorProfile?.data?.storeCode}
          </h3>
        </div>
      </div>

      <VendorSectionCard
        finance={dashboard?.finance}
        overallSales={dashboard?.overallSales}
        salesThisMonth={dashboard?.salesThisMonth}
        products={dashboard?.products}
      />

      <div className="lg:flex my-20 space-y-5 lg:space-y-0 lg:space-x-3">
        <div className="lg:flex-9/12 border border-line-1 bg-secondary rounded-lg p-5">
          <VendorChart chartData={chartData} />
        </div>
        <div className="lg:flex-3/12 border border-line-1 bg-secondary rounded-lg p-3">
          <h3 className="font-bold text-center">Highest Selling Products</h3>
          <HighestSellingProducts data={highestSellingProducts} />
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
