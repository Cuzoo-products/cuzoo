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
import phone from "@/FolderToDelete/phone.jpg";

function EditCategory() {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      CategoryName: "Phones",
      CategoryIcon: phone,
    },
  });

  const watchedFile = form.watch("CategoryIcon");

  const previewUrl = watchedFile
    ? typeof watchedFile === "string"
      ? watchedFile
      : URL.createObjectURL(watchedFile)
    : null;

  function onSubmit(data: z.infer<typeof CategoryFormSchema>) {
    console.log(data);
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

export default EditCategory;
