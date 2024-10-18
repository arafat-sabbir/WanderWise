import React, { useEffect, useMemo, useState } from "react";
import { TPost } from "@/types/types";
import {
  useGetAllPostsQuery,
  useDeletePostMutation,
} from "@/redux/features/posts/postApi";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Container from "@/components/Shared/Container";
import CreateNewPost from "@/components/Post/CreateNewPost";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";

const ManagePosts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = !searchTerm ? 100 : 100;

  const { data, isLoading, refetch } = useGetAllPostsQuery({
    page,
    limit,
    searchTerm,
    sort: "",
    category: "all",
  });
  const [posts, setPosts] = useState<TPost[]>([]);
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    setPosts(data?.data || []);
  }, [data?.data]);

  // Define the table columns
  const columns = useMemo<ColumnDef<TPost>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "upvotes.length",
        header: "Upvotes",
        cell: ({ row }) => <span>{row.original.upvotes.length}</span>,
      },
      {
        accessorKey: "upvotes.length",
        header: "Downvotes",
        cell: ({ row }) => <span>{row.original.downvotes.length}</span>,
      },
      {
        accessorKey: "user.name",
        header: "Author",
        cell: ({ row }) => <span>{row.original.user.name}</span>,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="destructive"
            onClick={() => handleDeletePost(row.original._id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    []
  );

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
      toast.success("Post deleted successfully!");
      refetch(); // Refetch the posts after deletion
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  // Define the table instance
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if (isLoading) {
    return <TableSkeleton />;
  }
  return (
    <div className=" min-h-screen py-10">
      <Container className="mx-auto">
        {/* Search Bar */}
        <div className="flex justify-between py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page when search term changes
            }}
            placeholder="Search posts..."
            className="border border-gray-300 rounded-md p-2 w-full max-w-lg"
          />
          <CreateNewPost />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Manage Posts
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full border-2 border-gray-300/50-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
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
      </Container>
    </div>
  );
};

export default ManagePosts;
