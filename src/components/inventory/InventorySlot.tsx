import React from "react";
import type { InventoryItem } from "../../types/InventoryItemType";
import { PiEmptyFill } from "react-icons/pi";
import { useItemTooltip } from "../../context/ItemTooltipContext";

type InventorySlotType = {
  item?: InventoryItem;
};

const InventorySlot: React.FC<InventorySlotType> = ({ item }) => {
  const { handleItemSlotClick } = useItemTooltip();
  return (
    <div
      onClick={(e) => handleItemSlotClick(item, e)}
      className="relative w-6 h-6 p-0.5 border border-brand/50 rounded bg-white flex items-center justify-center shadow-sm cursor-pointer"
      style={{ minWidth: 36, minHeight: 36 }}
    >
      {item?.image ? (
        <img
          src={item.image}
          alt={item.displayName}
          className="w-10 h-10 object-contain"
        />
      ) : (
        <span className="text-gray-200 text-xs">
          <PiEmptyFill size={24} />
        </span>
      )}
      {!!item?.quantity && item?.quantity > 1 && (
        <span
          className="absolute bottom-0.5 right-0.5 text-black  text-xs font-bold"
          style={{ WebkitTextStroke: "0.3px #ffd66b" }}
        >
          {item.quantity}
        </span>
      )}
    </div>
  );
};

export default InventorySlot;
