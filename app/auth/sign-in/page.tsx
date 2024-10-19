"use client";
import LoginForm from "@/components/Auth/LoginForm";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/features/hooks";

const Page = () => {
  const user = useAppSelector(selectCurrentUser);
  return <LoginForm />;
};

export default Page;
