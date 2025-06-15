import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useLoader } from "../../context/PageLoaderContext";
import { useLocation } from "react-router-dom";
import EquipmentSlots from "../../components/inventory/EquipmentSlots";
import InventorySlots from "../../components/inventory/InventorySlots";
import getInventoryItems from "../../helpers/inventorySlotHelper";

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
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const idPlayer = urlParams.get("id") || "";
  const form = useForm<{ m_idPlayer: string }>({
    defaultValues: { m_idPlayer: idPlayer },
  });
  const { loading, setLoading } = useLoader();
  const [showBackpack, setShowBackpack] = useState(true);
  const [showBank, setShowBank] = useState(true);
  const [
    { backpack1, backpack2, backpack3, bank, inventory, equipment },
    setInventoryData,
  ] = useState(defaultInventoryData);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (
    data: { m_idPlayer: string },
    showBackpack: boolean,
    showBank: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      let params = {};

      if (showBank) {
        params = { ...params, showBank: 1 };
      }

      if (showBackpack) {
        params = { ...params, showBackpack: 1 };
      }
      const res = await axiosClient.get(`/auth/inventory/${data.m_idPlayer}`, {
        params,
      });

      setInventoryData({
        backpack1: res.data.result.backpack1 || [],
        backpack2: res.data.result.backpack2 || [],
        backpack3: res.data.result.backpack3 || [],
        bank: res.data.result.bank || [],
        inventory: res.data.result.inventory || [],
        equipment: res.data.result.equipment || [],
      });
    } catch (err) {
      setError("Character not found or failed to fetch inventory.");
      setInventoryData(defaultInventoryData);
    } finally {
      setLoading(false);
    }
  };

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
    equipment.find((i) => i.slotIndex === slot);

  useEffect(() => {
    if (idPlayer) {
      form.setValue("m_idPlayer", idPlayer);
      onSubmit({ m_idPlayer: idPlayer }, showBackpack, showBank);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPlayer]);

  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8 max-w-full mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand">View Player Inventory</h1>
        <p className="mt-2 text-gray-600">
          View and explore player's inventory
        </p>
      </header>
      <form
        onSubmit={form.handleSubmit((data) => {
          const newParams = new URLSearchParams(location.search);
          newParams.set("id", data.m_idPlayer);
          window.history.replaceState(null, "", `?${newParams.toString()}`);

          onSubmit(data, showBackpack, showBank);
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
              {...form.register("m_idPlayer", { required: true })}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="bg-brand text-white px-4 py-2 rounded hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
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

      {error && (
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
          <p>{error}</p>
        </div>
      )}

      <div
        id="inventoryContainer"
        className="flex-wrap flex-col lg:flex-row md:flex md:gap-8 space-y-6 md:space-y-0"
      >
        {/* Equipment Section */}
        <div className="flex-1 space-y-2 ">
          {/* Main Equipment */}
          <EquipmentSlots
            items={getInventoryItems("MAIN_EQUIPMENT")}
            title="Main Equipment"
            equipmentBySlot={equipmentBySlot}
          />

          {/* Costume */}
          <EquipmentSlots
            items={getInventoryItems("COSTUME")}
            title="Costumes"
            equipmentBySlot={equipmentBySlot}
          />

          {/* Accessories */}
          <EquipmentSlots
            items={getInventoryItems("ACCESSORIES")}
            title="Accessories"
            equipmentBySlot={equipmentBySlot}
          />
        </div>

        {/* Inventory Section */}
        <InventorySlots title="Inventory" items={inventory} />

        {showBank && <InventorySlots title="Bank" items={bank} />}

        {showBackpack && (
          <div className="w-full gap-4 flex flex-col lg:flex-row items-stretch justify-center">
            {renderBackpack("Backpack 1", backpack1, 6)}
            {renderBackpack("Bag 1", backpack2)}
            {renderBackpack("Bag 2", backpack3)}
          </div>
        )}
      </div>
      {/* 
        {tooltipItem && (
          <InventoryTooltip
            tooltipRef={tooltipRef}
            tooltipPosition={tooltipPosition}
            tooltipItem={tooltipItem}
          />
        )} */}
    </div>
  );
};

export default ViewCharacterInventory;
