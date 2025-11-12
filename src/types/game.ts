export type CardType = "energy" | "water" | "greenery";

export interface Player {
  id: string;
  nickname: string;
  money: number;
  house_level: number;
  selected_card: CardType | null;
  inventory: ShopItem[];
  session_id?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: CardType;
  tier: number;
  level: number;
  basePrice: number;
  efficiency: number;
  ecology: number;
  description: string;
  image?: string;
}

export interface GameSession {
  code: string;
  players: Player[];
  isActive: boolean;
  createdAt: Date;
}
