import React from "react";
import { PiEmptyFill } from "react-icons/pi";
import type { InventoryItem } from "../../types/InventoryItemType";
import { useItemTooltip } from "../../context/ItemTooltipContext";

type EquipmentLabelType = { slot: number; title: string };

type EquipmentSlotsProps = {
  title: string;
  items: EquipmentLabelType[];
  equipmentBySlot: (slotNum: number) => InventoryItem | undefined;
};

const EquipmentSlots: React.FC<EquipmentSlotsProps> = ({
  title,
  items,
  equipmentBySlot,
}) => {
  const { handleItemSlotClick } = useItemTooltip();
  console.log(title, items);
  return (
    <div>
      <h3 className="font-semibold mb-1 text-brand">{title}</h3>
      <div className="flex flex-start items-start gap-1 flex-wrap border border-brand p-3 rounded bg-brand/10">
        {items.map(({ slot, title }, index) => {
          const item = equipmentBySlot(slot);
          return (
            <div
              key={`equipment-item-${item?.itemId}-${index}`}
              className="flex-1 flex flex-col items-center"
            >
              <div
                onClick={(e) => handleItemSlotClick(item, e)}
                className="relative w-6 h-6 p-0.5 border border-brand/50 rounded bg-white flex items-center justify-center shadow-sm cursor-pointer"
                style={{ minWidth: 36, minHeight: 36 }}
              >
                {item?.image ? (
                  <img
                    src={item.image}
                    alt={item.displayName || "Item"}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-gray-200 text-xs">
                    <PiEmptyFill size={24} />
                  </span>
                )}
                {!!item?.quantity && item.quantity > 1 && (
                  <span
                    className="absolute bottom-0.5 right-0.5 text-black text-xs font-bold"
                    style={{ WebkitTextStroke: "0.3px #ffd66b" }}
                  >
                    {item.quantity}
                  </span>
                )}
              </div>
              {title && (
                <span className="text-xs text-center mt-1 text-[#3B4F52] font-semibold">
                  {title}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentSlots;
