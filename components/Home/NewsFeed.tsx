"use client";
import React, { useEffect, useState } from "react";
import { TPost } from "@/types/types";
import FeedCard from "./FeedCard";
import LoadMore from "./LoadMore";
import FeedCardSkeleton from "../Skeleton/FeedCardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CreateNewPost from "../Post/CreateNewPost";
import { useGetAllPostsQuery } from "@/redux/features/posts/postApi";
import Container from "../Shared/Container";

const NewsFeed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = !searchTerm ? 5 : 20;

  // Fetch data using the Redux query
  const { data, isLoading, refetch, isFetching } = useGetAllPostsQuery({
    page,
    limit,
    searchTerm,
  });
  const [posts, setPosts] = useState<TPost[]>([]);
  useEffect(() => {
    setPosts(data?.data||[])
  },[data?.data])
  const hasMorePosts = posts.length >= limit;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <Container className="mx-auto">
        {/* Search Bar */}
        <div className="flex justify-between py-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Load More button */}
        {!isLoading && hasMorePosts && !searchTerm && (
          <LoadMore
            searchTerm={searchTerm}
          />
        )}
      </Container>
    </div>
  );
};

export default NewsFeed;
