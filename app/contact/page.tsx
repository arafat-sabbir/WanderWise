"use client"
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Container from "@/components/Shared/Container";
import { toast } from "sonner";

// Define Zod schema for validation
const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Infer TypeScript type from the schema
type TContact = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // Initialize react-hook-form with Zod validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TContact>({
    resolver: zodResolver(contactSchema),
  });

  // Form submission handler
  const onSubmit: SubmitHandler<TContact> = (data) => {
    console.log(data);
    setLoading(true);
    const tId = toast.loading("Sending message...");
    setTimeout(() => {
      toast.success("Message sent!", { id: tId });
      setLoading(false);
    }, 2000);
    // Here, you can handle form submission (e.g., send the data to a server)
  };

  return (
    <Container className="py-16  p-6 sm:p-12 rounded-md">
      <h1 className="mb-6">Contact Us</h1>

      {/* Map Section */}
      <div className="mb-8">
        <iframe
          className="w-full lg:h-68 xl:h-72 2xl:h-80 md:h-52 h-40 rounded-md"
          frameBorder="0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.482573607508!2d-121.49439968469213!3d38.581571979622185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808529c43adbc0c7%3A0x7d46b3429e2d63a6!2sSacramento%2C%20CA!5e0!3m2!1sen!2sus!4v1675030203713!5m2!1sen!2sus"
          allowFullScreen
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      </div>

      {/* Contact Form */}
    <div className=" mx-auto shadow-2xl  rounded-md p-4 py-10">
    <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Full Name Field */}
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className={`w-full p-4 rounded-md border-2  focus:outline-none  text-title  ${
              errors.fullName ? "border-red-500 border" : ""
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full p-4 border-2 focus:outline-none rounded-md  text-title  ${
              errors.email ? "border-red-500 border" : ""
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="message"
          >
            Your Message
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className={`w-full p-4 border-2  rounded-md focus:outline-none  text-title  ${
              errors.message ? "border-red-500 border" : ""
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center disabled:cursor-not-allowed py-3 bg-primary text-white font-semibold rounded-md hover: transition duration-300"
        >
          Send Message{loading && <Loader className="ml-2 animate-spin" />}
        </button>
      </form>
    </div>
    </Container>
  );
};

export default Contact;
