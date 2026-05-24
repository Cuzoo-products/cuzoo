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
import { EditProductFormSchema } from "@/lib/zodVaildation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "@/components/ui/image";
import {
  useGetOneProduct,
  useUpdateProduct,
} from "@/api/vendor/products/useProducts";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useGetCategories } from "@/api/vendor/categories/useCategories";
import type { CategoryData } from "@/components/utilities/Vendors/CategoryDataTable";
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

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetOneProduct(id as string);
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const form = useForm<z.infer<typeof EditProductFormSchema>>({
    resolver: zodResolver(EditProductFormSchema),
    defaultValues: {
      name: product?.data?.name,
      categoryId: product?.data?.categoryId,
      price: product?.data?.price,
      stock: product?.data?.stock,
      shortDescription: product?.data?.shortDescription,
      longDescription: product?.data?.longDescription,
      image1: product?.data?.image1?.url,
      image2: product?.data?.image2?.url,
      image3: product?.data?.image3?.url,
      image4: product?.data?.image4?.url,
    },
  });

  const watchedFile1 = form.watch("image1");
  const watchedFile2 = form.watch("image2");
  const watchedFile3 = form.watch("image3");
  const watchedFile4 = form.watch("image4");

  const previewUrl1 = watchedFile1
    ? typeof watchedFile1 === "string"
      ? watchedFile1
      : URL.createObjectURL(watchedFile1)
    : null;

  const previewUrl2 = watchedFile2
    ? typeof watchedFile2 === "string"
      ? watchedFile2
      : URL.createObjectURL(watchedFile2)
    : null;

  const previewUrl3 = watchedFile3
    ? typeof watchedFile3 === "string"
      ? watchedFile3
      : URL.createObjectURL(watchedFile3)
    : null;

  const previewUrl4 = watchedFile4
    ? typeof watchedFile4 === "string"
      ? watchedFile4
      : URL.createObjectURL(watchedFile4)
    : null;

  const { mutate: updateProduct, isPending } = useUpdateProduct();
  function onSubmit(data: z.infer<typeof EditProductFormSchema>) {
    // Create a new payload without unchanged images
    const payload = { ...data };

    // Only include images that have been changed (not the original URL)
    if (
      typeof data.image1 === "string" &&
      data.image1 === product?.data?.image1?.url
    ) {
      delete payload.image1;
    }
    if (
      typeof data.image2 === "string" &&
      data.image2 === product?.data?.image2?.url
    ) {
      delete payload.image2;
    }
    if (
      typeof data.image3 === "string" &&
      data.image3 === product?.data?.image3?.url
    ) {
      delete payload.image3;
    }
    if (
      typeof data.image4 === "string" &&
      data.image4 === product?.data?.image4?.url
    ) {
      delete payload.image4;
    }

    updateProduct(
      { id: id as string, productData: payload },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  }

  useEffect(() => {
    if (product?.data) {
      form.reset({
        name: product.data.name,
        categoryId: product.data.categoryId,
        price: product.data.price,
        stock: product.data.stock,
        shortDescription: product.data.shortDescription,
        longDescription: product.data.longDescription,
        image1: product.data.image1?.url,
        image2: product.data.image2?.url,
        image3: product.data.image3?.url,
        image4: product.data.image4?.url,
      });
    }
  }, [product, form]);

  if (isLoading || categoriesLoading) {
    return <Loader />;
  }

  return (
    <div className="vendor-form-page">
      <div className="vendor-form-shell vendor-form-shell--wide">
        <div className="vendor-form-header">
          <h1>Edit Product</h1>
          <p>Make changes to this product</p>
        </div>
        <div className="vendor-form-card">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
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
                      value={field.value || product?.data?.categoryId}
                    >
                      <SelectTrigger className="vendor-form-control w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="vendor-select-menu">
                        {categories?.data?.map((category: CategoryData) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
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

            {previewUrl1 && (
              <div>
                <h3>Image 1 (required)</h3>
                <Image
                  source={previewUrl1}
                  alt="Product Image one"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

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

            {previewUrl2 && (
              <div>
                <h3>Image 2 </h3>
                <Image
                  source={previewUrl2}
                  alt="Product Image two"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="image2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 2 (optional)</FormLabel>
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

            {previewUrl3 && (
              <div>
                <h3>Image 3 (optional)</h3>
                <Image
                  source={previewUrl3}
                  alt="Product Image three"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="image3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 3</FormLabel>
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

            {previewUrl4 && (
              <div>
                <h3>Image 4 (optional)</h3>
                <Image
                  source={previewUrl4}
                  alt="Product Image four"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="image4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 4</FormLabel>
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

export default EditProduct;
