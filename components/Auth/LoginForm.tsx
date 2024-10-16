"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/features/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/types/user/user";
import { Loader } from "lucide-react";
import BackToHome from "../Shared/BackToHome";
import Container from "../Shared/Container";
import { LoginFormValidation } from "@/lib/validation";
import CustomFormField from "../Shared/CustomFormField";
import { FormFieldType } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setCookie } from "cookies-next";

const LoginForm = ({ className }: { className?: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loginUser, { data, isLoading, isError }] = useLoginMutation();
  const onSubmit = async (values: z.infer<typeof LoginFormValidation>) => {
    try {
      const response = await loginUser(values);
      toast.success(response?.data?.message);
      console.log(response, "login");
      const user = response.data?.data as TUser;
      setCookie("token", response?.data.data.token, {
        maxAge: 60 * 60 * 24 * 10,
        path: "/",
      });
      dispatch(setUser({ user, token: response?.data.data.token }));
      router.push("/");
    } catch (error: any) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <Container className="flex justify-center items-center h-screen relative">
      <BackToHome />
      <div className="mx-auto w-full max-w-xl space-y-6 rounded-lg border bg-white p-10 shadow-lg sm:p-20 dark:border-zinc-700 dark:bg-zinc-900">
        <h1 className="text-3xl font-medium text-center mb-10">Welcome Back</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6 flex-1", className)}
          >
            <CustomFormField
              control={form.control}
              className=" rounded-none border"
              fieldType={FormFieldType.INPUT}
              name="email"
              placeholder="Enter Your Email"
              iconAlt="user"
            />
            <CustomFormField
              control={form.control}
              className=" rounded-none"
              fieldType={FormFieldType.INPUT}
              name="password"
              placeholder="Enter Your Password"
              iconAlt="user"
            />
            <Button
              disabled={isLoading}
              className="mt-4 bg-primary mx-auto lg:mx-0 w-full"
            >
              Login
              {isLoading && <Loader size={22} className="animate-spin ml-2" />}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
          Don&apos;t have an account?
          <Link href="/sign-up" className="font-semibold underline">
            Sign Up
          </Link>
        </p>
      </div>
    </Container>
  );
};
export default LoginForm;
