import { useRequestWithdrawal } from "@/api/fleet/finance/useFinance";
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

const dummyBanks = [
  { id: "1", name: "GTBank - 0123456789" },
  { id: "2", name: "Access Bank - 1234567890" },
  { id: "3", name: "UBA - 9876543210" },
];

export function WithdrawDialog() {
  const { mutate: requestWithdrawal, isPending: isRequestingWithdrawal } =
    useRequestWithdrawal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement)
      ?.value;
    const bankId = (form.elements.namedItem("bankId") as HTMLSelectElement)
      ?.value;

    if (!amount || !bankId) return;

    requestWithdrawal({ amount, bankId });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button>Withdraw</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Choose a bank account and enter the amount you want to withdraw.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="bankId">Bank Account</Label>
              <select
                id="bankId"
                name="bankId"
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isRequestingWithdrawal}>
              {isRequestingWithdrawal ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
