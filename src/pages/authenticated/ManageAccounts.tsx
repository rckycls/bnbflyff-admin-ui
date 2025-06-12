import React from "react";
import type {
  ColumnDef,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";
import { debounce } from "lodash";
import DataTable from "../../components/ui/DataTable";

type Account = {
  account: string;
  password: string;
  isuse: string;
  id: number;
  realname?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  // Add more fields if needed
};

type AccountsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: Account[];
};

const fetchAccounts = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState
): Promise<AccountsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id} ${sorting[0].desc ? "desc" : "asc"}`
    : undefined;

  const res = await axiosClient.get("/auth/accounts", {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  account: true,
  isuse: true,
  password: false,
  id: false,
  realname: false,
  email: false,
  created_at: false,
  updated_at: false,
};

const ManageAccounts: React.FC = () => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data, isLoading, isError } = useQuery<AccountsResponse>({
    queryKey: [
      "accounts",
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      sorting,
    ],
    queryFn: () =>
      fetchAccounts(
        pagination.pageIndex + 1,
        pagination.pageSize,
        globalFilter,
        sorting
      ),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  const columns: ColumnDef<Account>[] = [
    { accessorKey: "account", header: "Account" },
    { accessorKey: "isuse", header: "Status" },
    { accessorKey: "password", header: "Password" },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "realname", header: "Real Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue() as string).toLocaleString() : "",
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue() as string).toLocaleString() : "",
    },
  ];

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setGlobalFilter(value);
      }, 300),
    []
  );

  const searchInput = (
    <input
      type="text"
      placeholder="Search accounts..."
      className="px-4 py-2 border rounded"
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-brand">Manage Accounts</h1>
        <p className="mt-2 text-lg text-gray-600">
          View and manage player accounts.
        </p>
      </header>

      <DataTable
        data={data?.result ?? []}
        columns={columns}
        totalPages={data?.totalPages ?? 1}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          setPagination,
        }}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        sorting={sorting}
        onSortingChange={setSorting}
        searchInput={searchInput}
        filterInput={null}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default ManageAccounts;
