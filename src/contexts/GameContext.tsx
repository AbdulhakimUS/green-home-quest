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
  oxygen: number;
  completed_missions: string[];
}

interface GameSession {
  id: string;
  code: string;
  status: 'waiting' | 'active' | 'finished';
  timer_duration: number;
  started_at: string | null;
  active_events: any[];
  admin_reconnect_allowed: boolean;
}

interface GameContextType {
  player: Player | null;
  isAdmin: boolean;
  gameCode: string | null;
  allPlayers: Player[];
  gameSession: GameSession | null;
  timeRemaining: number | null;
  currentIncome: number;
  updateMoney: (amount: number) => void;
  selectCard: (card: CardType) => void;
  purchaseItem: (item: ShopItem) => Promise<void>;
  startGame: (duration: number) => Promise<void>;
  endGame: () => Promise<void>;
  claimMissionReward: (missionId: string, reward: number) => Promise<void>;
  removePlayer: () => Promise<void>;
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
  const [currentIncome, setCurrentIncome] = useState(0);

  // Восстановление сессии из localStorage
  useEffect(() => {
    const savedPlayerId = localStorage.getItem('eco_player_id');
    const savedSessionId = localStorage.getItem('eco_session_id');
    
    if (savedPlayerId && savedSessionId && !player) {
      const restoreSession = async () => {
        const { data: sessionData } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('id', savedSessionId)
          .single();
        
        if (sessionData) {
          setGameSession({
            ...sessionData,
            status: sessionData.status as 'waiting' | 'active' | 'finished',
            active_events: (sessionData.active_events as any) || []
          });
          setGameCode(sessionData.code);
          
          const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('id', savedPlayerId)
            .single();
          
          if (playerData) {
            setPlayer({
              ...playerData,
              selected_card: (playerData.selected_card as CardType) || null,
              inventory: (playerData.inventory as any as ShopItem[]) || [],
              completed_missions: (playerData.completed_missions as any as string[]) || []
            });
          }
        }
      };
      
      restoreSession();
    }
  }, []);

  // Подписка на изменения игроков
  useEffect(() => {
    if (!gameSession?.id) {
      console.log('❌ No gameSession, skipping player subscription');
      return;
    }

    console.log('🔄 Setting up player subscription for session:', gameSession.id);

    const loadPlayers = async () => {
      console.log('📥 Loading players for session:', gameSession.id);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', gameSession.id);
      
      if (error) {
        console.error('❌ Error loading players:', error);
        return;
      }
      
      if (data) {
        console.log('✅ Loaded players:', data.length);
        const players = data.map(p => ({
          ...p,
          selected_card: (p.selected_card as CardType) || null,
          inventory: (p.inventory as any as ShopItem[]) || [],
          completed_missions: (p.completed_missions as any as string[]) || []
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
      .channel(`players-changes-${gameSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${gameSession.id}`
        },
        (payload) => {
          console.log('🔔 Players changed:', payload);
          loadPlayers();
        }
      )
      .subscribe((status) => {
        console.log('📡 Player subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from players channel');
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Подписка на изменения сессии
  useEffect(() => {
    if (!gameSession?.id) {
      console.log('❌ No gameSession, skipping session subscription');
      return;
    }

    console.log('🔄 Setting up session subscription for:', gameSession.id);

    const channel = supabase
      .channel(`session-changes-${gameSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameSession.id}`
        },
        (payload) => {
          console.log('🔔 Session updated:', payload.new);
          setGameSession(payload.new as GameSession);
        }
      )
      .subscribe((status) => {
        console.log('📡 Session subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from session channel');
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

    // Проверка уровня дома для дорогих предметов
    if (item.basePrice >= 1500 && player.house_level < 3) {
      toast({
        title: "Требуется уровень дома",
        description: "Для покупки этого предмета нужен уровень дома 3 или выше",
        variant: "destructive"
      });
      return;
    }

    const existingItem = player.inventory.find(i => i.id === item.id);
    
    let updatedInventory: ShopItem[];
    let price: number;
    let newLevel: number;
    let houseIncrease: number;
    let oxygenIncrease = 0;
    
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

    // Растения увеличивают кислород
    if (item.category === 'greenery') {
      oxygenIncrease = item.tier * 2;
    }

    const newHouseLevel = Math.min(25, player.house_level + houseIncrease);
    const newMoney = player.money - price;
    const newOxygen = player.oxygen + oxygenIncrease;

    await supabase
      .from('players')
      .update({
        money: newMoney,
        house_level: newHouseLevel,
        oxygen: newOxygen,
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

  const endGame = async () => {
    if (!gameSession || !isAdmin) return;

    await supabase
      .from('game_sessions')
      .update({ status: 'finished' })
      .eq('id', gameSession.id);

    toast({
      title: "Игра завершена!",
      description: "Все результаты сохранены",
    });
  };

  const claimMissionReward = async (missionId: string, reward: number) => {
    if (!player) return;

    const updatedMissions = [...player.completed_missions, missionId];
    const newMoney = player.money + reward;

    await supabase
      .from('players')
      .update({
        completed_missions: updatedMissions as any,
        money: newMoney
      })
      .eq('id', player.id);

    toast({
      title: "Миссия выполнена!",
      description: `Получено: $${reward.toLocaleString()}`,
    });
  };

  const removePlayer = async () => {
    if (!player) return;

    await supabase
      .from('players')
      .delete()
      .eq('id', player.id);

    localStorage.removeItem('eco_player_id');
    localStorage.removeItem('eco_session_id');
    
    setPlayer(null);
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

  // Система прибыли
  useEffect(() => {
    if (!player || !gameSession || gameSession.status !== 'active') return;

    const calculateProfit = () => {
      let totalProfit = 0;
      player.inventory.forEach(item => {
        const levelMultiplier = Math.pow(1.5, item.level - 1);
        totalProfit += item.profitPerSecond * levelMultiplier * item.level;
      });
      return totalProfit;
    };

    const getInterval = () => {
      const totalIncome = calculateProfit();
      // Если доход выше 100$/сек, начисляем каждые 0.5 сек
      if (totalIncome > 100) return 500;
      
      const maxLevel = Math.max(...player.inventory.map(i => i.level), 1);
      if (maxLevel === 1) return 2000;
      if (maxLevel === 2) return 1500;
      return 1000;
    };

    const interval = setInterval(() => {
      const profit = calculateProfit();
      if (profit > 0) {
        const newMoney = player.money + profit;
        supabase
          .from('players')
          .update({ money: newMoney })
          .eq('id', player.id)
          .then(() => {
            setPlayer({ ...player, money: newMoney });
          });
      }
    }, getInterval());

    return () => clearInterval(interval);
  }, [player?.id, player?.inventory, player?.money, gameSession?.status]);

  // Вычисление текущего дохода
  useEffect(() => {
    if (!player) return;
    
    let totalProfit = 0;
    player.inventory.forEach(item => {
      const levelMultiplier = Math.pow(1.5, item.level - 1);
      totalProfit += item.profitPerSecond * levelMultiplier * item.level;
    });
    setCurrentIncome(totalProfit);
  }, [player?.inventory]);

  return (
    <GameContext.Provider
      value={{
        player,
        isAdmin,
        gameCode,
        allPlayers,
        gameSession,
        timeRemaining,
        currentIncome,
        updateMoney,
        selectCard,
        purchaseItem,
        startGame,
        endGame,
        claimMissionReward,
        removePlayer,
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
