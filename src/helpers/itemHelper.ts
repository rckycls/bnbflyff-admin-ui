import type { InventoryItem } from "../types/InventoryItemType";

type SlotClickProps = {
  item?: InventoryItem;
  event?: React.MouseEvent<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  setTooltipItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setTooltipPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
};

const handleItemSlotClick = ({
  item,
  event,
  containerRef,
  tooltipRef,
  setTooltipItem,
  setTooltipPosition,
}: SlotClickProps) => {
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

export default handleItemSlotClick
