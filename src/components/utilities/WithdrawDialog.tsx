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

const dummyBanks = [
  { id: "8140231279", name: "Opay - 8140231279" },
  { id: "1234567890", name: "Access Bank - 1234567890" },
  { id: "9000000000", name: "UBA - 9000000000" },
];

export type WithdrawPayload = { accountNumber: string; amount: number };

export type WithdrawDialogProps = {
  balance: number;
  onSubmit: (data: WithdrawPayload) => void;
  isPending?: boolean;
};

export function WithdrawDialog({
  balance,
  onSubmit,
  isPending = false,
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
              >
                <option value="" disabled>
                  Select bank to withdraw to
                </option>
                {dummyBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
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
