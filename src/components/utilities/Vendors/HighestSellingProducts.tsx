import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { HighestSellingProductsT } from "@/pages/vendors/VendorDashboard";

function HighestSellingProducts({ data }: { data: HighestSellingProductsT[] }) {
  return (
    <>
      {data.map((items) => (
        <div
          key={items.id}
          className="flex items-center space-x-3 border-b border-b-line-1 py-3"
        >
          <Avatar className="size-10">
            <AvatarImage src={items.imageUrl} />
          </Avatar>
          <div className="text-sm">
            <p className="font-bold">{items.productName}</p>
            <p>{items.sales} sales</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default HighestSellingProducts;
