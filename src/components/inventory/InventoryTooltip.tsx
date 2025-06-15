import React, { useState } from "react";
import type { InventoryItem } from "../../types/InventoryItemType";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
import { PiEmptyFill } from "react-icons/pi";

type InventoryTooltipType = {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  tooltipPosition: {
    x: number;
    y: number;
  };
  tooltipItem: InventoryItem | null;
};

const InventoryTooltip: React.FC<InventoryTooltipType> = ({
  tooltipRef,
  tooltipPosition,
  tooltipItem,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (tooltipItem?.itemId && !copied) {
      navigator.clipboard.writeText(tooltipItem.itemId.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // hide after 1s
    }
  };

  return (
    <div
      key={`inventory-tooltip-${Math.floor(Math.random() * 10000)}`}
      ref={tooltipRef}
      className="absolute z-100 bg-white border border-brand rounded shadow-lg p-2 text-sm max-w-xs w-50 overflow-auto animate-fade-in-scale"
      style={{
        top: tooltipPosition.y,
        left: tooltipPosition.x,
        wordWrap: "break-word",
      }}
    >
      <div className="font-bold text-brand">
        {tooltipItem?.displayName}{" "}
        {tooltipItem?.enhancement &&
          tooltipItem?.enhancement > 0 &&
          `+${tooltipItem?.enhancement}`}
      </div>
      {tooltipItem?.itemId && (
        <div className="uppercase font-semibold text-secondary text-xs mb-1 flex gap-x-2 flex-wrap flex-row">
          <h1>{`Item ID: ${tooltipItem.itemId}`}</h1>
          <button className="cursor-pointer" onClick={handleCopy}>
            {copied ? <FaCheckCircle /> : <FaCopy />}
          </button>
        </div>
      )}
      {tooltipItem?.abilityDisplay && (
        <div className="text-xs font-semibold mb-1">
          {tooltipItem?.abilityDisplay}
        </div>
      )}
      {tooltipItem?.accessoryBonus &&
        tooltipItem?.accessoryBonus.map((bonus, index) => (
          <div
            key={`item-accessoryBonus--${Math.floor(
              Math.random() * 1000
            )}-${index}`}
            className="text-xs font-semibold mb-1"
          >
            {bonus}
          </div>
        ))}

      {/* Item stats */}
      {[tooltipItem?.stat1, tooltipItem?.stat2, tooltipItem?.stat3].map(
        (stat, index) =>
          !!stat && (
            <div
              key={`item-stat--${Math.floor(Math.random() * 1000)}-${index}`}
              className="text-xs"
            >
              {stat.label} +{stat.value}
            </div>
          )
      )}

      {/* Item awakenings */}
      {[tooltipItem?.awake1, tooltipItem?.awake2, tooltipItem?.awake3].map(
        (awake, index) =>
          !!awake && (
            <div
              key={`item-awake--${Math.floor(Math.random() * 1000)}-${index}`}
              className="text-blue-600 text-xs"
            >
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

      {tooltipItem?.originalModel && (
        <div className="p-2 my-2 w-full bg-accent-gold rounded-lg">
          <div className="flex items-center justify-center flex-col">
            {tooltipItem?.originalModel.image ? (
              <img
                src={tooltipItem?.originalModel.image}
                alt={tooltipItem?.originalModel.displayName}
                className="w-8 h-8 object-contain rounded-lg"
              />
            ) : (
              <span className="text-gray-200 text-xs">
                <PiEmptyFill size={24} />
              </span>
            )}
            <h1 className="text-brand font-bold text-sm">
              {tooltipItem?.originalModel.displayName}
            </h1>
            <p className="text-xs text-muted">Original Model</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTooltip;
