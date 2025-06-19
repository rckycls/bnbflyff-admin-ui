import React from "react";
import moment from "moment";
import type {
  ColumnDef,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";
import { debounce } from "lodash";
import DataTable from "../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import type { TradeLogType } from "../../types/TradeLogType";
import TradeLogDetail from "../../components/tradelogs/TradeLogDetail";
import { useModal } from "../../context/ModalContext";
import { RiExchangeBoxFill } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";

type TradeLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: TradeLogType[];
};

type SearchType = {
  idPlayer1?: string;
  idPlayer2?: string;
  ItemInder?: number;
};

const fetchTradeLogs = async (
  page: number,
  limit: number,
  search: SearchType | null,
  sorting: SortingState
): Promise<TradeLogsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
    : undefined;

  const res = await axiosClient.get("/auth/trade-logs", {
    params: { page, limit, ...search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  TradeID: true,
  TradeDt: true,
};

const ViewTradeLogs: React.FC = () => {
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState<SearchType | null>(
    null
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } = useQuery<TradeLogsResponse>({
    queryKey: [
      "tradeLogs",
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      sorting,
    ],
    queryFn: () =>
      fetchTradeLogs(
        pagination.pageIndex + 1,
        pagination.pageSize,
        globalFilter,
        sorting
      ),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  const columns: ColumnDef<TradeLogType>[] = [
    { accessorKey: "TradeID", header: "Trade ID" },
    {
      accessorKey: "TradeDt",
      header: "Trade Date",
      cell: ({ row }) => moment(row.original.TradeDt).format("LLLL"),
    },
    {
      accessorKey: "WorldID",
      header: "Players",
      cell: ({ row }) => {
        const tradeLog = row.original;
        return (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
            <button
              onClick={() => {
                navigate(
                  "/characters/inventory?id=" + tradeLog.details[0].idPlayer
                );
              }}
              className="px-2 py-0.5 bg-secondary text-white rounded-md text-xs min-w-[80px]"
              title={`View ${tradeLog.details[0].CharacterName} inventory`}
            >{`${tradeLog.details[0].CharacterName}`}</button>
            <FaExchangeAlt size={10} className="text-brand hidden md:flex" />
            <button
              onClick={() => {
                navigate(
                  "/characters/inventory?id=" + tradeLog.details[1].idPlayer
                );
              }}
              className="px-2 py-0.5 bg-secondary text-white rounded-md text-xs min-w-[80px]"
              title={`View ${tradeLog.details[1].CharacterName} inventory`}
            >{`${tradeLog.details[1].CharacterName}`}</button>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Details",
      cell: ({ row }) => {
        const tradeLog = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-gray-100 text-brand cursor-pointer"
              onClick={() => {
                showModal(
                  <TradeLogDetail {...tradeLog} />,
                  `Trade Window - ${tradeLog.TradeID}`
                );
              }}
            >
              <RiExchangeBoxFill size={22} />
            </button>
          </div>
        );
      },
    },
  ];

  const debouncedSearch = React.useMemo(
    () =>
      debounce((prop: string, value: string) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setGlobalFilter((oldFilter) => ({
          ...oldFilter,
          ...{ [prop]: value },
        }));
      }, 500),
    []
  );

  const searchInput = (
    <div className="flex flex-wrap gap-2 max-w-full w-full md:w-auto">
      <input
        type="text"
        placeholder="Player ID"
        className="px-4 py-2 border rounded max-w-full md:max-w-[160px] borded-text text-text"
        onChange={(e) => debouncedSearch("idPlayer1", e.target.value)}
      />
      <input
        type="text"
        placeholder="Player ID"
        className="px-4 py-2 border rounded max-w-full md:max-w-[160px] borded-text text-text"
        onChange={(e) => debouncedSearch("idPlayer2", e.target.value)}
      />
      <input
        type="text"
        placeholder="Item ID"
        className="px-4 py-2 border rounded max-w-full md:max-w-[160px] borded-text text-text"
        onChange={(e) => debouncedSearch("ItemIndex", e.target.value)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-brand">View Trade Logs</h1>
        <p className="mt-2 text-lg text-gray-600">
          Monitor player trade logs.
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
        isLoading={isLoading || isFetching}
        isError={isError}
      />
    </div>
  );
};

export default ViewTradeLogs;
