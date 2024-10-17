"use client";
import React, { useEffect, useState } from "react";
import { TPost } from "@/types/types";
import { useGetAllPostsQuery } from "@/redux/features/posts/postApi";
import FeedCard from "./FeedCard";
import LoadMore from "./LoadMore";

const NewsFeed = () => {
  const query = { page: 1, limit: 3 };
  const { data, isLoading, isError, refetch } = useGetAllPostsQuery(query);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Travel Tips & Destination Guides
        </h1>
        <div className="space-y-6">
          {data?.data?.map((post: TPost) => (
            <FeedCard key={post._id.toString()} post={post} />
          ))}
        </div>
        {!isLoading && <LoadMore />}
      </div>
    </div>
  );
};

export default NewsFeed;
