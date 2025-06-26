import React from 'react';
import type {
  ColumnDef,
  VisibilityState,
  SortingState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { debounce } from 'lodash';
import DataTable from '../../components/ui/DataTable';
import {
  FaExchangeAlt,
  FaEdit,
  FaTrashAlt,
  FaGavel,
  FaScroll,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GiNinjaArmor } from 'react-icons/gi';
import { useModal } from '../../context/ModalContext';
import CharacterRenameModal from '../../components/modals/CharacterRenameModal';
import CharacterRenameHistoryModal from '../../components/modals/CharacterRenameHistoryModal';

type Character = {
  m_idPlayer: string;
  serverindex: string;
  account: string;
  m_szName: string;
  playerslot: number;
  m_nLevel: number;
  m_nJob: number;
  m_nHitPoint: number;
  m_nManaPoint: number;
  m_nFatiguePoint: number;
  isblock: string | null;
  CreateTime: string;
};

type CharactersResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  result: Character[];
};

const fetchCharacters = async (
  page: number,
  limit: number,
  search: string,
  sorting: SortingState
): Promise<CharactersResponse> => {
  const sortParam = sorting.length
    ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const res = await axiosClient.get('/auth/characters', {
    params: { page, limit, search, sort: sortParam },
  });
  return res.data;
};

const defaultColumnVisibility: VisibilityState = {
  account: true,
  m_szName: true,
  m_nLevel: true,
  m_nJob: true,
  playerslot: false,
  m_nHitPoint: false,
  m_nManaPoint: false,
  m_nFatiguePoint: false,
  isblock: false,
  CreateTime: false,
};

const ManageCharacters: React.FC = () => {
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isFetching, isError } = useQuery<CharactersResponse>(
    {
      queryKey: [
        'characters',
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting,
      ],
      queryFn: () =>
        fetchCharacters(
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting
        ),
      placeholderData: (prev) => prev,
      staleTime: 5 * 60 * 1000,
    }
  );

  const columns: ColumnDef<Character>[] = [
    { accessorKey: 'account', header: 'Account' },
    { accessorKey: 'm_idPlayer', header: 'ID' },
    { accessorKey: 'm_szName', header: 'Name' },
    { accessorKey: 'm_nLevel', header: 'Level' },
    { accessorKey: 'm_nJob', header: 'Job' },
    { accessorKey: 'playerslot', header: 'Player Slot' },
    { accessorKey: 'm_nHitPoint', header: 'HP' },
    { accessorKey: 'm_nManaPoint', header: 'MP' },
    { accessorKey: 'm_nFatiguePoint', header: 'Fatigue' },
    { accessorKey: 'isblock', header: 'Blocked' },
    {
      accessorKey: 'CreateTime',
      header: 'Created At',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const { m_idPlayer, m_szName } = row.original;
        return (
          <div className="flex items-center flex-wrap gap-2">
            <button
              className="p-2 rounded hover:bg-brand/10 text-brand cursor-pointer"
              onClick={() => navigate('/characters/' + row.original.m_idPlayer)}
              title="Ban"
            >
              <FaGavel size={18} />
            </button>
            <button
              className="p-2 rounded hover:bg-brand/10 text-brand cursor-pointer"
              onClick={() => {
                showModal(
                  <CharacterRenameModal
                    m_idPlayer={m_idPlayer}
                    m_szName={m_szName}
                  />,
                  `Rename - ${m_szName} - ${m_idPlayer}`
                );
              }}
              title="Rename"
            >
              <FaEdit size={18} />
            </button>
            <button
              className="p-2 rounded hover:bg-brand/10 text-brand cursor-pointer"
              onClick={() => {
                showModal(
                  <CharacterRenameHistoryModal id={m_idPlayer} />,
                  `Rename History - ${m_szName} - ${m_idPlayer}`,
                  'xl'
                );
              }}
              title="Change Name History"
            >
              <FaScroll size={18} />
            </button>
            <button
              className="p-2 rounded hover:bg-brand/10 text-brand cursor-pointer"
              onClick={() =>
                navigate('/trade-logs?id=' + row.original.m_idPlayer)
              }
              title="Trade Logs"
            >
              <FaExchangeAlt size={18} />
            </button>
            <button
              className="p-2 rounded hover:bg-brand/10 text-brand cursor-pointer"
              onClick={() =>
                navigate('/characters/inventory?id=' + row.original.m_idPlayer)
              }
              title="View Inventory"
            >
              <GiNinjaArmor size={22} />
            </button>
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
        <h1 className="text-4xl font-bold text-brand">Manage Characters</h1>
        <p className="mt-2 text-lg text-gray-600">
          View and manage player characters.
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

export default ManageCharacters;
