import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type WithdrawPayload = { accountNumber: string; amount: number };

export type WithdrawAccount = {
  accountName: string;
  accountNumber: string;
  bankName: string;
};

export type WithdrawDialogProps = {
  balance: number;
  onSubmit: (data: WithdrawPayload) => void;
  isPending?: boolean;
  accounts?: WithdrawAccount[];
};

export function WithdrawDialog({
  balance,
  onSubmit,
  isPending = false,
  accounts = [],
}: WithdrawDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amountVal = (form.elements.namedItem("amount") as HTMLInputElement)
      ?.value;
    const accountNumber = (
      form.elements.namedItem("accountNumber") as HTMLSelectElement
    )?.value;

    if (!amountVal || !accountNumber) return;

    const amount = Number(amountVal);
    if (Number.isNaN(amount) || amount <= 0) return;

    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    onSubmit({ accountNumber, amount });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Choose a bank account and enter the amount you want to withdraw.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="accountNumber">Bank Account</Label>
              <select
                id="accountNumber"
                name="accountNumber"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue=""
                disabled={accounts.length === 0}
              >
                <option value="" disabled>
                  {accounts.length === 0
                    ? "No bank accounts. Add one in Banks."
                    : "Select bank to withdraw to"}
                </option>
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.bankName} – {acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
