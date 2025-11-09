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
import { CategoryFormSchema } from "@/lib/zodVaildation";
import Image from "@/components/ui/image";
import {
  useGetOneCategory,
  useUpdateCategory,
} from "@/api/vendor/categories/useCategories";
import { useParams } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import Loader from "@/components/utilities/Loader";

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function EditCategory() {
  const { id } = useParams();

  const { data: category, isLoading } = useGetOneCategory(id as string);

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      CategoryName: "",
      CategoryIcon: "",
    },
  });

  // Update form with category data when loaded
  useEffect(() => {
    if (category?.data) {
      form.reset({
        CategoryName: category.data.name,
        CategoryIcon: category.data.image?.url || "",
      });
    }
  }, [category, form]);

  const watchedFile = form.watch("CategoryIcon");

  const previewUrl = watchedFile
    ? typeof watchedFile === "string"
      ? watchedFile
      : URL.createObjectURL(watchedFile)
    : null;

  const { mutate: updateCategory, isPending } = useUpdateCategory();

  function onSubmit(data: z.infer<typeof CategoryFormSchema>) {
    updateCategory({ id: id as string, catData: data });
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Edit Category</h3>
        <p>make changes to this Category</p>
      </div>
      <div className="bg-secondary md:w-3/4 mx-auto py-10 rounded-2xl mb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 md:w-3/4 lg:w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="CategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {previewUrl && (
              <div>
                <h3>Category Icon</h3>
                <Image
                  source={previewUrl}
                  alt="Category Icon"
                  className="w-40 h-auto rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="CategoryIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Category Icon (Image)</FormLabel>
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

export default EditCategory;
