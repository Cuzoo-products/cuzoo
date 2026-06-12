import { formatDisplayId } from "@/lib/formatDisplayId";

type DataTableIdCellProps = {
  id?: string | null;
};

export function DataTableIdCell({ id }: DataTableIdCellProps) {
  const full = (id ?? "").trim();
  if (!full) return <span className="text-muted-foreground">—</span>;

  return (
    <span className="font-mono text-xs" title={full}>
      {formatDisplayId(full)}
    </span>
  );
}
