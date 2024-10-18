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
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = !searchTerm ? 5 : 20;
  const [sort, setSort] = useState("");

  // Fetch data using the Redux query
  const { data, isLoading, refetch } = useGetAllPostsQuery({
    page,
    limit,
    searchTerm,
    category,
    sort,
  });
  const [posts, setPosts] = useState<TPost[]>([]);
  useEffect(() => {
    setPosts(data?.data || []);
  }, [data?.data]);
  const hasMorePosts = posts.length >= limit;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between py-4 space-y-4 lg:space-y-0 lg:space-x-4 items-center">

            <Select
              defaultValue=""
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Adventure Travel">Adventure Travel</SelectItem>
                <SelectItem value="Cultural Experiences">
                  Cultural Experiences
                </SelectItem>
                <SelectItem value="Family Travel">Family Travel</SelectItem>
                <SelectItem value="Budget Travel">Budget Travel</SelectItem>
                <SelectItem value="Luxury Travel">Luxury Travel</SelectItem>
                <SelectItem value="Solo Travel">Solo Travel</SelectItem>
                <SelectItem value="Food and Culinary Tours">
                  Food and Culinary Tours
                </SelectItem>
                <SelectItem value="Eco-Tourism">Eco-Tourism</SelectItem>
                <SelectItem value="Wellness and Retreats">
                  Wellness and Retreats
                </SelectItem>
                <SelectItem value="Destination Guides">
                  Destination Guides
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue=""
              onValueChange={(value) => setSort(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By Upvotes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High To Low</SelectItem>
                <SelectItem value="asc">Low To High</SelectItem>
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
              className="border border-gray-300 rounded-md p-2 w-full"
            />

          <CreateNewPost />
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <FeedCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* News Feed */}
        {!isLoading && posts.length > 0 && (
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
          <LoadMore searchTerm={searchTerm} category={category} sort={sort} />
        )}
      </Container>
    </div>
  );
};

export default NewsFeed;
