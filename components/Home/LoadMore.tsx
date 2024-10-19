"use client";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import FeedCard from "./FeedCard";
import { TPost } from "@/types/types";
import { useGetAllPostsQuery } from "@/redux/features/posts/postApi";

const LoadMore = ({
  searchTerm,
  category,
  sort,
}: {
  searchTerm: string;
  category: string;
  sort:string;
}) => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(2); // Start from page 2, assuming page 1 data is already loaded
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hideLoading, setHideLoading] = useState(false);

  // Fetch posts using Redux Query, changing with page and searchTerm
  const { data, isFetching, refetch } = useGetAllPostsQuery({
    page,
    limit: 5,
    searchTerm,
    category,
    sort
  });

  // Handle infinite scroll when posts come into view
  useEffect(() => {
    if (inView && !isFetching) {
      if (data?.data.length === 0) {
        setHideLoading(true); // Hide loader if no more posts
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.data]);
        setPage((prevPage) => prevPage + 1); // Increment page for next fetch
      }
    }
  }, [inView, data, isFetching]);

  // Reset posts when search term changes
  useEffect(() => {
    setPosts([]); // Clear posts on search
    setPage(2); // Reset page
    setHideLoading(false); // Re-enable loading indicator
  }, [searchTerm]);
  return (
    <div className="mt-6">
      <div className="space-y-6">
        {posts?.map((post: TPost) => (
          <FeedCard
            refetch={refetch}
            key={post._id.toString()}
            post={post}
            setPosts={setPosts}
          />
        ))}
      </div>

      {/* Show loader only if not hiding it */}
      {!hideLoading && (
        <Loader ref={ref} className="animate-spin mx-auto my-4" />
      )}
    </div>
  );
};

export default LoadMore;
