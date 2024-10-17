"use client";
import getAllPosts from "@/app/actions";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FeedCard from "./FeedCard";
import { TPost } from "@/types/types";

let page = 2;

const LoadMore = () => {
  const { ref, inView } = useInView();
  const [hideLoading, setHideLoading] = useState(false);
  const [posts, setPosts] = useState<TPost[]>([]);
  useEffect(() => {
    const query = { page: page, limit: 3 };
    if (inView) {
      getAllPosts(query).then((res) => {
        page++;
        if (res.data.length === 0) {
          setHideLoading(true);
        }
        setPosts([...posts, ...res.data]);
      });
    }
  }, [inView]);
  console.log(posts, "posts");
  return (
    <div className="mt-6">
      <div className="space-y-6">
        {posts?.map((post: TPost) => (
          <FeedCard key={post._id.toString()} post={post} />
        ))}
      </div>
      {!hideLoading && <Loader ref={ref} className="animate-spin mx-auto my-4" />}
    </div>
  );
};

export default LoadMore;
