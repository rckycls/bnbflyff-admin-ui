import type { InventoryItem } from "./InventoryItemType";

export type ItemLogType = {
  m_idPlayer: string;
  ContainerID: string;
  source: string;
  CharacterName: string;
  items: InventoryItem[];
};
