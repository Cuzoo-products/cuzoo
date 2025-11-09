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

    console.log(payload);
    updateProduct({ id: id as string, productData: payload });
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
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Edit Product</h3>
        <p>make changes to this product</p>
      </div>
      <div className="bg-secondary md:w-3/4 mx-auto py-10 rounded-2xl mb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                      <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
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
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
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
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
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
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
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
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
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
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await fileToBase64(file);
                            field.onChange(base64);
                          } catch (error) {
                            toast.error("Error processing passport image");
                            console.error("Error:", error);
                          }
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
              className="w-full mt-3 h-11 bg-[#4D37B3] text-white"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditProduct;
