import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import axiosClient from "../../api/axiosClient";
import { useLoader } from "../../context/PageLoaderContext";
import type { ItemLogType } from "../../types/ItemLogType";
import DataTable from "../../components/ui/DataTable";
import { useItemTooltip } from "../../context/ItemTooltipContext";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

type PlayerItemsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: ItemLogType[];
};

type SearchType = {
  itemId?: number;
  includeBank?: number;
  includeBackpack?: number;
};

const fetchItems = async (
  page: number,
  limit: number,
  search: SearchType | null,
  sorting: SortingState
): Promise<PlayerItemsResponse> => {
  const sortParam =
    sorting.length > 0
      ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
      : undefined;

  const { data } = await axiosClient.get("/auth/items", {
    params: { page, limit, ...search, sort: sortParam },
  });

  return data;
};

const ViewPlayerItems: React.FC = () => {
  const navigate = useNavigate();
  const { handleItemSlotClick } = useItemTooltip();
  const form = useForm<{ itemId: string }>({ defaultValues: { itemId: "" } });

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState<SearchType | null>(null);

  const [includeBackpack, setIncludeBackpack] = useState(true);
  const [includeBank, setIncludeBank] = useState(true);

  const { loading, setLoading } = useLoader();
  const location = useLocation();

  const itemId = new URLSearchParams(location.search).get("id") || "";

  const { data, isLoading, isFetching, isError } =
    useQuery<PlayerItemsResponse>({
      queryKey: [
        "items",
        globalFilter?.itemId,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting,
      ],
      queryFn: () => {
        setLoading(true);
        return fetchItems(
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting
        );
      },
      enabled: !!globalFilter?.itemId,
      staleTime: 5 * 60 * 1000,
      placeholderData: (prev) => prev,
    });

  const columns: ColumnDef<ItemLogType>[] = [
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const { source, ContainerID } = row.original;
        let bgColor = "bg-success";
        let sourceName = source;
        if (source === "POCKET") {
          bgColor = "bg-secondary";

          if (ContainerID != "0") {
            sourceName = "Bag " + ContainerID;
          } else {
            sourceName = "Backpack";
          }
        } else if (source === "BANK") {
          bgColor = "bg-muted";
        }
        return (
          <div
            className={`py-0.5 px-1 rounded-lg text-xs  text-white font-bold ${bgColor} w-[100px] text-center uppercase`}
          >
            {sourceName}
          </div>
        );
      },
    },
    {
      accessorKey: "CharacterName",
      header: "Player",
      cell: ({ row }) => {
        const { m_idPlayer, CharacterName } = row.original;

        return (
          <div className="flex flex-wrap gap-x-2">
            <div className="py-1 px-3 rounded-lg text-xs text-white font-semibold bg-brand">
              {CharacterName}
            </div>
            <button
              className="cursor-pointer text-brand"
              onClick={() => {
                navigate("/characters/inventory?id=" + m_idPlayer);
              }}
              rel="noopener noreferrer"
            >
              <HiMiniArrowTopRightOnSquare />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Details",
      cell: ({ row }) => {
        const { items } = row.original;
        return (
          <div className="flex flex-wrap gap-2 rounded-lg">
            {items.map((item, index) => (
              <div
                key={`view-item-${Math.floor(
                  Math.random() * 10000
                )} + ${index}`}
                className="h-8 w-8"
                onClick={(event) => handleItemSlotClick(item, event)}
              >
                <img
                  className="rounded-lg border border-accent-blue"
                  src={item.image?.toLowerCase()}
                />
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  const onSubmit = ({ itemId }: { itemId: string }) => {
    const params: SearchType = {
      itemId: Number(itemId),
      includeBackpack: includeBackpack ? 1 : 0,
      includeBank: includeBank ? 1 : 0,
    };
    setGlobalFilter(params);
  };

  useEffect(() => {
    if (itemId) {
      form.setValue("itemId", itemId);
      onSubmit({ itemId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8 max-w-full mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand">View Items</h1>
        <p className="mt-2 text-gray-600">
          View specific items from player's inventory.
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit((data) => {
          const newParams = new URLSearchParams(location.search);
          newParams.set("id", data.itemId);
          window.history.replaceState(null, "", `?${newParams.toString()}`);
          onSubmit(data);
        })}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-brand">
            Search by Item ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...form.register("itemId", { required: true })}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="bg-brand text-white px-4 py-2 rounded hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="mt-2 flex gap-x-4">
            <label className="inline-flex items-center space-x-2 text-sm text-brand">
              <input
                type="checkbox"
                checked={includeBackpack}
                onChange={(e) => setIncludeBackpack(e.target.checked)}
                className="form-checkbox"
              />
              <span>Backpack</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-sm text-brand">
              <input
                type="checkbox"
                checked={includeBank}
                onChange={(e) => setIncludeBank(e.target.checked)}
                className="form-checkbox"
              />
              <span>Bank</span>
            </label>
          </div>
        </div>
      </form>

      <DataTable
        data={data?.result ?? []}
        columns={columns}
        totalPages={data?.totalPages ?? 1}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          setPagination,
        }}
        sorting={sorting}
        onSortingChange={setSorting}
        filterInput={null}
        isLoading={isLoading || isFetching}
        isError={isError}
      />
    </div>
  );
};

export default ViewPlayerItems;
