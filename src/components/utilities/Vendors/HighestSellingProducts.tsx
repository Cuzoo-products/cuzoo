import type { HighestSellingProductsT } from "@/pages/vendors/VendorDashboard";

function HighestSellingProducts({ data }: { data: HighestSellingProductsT[] }) {
  if (!data.length) {
    return (
      <p className="vendor-product-row__sales">No products to display yet.</p>
    );
  }

  return (
    <div className="vendor-product-list">
      {data.map((item) => (
        <div key={item.id} className="vendor-product-row">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="vendor-product-row__image"
            />
          ) : (
            <div
              className="vendor-product-row__image"
              style={{ backgroundColor: "var(--admin-border)" }}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="vendor-product-row__name">{item.productName}</p>
            <p className="vendor-product-row__sales">{item.sales} sales</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HighestSellingProducts;
