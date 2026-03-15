import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  useAddBankAccount,
  useDeleteBankAccount,
  useGetBankList,
  useGetVerifyAccount,
} from "@/api/fleet/finance/useFinance";
import { toast } from "sonner";

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

type BankListResponse = {
  success: boolean;
  statusCode: number;
  data: {
    data: {
      name: string;
      code: string;
    }[];
    meta: {
      next: string | null;
      previous: string | null;
      perPage: number;
    };
  };
};

type VerifyAccountResponse = {
  success: boolean;
  statusCode: number;
  data: {
    accountNumber: string;
    accountName: string;
  };
};

const initialBanks: BankAccount[] = [];

export default function Banks() {
  const { mutate: addBankAccount, isPending: isAddingBankAccount } =
    useAddBankAccount();
  const { data: bankList } = useGetBankList() as {
    data?: BankListResponse;
  };
  const { mutate: deleteBankAccount, isPending: isDeletingBankAccount } =
    useDeleteBankAccount();

  const [banks] = useState<BankAccount[]>(initialBanks);
  const [form, setForm] = useState({
    bankCode: "",
    accountName: "",
    accountNumber: "",
  });

  const bankOptions = bankList?.data?.data ?? [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const { data: verifyAccount } = useGetVerifyAccount(
    form.accountNumber,
    form.bankCode,
  ) as { data?: VerifyAccountResponse };

  useEffect(() => {
    if (verifyAccount?.data?.accountName) {
      setForm((prev) => ({
        ...prev,
        accountName: verifyAccount.data.accountName,
      }));
    }
  }, [verifyAccount]);

  const handleAddBank = () => {
    if (!form.bankCode || !form.accountName || !form.accountNumber) return;

    addBankAccount(
      {
        accountNumber: form.accountNumber,
        bankCode: form.bankCode,
        accountName: form.accountName,
      },
      {
        onSuccess: () => {
          setForm({
            bankCode: "",
            accountName: "",
            accountNumber: "",
          });
          toast.success("Bank account added successfully");
        },
      },
    );
  };

  const handleDeleteBank = (accountNumber: string) => {
    deleteBankAccount({
      accountNumber: accountNumber,
    });
  };

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Banks</h3>
        <p className="text-muted-foreground">
          Manage payout bank accounts for your fleet.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-secondary lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Add New Bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Name</label>
              <select
                name="bankCode"
                value={form.bankCode}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <Input
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 0123456789"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name</label>
              <Input
                name="accountName"
                value={form.accountName}
                readOnly
                placeholder="Account name will appear after verification"
                className="h-10 bg-muted"
              />
            </div>

            <Button
              type="button"
              className="w-full mt-2"
              onClick={handleAddBank}
              disabled={isAddingBankAccount}
            >
              {isAddingBankAccount ? "Adding..." : "Add Bank"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Saved Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {banks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bank accounts added yet. Add a bank on the left to get
                started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line-1 text-left">
                      <th className="py-2 pr-4">Bank</th>
                      <th className="py-2 pr-4">Account Name</th>
                      <th className="py-2 pr-4">Account Number</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banks.map((bank) => (
                      <tr
                        key={bank.id}
                        className="border-b border-line-1 last:border-0"
                      >
                        <td className="py-2 pr-4">{bank.bankName}</td>
                        <td className="py-2 pr-4">{bank.accountName}</td>
                        <td className="py-2 pr-4">{bank.accountNumber}</td>
                        <td className="py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBank(bank.id)}
                            aria-label="Delete bank"
                            disabled={isDeletingBankAccount}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
