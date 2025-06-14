import React from "react";
import type {
  TradeDetailLogType,
  TradeItemLogType,
} from "../../types/TradeLogType";
import { useItemTooltip } from "../../context/ItemTooltipContext";

type TradeLogWindowType = {
  penya?: string;
  detail: TradeDetailLogType;
  items: TradeItemLogType[];
};

const TradeLogWindow: React.FC<TradeLogWindowType> = ({
  detail,
  items,
  penya = "0",
}) => {
  const { handleItemSlotClick } = useItemTooltip();
  return (
    <div className="relative w-full bg-white rounded-lg flex flex-col items-start justify-start">
      <div className="px-3 py-1 w-full text-left rounded-t-lg border-b border-b-accent-blue bg-accent-gold">
        <h1>
          <span className="font-semibold text-secondary">
            {detail.CharacterName}
          </span>
          <span className="text-secondary font-thin">
            {` (${detail.idPlayer})`}
          </span>
        </h1>
      </div>
      <div className="w-full flex flex-wrap gap-2 p-2 px-4 max-h-32 overflow-y-auto">
        {items.length ? (
          items.map((item) => (
            <div
              key={`trade-log-window-item-${Math.floor(Math.random() * 10000)}`}
              className="h-8 w-8"
              onClick={(event) =>
                handleItemSlotClick(
                  { ...item.itemData, itemId: item.itemId },
                  event
                )
              }
            >
              <img src={item.itemData.image?.toLowerCase()} />
            </div>
          ))
        ) : (
          <span className="text-muted text-sm">No items added.</span>
        )}
      </div>
      <div className="text-xs px-3 py-1 w-full text-left rounded-t-lg border-t border-t-accent-blue">
        <h1>
          <span className="font-semibold text-black">Penya:</span>
          <span className="text-black font-thin">{` ${penya}`}</span>
        </h1>
      </div>
    </div>
  );
};

export default TradeLogWindow;
