"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { RegisterFormValidation } from "@/lib/validation";
import { toast } from "sonner";
import { useState } from "react"; // Import useState to manage the image file
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import Container from "../Shared/Container";
import BackToHome from "../Shared/BackToHome";
import CustomFormField from "../Shared/CustomFormField";
import Link from "next/link";
import Image from "next/image";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "text_area",
  PHONE_INPUT = "phone_input",
  SELECT = "select",
}
// Name, email, password, phone number, address.

const RegisterForm = ({ className }: { className?: string }) => {
  const form = useForm<z.infer<typeof RegisterFormValidation>>({
    resolver: zodResolver(RegisterFormValidation),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      bio: "",
    },
  });

  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null); // State to store the selected photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // State for photo preview
  const [registerUser, { data, isLoading, isError }] = useRegisterMutation();

  const onSubmit = async (values: z.infer<typeof RegisterFormValidation>) => {
    const formData = new FormData();

    // Append profile picture separately
    formData.append("profilePicture", photo as File);

    // Append each key-value pair from `values` to the formData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string); // Type casting value to string
    });

    console.log({ profilePicture: photo, ...values });

    try {
      const response = await registerUser(formData); // Send `formData` instead of object
      console.log(response?.data?.data);
      toast.success("Register Successful");
      router.push("/auth/sign-in");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //Drop Zone For Photo Upload For Future Work

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPhoto(acceptedFiles[0]); // Set the first accepted file as the photo
      setPhotoPreview(URL.createObjectURL(acceptedFiles[0])); // Create a preview URL
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1, // Limit to a single file
  });

  return (
    <Container className="flex justify-center items-center h-screen relative">
      <BackToHome />
      <div className="mx-auto w-full max-w-xl space-y-8 rounded-lg border bg-white p-10 shadow-lg sm:p-20 dark:border-zinc-700 dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold text-center">Sign Up</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6 flex-1", className)}
          >
            <CustomFormField
              label="Name"
              control={form.control}
              className="rounded-none"
              fieldType={FormFieldType.INPUT}
              name="name"
              placeholder="Enter Your Name"
              iconAlt="user"
            />
            <CustomFormField
              label="Email"
              control={form.control}
              className="rounded-none"
              fieldType={FormFieldType.INPUT}
              name="email"
              placeholder="Enter Your Email"
              iconAlt="email"
            />
            {/* <CustomFormField
              label="Phone"
              control={form.control}
              className="rounded-none"
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              placeholder="Enter Your Phone"
            /> */}
            <CustomFormField
              label="Bio"
              control={form.control}
              className="rounded-none"
              fieldType={FormFieldType.TEXTAREA}
              name="bio"
              placeholder="Enter Your Bio"
            />
            <CustomFormField
              label="Password"
              control={form.control}
              className="rounded-none"
              fieldType={FormFieldType.INPUT}
              name="password"
              placeholder="Enter Your Password"
              iconAlt="password"
            />
            {/* Dropzone for image upload */}
            <div>
              <label htmlFor="photo" className="font-medium">
                Photo
              </label>
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-300 p-4 rounded"
              >
                <input {...getInputProps()} />
                {photo && (
                  <div className="flex justify-center">
                    <Image
                      height={32}
                      width={32}
                      src={photoPreview!}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded mt-2"
                    />
                  </div>
                )}
                <p className="text-center">
                  Drag n drop your photo here, or click to select one
                </p>
              </div>
            </div>
            <Button
              disabled={isLoading}
              className="mt-4 bg-primary mx-auto lg:mx-0 w-full"
            >
              Register {isLoading && <Loader className="ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
          Don&apos;t have an account?
          <Link href="/login" className="font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default RegisterForm;
