import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { ProductFormSchema } from "@/lib/zodVaildation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProduct } from "@/api/vendor/products/useProducts";
import { useGetCategories } from "@/api/vendor/categories/useCategories";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function AddProduct() {
  const navigate = useNavigate();
  const { data: categories } = useGetCategories();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stock: 0,
      shortDescription: "",
      longDescription: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    },
  });

  const { mutate: createProduct, isPending } = useCreateProduct();

  function onSubmit(data: z.infer<typeof ProductFormSchema>) {
    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([_, values]) =>
          values !== null && values !== "" && values !== undefined,
      ),
    );
    createProduct(payload, {
      onSuccess: () => {
        navigate("/vendor/products");
      },
    });
  }

  return (
    <div className="vendor-form-page">
      <div className="vendor-form-shell vendor-form-shell--wide">
        <div className="vendor-form-header">
          <h1>Add Products</h1>
          <p>add to your list of products</p>
        </div>
        <div className="vendor-form-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        className="vendor-form-control"
                        placeholder="e.g Iphone 11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="vendor-form-control"
                        {...field}
                        placeholder="100000"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        className="vendor-form-control"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="vendor-form-control w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="vendor-select-menu">
                          {(categories?.data || []).map(
                            (cat: { id: string; name: string }) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="short description of products"
                        className="vendor-form-control"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Long description of product"
                        className="vendor-form-control min-h-[7rem]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image 1 (required)</FormLabel>
                    <FormControl>
                      <VendorFileInput
                        onFileSelect={async (file) => {
                          if (!file) return;
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing product image");
                            console.error("Error:", error);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image 2 (required)</FormLabel>
                    <FormControl>
                      <VendorFileInput
                        onFileSelect={async (file) => {
                          if (!file) return;
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing product image");
                            console.error("Error:", error);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image 3 (optional)</FormLabel>
                    <FormControl>
                      <VendorFileInput
                        onFileSelect={async (file) => {
                          if (!file) return;
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing product image");
                            console.error("Error:", error);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image 4 (optional)</FormLabel>
                    <FormControl>
                      <VendorFileInput
                        onFileSelect={async (file) => {
                          if (!file) return;
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing product image");
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
                className="vendor-form-submit"
                disabled={isPending}
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

export default AddProduct;
