import { useMemo } from "react";
import { TUser } from "@/types/user/user";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { useFollowOrUnFollowUserMutation } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/features/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the columns for React Table

const FollowersFollowing = ({
  followers,
  following,
  refetch,
}: {
  followers: TUser[];
  following: TUser[];
  refetch: () => void;
}) => {
  const [foolowUser, { isLoading }] = useFollowOrUnFollowUserMutation();
  const token = useAppSelector(selectCurrentToken);
  const useColumns = () => {
    const columns = useMemo<ColumnDef<TUser>[]>(
      () => [
        {
          header: "Profile Picture",
          accessorKey: "profilePicture",
          cell: ({ row }) => (
            <Image
              src={row.original.profilePicture || "/default-avatar.png"}
              alt={row.original.name}
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
          ),
        },
        {
          header: "Name",
          accessorKey: "name",
          cell: ({ row }) => (
            <span className="font-semibold">{row.original.name}</span>
          ),
        },
        {
          header: "Bio",
          accessorKey: "bio",
          cell: ({ row }) => (
            <span>{row.original.bio || "No bio available"}</span>
          ),
        },
      ],
      []
    );
    return columns;
  };
  const useFollowing = () => {
    const columns = useMemo<ColumnDef<TUser>[]>(
      () => [
        {
          header: "Profile Picture",
          accessorKey: "profilePicture",
          cell: ({ row }) => (
            <Image
              src={row.original.profilePicture || "/default-avatar.png"}
              alt={row.original.name}
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
          ),
        },
        {
          header: "Name",
          accessorKey: "name",
          cell: ({ row }) => (
            <span className="font-semibold">{row.original.name}</span>
          ),
        },
        {
          header: "Bio",
          accessorKey: "bio",
          cell: ({ row }) => (
            <span>{row.original.bio || "No bio available"}</span>
          ),
        },
        {
          header: "Actions",
          cell: ({ row }) => (
            <Button
              disabled={isLoading}
              onClick={() => followOrUnFollowUser(row.original._id)}
              className="px-4 py-2"
            >
              Unfollow {isLoading && <Loader className="ml-2 animate-spin"/>}
            </Button>
          ),
        },
      ],
      []
    );
    return columns;
  };
  const followersColumns = useColumns();
  const followingColumns = useFollowing();

  // Create the table instances for both followers and following
  const followersTable = useReactTable({
    data: followers,
    columns: followersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const followingTable = useReactTable({
    data: following,
    columns: followingColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const followOrUnFollowUser = async (userId: string, status = "unfollow") => {
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Container */}
      <div className="container mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Followers & Following</h1>
        </div>

        {/* Followers and Following Section */}
        <div className="grid grid-cols-1 gap-12">
          {/* Followers */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Followers {followers.length || 0}
            </h2>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                {followersTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 border-b text-left bg-gray-200 font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {followersTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 border-b">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Following */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Following {following.length || 0}
            </h2>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                {followingTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 border-b text-left bg-gray-200 font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {followingTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 border-b">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowing;
