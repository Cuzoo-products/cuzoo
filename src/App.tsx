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
import { LoginFormSchema } from "@/lib/zodVaildation";
import Image from "./components/ui/image";
import logo1 from "@/assets/logo2.png";

function App() {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    console.log(data);
  }

  return (
    <div className="bg-background h-screen px-3 md:px-0 flex justify-center my-10 items-center">
      <div className="w-full md:w-1/2 rounded-2xl">
        <div className="bg-secondary shadow-md py-7 rounded">
          <div className="flex justify-center items-center">
            <Image source={logo1} alt="" className="w-16 h-16" />
          </div>
          <div className="text-center mt-1 mb-10">
            <h2 className="text-2xl font-bold">Login</h2>
            <p>Welcome back!👋🏽</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-3/4 lg:w-2/3 space-y-6 mx-auto"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter mail</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="email"
                        placeholder="johndoe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#d6d6d6] h-11 focus-visible:shadow-md focus-visible:ring-[#4D37B3]"
                        type="password"
                        placeholder="••••••••"
                        {...field}
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
        <p className="text-center mt-5">©2025 Cuzoo. All Rights reserved.</p>
      </div>
    </div>
  );
}

export default App;
