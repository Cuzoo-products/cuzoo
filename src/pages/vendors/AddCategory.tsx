import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VendorFileInput } from "@/components/utilities/Vendors/VendorFileInput";
import { CategoryFormSchema } from "@/lib/zodVaildation";
import { useCreateCategory } from "@/api/vendor/categories/useCategories";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function AddCategory() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      CategoryName: "",
      CategoryIcon: "",
    },
  });

  const { mutate, isPending } = useCreateCategory();

  function onSubmit(data: z.infer<typeof CategoryFormSchema>) {
    const CatInfo = {
      name: data.CategoryName,
      icon: data.CategoryIcon,
    };

    mutate(CatInfo, {
      onSuccess: () => {
        navigate("/vendor/categories");
      },
    });
  }

  return (
    <div className="vendor-form-page">
      <div className="vendor-form-shell">
        <div className="vendor-form-header">
          <h1>Add Category</h1>
          <p>add to your Category</p>
        </div>
        <div className="vendor-form-card">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="CategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        className="vendor-form-control"
                        placeholder="Phones"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="CategoryIcon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Icon (Image)</FormLabel>
                    <FormControl>
                      <VendorFileInput
                        onFileSelect={async (file) => {
                          if (!file) return;
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="vendor-form-submit"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
