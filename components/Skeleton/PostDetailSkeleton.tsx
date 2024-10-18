import Container from "../Shared/Container";

// components/SkeletonLoader.tsx
const PostDetailSkeleton = () => {
  return (
    <Container className="animate-pulse pt-20">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-32 bg-gray-300 rounded mb-2"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
    </Container>
  );
};

export default PostDetailSkeleton;
