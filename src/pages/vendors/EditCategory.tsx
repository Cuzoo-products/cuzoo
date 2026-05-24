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
import Image from "@/components/ui/image";
import {
  useGetOneCategory,
  useUpdateCategory,
} from "@/api/vendor/categories/useCategories";
import { useParams } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Loader from "@/components/utilities/Loader";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const { data: category, isLoading } = useGetOneCategory(id as string);

  const initialCategoryIconRef = useRef<string>("");

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      CategoryName: "",
      CategoryIcon: "",
    },
  });

  useEffect(() => {
    if (category?.data) {
      const iconUrl = category.data.image?.url || "";
      initialCategoryIconRef.current = iconUrl;
      form.reset({
        CategoryName: category.data.name,
        CategoryIcon: iconUrl,
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
    const payload: { name: string; icon?: string } = {
      name: data.CategoryName,
    };
    if (data.CategoryIcon !== initialCategoryIconRef.current) {
      payload.icon = data.CategoryIcon;
    }
    updateCategory(
      { id: id as string, catData: payload },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="vendor-form-page">
      <div className="vendor-form-shell">
        <div className="vendor-form-header">
          <h1>Edit Category</h1>
          <p>Make changes to this category</p>
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

              {previewUrl ? (
                <div>
                  <FormLabel>Current Icon</FormLabel>
                  <Image
                    source={previewUrl}
                    alt="Category Icon"
                    className="mt-2 w-40 h-auto rounded-lg"
                  />
                </div>
              ) : null}

              <FormField
                control={form.control}
                name="CategoryIcon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Category Icon (Image)</FormLabel>
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

export default EditCategory;
