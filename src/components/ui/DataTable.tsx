import React, { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import type {
  ColumnDef,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";
import { useLoader } from "../../context/PageLoaderContext";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  totalPages: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
    setPagination: React.Dispatch<
      React.SetStateAction<{ pageIndex: number; pageSize: number }>
    >;
  };
  sorting: SortingState;
  onSortingChange: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  isLoading?: boolean;
  isError?: boolean;
  searchInput?: React.ReactNode;
  filterInput?: React.ReactNode;
  className?: string;
}

function DataTable<TData>({
  data,
  columns,
  totalPages,
  pagination,
  columnVisibility = {},
  setColumnVisibility = () => {},
  isLoading = false,
  isError = false,
  searchInput,
  filterInput,
  sorting,
  onSortingChange,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination,
      columnVisibility,
      sorting,
    },
    onSortingChange,
    onPaginationChange: pagination.setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { setLoading } = useLoader();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {searchInput}
        {filterInput}
        {!!Object.keys(columnVisibility).length &&
          table
            .getAllLeafColumns()
            .filter(
              (column) =>
                column.id !== "actions" && !column.id.startsWith("NS_")
            )
            .map((column) => (
              <label
                key={column.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {String(column.columnDef.header)}
              </label>
            ))}
      </div>

      {isError ? (
        <p className="text-red-600">Error loading data.</p>
      ) : (
        <>
          {/* Table for medium and up */}
          <div className="overflow-x-auto">
            <table className="hidden sm:table w-full text-left border border-gray-200">
              <thead className="bg-brand text-surface">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-2 py-1 sm:px-4 sm:py-2 border-b whitespace-normal break-words"
                        onClick={
                          header.id === "actions" || header.id.startsWith("NS_")
                            ? () => {}
                            : header.column.getToggleSortingHandler()
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="even:bg-surface">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2 py-1 sm:px-4 sm:py-2 border-b whitespace-normal break-words"
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
          {table.getRowModel().rows.length <= 0 && (
            <div className="text-center text-gray-500 py-10">
              <p className="text-sm">No data available</p>
            </div>
          )}

          {/* Card view for small screens */}
          <div className="sm:hidden space-y-4">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="border rounded shadow-sm bg-surface flex flex-wrap"
                role="group"
                aria-label="Row details"
              >
                {row.getVisibleCells().map((cell, key) => {
                  const header = table
                    .getAllLeafColumns()
                    .find((col) => col.id === cell.column.id)?.columnDef.header;

                  return (
                    <div
                      key={cell.id}
                      className={`mb-2 last:mb-0 ${
                        key === 0 ? "w-full" : "w-1/2"
                      }`}
                    >
                      {key !== 0 ? (
                        <>
                          <div className="text-xs font-bold text-gray-500 px-2">
                            {typeof header === "function"
                              ? String(cell.column.columnDef.header)
                              : header}
                          </div>
                          <div className="text-brand text-base px-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-surface text-semibold text-base w-full bg-brand px-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-secondary text-surface text-sm rounded disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-secondary text-surface text-sm rounded disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DataTable;
