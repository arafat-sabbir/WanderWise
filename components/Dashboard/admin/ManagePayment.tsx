import React, { useMemo } from "react";
import { TPost } from "@/types/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Container from "@/components/Shared/Container";
import { useGetAllPaymentQuery } from "@/redux/features/payments/paymentApi";
import { useAppSelector } from "@/redux/features/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";

const ManagePayment = () => {
  const token = useAppSelector(selectCurrentToken);
  const { data, isLoading, error } = useGetAllPaymentQuery(token!);
  console.log(data, error);
  // Define the table columns
  const columns = useMemo<ColumnDef<TPost>[]>(
    () => [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <span>{row.original.user.name as string}</span>,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Payment Status",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      }
    ],
    []
  );

  // Define the table instance
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if(isLoading){
    return <TableSkeleton/>
  }
  return (
    <div className=" min-h-screen py-10">
      <Container className="mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Manage Payment
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

export default ManagePayment;
