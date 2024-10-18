"use client";
import ManagePayment from "@/components/Dashboard/admin/ManagePayment";
import ManagePosts from "@/components/Dashboard/admin/ManagePosts";
import ManageUsers from "@/components/Dashboard/admin/ManageUser";
import FollowersFollowing from "@/components/Dashboard/user/followersfollowing/FollowersFollowing";
import Posts from "@/components/Dashboard/user/post/Post";
import Profile from "@/components/Dashboard/user/profile/Profile";
import Container from "@/components/Shared/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/features/hooks";
import { useGetUserQuery } from "@/redux/features/user/userApi";

const Page = () => {
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const { data, refetch, isLoading } = useGetUserQuery(token);

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
          <TabsList className="flex flex-wrap gap-4 bg-white justify-center lg:justify-start ">
            <TabsTrigger
              value="ManageUser"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Manage User
            </TabsTrigger>
            <TabsTrigger
              value="ManagePosts"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Manage Posts
            </TabsTrigger>
            <TabsTrigger
              value="ManagePayment"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Manage Payment
            </TabsTrigger>
          </TabsList>
        )}

        {/* User Tabs */}
        {user?.role === "user" && (
          <TabsList className="flex flex-wrap gap-4 bg-white  justify-center lg:justify-start ">
            <TabsTrigger
              value="Profile"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="Posts"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Your Posts
            </TabsTrigger>
            <TabsTrigger
              value="FollwersFollowing"
              className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-primary rounded-lg transition"
            >
              Followers & Following
            </TabsTrigger>
          </TabsList>
        )}

        {/* Admin Dashboard Content */}
        <TabsContent value="ManageUser">
          <div className="p-6 bg-white shadow-xl rounded-lg">
            <ManageUsers />
          </div>
        </TabsContent>
        <TabsContent value="ManagePosts">
          <div className="p-6 bg-white shadow-xl rounded-lg">
            <ManagePosts />
          </div>
        </TabsContent>
        <TabsContent value="ManagePayment">
          <div className="p-6 bg-white shadow-xl rounded-lg">
            <ManagePayment />
          </div>
        </TabsContent>

        {/* User Dashboard Content */}
        <TabsContent value="Profile">
          <div className="p-6 bg-white  rounded-lg">
            <Profile user={data?.data} isLoading={isLoading} refetch={refetch} />
          </div>
        </TabsContent>
        <TabsContent value="Posts">
          <div className="p-6 bg-white  rounded-lg">
            <Posts />
          </div>
        </TabsContent>
        <TabsContent value="FollwersFollowing">
          <div className="p-6 bg-white  rounded-lg">
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
