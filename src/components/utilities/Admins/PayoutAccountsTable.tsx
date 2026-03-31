import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** One entry in `wallet.payoutAccounts` from the API. */
export type WalletPayoutAccount = {
  name?: string;
  currency?: string;
  recipient_code?: string;
  type?: string;
  details?: {
    authorization_code?: string | null;
    account_number?: string;
    account_name?: string;
    bank_code?: string;
    bank_name?: string;
  };
};

function maskAccountNumber(acc: string | undefined): string {
  const s = (acc ?? "").trim();
  if (!s) return "—";
  if (s.length < 4) return "****";
  return `****${s.slice(-4)}`;
}

function holderName(row: WalletPayoutAccount): string {
  const top = row.name?.trim();
  const inner = row.details?.account_name?.trim();
  return top || inner || "—";
}

export function normalizeWalletPayoutAccounts(
  value: unknown,
): WalletPayoutAccount[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (x): x is WalletPayoutAccount =>
      x != null && typeof x === "object" && !Array.isArray(x),
  );
}

export function PayoutAccountsTable({ accounts }: { accounts: unknown }) {
  const rows = normalizeWalletPayoutAccounts(accounts);
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No payout accounts on file.</p>
    );
  }

  return (
    <div className="rounded-md border border-line-1 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account holder</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead className="whitespace-nowrap">Account no.</TableHead>
            <TableHead>Bank code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="min-w-[9rem]">Recipient code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={`${row.recipient_code ?? row.details?.account_number ?? i}-${i}`}>
              <TableCell className="font-medium max-w-[12rem]">
                {holderName(row)}
              </TableCell>
              <TableCell className="max-w-[14rem]">
                {row.details?.bank_name?.trim() || "—"}
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">
                {maskAccountNumber(row.details?.account_number)}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {row.details?.bank_code?.trim() || "—"}
              </TableCell>
              <TableCell>{row.type || "—"}</TableCell>
              <TableCell>{row.currency || "—"}</TableCell>
              <TableCell className="font-mono text-xs">
                {row.recipient_code || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
