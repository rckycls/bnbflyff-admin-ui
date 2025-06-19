import React from 'react';
import moment from 'moment';
import type {
  ColumnDef,
  VisibilityState,
  SortingState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { debounce } from 'lodash';
import DataTable from '../../components/ui/DataTable';
import { useModal } from '../../context/ModalContext';
import type { GuildType } from '../../types/GuildType';
import { MdPeople } from 'react-icons/md';
import GuildMembersModal from '../../components/modals/GuildMembersModal';
import GuildBankModal from '../../components/modals/GuildBankModal';
import { GiBank } from 'react-icons/gi';

type GuildsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: GuildType[];
};

type SearchType = {
  m_szGuild?: string;
};

const fetchGuilds = async (
  page: number,
  limit: number,
  search: SearchType | null,
  sorting: SortingState
): Promise<GuildsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get('/auth/guilds', {
    params: { page, limit, ...search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  m_idGuild: true,
  m_szGuild: true,
  m_nLevel: true,
  m_nGuildGold: true,
  m_nGuildPxp: true,
  m_nWin: false,
  m_nLose: false,
  m_nSurrender: false,
  m_nWinPoint: false,
  CreateTime: true,
};

const ManageGuilds: React.FC = () => {
  const { showModal } = useModal();
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
  const { data, isLoading, isFetching, isError } = useQuery<GuildsResponse>({
    queryKey: [
      'Guilds',
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      sorting,
    ],
    queryFn: () =>
      fetchGuilds(
        pagination.pageIndex + 1,
        pagination.pageSize,
        globalFilter,
        sorting
      ),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  const columns: ColumnDef<GuildType>[] = [
    { accessorKey: 'm_idGuild', header: 'ID' },
    { accessorKey: 'm_szGuild', header: 'Name' },
    { accessorKey: 'm_nLevel', header: 'Level' },
    { accessorKey: 'm_nGuildGold', header: 'Penya' },
    { accessorKey: 'm_nGuildPxp', header: 'EXP' },
    { accessorKey: 'm_nWin', header: 'WINS' },
    { accessorKey: 'm_nLose', header: 'LOSES' },
    { accessorKey: 'm_nSurrender', header: 'SURRENDERS' },
    { accessorKey: 'm_nWinPoint', header: 'POINTS' },
    {
      accessorKey: 'CreateTime',
      header: 'Date Created',
      cell: ({ row }) => moment(row.original.CreateTime).format('LLLL'),
    },
    {
      accessorKey: 'actions',
      header: 'Details',
      cell: ({ row }) => {
        const { m_idGuild, m_szGuild } = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              title="View Members"
              onClick={() => {
                showModal(
                  <GuildMembersModal id={m_idGuild} />,
                  `Guild Members - ${m_szGuild}`,
                  'xl'
                );
              }}
              className="p-2 rounded hover:bg-gray-100 text-brand cursor-pointer"
            >
              <MdPeople size={22} />
            </button>
            <button
              title="View Bank"
              onClick={() => {
                showModal(
                  <GuildBankModal id={m_idGuild} />,
                  `Guild Bank - ${m_szGuild}`
                );
              }}
              className="p-2 rounded hover:bg-gray-100 text-brand cursor-pointer"
            >
              <GiBank size={22} />
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
        placeholder="Guild Name"
        className="px-4 py-2 border rounded max-w-full md:max-w-[160px] borded-text text-text"
        onChange={(e) => debouncedSearch('m_szName', e.target.value)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-brand">Manage Guilds</h1>
        <p className="mt-2 text-lg text-gray-600">Monitor and manage guilds</p>
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

export default ManageGuilds;
