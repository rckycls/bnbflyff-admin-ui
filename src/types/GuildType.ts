import type { InventoryItem } from './InventoryItemType';

export type GuildMemberType = {
  m_idPlayer: string;
  m_szName?: string;
  m_nMemberLv: number;
  m_szAlias?: string;
  m_nGiveGold?: string;
  m_nGivePxp?: string;
  CreateTime?: string;
};

export type GuildType = {
  m_idGuild: string;
  m_szGuild: string;
  m_nLevel?: number;
  m_nGuildGold?: number;
  m_nGuildPxp?: number;
  m_nWin?: number;
  m_nLose?: number;
  m_nSurrender?: number;
  m_nWinPoint?: number;
  CreateTime: string;
  members?: GuildMemberType[];
  leader?: GuildMemberType;
  bank: InventoryItem[];
};
