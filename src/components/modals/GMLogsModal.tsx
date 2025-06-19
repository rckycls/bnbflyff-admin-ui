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

type CommandLog = {
  m_szWords: string;
  s_date: string;
};

type GMLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: CommandLog[];
};

const fetchGMLogs = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState,
  gmId: string
): Promise<GMLogsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get('/auth/gamemasters/' + gmId, {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  m_szWords: true,
  s_date: true,
};

const GMLogsModal: React.FC<{ gmId: string }> = ({ gmId }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } = useQuery<GMLogsResponse>({
    queryKey: [
      'GMLogs',
      gmId,
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      sorting,
    ],
    queryFn: () =>
      fetchGMLogs(
        pagination.pageIndex + 1,
        pagination.pageSize,
        globalFilter,
        sorting,
        gmId
      ),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  const columns: ColumnDef<CommandLog>[] = [
    { accessorKey: 'm_szWords', header: 'Command' },
    {
      accessorKey: 's_date',
      header: 'Date',
      cell: ({ row }) => {
        return `${moment(row.original.s_date, 'YYYYMMDDHHmmss').format(
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
      placeholder="Search commands..."
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

export default GMLogsModal;
