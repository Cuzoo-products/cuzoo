import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type CategoryData,
} from "@/components/utilities/Vendors/CategoryDataTable";

const data: CategoryData[] = [
  {
    id: "728ed52f",
    name: "Phones",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: "728ed52f",
    name: "Cloths",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: "489e1d42",
    name: "Assessories",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: "48901d42",
    name: "Watches",
    icon: "https://github.com/shadcn.png",
  },
];

function Categories() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Categories</h3>
        <p>Manage all categories information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Categories;
