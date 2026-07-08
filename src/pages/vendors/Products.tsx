import { useEffect, useMemo, useState } from "react";
import { useGetProducts } from "@/api/vendor/products/useProducts";
import {
  parseVendorProductsListMeta,
  parseVendorProductsListPayload,
  type GetVendorProductsParams,
} from "@/api/vendor/products/productApi";
import { useGetCategories } from "@/api/vendor/categories/useCategories";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columns,
  type ProductData,
} from "@/components/utilities/Vendors/ProductsDataTable";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

function imageUrlFromProduct(product: Record<string, unknown>): string {
  const image1 = product.image1;
  if (typeof image1 === "string") return image1;
  if (image1 && typeof image1 === "object") {
    const url = (image1 as { url?: string }).url;
    if (typeof url === "string") return url;
  }
  return "";
}

function mapProductToRow(product: Record<string, unknown>): ProductData {
  const id = String(product.id ?? product.Id ?? "").trim();
  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price) || 0;
  const stock =
    typeof product.stock === "number"
      ? product.stock
      : Number(product.stock) || 0;

  return {
    id,
    name: product.name != null ? String(product.name) : "—",
    image1: { url: imageUrlFromProduct(product) },
    price: String(price),
    stock: String(stock),
  };
}

function Products() {
  const [nameInput, setNameInput] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const { data: categoriesPayload } = useGetCategories();
  const categories = useMemo(() => {
    const raw = (categoriesPayload as { data?: unknown } | undefined)?.data;
    if (!Array.isArray(raw)) return [] as Array<{ id: string; name: string }>;
    return raw
      .map((cat) => {
        const c = cat as { id?: string; name?: string };
        return {
          id: String(c.id ?? "").trim(),
          name: String(c.name ?? "").trim(),
        };
      })
      .filter((c) => c.id !== "");
  }, [categoriesPayload]);

  useEffect(() => {
    setCursorStack([undefined]);
  }, [appliedName, categoryId]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVendorProductsParams>(() => {
    const params: GetVendorProductsParams = { limit };
    if (appliedName.trim()) params.name = appliedName.trim();
    if (categoryId) params.categoryId = categoryId;
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [appliedName, categoryId, currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useGetProducts(queryParams);

  const products = useMemo(() => parseVendorProductsListPayload(data), [data]);
  const meta = useMemo(() => parseVendorProductsListMeta(data), [data]);

  const tableData: ProductData[] = useMemo(
    () => products.map(mapProductToRow).filter((row) => row.id !== ""),
    [products],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    products.length >= limit;

  const handleApplyName = () => {
    setAppliedName(nameInput.trim());
  };

  const handleClearFilters = () => {
    setNameInput("");
    setAppliedName("");
    setCategoryId("");
    setCursorStack([undefined]);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCursorStack([undefined]);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (!hasNext || meta?.lastCursor == null) return;
    setCursorStack((prev) => [...prev, meta.lastCursor as number | string]);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Products" subtitle="Failed to load products." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle={
          meta?.count != null
            ? `Manage products · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all products information"
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-line-1 bg-background p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 min-w-[200px] flex-1">
          <label className="text-sm font-medium">Product name</label>
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Search by name"
            className="h-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyName();
            }}
          />
        </div>

        <div className="space-y-2 min-w-[180px]">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={categoryId || "all"}
            onValueChange={(next) =>
              setCategoryId(next === "all" ? "" : next)
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="vendor-select-menu">
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name || cat.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleApplyName}>
            Apply
          </Button>
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
        columns={columns}
        data={tableData}
      />

      <BackendCursorPagination
        count={meta?.count}
        limit={limit}
        pageIndex={pageIndex}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        isLoading={isFetching}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default Products;
