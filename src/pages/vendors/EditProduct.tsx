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
import { ProductFormSchema } from "@/lib/zodVaildation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import phone from "@/FolderToDelete/phone.jpg";
import phone2 from "@/FolderToDelete/phone2.jpg";
import Image from "@/components/ui/image";

function EditProduct() {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      ProductName: "",
      Category: "",
      Price: "",
      Stock: "",
      ShortDescription: "",
      LongDescription: "",
      Image1: phone,
      Image2: phone,
      Image3: phone2,
      Image4: phone2,
    },
  });

  const watchedFile1 = form.watch("Image1");
  const watchedFile2 = form.watch("Image2");
  const watchedFile3 = form.watch("Image3");
  const watchedFile4 = form.watch("Image4");

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

  function onSubmit(data: z.infer<typeof ProductFormSchema>) {
    console.log(data);
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
              name="ProductName"
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
              name="Price"
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
              name="Stock"
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
              name="Category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Phone</SelectItem>
                        <SelectItem value="Female">Watch</SelectItem>
                        <SelectItem value="Other">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ShortDescription"
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
              name="LongDescription"
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
              name="Image1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 1 (required)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {previewUrl2 && (
              <div>
                <h3>Image 2 (optional)</h3>
                <Image
                  source={previewUrl2}
                  alt="Product Image two"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="Image2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 2 (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
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
              name="Image3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 3 (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
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
              name="Image4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image 4 (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-11 border-[#d6d6d6] focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-3 h-11 bg-[#4D37B3] text-white"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditProduct;
