"use client";
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
    <Container>
      <Tabs defaultValue={user?.role === "admin" ? "ManageUser" : "Profile"}>
        {/* user Dashboard */}
        {user?.role === "user" && (
          <TabsList>
            <TabsTrigger value="Profile">Profile</TabsTrigger>
            <TabsTrigger value="Posts">Your Posts</TabsTrigger>
            <TabsTrigger value="FollwersFollowing">
              Follwers & Following
            </TabsTrigger>
          </TabsList>
        )}
        
        {/* Admin Dashboard */}
        {user?.role === "admin" && (
          <TabsList>
            <TabsTrigger value="ManageUser">Manage User</TabsTrigger>
            <TabsTrigger value="ManagePosts">Manage Posts</TabsTrigger>
            <TabsTrigger value="FollwersFollowing">
              Follwers & Following
            </TabsTrigger>
          </TabsList>
        )}

        {/* Admin Dashboard */}
        <TabsContent value="ManageUser">
          <ManageUsers />
        </TabsContent>
        <TabsContent value="ManagePosts">
          <ManagePosts />
        </TabsContent>
        {/* Admin Dashboard */}

        {/* user Dashboard */}
        <TabsContent value="Profile">
          <Profile user={data?.data} isLoading={isLoading} refetch={refetch} />
        </TabsContent>
        <TabsContent value="Posts">
          <Posts />
        </TabsContent>
        <TabsContent value="FollwersFollowing">
          <FollowersFollowing
            refetch={refetch}
            followers={data?.data?.followers}
            following={data?.data?.following}
          />
        </TabsContent>
        {/* User Dashboard */}
      </Tabs>
    </Container>
  );
};

export default Page;
