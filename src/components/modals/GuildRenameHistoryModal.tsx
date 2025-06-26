import { useQuery } from '@tanstack/react-query';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import React, { useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import DataTable from '../ui/DataTable';
import moment from 'moment';

type ChangeGuildNameLogType = {
  idGuild: string;
  OldGuildName: string;
  NewGuildName: string;
  ChangeDt: string;
};

type ChangeGuildNameLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: ChangeGuildNameLogType[];
};

const fetchChangeGuildNameLogs = async (
  page: number,
  limit: number,
  sorting: SortingState,
  id: string
): Promise<ChangeGuildNameLogsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get(
    '/auth/guilds/' + id + '/change-name-logs',
    {
      params: { page, limit, sort: sortParam },
    }
  );
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  idPlayer: true,
  OldGuildName: true,
  NewGuildName: true,
  ChangeDt: true,
};

const GuildRenameHistoryModal: React.FC<{ id: string }> = ({ id }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<ChangeGuildNameLogsResponse>({
      queryKey: [
        'ChangeGuildNameLogs',
        id,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
      ],
      queryFn: () =>
        fetchChangeGuildNameLogs(
          pagination.pageIndex + 1,
          pagination.pageSize,
          sorting,
          id
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    });

  const columns: ColumnDef<ChangeGuildNameLogType>[] = [
    { accessorKey: 'idGuild', header: 'Guild ID' },
    { accessorKey: 'NewGuildName', header: 'New Guild Name' },
    { accessorKey: 'OldGuildName', header: 'Old Guild Name' },
    {
      accessorKey: 'ChangeDt',
      header: 'Change Date',
      cell: ({ row }) => {
        return `${moment(row.original.ChangeDt, 'YYYYMMDDHHmmss').format(
          'MMM D, Y HH:mm'
        )}`;
      },
    },
  ];

  useEffect(() => {
    refetch();
  }, [id]);
  
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
        filterInput={null}
        isLoading={isLoading || isFetching}
        isError={isError}
      />
    </div>
  );
};

export default GuildRenameHistoryModal;
