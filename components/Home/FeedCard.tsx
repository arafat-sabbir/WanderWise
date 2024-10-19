import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  Tag,
  Verified,
  User as LucideUser,
} from "lucide-react"; // Lucide React icons
import { TPost } from "@/types/types";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { MotionDiv } from "../Shared/MotionDiv";
import { useAppSelector } from "@/redux/features/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetUserQuery } from "@/redux/features/user/userApi";

type FeedCardProps = {
  post: TPost;
  refetch: any;
  setPosts?: any;
};

const FeedCard = ({ post }: FeedCardProps) => {
  const token = useAppSelector(selectCurrentToken);
  const { data } = useGetUserQuery(token);
  const user = data?.data;
  const [showComments, setShowComments] = useState<string | null>(null);
  const toggleComments = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };
  const router = useRouter();
  const viewDetail = (redirect: string) => {
    if (user?.isVerified) {
      router.push(redirect);
    } else {
      router.push("/dashboard");
      toast.error("Please Verify Your Account To View Premium Content");
    }
  };
  return (
    <MotionDiv
      initial="hidden"
      transition={{
        ease: "easeInOut",
        duration: 1,
      }}
      viewport={{ amount: 0 }}
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <Card className="shadow-md w-full max-w-4xl mx-auto my-4">
        {/* Post Header */}
        <CardHeader className="flex justify-between items-center border-b border-gray-200 p-4 md:p-6">
          <div className="flex items-center space-x-2">
            <Avatar className="bg-gray-200 w-12 h-12 md:w-16 md:h-16">
              {post?.user?.profilePicture ? (
                <AvatarImage src={post.user.profilePicture} />
              ) : (
                <LucideUser className="text-gray-600 w-8 h-8 md:w-10 md:h-10" />
              )}
            </Avatar>
            <div>
              <h1 className="text-lg md:text-2xl flex items-center gap-1 font-bold">
                {post?.user?.name}
                {post?.user?.isVerified && <Verified color="blue" />}
              </h1>
            </div>
          </div>
        </CardHeader>

        {/* Post Content */}
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-center pt-2">
            <h2 className="text-base md:text-xl font-bold mb-2 capitalize">
              {post?.title ?? "Untitled Post"}
            </h2>
            {post?.isPremium && (
              <span className="text-sm text-blue-600 capitalize bg-blue-100 px-2 py-1 rounded-full flex items-center">
                Premium
                <Verified className="text-blue-500 ml-1" size={20} />
              </span>
            )}
          </div>
          <div
            className="text-sm md:text-base text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: post?.content ?? "No content available.",
            }}
          />

          {/* Display images if available */}
          {post?.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {post.images.map((image, index) => (
                <Image
                  height={400}
                  width={400}
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            {/* Post Tags */}
            {post?.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-blue-600 capitalize bg-blue-100 px-2 py-1 rounded-full flex items-center"
                  >
                    <Tag className="mr-1" size={14} /> {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs md:text-sm text-blue-600 capitalize bg-blue-100 px-2 py-1 rounded-full flex items-center mt-2">
              <span className="text-gray-500">Category</span>:{" "}
              {post?.category ?? "Uncategorized"}
            </p>
          </div>
        </CardContent>

        {/* Post Actions */}
        <CardFooter className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 p-4 md:p-6">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <ThumbsUp
                className="mr-1"
                color={
                  post.upvotes?.includes(user?._id as string) ? "blue" : "gray"
                }
                size={18}
              />
              {post?.upvotes?.length ?? 0}
            </div>
            <div className="flex items-center">
              <ThumbsDown
                className="mr-1"
                color={
                  post.downvotes?.includes(user?._id as string) ? "red" : "gray"
                }
                size={18}
              />
              {post?.downvotes?.length ?? 0}
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <p
              className="text-gray-500 hover:underline hover:cursor-pointer mr-2"
              onClick={() => toggleComments(post?._id ?? "")}
            >
              {post?.comments?.length ?? 0} Comments
            </p>
            <Button
              variant="outline"
              onClick={() => viewDetail(`/post/${post?._id}`)}
            >
              View Detail
            </Button>
          </div>
        </CardFooter>

        {/* Comments Section */}
        {showComments === post?._id && (
          <div className="mt-4 border-t border-gray-200 p-4">
            {post?.comments?.length > 0 ? (
              post?.comments?.map((comment) => (
                <div
                  key={comment?._id}
                  className="flex items-start mb-2 p-2 bg-gray-100 rounded-lg shadow-sm"
                >
                  <Avatar>
                    <AvatarImage src={comment?.user?.profilePicture} />
                    <AvatarFallback>{comment?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="ml-2">
                    <p className="font-bold">
                      {comment?.user?.name ?? "Anonymous"}
                    </p>
                    <p>{comment?.comment ?? "No comment available"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments available</p>
            )}
          </div>
        )}
      </Card>
    </MotionDiv>
  );
};

export default FeedCard;
