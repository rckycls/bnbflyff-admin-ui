export type InventoryItem = {
  slotIndex: number;
  itemId: number | null;
  quantity: number;
  enhancement?: number;
  image?: string;
  imageFullPath?: string;
  abilityDisplay?: string;
  displayName?: string;
  description?: string;
  stat1?: { label: string; value: string };
  stat2?: { label: string; value: string };
  stat3?: { label: string; value: string };
  awake1?: { label: string; value: string };
  awake2?: { label: string; value: string };
  awake3?: { label: string; value: string };
  accessoryBonus?: string[];
};
