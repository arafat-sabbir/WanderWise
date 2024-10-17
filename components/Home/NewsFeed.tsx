"use client";
import React, { useEffect, useState } from "react";
import { TPost } from "@/types/types";
import FeedCard from "./FeedCard";
import LoadMore from "./LoadMore";
import getAllPosts from "@/app/actions";
import FeedCardSkeleton from "../Skeleton/FeedCardSkeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CreateNewPost from "../Post/CreateNewPost";

const NewsFeed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(false); // To track if more posts are available

  useEffect(() => {
    setLoading(true);
    if (searchTerm) {
      setPosts([]);
    }
    getAllPosts({
      page: 1,
      limit: !searchTerm ? 3 : 20,
      searchTerm: searchTerm,
    }).then((res) => {
      if (res.data.length < 3) {
        setHasMorePosts(false);
      } else {
        setHasMorePosts(true);
      }
      setPosts(res.data);
      setLoading(false); // Set loading to false after fetching completes
    });
  }, [searchTerm]);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="border border-gray-300 rounded-md p-2 w-full max-w-lg"
          />
          <CreateNewPost />
        </div>
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="py-2">
              <FeedCardSkeleton />
            </div>
          ))}
        {/* News Feed */}
        {posts?.length > 0 && (
          <div className="space-y-6">
            {posts.map((post: TPost) => (
              <FeedCard key={post._id.toString()} post={post} />
            ))}
          </div>
        )}
        {/* Load More button only if there are more posts */}
        {!loading && hasMorePosts && !searchTerm && (
          <LoadMore searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
