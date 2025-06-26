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
import type { InventoryItem } from '../../types/InventoryItemType';
import InventorySlot from '../inventory/InventorySlot';
import { useItemTooltip } from '../../context/ItemTooltipContext';

type GuildBankHistoryType = {
  m_idPlayer: string;
  m_szName: string;
  m_nGuildGold: number;
  m_Item: number;
  State: string;
  s_date: string;
  Item_count: number;
  itemDetails?: InventoryItem;
};

type GuildBankHistoriesResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: GuildBankHistoryType[];
};

const fetchGuildBankHistories = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState,
  id: string
): Promise<GuildBankHistoriesResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get('/auth/guilds/' + id + '/bank-history', {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  m_idPlayer: false,
  m_szName: true,
  m_nGuildGold: true,
  m_Item: true,
  State: true,
  Item_count: true,
  s_date: true,
};

const GuildBankHistoryModal: React.FC<{ id: string }> = ({ id }) => {
  const { handleItemSlotClick } = useItemTooltip();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } =
    useQuery<GuildBankHistoriesResponse>({
      queryKey: [
        'GuildBankHistories',
        id,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting,
      ],
      queryFn: () =>
        fetchGuildBankHistories(
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting,
          id
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    });

  const columns: ColumnDef<GuildBankHistoryType>[] = [
    { accessorKey: 'm_idPlayer', header: 'Player ID' },
    { accessorKey: 'm_szName', header: 'Member Name' },
    { accessorKey: 'm_nGuildGold', header: 'Gold ' },
    {
      accessorKey: 'm_Item',
      header: 'Item',
      cell: ({ row }) => {
        const { m_Item, itemDetails } = row.original;

        return (
          <div>
            {itemDetails?.displayName ? (
              <div className="flex flex-wrap gap-2 rounded-lg">
                <div
                  className="h-8 w-8"
                  onClick={(event) => handleItemSlotClick(itemDetails, event)}
                >
                  <img
                    className="rounded-lg border border-accent-blue"
                    src={itemDetails.imageFullPath?.toLowerCase()}
                  />
                </div>
              </div>
            ) : (
              m_Item
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'State',
      header: 'Type',
      cell: ({ row }) => {
        const { State } = row.original;
        return (
          <div
            className={`px-2 py-1 ${State === 'A' ? 'bg-success/20' : 'bg-danger/20'} text-text text-center rounded-lg text-[10px]`}
          >
            {State === 'A' ? 'ADD' : 'TAKE'}
          </div>
        );
      },
    },
    { accessorKey: 'Item_count', header: 'Item Count' },
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
