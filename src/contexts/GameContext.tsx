import React, { createContext, useContext, useState, ReactNode } from "react";
import { Player, CardType, ShopItem } from "@/types/game";

interface GameContextType {
  player: Player | null;
  isAdmin: boolean;
  gameCode: string | null;
  allPlayers: Player[];
  setPlayer: (player: Player | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setGameCode: (code: string | null) => void;
  updateMoney: (amount: number) => void;
  selectCard: (card: CardType) => void;
  purchaseItem: (item: ShopItem) => void;
  addPlayer: (player: Player) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  const updateMoney = (amount: number) => {
    if (player) {
      const newPlayer = { ...player, money: player.money + amount };
      setPlayer(newPlayer);
      setAllPlayers(prev => 
        prev.map(p => p.id === player.id ? newPlayer : p)
      );
    }
  };

  const selectCard = (card: CardType) => {
    if (player) {
      const newPlayer = { ...player, selectedCard: card };
      setPlayer(newPlayer);
      setAllPlayers(prev => 
        prev.map(p => p.id === player.id ? newPlayer : p)
      );
    }
  };

  const purchaseItem = (item: ShopItem) => {
    if (player && player.money >= item.basePrice) {
      const existingItem = player.inventory.find(
        i => i.id === item.id && i.category === item.category
      );
      
      let newInventory;
      let cost = item.basePrice;
      
      if (existingItem) {
        const newLevel = existingItem.level + 1;
        cost = Math.floor(item.basePrice * Math.pow(1.3, newLevel - 1));
        newInventory = player.inventory.map(i =>
          i.id === item.id && i.category === item.category
            ? { ...i, level: newLevel }
            : i
        );
      } else {
        newInventory = [...player.inventory, { ...item, level: 1 }];
      }

      const newPlayer = {
        ...player,
        money: player.money - cost,
        inventory: newInventory,
        houseLevel: Math.min(10, player.houseLevel + 1)
      };
      
      setPlayer(newPlayer);
      setAllPlayers(prev => 
        prev.map(p => p.id === player.id ? newPlayer : p)
      );
    }
  };

  const addPlayer = (newPlayer: Player) => {
    setAllPlayers(prev => [...prev, newPlayer]);
  };

  return (
    <GameContext.Provider
      value={{
        player,
        isAdmin,
        gameCode,
        allPlayers,
        setPlayer,
        setIsAdmin,
        setGameCode,
        updateMoney,
        selectCard,
        purchaseItem,
        addPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
