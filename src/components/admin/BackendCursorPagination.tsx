import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BackendCursorPaginationProps = {
  count?: number;
  limit: number;
  pageSizeOptions?: number[];
  pageIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onLimitChange: (limit: number) => void;
};

export default function BackendCursorPagination({
  count,
  limit,
  pageSizeOptions = [10, 20, 25, 50],
  pageIndex,
  hasPrevious,
  hasNext,
  isLoading = false,
  onPrevious,
  onNext,
  onLimitChange,
}: BackendCursorPaginationProps) {
  return (
    <div className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {count != null ? `${count.toLocaleString("en-NG")} total` : "—"}
        {isLoading ? " · Loading…" : ""}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => onLimitChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm font-medium">Page {pageIndex + 1}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onPrevious}
            disabled={!hasPrevious || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onNext}
            disabled={!hasNext || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
