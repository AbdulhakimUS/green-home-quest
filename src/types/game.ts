export type CardType = "energy" | "water" | "greenery";

export interface Player {
  id: string;
  nickname: string;
  money: number;
  house_level: number;
  selected_card: CardType | null;
  inventory: ShopItem[];
  session_id?: string;
  oxygen: number;
  completed_missions: string[];
  claimed_treasures?: string[];
  claimed_item_rewards?: number[]; // пороги, за которые уже получена награда
  all_treasures_claimed?: boolean; // получена ли награда за все клады
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

export interface MarketListing {
  id: string;
  session_id: string;
  seller_id: string;
  seller_nickname: string;
  item: ShopItem;
  price: number;
  created_at: string;
}


export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  condition: (player: Player) => boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effect: string;
  duration: number;
  startedAt: number;
}

export interface GameSession {
  code: string;
  players: Player[];
  isActive: boolean;
  createdAt: Date;
  status?: "waiting" | "active" | "finished" | "paused";
  treasure_items?: string[];
  market_listings?: MarketListing[];
}
