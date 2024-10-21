"use client";
import Container from "@/components/Shared/Container";
import PostDetailSkeleton from "@/components/Skeleton/PostDetailSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useCreateNewCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/redux/features/comments/commentApi";
import { useAppSelector } from "@/redux/features/hooks";
import {
  useGetSinglePostQuery,
  useVotePostMutation,
} from "@/redux/features/posts/postApi";
import {
  useFollowOrUnFollowUserMutation,
  useGetUserQuery,
} from "@/redux/features/user/userApi";
import {
  CircleX,
  Ellipsis,
  Loader,
  Pencil,
  PenLine,
  Tag,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const PostDetail = ({ params }: { params: { id: string } }) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // ... other code
  const [showPopOver, setShowPopOver] = useState(false);
  const handleEditComment = (commentId: string) => {
    if (editingCommentId === commentId) {
      // If the user clicks the edit button again, toggle off the editing state
      setEditingCommentId(null);
    } else {
      // Set the editing state to the selected comment ID
      setEditingCommentId(commentId);
    }
  };
  const token = useAppSelector(selectCurrentToken);
  const { data } = useGetUserQuery(token);
  const user = data?.data;
  const [comment, setComment] = useState<string>("");
  const [votePost] = useVotePostMutation();
  const [addComment, { isLoading }] = useCreateNewCommentMutation();
  const {
    data: post,
    isLoading: isPostLoading,
    error,
    refetch,
  } = useGetSinglePostQuery(params.id);

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const response = await addComment({
          token,
          postId: params.id,
          comment,
        }).unwrap();
        toast.success(response?.message); // Assuming response has a message field
        refetch(); // Refetch to update the comments
        setComment("");
      } catch (error: any) {
        toast.error(error?.data?.message || "Error submitting comment.");
        console.error("Comment submission error:", error);
      }
    } else {
      toast.error("Comment cannot be empty.");
    }
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
  const [foolowUser] = useFollowOrUnFollowUserMutation();
  const followOrUnFollowUser = async (
    userId: string,
    status: "follow" | "unfollow"
  ) => {
    try {
      // Perform the follow/unfollow mutation
      const response = await foolowUser({ token, userId, status });
      // After successful mutation, refetch users to sync with server
      refetch();
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to follow/unfollow");
    }
  };
  const [editedComment, setEditedComment] = useState("");
  const [updateComment, { isLoading: updateIsLoading }] =
    useUpdateCommentMutation();

  const editComment = async () => {
    try {
      const response = await updateComment({
        token,
        id: editingCommentId,
        comment: editedComment,
      });
      console.log(response?.data);
      toast.success(response?.data?.message);
      setEditingCommentId(null);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const [deleteCommentById, { isLoading: deleteIsLoading }] =
    useDeleteCommentMutation();
  const deleteComment = async (commentId: string) => {
    try {
      const response = await deleteCommentById({
        token,
        id: commentId,
      });
      console.log(response?.data);
      toast.success(response?.data?.message);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle loading and error states
  if (error)
    return <div className="text-center py-10">Error loading post!</div>;
  if (isPostLoading) return <PostDetailSkeleton />;
  return (
    <Container className="mx-auto p-5 md:p-10">
      {post?.data?.tags && post?.data?.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {post?.data.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-sm text-blue-600 capitalize bg-blue-100 px-2 py-1 rounded-full flex items-center"
            >
              <Tag className="mr-1" size={14} /> {tag}
            </span>
          ))}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        {post?.data.title}
      </h1>

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {post?.data.images.map((image: string, index: number) => (
          <Image
            key={index}
            src={image}
            alt={`Post image ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
            layout="responsive"
            height={300} // Adjust height for your design
            width={500} // Adjust width for your design
          />
        ))}
      </div>
      {/* Post Actions */}
      <CardFooter className="flex justify-end items-center border-t border-gray-200 ">
        <div className="flex space-x-4 pt-2">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-blue-500"
            onClick={() => handleVote({ postId: params.id, status: "upvote" })}
          >
            <ThumbsUp
              className="mr-1"
              color={
                post?.data.upvotes?.includes(user?._id as string)
                  ? "blue"
                  : "gray"
              }
              size={18}
            />
            {post?.data.upvotes?.length ?? 0}
          </Button>
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-red-500"
            onClick={() =>
              handleVote({ postId: params.id, status: "downvote" })
            }
          >
            <ThumbsDown
              className="mr-1"
              color={
                post?.data.downvotes?.includes(user?._id as string)
                  ? "red"
                  : "gray"
              }
              size={18}
            />
            {post?.data?.downvotes?.length ?? 0}
          </Button>
        </div>
      </CardFooter>
      {/* Content Section */}
      <div
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: post?.data?.content }}
      />
      {/* User Info Section */}
      <div>
        <h1 className="border-t text-xl font-semibold py-2">Author</h1>
        <div className="flex justify-between">
          <div className="flex items-center  mb-6">
            <Image
              height={48}
              width={48}
              src={post?.data?.user?.profilePicture}
              alt="User Profile"
              className="w-12 h-12 rounded-full border border-gray-300 shadow-sm mr-4"
            />
            <div>
              <h2 className="font-semibold text-lg">{post?.data.user.name}</h2>
              <p className="text-gray-600">{post?.data.user.bio}</p>
            </div>
          </div>
          <div>
            <div>
              {post?.data.user.followers.includes(user?._id) || (
                <Button
                  onClick={() =>
                    followOrUnFollowUser(post?.data.user._id, "follow")
                  }
                >
                  Follow
                </Button>
              )}
              {post?.data.user.followers.includes(user?._id) && (
                <Button
                  onClick={() =>
                    followOrUnFollowUser(post?.data.user._id, "unfollow")
                  }
                >
                  Unfollow
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {post?.data.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          post?.data.comments.map((comment: any) => (
            <div
              key={comment?._id}
              className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg shadow-sm"
            >
              <div className="flex items-start">
                <Avatar>
                  <AvatarImage src={comment?.user?.profilePicture} />
                  <AvatarFallback>{comment?.user?.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="ml-2">
                  <p className="font-bold">
                    {comment?.user?.name ?? "Anonymous"}
                  </p>
                  <div className="flex gap-2 items-center">
                    <Input
                      onChange={(e) => setEditedComment(e.target.value)}
                      disabled={editingCommentId !== comment?._id}
                      className="disabled:border-0 disabled:text-black disabled:opacity-100 disabled:shadow-none disabled:p-0 disabled:m-0 disabled:-mt-2"
                      defaultValue={comment?.comment ?? "No comment available"}
                    ></Input>
                    {editingCommentId == comment?._id && (
                      <>
                        <Button
                          onClick={editComment}
                          disabled={updateIsLoading}
                        >
                          Update
                          {updateIsLoading && (
                            <Loader className="ml-2 animate-spin" />
                          )}
                        </Button>
                        <Button
                          onClick={()=>setEditingCommentId("")}
                          disabled={updateIsLoading}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {user?._id === comment?.user?._id && (
                <Popover open={showPopOver} onOpenChange={setShowPopOver}>
                  <PopoverTrigger>
                    <Ellipsis />
                  </PopoverTrigger>
                  <PopoverContent className="max-w-[120px] space-y-2">
                    <p
                      className="flex gap-1 items-center border rounded-md px-2 py-1 cursor-pointer"
                      onClick={() => {
                        handleEditComment(comment._id); // Enable editing for the selected comment
                        setEditingCommentId(comment._id); // Close popover by changing the state
                        setShowPopOver(false);
                      }}
                    >
                      Edit
                      <PenLine />
                    </p>
                    <p
                      onClick={() => deleteComment(comment._id)}
                      className="flex gap-1 items-center border rounded-md px-2 py-1 cursor-pointer"
                    >
                      Delete
                      {deleteIsLoading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <CircleX />
                      )}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))
        )}
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
    </Container>
  );
};

export default PostDetail;
