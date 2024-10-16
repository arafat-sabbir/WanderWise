import { z } from "zod";

export const LoginFormValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password Must Be 6 Characters Long" }),
});

export const RegisterFormValidation = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z.string({required_error:"Email is required"}).email({ message: "Invalid Email Address" }),
  phone: z.string({required_error:"Phone Number is required"}).min(11, { message: "Invalid Phone Number" }),
  address: z.string({required_error:"Address is required"}),
  password: z
    .string()
    .min(6, { message: "Password Must Be 6 Characters Long" }),
});

export const CheckoutFormValidation = z.object({
  fullName: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  phone: z.string().min(11, { message: "Invalid Phone Number" }),
  region: z.string({ message: "Please select your region" }),
  city: z.string({ message: "Please select your city" }),
  area: z.string({ message: "Please select your area" }),
  address: z.string({ message: "Please enter your address" }),
  buildingNo: z.string({ message: "Please enter your building number" }),
});

export const AddProductValidation = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  price: z
    .string({ required_error: "Price is required" })
    .refine((val) => !isNaN(Number(val)), { message: "Price must be a number" }),
  category: z.string({ required_error: "Category is required" }),
  stockCount: z
    .string({ required_error: "Stock Count is required" })
    .refine((val) => !isNaN(Number(val)), { message: "Stock Count must be a number" }),
  vendor: z.string({ required_error: "Vendor is required" }),
});
