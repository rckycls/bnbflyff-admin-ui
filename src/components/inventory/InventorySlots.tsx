import React from "react";
import type { InventoryItem } from "../../types/InventoryItemType";
import InventorySlot from "./InventorySlot";

type InventorySlotsProps = {
  title: string;
  items: InventoryItem[];
  totalSlots?: number;
};

const InventorySlots: React.FC<InventorySlotsProps> = ({
  title,
  items,
  totalSlots = 42,
}) => {
  return (
    <div className="flex-1">
      <h3 className="font-semibold mb-1 text-brand">{title}</h3>
      <div className="grid grid-cols-6 gap-y-4 border border-brand p-3 rounded bg-brand/10 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        {Array.from({
          length: totalSlots > items.length ? totalSlots : items.length,
        }).map((_, index) => {
          const item = items.find((i) => i.slotIndex === index);
          return (
            <InventorySlot
              key={`inventory-slot--${Math.floor(
                Math.random() * 10000
              )}_${index}`}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InventorySlots;
