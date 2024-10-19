"use client"

import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/features/hooks";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const token = useAppSelector(selectCurrentToken)
    if(!token){
        router.push('/auth/sign-in')
    }
  return (
    <>
      <div>{children}</div>
    </>
  );
}
