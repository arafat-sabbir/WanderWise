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
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

import Link from "next/link";

type FeedCardProps = {
  post: TPost;
  refetch: any;
  setPosts?: any;
};

const FeedCard = ({ post }: FeedCardProps) => {
  const user = useAppSelector(selectCurrentUser);
  const [showComments, setShowComments] = useState<string | null>(null);
  const toggleComments = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
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
      <Card className="shadow-md">
        {/* Post Header */}
        <CardHeader className="flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Avatar className="bg-gray-200">
              {post?.user?.profilePicture ? (
                <AvatarImage src={post.user.profilePicture} />
              ) : (
                <LucideUser className="text-gray-600" />
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl flex justify-center items-center gap-1  font-bold text-center ">
                {post?.user?.name}
                {post?.user?.isVerified && <Verified color="blue" />}
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                {post?.category ?? "Uncategorized"}
              </p>
            </div>
          </div>
          {post?.isPremium && <Verified className="text-blue-500" size={24} />}
        </CardHeader>

        {/* Post Content */}
        <CardContent>
          <h2 className="text-xl font-bold mb-2 capitalize">
            {post?.title ?? "Untitled Post"}
          </h2>
          <div
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html:
                (post?.content ?? "No content available.").slice(0, 200) +
                "...",
            }}
          />
          {/* Display images if available */}
          {post?.images && post.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
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

          {/* Post Tags */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-blue-600 capitalize bg-blue-100 px-2 py-1 rounded-full flex items-center"
                >
                  <Tag className="mr-1" size={14} /> {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        {/* Post Actions */}
        <CardFooter className="flex justify-between items-center border-t border-gray-200 ">
          <div className="flex space-x-4 pt-2">
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
          <div className="flex items-center">
            <p
              className="text-gray-500 hover:underline hover:cursor-pointer mr-2"
              onClick={() => toggleComments(post?._id ?? "")}
            >
              {post?.comments?.length ?? 0} Comments
            </p>
            <Button variant="outline">
              <Link href={`/post/${post?._id}`}>View Detail</Link>
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
