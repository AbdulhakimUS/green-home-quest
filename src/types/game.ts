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
  status?: 'waiting' | 'active' | 'finished' | 'paused';
}
