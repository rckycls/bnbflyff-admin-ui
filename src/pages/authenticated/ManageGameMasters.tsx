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
import moment from "moment";
import { MdOutlineOpenInBrowser } from "react-icons/md";
import { useModal } from "../../context/ModalContext";
import GMLogsModal from "../../components/modals/GMLogsModal";

type CommandLog = {
  m_szWords: string;
  s_date: string;
};

type CommandLogs = {
  createitem: CommandLog;
  SetRandomOption: CommandLog;
  ResistItem: CommandLog;
  getgold: CommandLog;
  createitem2: CommandLog;
  createnpc: CommandLog;
};

type GMCharacter = {
  m_idPlayer: string;
  account: string;
  CharacterName: string;
  m_chAuthority: string;
  CreateTime: string;
  logs: CommandLogs;
};

type GMCharactersResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: GMCharacter[];
};

const fetchGMCharacters = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState
): Promise<GMCharactersResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
    : undefined;

  const res = await axiosClient.get("/auth/gamemasters", {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  m_idPlayer: false,
  account: true,
  m_szName: true,
  m_chAuthority: true,
  CreateTime: false,
};

const ManageGameMasters: React.FC = () => {
  const { showModal } = useModal();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } =
    useQuery<GMCharactersResponse>({
      queryKey: [
        "gmCharacters",
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting,
      ],
      queryFn: () =>
        fetchGMCharacters(
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    });

  const columns: ColumnDef<GMCharacter>[] = [
    { accessorKey: "m_idPlayer", header: "ID" },
    { accessorKey: "account", header: "Account" },
    { accessorKey: "CharacterName", header: "Character Name" },
    { accessorKey: "m_chAuthority", header: "Auth" },
    {
      accessorKey: "CreateTime",
      header: "Create Time",
      cell: ({ getValue }) =>
        moment(new Date(getValue() as string).toLocaleString()).format("LLLL"),
    },
    {
      accessorKey: "NS_recentGMCommands",
      header: "Recent GM Commands",
      cell: ({ row }) => {
        const { logs, m_idPlayer } = row.original;
        const {
          createitem,
          createnpc,
          createitem2,
          ResistItem,
          getgold,
          SetRandomOption,
        } = logs;

        if (
          !createitem &&
          !createnpc &&
          !createitem2 &&
          !ResistItem &&
          !getgold &&
          !SetRandomOption
        ) {
          return <div>No Recent GM Commands yet</div>;
        }

        return (
          <div className="flex flex-col gap-2">
            {[
              createitem,
              SetRandomOption,
              createnpc,
              createitem2,
              ResistItem,
              getgold,
            ].map(
              (log, index) =>
                log && (
                  <div
                    key={`log_gm_${Math.floor(Math.random() * 10000)}-${index}`}
                    className="flex flex-row text-xs gap-x-1 rounded-lg text-text"
                  >
                    <h1 className="font-semibold">{log.m_szWords}</h1>
                    <h2 className="text-muted">
                      {`(${moment(log.s_date, "YYYYMMDDHHmmss").format(
                        "MMM D, Y HH:mm"
                      )})`}
                    </h2>
                  </div>
                )
            )}
            <div>
              <button
                className="py-1 bg-transparent font-bold text-brand text-xs flex items-center justify-center gap-x-1"
                onClick={() => {
                  showModal(<GMLogsModal gmId={m_idPlayer} />, `GM Logs`, "xl");
                }}
              >
                <MdOutlineOpenInBrowser size={16} />
                <p>View All </p>
              </button>
            </div>
          </div>
        );
      },
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
      placeholder="Search characters..."
      className="px-4 py-2 border rounded borded-text text-text"
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-brand">Manage Game Masters</h1>
        <p className="mt-2 text-lg text-gray-600">
          View and manage game master commands and logs.
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

export default ManageGameMasters;
