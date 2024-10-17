"use client";
import getAllPosts from "@/app/actions";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FeedCard from "./FeedCard";
import { TPost } from "@/types/types";

let page = 2;

const LoadMore = ({ searchTerm }: { searchTerm: string }) => {
  const { ref, inView } = useInView();
  const [hideLoading, setHideLoading] = useState(false);
  const [posts, setPosts] = useState<TPost[]>([]);

  useEffect(() => {
    if (searchTerm) {
      setPosts([]);
      page = 2;
    }
    if (inView) {
      getAllPosts({ page: page, limit: 3, searchTerm: searchTerm }).then(
        (res) => {
          console.log("fetching new post", res, {
            page: page,
            limit: 3,
            searchTerm: searchTerm,
          });
          if (searchTerm) {
            setPosts(res.data); // Replace posts when searching
          } else {
            setPosts((prevPosts) => [...prevPosts, ...res.data]); // Append posts if not searching
          }
          if (res.data.length === 0) {
            setHideLoading(true);
          } else {
            page++;
          }
        }
      );
    }
  }, [inView, searchTerm]);
  return (
    <div className="mt-6">
      <div className="space-y-6">
        {posts?.map((post: TPost) => (
          <FeedCard key={post._id.toString()} post={post} />
        ))}
      </div>
      {!hideLoading && (
        <Loader ref={ref} className="animate-spin mx-auto my-4" />
      )}
    </div>
  );
};

export default LoadMore;
