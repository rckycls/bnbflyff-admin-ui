import { useEffect, useRef, useState, type RefObject } from "react";
import type { InventoryItem } from "../types/InventoryItemType";

export type UseItemTooltipReturn = {
  tooltipItem: InventoryItem | null;
  setTooltipItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  tooltipPosition: { x: number; y: number };
  setTooltipPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  tooltipRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  handleItemSlotClick: (
    item?: InventoryItem,
    event?: React.MouseEvent<HTMLDivElement>
  ) => void;
  handleClickOutside: (elementId: string) => void;
};

const useItemTooltip = (): UseItemTooltipReturn => {
  const [tooltipItem, setTooltipItem] = useState<InventoryItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleItemSlotClick = (
    item?: InventoryItem,
    event?: React.MouseEvent<HTMLDivElement>
  ) => {
    event?.stopPropagation();
    if (!item || !item.displayName || !containerRef?.current) return;

    const slotElement = event?.currentTarget as HTMLDivElement;
    const slotRect = slotElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const offsetX = slotRect.left - containerRect.left;
    const offsetY = slotRect.top - containerRect.top;

    setTooltipItem(item);
    setTimeout(() => {
      if (!tooltipRef.current || !containerRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const containerWidth = containerRef.current.offsetWidth;

      let adjustedX = offsetX + slotRect.width + 4;

      if (adjustedX + tooltipWidth > containerWidth) {
        adjustedX = offsetX - tooltipWidth - 4;
        if (adjustedX < 0) adjustedX = containerWidth - tooltipWidth - 4;
      }

      setTooltipPosition({
        x: adjustedX,
        y: offsetY,
      });
    }, 0);
  };

  const handleClickOutside = (elementId?: string) => {
    console.log(elementId);
    const listener = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(mouseEvent.target as Node)
      ) {
        setTooltipItem(null);
      }
    };

    const doc = elementId ? document.getElementById(elementId) : document;
    doc?.addEventListener("click", listener);

    return () => doc?.removeEventListener("click", listener);
  };

  return {
    tooltipItem,
    setTooltipItem,
    tooltipPosition,
    setTooltipPosition,
    tooltipRef,
    containerRef,
    handleItemSlotClick,
    handleClickOutside,
  };
};

export default useItemTooltip;
