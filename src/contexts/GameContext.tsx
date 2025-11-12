import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CardType, ShopItem } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Player {
  id: string;
  session_id: string;
  nickname: string;
  money: number;
  house_level: number;
  selected_card: CardType | null;
  inventory: ShopItem[];
}

interface GameSession {
  id: string;
  code: string;
  status: 'waiting' | 'active' | 'finished';
  timer_duration: number;
  started_at: string | null;
}

interface GameContextType {
  player: Player | null;
  isAdmin: boolean;
  gameCode: string | null;
  allPlayers: Player[];
  gameSession: GameSession | null;
  timeRemaining: number | null;
  updateMoney: (amount: number) => void;
  selectCard: (card: CardType) => void;
  purchaseItem: (item: ShopItem) => Promise<void>;
  startGame: (duration: number) => Promise<void>;
  setPlayer: (player: Player | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setGameSession: (session: GameSession | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Подписка на изменения игроков
  useEffect(() => {
    if (!gameSession) return;

    const loadPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', gameSession.id);
      
      if (data) {
        const players = data.map(p => ({
          ...p,
          selected_card: (p.selected_card as CardType) || null,
          inventory: (p.inventory as any as ShopItem[]) || []
        }));
        setAllPlayers(players);
        
        if (player) {
          const updatedPlayer = players.find(p => p.id === player.id);
          if (updatedPlayer) {
            setPlayer(updatedPlayer);
          }
        }
      }
    };

    loadPlayers();

    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${gameSession.id}`
        },
        () => {
          loadPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Подписка на изменения сессии
  useEffect(() => {
    if (!gameSession) return;

    const channel = supabase
      .channel('session-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameSession.id}`
        },
        (payload) => {
          setGameSession(payload.new as GameSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Таймер
  useEffect(() => {
    if (!gameSession || gameSession.status !== 'active' || !gameSession.started_at) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(gameSession.started_at!).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = gameSession.timer_duration - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        if (isAdmin) {
          supabase
            .from('game_sessions')
            .update({ status: 'finished' })
            .eq('id', gameSession.id)
            .then();
        }
      } else {
        setTimeRemaining(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [gameSession, isAdmin]);

  const updateMoney = async (amount: number) => {
    if (!player) return;
    
    const newMoney = player.money + amount;
    await supabase
      .from('players')
      .update({ money: newMoney })
      .eq('id', player.id);
  };

  const selectCard = async (card: CardType) => {
    if (!player) return;
    
    await supabase
      .from('players')
      .update({ selected_card: card })
      .eq('id', player.id);
  };

  const purchaseItem = async (item: ShopItem) => {
    if (!player || !gameSession || gameSession.status !== 'active') {
      toast({
        title: "Ошибка",
        description: "Игра еще не началась или уже завершена",
        variant: "destructive"
      });
      return;
    }

    const existingItem = player.inventory.find(i => i.id === item.id);
    
    let updatedInventory: ShopItem[];
    let price: number;
    let newLevel: number;
    let houseIncrease: number;
    
    if (existingItem) {
      newLevel = existingItem.level + 1;
      price = Math.floor(item.basePrice * Math.pow(1.5, newLevel - 1));
      updatedInventory = player.inventory.map(i =>
        i.id === item.id ? { ...i, level: newLevel } : i
      );
    } else {
      newLevel = 1;
      price = item.basePrice;
      updatedInventory = [...player.inventory, { ...item, level: 1 }];
    }

    if (player.money < price) {
      toast({
        title: "Недостаточно средств",
        description: `Нужно еще $${price - player.money}`,
        variant: "destructive"
      });
      return;
    }

    // Рассчитываем повышение уровня дома
    if (item.tier === 1) houseIncrease = 0.25;
    else if (item.tier === 2) houseIncrease = 0.5;
    else if (item.tier === 3) houseIncrease = 0.75;
    else if (item.tier === 4) houseIncrease = 1.0;
    else if (item.tier === 5) houseIncrease = 1.25;
    else houseIncrease = 1.5;

    const newHouseLevel = Math.min(25, player.house_level + houseIncrease);
    const newMoney = player.money - price;

    await supabase
      .from('players')
      .update({
        money: newMoney,
        house_level: newHouseLevel,
        inventory: updatedInventory as any
      })
      .eq('id', player.id);

    await supabase
      .from('purchase_history')
      .insert({
        player_id: player.id,
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        tier: item.tier,
        level: newLevel,
        price: price
      });

    toast({
      title: "Покупка успешна!",
      description: `${item.name} (Уровень ${newLevel})`,
    });
  };

  const startGame = async (duration: number) => {
    if (!gameSession || !isAdmin) return;

    await supabase
      .from('game_sessions')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
        timer_duration: duration * 60
      })
      .eq('id', gameSession.id);

    toast({
      title: "Игра началась!",
      description: `Таймер: ${duration} минут`,
    });
  };

  return (
    <GameContext.Provider
      value={{
        player,
        isAdmin,
        gameCode,
        allPlayers,
        gameSession,
        timeRemaining,
        updateMoney,
        selectCard,
        purchaseItem,
        startGame,
        setPlayer,
        setIsAdmin,
        setGameSession,
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
