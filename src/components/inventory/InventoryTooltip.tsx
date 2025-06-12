import React, { useEffect } from "react";
import type { InventoryItem } from "../../types/InventoryItemType";

type InventoryTooltipType = {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  tooltipPosition: {
    x: number;
    y: number;
  };
  tooltipItem: InventoryItem | null;
  setTooltipItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
};

const InventoryTooltip: React.FC<InventoryTooltipType> = ({
  tooltipRef,
  tooltipPosition,
  tooltipItem,
  setTooltipItem,
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setTooltipItem(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 bg-white border border-brand rounded shadow-lg p-2 text-sm max-w-xs w-50 overflow-auto animate-fade-in-scale"
      style={{
        top: tooltipPosition.y,
        left: tooltipPosition.x,
        wordWrap: "break-word",
      }}
    >
      <div className="font-bold mb-1 text-brand">
        {tooltipItem?.displayName}{" "}
        {tooltipItem?.enhancement &&
          tooltipItem?.enhancement > 0 &&
          `+${tooltipItem?.enhancement}`}
      </div>
      {tooltipItem?.abilityDisplay && (
        <div className="text-xs font-semibold mb-1">
          {tooltipItem?.abilityDisplay}
        </div>
      )}
      {tooltipItem?.accessoryBonus &&
        tooltipItem?.accessoryBonus.map((bonus) => (
          <div className="text-xs font-semibold mb-1">{bonus}</div>
        ))}

      {/* Item stats */}
      {[tooltipItem?.stat1, tooltipItem?.stat2, tooltipItem?.stat3].map(
        (stat) =>
          !!stat && (
            <div className="text-xs">
              {stat.label} +{stat.value}
            </div>
          )
      )}

      {/* Item awakenings */}
      {[tooltipItem?.awake1, tooltipItem?.awake2, tooltipItem?.awake3].map(
        (awake) =>
          !!awake && (
            <div className="text-blue-600 text-xs">
              {awake.label} {awake.value}
            </div>
          )
      )}

      {/* Item description */}
      {tooltipItem?.description && (
        <div className="text-gray-500 italic text-xs">
          {tooltipItem?.description}
        </div>
      )}
    </div>
  );
};

export default InventoryTooltip;
