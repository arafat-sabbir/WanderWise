"use client";
import React, { useEffect, useState } from "react";
import { TPost } from "@/types/types";
import {
  useGetAllPostsForUserQuery,
} from "@/redux/features/posts/postApi";
import Container from "@/components/Shared/Container";
import CreateNewPost from "@/components/Post/CreateNewPost";
import FeedCardSkeleton from "@/components/Skeleton/FeedCardSkeleton";
import FeedCard from "@/components/Home/FeedCard";
import { useAppSelector } from "@/redux/features/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = useAppSelector(selectCurrentToken);
  const [page, setPage] = useState(1);
  const limit = !searchTerm ? 100 : 100;

  // Fetch data using the Redux query
  const { data, isLoading, refetch } = useGetAllPostsForUserQuery({token,page,limit,searchTerm});
  const [posts, setPosts] = useState<TPost[]>([]);
  useEffect(() => {
    setPosts(data?.data || []);
  }, [data?.data]);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <Container className="mx-auto">
        {/* Search Bar */}
        <div className="flex justify-between py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page when search term changes
            }}
            placeholder="Search posts..."
            className="border border-gray-300 rounded-md p-2 w-full max-w-lg"
          />
          <CreateNewPost />
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-2">
                <FeedCardSkeleton />
              </div>
            ))}
          </>
        )}

        {/* News Feed */}
        {posts.length > 0 && !isLoading && (
          <div className="space-y-6">
            {posts.map((post: TPost) => (
              <FeedCard
                refetch={refetch}
                key={post._id.toString()}
                post={post}
                setPosts={setPosts}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Posts;
