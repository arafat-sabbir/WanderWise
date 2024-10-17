"use client";
import { useGetSinglePostQuery } from "@/redux/features/posts/postApi";
import { Tag } from "lucide-react";
import Image from "next/image";

const PostDetail = ({ params }: { params: { id: string } }) => {
  const { data: post, error, isLoading } = useGetSinglePostQuery(params.id);

  // Handle loading and error states
  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10">Error loading post!</div>;

  return (
    <div className="max-w-4xl mx-auto p-5 md:p-10">
      {post?.data?.tags && post?.data?.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {post?.data.tags.map((tag, index) => (
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

      {/* Content Section */}
      <div
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: post?.data?.content }}
      />

      {/* User Info Section */}
      <div className="flex items-center border-t pt-4 mb-6">
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

      {/* Comments Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {post?.data.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          post?.data.comments.map((comment) => (
            <div key={comment._id} className="border-b py-2">
              <div className="flex items-start mb-1">
                <Image
                  height={32}
                  width={32}
                  src={comment.user.profilePicture}
                  alt="Comment User"
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-sm mr-2"
                />
                <div>
                  <span className="font-semibold">{comment.user.name}</span>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetail;
