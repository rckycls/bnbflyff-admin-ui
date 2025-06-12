import React from "react";
import type { InventoryItem } from "../../types/InventoryItemType";
import InventorySlot from "./InventorySlot";

type InventorySlotsProps = {
  title: string;
  items: InventoryItem[];
  totalSlots?: number;
  handleSlotClick: (
    item?: InventoryItem,
    event?: React.MouseEvent<HTMLDivElement>
  ) => void;
};

const InventorySlots: React.FC<InventorySlotsProps> = ({
  title,
  items,
  handleSlotClick,
  totalSlots = 42,
}) => {
  return (
    <div className="flex-1">
      <h3 className="font-semibold mb-1 text-brand">{title}</h3>
      <div className="grid grid-cols-6 gap-y-4 border border-brand p-3 rounded bg-brand/10">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const item = items.find((i) => i.slotIndex === index);
          return (
            <InventorySlot item={item} handleSlotClick={handleSlotClick} />
          );
        })}
      </div>
    </div>
  );
};

export default InventorySlots;
