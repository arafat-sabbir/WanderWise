"use client";

import dynamic from "next/dynamic";
import Container from "@/components/Shared/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/features/hooks";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { Loader } from "lucide-react";

// Dynamically import components to avoid SSR-related issues
const ManagePayment = dynamic(
  () => import("@/components/Dashboard/admin/ManagePayment"),
  { ssr: false }
);
const ManagePosts = dynamic(
  () => import("@/components/Dashboard/admin/ManagePosts"),
  { ssr: false }
);
const ManageUsers = dynamic(
  () => import("@/components/Dashboard/admin/ManageUser"),
  { ssr: false }
);
const FollowersFollowing = dynamic(
  () =>
    import("@/components/Dashboard/user/followersfollowing/FollowersFollowing"),
  { ssr: false }
);
const Posts = dynamic(() => import("@/components/Dashboard/user/post/Post"), {
  ssr: false,
});
const Profile = dynamic(
  () => import("@/components/Dashboard/user/profile/Profile"),
  { ssr: false }
);

const Page = () => {
  const token = useAppSelector(selectCurrentToken);
  const { data, refetch, isLoading } = useGetUserQuery(token);
  const user = data?.data;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader className="animate-spin " />
      </div>
    );
  }
  return (
    <Container className="py-10 px-6 lg:px-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-center mb-8">
        {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
      </h1>
      <Tabs
        defaultValue={user?.role === "admin" ? "ManageUser" : "Profile"}
        className="space-y-6"
      >
        {/* Admin Tabs */}
        {user?.role === "admin" && (
          <TabsList className="flex bg-stone-200  flex-wrap gap-4   justify-center max-w-fit mx-auto px-4">
            <TabsTrigger
              value="ManageUser"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Manage User
            </TabsTrigger>
            <TabsTrigger
              value="ManagePosts"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Manage Posts
            </TabsTrigger>
            <TabsTrigger
              value="ManagePayment"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Manage Payment
            </TabsTrigger>
          </TabsList>
        )}

        {/* User Tabs */}
        {user?.role === "user" && (
          <TabsList className="flex bg-stone-200  flex-wrap gap-4   justify-center max-w-fit mx-auto px-4">
            <TabsTrigger
              value="Profile"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="Posts"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Your Posts
            </TabsTrigger>
            <TabsTrigger
              value="FollwersFollowing"
              className="px-2 py-1  font-semibold tracking-wide text-gray-700 hover:text-primary rounded-lg transition border"
            >
              Followers & Following
            </TabsTrigger>
          </TabsList>
        )}

        {/* Admin Dashboard Content */}
        <TabsContent value="ManageUser">
          <div className=" bg-white shadow-xl px-6 rounded-lg">
            <ManageUsers />
          </div>
        </TabsContent>
        <TabsContent value="ManagePosts">
          <div className=" bg-white shadow-xl  px-6 rounded-lg">
            <ManagePosts />
          </div>
        </TabsContent>
        <TabsContent value="ManagePayment">
          <div className=" bg-white shadow-xl  px-6 rounded-lg">
            <ManagePayment />
          </div>
        </TabsContent>

        {/* User Dashboard Content */}
        <TabsContent value="Profile">
          <div className=" bg-white  rounded-lg">
            <Profile
              user={data?.data}
              isLoading={isLoading}
              refetch={refetch}
            />
          </div>
        </TabsContent>
        <TabsContent value="Posts">
          <div className=" bg-white  rounded-lg">
            <Posts />
          </div>
        </TabsContent>
        <TabsContent value="FollwersFollowing">
          <div className=" bg-white  rounded-lg">
            <FollowersFollowing
              refetch={refetch}
              followers={data?.data?.followers}
              following={data?.data?.following}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Page;
