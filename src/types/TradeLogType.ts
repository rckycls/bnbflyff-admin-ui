import type { InventoryItem } from "./InventoryItemType";

export type TradeItemLogType = {
  itemId: number;
  idPlayer: string;
  itemData: InventoryItem;
};

export type TradeDetailLogType = {
  idPlayer: string;
  penya: string;
  PlayerIP: string;
  CharacterName: string;
};

export type TradeLogType = {
  WorldID: number;
  TradeID: number;
  TradeDt: string;
  details: TradeDetailLogType[];
  items: TradeItemLogType[];
};
