import { useQuery } from '@tanstack/react-query';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import axiosClient from '../../api/axiosClient';
import { debounce } from 'lodash';
import DataTable from '../ui/DataTable';
import moment from 'moment';
import type { GuildMemberType } from '../../types/GuildType';

type GuildMembersResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: GuildMemberType[];
};

const fetchGuildMembers = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState,
  id: string
): Promise<GuildMembersResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get('/auth/guilds/' + id + '/members', {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  m_idPlayer: false,
  m_szName: true,
  m_nMemberLv: true,
  m_szAlias: false,
  m_nGiveGold: true,
  m_nGivePxp: true,
  CreateTime: true,
};

const GuildBankHistoryModal: React.FC<{ id: string }> = ({ id }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } =
    useQuery<GuildMembersResponse>({
      queryKey: [
        'GuildMembers',
        id,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting,
      ],
      queryFn: () =>
        fetchGuildMembers(
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting,
          id
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    });

  const columns: ColumnDef<GuildMemberType>[] = [
    { accessorKey: 'm_idPlayer', header: 'Player ID' },
    { accessorKey: 'm_szName', header: 'Member Name' },
    { accessorKey: 'm_nMemberLv', header: 'Level' },
    { accessorKey: 'm_szAlias', header: 'Nickname' },
    { accessorKey: 'm_nGiveGold', header: 'Penya Contribution' },
    { accessorKey: 'm_nGivePxp', header: 'Exp Contribution' },
    {
      accessorKey: 'CreateTime',
      header: 'Join Date',
      cell: ({ row }) => {
        return `${moment(row.original.CreateTime, 'YYYYMMDDHHmmss').format(
          'MMM D, Y HH:mm'
        )}`;
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
      placeholder="Search member..."
      className="px-4 py-2 border border-text text-text rounded"
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );

  return (
    <div className="flex flex-col items-center justify-between w-full rounded-lg p-2">
      <DataTable
        className="w-full text-xs font-semibold"
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

export default GuildBankHistoryModal;
