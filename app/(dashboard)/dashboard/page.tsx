"use client";
import FollowersFollowing from "@/components/Dashboard/user/followersfollowing/FollowersFollowing";
import Posts from "@/components/Dashboard/user/post/Post";
import Profile from "@/components/Dashboard/user/profile/Profile";
import Container from "@/components/Shared/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/features/hooks";
import { useGetUserQuery } from "@/redux/features/user/userApi";

const Page = () => {
  const token = useAppSelector(selectCurrentToken);
  const { data, isLoading, refetch } = useGetUserQuery(token);
  return (
    <Container>
      <Tabs defaultValue="Profile">
        <TabsList>
          <TabsTrigger value="Profile">Profile</TabsTrigger>
          <TabsTrigger value="Posts">Your Posts</TabsTrigger>
          <TabsTrigger value="FollwersFollowing">
            Follwers & Following
          </TabsTrigger>
        </TabsList>
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
      </Tabs>
    </Container>
  );
};

export default Page;
