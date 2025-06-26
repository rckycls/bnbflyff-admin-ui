import { useQuery } from '@tanstack/react-query';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import axiosClient from '../../api/axiosClient';
import DataTable from '../ui/DataTable';
import moment from 'moment';

type ChangeNameLogType = {
  idPlayer: string;
  OldCharName: string;
  NewCharName: string;
  ChangeDt: string;
};

type ChangeNameLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: ChangeNameLogType[];
};

const fetchChangeNameLogs = async (
  page: number,
  limit: number,
  sorting: SortingState,
  id: string
): Promise<ChangeNameLogsResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get(
    '/auth/characters/' + id + '/change-name-logs',
    {
      params: { page, limit, sort: sortParam },
    }
  );
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  idPlayer: true,
  OldCharName: true,
  NewCharName: true,
  ChangeDt: true,
};

const CharacterRenameHistoryModal: React.FC<{ id: string }> = ({ id }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } =
    useQuery<ChangeNameLogsResponse>({
      queryKey: [
        'ChangeNameLogs',
        id,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
      ],
      queryFn: () =>
        fetchChangeNameLogs(
          pagination.pageIndex + 1,
          pagination.pageSize,
          sorting,
          id
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    });

  const columns: ColumnDef<ChangeNameLogType>[] = [
    { accessorKey: 'idPlayer', header: 'Player ID' },
    { accessorKey: 'OldCharName', header: 'Old Character Name' },
    { accessorKey: 'NewCharName', header: 'New Character Name' },
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

export default CharacterRenameHistoryModal;
