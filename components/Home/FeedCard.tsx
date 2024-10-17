import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  Tag,
  Verified,
  User as LucideUser,
  Loader,
} from "lucide-react"; // Lucide React icons
import { TPost } from "@/types/types";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { MotionDiv } from "../Shared/MotionDiv";
import { useVotePostMutation } from "@/redux/features/posts/postApi";
import { useAppSelector } from "@/redux/features/hooks";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useCreateNewCommentMutation } from "@/redux/features/comments/commentApi";
import Link from "next/link";

type FeedCardProps = {
  post: TPost;
  refetch: any;
  setPosts?: any;
};

const FeedCard = ({ post, refetch, setPosts }: FeedCardProps) => {
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [votePost] = useVotePostMutation();

  const toggleComments = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };

  const handleVote = async ({
    postId,
    status,
  }: {
    postId: string;
    status: "upvote" | "downvote";
  }) => {
    try {
      // Optimistically update the post
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              upvotes:
                status === "upvote"
                  ? [...post.upvotes, user._id]
                  : post.upvotes.filter((id) => id !== user._id),
              downvotes:
                status === "downvote"
                  ? [...post.downvotes, user._id]
                  : post.downvotes.filter((id) => id !== user._id),
            };
          }
          return post;
        })
      );

      // Perform the vote mutation
      const response = await votePost({ token, postId, status });

      // After successful mutation, refetch posts to sync with server
      refetch();
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to vote");
    }
  };
  const [addComment, { isLoading }] = useCreateNewCommentMutation();

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const response = await addComment({
          token,
          postId: post._id,
          comment,
        }).unwrap();
        toast.success(response?.message); // Assuming response has a message field
        refetch(); // Refetch to update the comments
        setComment("");
      } catch (error) {
        toast.error(error?.data?.message || "Error submitting comment.");
        console.error("Comment submission error:", error);
      }
    } else {
      toast.error("Comment cannot be empty.");
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
              <p className="font-bold text-lg capitalize">
                {post?.user?.name ?? "Anonymous"}
              </p>
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
            <Button
              variant="ghost"
              className="flex items-center text-gray-600 hover:text-blue-500"
              onClick={() =>
                handleVote({ postId: post?._id, status: "upvote" })
              }
            >
              <ThumbsUp
                className="mr-1"
                color={
                  post.upvotes?.includes(user?._id as string) ? "blue" : "gray"
                }
                size={18}
              />
              {post?.upvotes?.length ?? 0}
            </Button>
            <Button
              variant="ghost"
              className="flex items-center text-gray-600 hover:text-red-500"
              onClick={() =>
                handleVote({ postId: post?._id, status: "downvote" })
              }
            >
              <ThumbsDown
                className="mr-1"
                color={
                  post.downvotes?.includes(user?._id as string) ? "red" : "gray"
                }
                size={18}
              />
              {post?.downvotes?.length ?? 0}
            </Button>
          </div>
          <div className="flex items-center">
            <p
              className="text-gray-500 hover:underline hover:cursor-pointer mr-2"
              onClick={() => toggleComments(post?._id ?? "")}
            >
              {post?.comments?.length ?? 0} Comments
            </p>
            <Button variant="outline"><Link href={`/post/${post?._id}`}>View Detail</Link></Button>
          </div>
        </CardFooter>

        {/* Comments Section */}
        {showComments === post?._id && (
          <div className="mt-4 border-t border-gray-200 p-4">
            {post?.comments?.map((comment) => (
              <div key={comment?._id} className="flex items-start mb-2 p-2 bg-gray-100 rounded-lg shadow-sm">
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
            ))}

            {/* Comment Input */}
            <div className="mt-4">
              <div className="flex items-center border rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-grow p-2 border-0 rounded-md focus:outline-none"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={isLoading}
                  className="ml-2"
                >
                  {isLoading ? <Loader size={16} /> : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </MotionDiv>
  );
};

export default FeedCard;
