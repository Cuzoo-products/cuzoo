import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

type CreateViewActionsColumnOptions<T> = {
  getHref: (row: T) => string | undefined | null;
};

export function createViewActionsColumn<T>({
  getHref,
}: CreateViewActionsColumnOptions<T>): ColumnDef<T> {
  return {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const href = getHref(row.original);

      return (
        <div className="text-right">
          {href ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={href}>View</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              View
            </Button>
          )}
        </div>
      );
    },
  };
}
