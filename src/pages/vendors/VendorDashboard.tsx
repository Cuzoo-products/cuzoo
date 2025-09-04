import HighestSellingProducts from "@/components/utilities/Vendors/HighestSellingProducts";
import VendorChart from "@/components/utilities/Vendors/VendorChart";
import VendorSectionCard from "@/components/utilities/Vendors/VendorSectionCard";

const chartData = [
  { month: "January", revenue: 180, sales: 74 },
  { month: "February", revenue: 186, sales: 80 },
  { month: "March", revenue: 120, sales: 20 },
  { month: "April", revenue: 110, sales: 90 },
  { month: "May", revenue: 193, sales: 30 },
  { month: "June", revenue: 170, sales: 60 },
];

export type HighestSellingProductsT = {
  id: number;
  productName: string;
  sales: string;
  imageUrl: string;
};
const highestSellingProducts: HighestSellingProductsT[] = [
  {
    id: 1,
    productName: "Iphone",
    sales: "129",
    imageUrl: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    productName: "Samsung",
    sales: "128",
    imageUrl: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    productName: "Nokia",
    sales: "123",
    imageUrl: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    productName: "Tecno",
    sales: "121",
    imageUrl: "https://github.com/shadcn.png",
  },
  {
    id: 5,
    productName: "Infinix",
    sales: "117",
    imageUrl: "https://github.com/shadcn.png",
  },
];

function VendorDashboard() {
  return (
    <div className="@container/main">
      <div className="flex justify-between items-center">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Dashboard</h3>
          <p>Hello, Tobiloba Ibrahim</p>
        </div>
        <div>
          <h3 className="!font-bold text-xl">vendor-code</h3>
        </div>
      </div>

      <VendorSectionCard />

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
