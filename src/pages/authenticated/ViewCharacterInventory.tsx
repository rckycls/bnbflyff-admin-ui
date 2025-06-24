import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useLocation } from 'react-router-dom';
import EquipmentSlots from '../../components/inventory/EquipmentSlots';
import InventorySlots from '../../components/inventory/InventorySlots';
import getInventoryItems from '../../helpers/inventorySlotHelper';
import { useQuery } from '@tanstack/react-query';
import { useLoader } from '../../context/PageLoaderContext';
import debounce from 'lodash/debounce';
import { isAxiosError } from 'axios';

type InventoryItem = {
  slotIndex: number;
  itemId: number | null;
  quantity: number;
  enhancement?: number;
  image?: string;
  abilityDisplay?: string;
  displayName?: string;
  description?: string;
  stat1?: { label: string; value: string };
  stat2?: { label: string; value: string };
  stat3?: { label: string; value: string };
  awake1?: { label: string; value: string };
  awake2?: { label: string; value: string };
  awake3?: { label: string; value: string };
  accessoryBonus?: string[];
};

type EquipmentItem = InventoryItem;

const defaultInventoryData = {
  backpack1: [] as InventoryItem[],
  backpack2: [] as InventoryItem[],
  backpack3: [] as InventoryItem[],
  bank: [] as InventoryItem[],
  inventory: [] as InventoryItem[],
  equipment: [] as EquipmentItem[],
};

const ViewCharacterInventory: React.FC = () => {
  const { setLoading } = useLoader();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const idPlayer = urlParams.get('id') || '';
  const [fetchedPlayerIds, setFetchedPlayerIds] = useState<Set<string>>(
    new Set()
  );

  const form = useForm<{ m_idPlayer: string }>({
    defaultValues: { m_idPlayer: idPlayer },
  });

  const [showBackpack, setShowBackpack] = useState(true);
  const [showBank, setShowBank] = useState(true);

  const m_idPlayer = form.watch('m_idPlayer');

  const queryKey = ['inventory', m_idPlayer, showBank, showBackpack];

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey,
    enabled: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {};
      if (showBank) params.showBank = 1;
      if (showBackpack) params.showBackpack = 1;

      const res = await axiosClient.get(`/auth/inventory/${m_idPlayer}`, {
        params,
      });

      setLoading(false);
      return res.data.result;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retry: (failCount, error: any) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        setLoading(false);
        return false;
      }
      return failCount < 3;
    },
  });

  const debouncedFetch = useMemo(() => {
    return debounce((id: string) => {
      if (!id) return;

      if (!fetchedPlayerIds.has(id)) {
        refetch();
        setFetchedPlayerIds((prev) => new Set(prev).add(id));
      }
    }, 500);
  }, [refetch, fetchedPlayerIds]);

  useEffect(() => {
    debouncedFetch(m_idPlayer);
  }, [m_idPlayer, debouncedFetch]);

  useEffect(() => {
    if (idPlayer) {
      form.setValue('m_idPlayer', idPlayer);
    }
  }, [idPlayer, form]);

  const {
    backpack1 = [],
    backpack2 = [],
    backpack3 = [],
    bank = [],
    inventory = [],
    equipment = [],
  } = data || defaultInventoryData;

  const renderBackpack = (
    title: string,
    backpack: InventoryItem[],
    length: number = 24
  ) => {
    return (
      <InventorySlots totalSlots={length} title={title} items={backpack} />
    );
  };

  const equipmentBySlot = (slot: number) =>
    equipment.find((i: InventoryItem) => i.slotIndex === slot);

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8 max-w-full mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand">View Player Inventory</h1>
        <p className="mt-2 text-gray-600">
          {"View and explore player's inventory"}
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit((data) => {
          const newParams = new URLSearchParams(location.search);
          newParams.set('id', data.m_idPlayer);
          window.history.replaceState(null, '', `?${newParams.toString()}`);
          refetch();
        })}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-brand">
            Search by ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...form.register('m_idPlayer', { required: true })}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="bg-brand text-white px-4 py-2 rounded hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <label className="inline-flex items-center space-x-2 text-sm text-brand">
              <input
                type="checkbox"
                checked={showBackpack}
                onChange={(e) => setShowBackpack(e.target.checked)}
                className="form-checkbox"
              />
              <span>Show Backpack</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-sm text-brand">
              <input
                type="checkbox"
                checked={showBank}
                onChange={(e) => setShowBank(e.target.checked)}
                className="form-checkbox"
              />
              <span>Show Bank</span>
            </label>
          </div>
        </div>
      </form>

      {isError && (
        <div className="flex items-center gap-2 text-secondary bg-secondary-200 border border-secondary-300 rounded p-3 text-sm md:text-base font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
            />
          </svg>
          <p>Character not found or failed to fetch inventory.</p>
        </div>
      )}

      {!isError && (
        <div
          id="inventoryContainer"
          className="flex-wrap flex-col lg:flex-row md:flex md:gap-8 space-y-6 md:space-y-0"
        >
          <div className="flex-1 space-y-2 ">
            <EquipmentSlots
              items={getInventoryItems('MAIN_EQUIPMENT')}
              title="Main Equipment"
              equipmentBySlot={equipmentBySlot}
            />
            <EquipmentSlots
              items={getInventoryItems('COSTUME')}
              title="Costumes"
              equipmentBySlot={equipmentBySlot}
            />
            <EquipmentSlots
              items={getInventoryItems('ACCESSORIES')}
              title="Accessories"
              equipmentBySlot={equipmentBySlot}
            />
          </div>

          <InventorySlots title="Inventory" items={inventory} />

          {showBank && <InventorySlots title="Bank" items={bank} />}

          {showBackpack && (
            <div className="w-full gap-4 flex flex-col lg:flex-row items-stretch justify-center">
              {renderBackpack('Backpack 1', backpack1, 6)}
              {renderBackpack('Bag 1', backpack2)}
              {renderBackpack('Bag 2', backpack3)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewCharacterInventory;
