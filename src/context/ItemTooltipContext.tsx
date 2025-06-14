import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { InventoryItem } from "../types/InventoryItemType";
import InventoryTooltip from "../components/inventory/InventoryTooltip";

type ItemTooltipContextType = {
  tooltipItem: InventoryItem | null;
  setTooltipItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  tooltipPosition: { x: number; y: number };
  setTooltipPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  tooltipRef: RefObject<HTMLDivElement | null>;
  modalRef: RefObject<HTMLDivElement | null>;
  handleItemSlotClick: (
    item?: InventoryItem,
    event?: React.MouseEvent<HTMLDivElement>
  ) => void;
};

const ItemTooltipContext = createContext<ItemTooltipContextType | undefined>(
  undefined
);

export const ItemTooltipProvider = ({ children }: { children: ReactNode }) => {
  const [tooltipItem, setTooltipItem] = useState<InventoryItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleItemSlotClick = (
    item?: InventoryItem,
    event?: React.MouseEvent<HTMLDivElement>
  ) => {
    event?.stopPropagation();
    if (!item || !item.displayName || !containerRef.current || !event) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    setTooltipPosition({ x: mouseX + 12, y: mouseY + 12 });

    setTooltipItem(null);

    setTimeout(() => {
      setTooltipItem(item);
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(mouseEvent.target as Node)
      ) {
        setTooltipItem(null);
      }
    };
    document?.addEventListener("click", handleClickOutside);

    return () => document?.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <ItemTooltipContext.Provider
      value={{
        modalRef,
        tooltipItem,
        setTooltipItem,
        tooltipRef,
        tooltipPosition,
        setTooltipPosition,
        handleItemSlotClick,
      }}
    >
      <div ref={containerRef}>
        {children}
        {tooltipItem && (
          <InventoryTooltip
            tooltipRef={tooltipRef}
            tooltipPosition={tooltipPosition}
            tooltipItem={tooltipItem}
          />
        )}
      </div>
    </ItemTooltipContext.Provider>
  );
};

export const useItemTooltip = () => {
  const context = useContext(ItemTooltipContext);
  if (context === undefined) {
    throw new Error(
      "useItemTooltip must be used within an ItemTooltipProvider"
    );
  }
  return context;
};
