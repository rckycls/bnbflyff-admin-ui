import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { isAxiosError } from 'axios';
import type { InventoryItem } from '../../types/InventoryItemType';
import { useLoader } from '../../context/PageLoaderContext';
import InventorySlot from '../inventory/InventorySlot';

type GuildBankModalProps = {
  id: string;
};

const GuildBankModal: React.FC<GuildBankModalProps> = ({ id }) => {
  const { setLoading } = useLoader();

  const queryKey = ['guildBank', id];

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      setLoading(true);
      const res = await axiosClient.get(`/auth/guilds/${id}/bank`);
      setLoading(false);
      return res.data.result as InventoryItem[];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retry: (count, error: any) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        setLoading(false);
        return false;
      }
      return count < 2;
    },
  });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  return (
    <div className="w-full">
      {isLoading && (
        <p className="text-center text-sm text-gray-500">
          Loading guild bank...
        </p>
      )}

      {isError && (
        <div className="text-center text-red-600 text-sm">
          Failed to load guild bank inventory.
        </div>
      )}

      <div className="flex flex-wrap gap-2 bg-brand/20 min-h-[100px] p-2 rounded-lg">
        {data?.map((item, index) => (
          <InventorySlot
            key={`inventory-slot-bank--${Math.floor(
              Math.random() * 10000
            )}_${index}`}
            item={item}
          />
        ))}

        {!data?.length && (
          <div className="text-text text-xs">No items available</div>
        )}
      </div>
    </div>
  );
};

export default GuildBankModal;
