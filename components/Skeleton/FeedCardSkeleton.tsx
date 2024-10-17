"use client";
import { Avatar } from "../ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const FeedCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <Card className="shadow-md">
        {/* Post Header */}
        <CardHeader className="flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Avatar className="bg-gray-300 w-10 h-10 rounded-full" />
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </CardHeader>

        {/* Post Content */}
        <CardContent>
          <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>

          {/* Images Skeleton */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="h-40 bg-gray-300 rounded-md"></div>
            <div className="h-40 bg-gray-300 rounded-md"></div>
            <div className="h-40 bg-gray-300 rounded-md"></div>
          </div>
        </CardContent>

        {/* Post Tags */}
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-14"></div>
          </div>
        </CardContent>

        {/* Post Actions */}
        <CardFooter className="flex justify-between items-center border-t border-gray-200">
          <div className="flex space-x-4 pt-2">
            <div className="h-6 bg-gray-300 rounded w-12"></div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedCardSkeleton;
