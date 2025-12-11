import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CardType, ShopItem } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { shopItems } from "@/data/shopItems";

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
  treasure_items?: string[];
}

interface GameSession {
  id: string;
  code: string;
  status: "waiting" | "active" | "finished" | "paused";
  timer_duration: number;
  started_at: string | null;
  active_events: any[];
  admin_reconnect_allowed: boolean;
  initial_balance: number;
  treasure_items: string[];
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
  endGame: () => Promise<void>;
  pauseGame: () => Promise<void>;
  restartGame: () => Promise<void>;
  claimMissionReward: (missionId: string, reward: number) => Promise<void>;
  removePlayer: () => Promise<void>;
  removePlayerById: (playerId: string) => Promise<void>;
  logoutAdmin: () => void;
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

  // Восстановление сессии из localStorage
  useEffect(() => {
    const savedPlayerId = localStorage.getItem("eco_player_id");
    const savedSessionId = localStorage.getItem("eco_session_id");
    const savedIsAdmin = localStorage.getItem("eco_is_admin") === "true";

    if (savedSessionId) {
      const restoreSession = async () => {
        const { data: sessionData } = await supabase
          .from("game_sessions")
          .select("*")
          .eq("id", savedSessionId)
          .single();

        if (sessionData) {
          setGameSession({
            ...sessionData,
            status: sessionData.status as
              | "waiting"
              | "active"
              | "finished"
              | "paused",
            active_events: (sessionData.active_events as any) || [],
          });
          setGameCode(sessionData.code);

          if (savedIsAdmin) {
            setIsAdmin(true);
          } else if (savedPlayerId && !player) {
            const { data: playerData } = await supabase
              .from("players")
              .select("*")
              .eq("id", savedPlayerId)
              .single();

            if (playerData) {
              setPlayer({
                ...playerData,
                selected_card: (playerData.selected_card as CardType) || null,
                inventory: (playerData.inventory as any as ShopItem[]) || [],
                completed_missions:
                  (playerData.completed_missions as any as string[]) || [],
              });
            }
          }
        }
      };

      restoreSession();
    }
  }, []);

  // Подписка на изменения игроков
  useEffect(() => {
    if (!gameSession?.id) return;

    const loadPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("session_id", gameSession.id);

      if (error) {
        console.error("Error loading players:", error);
        return;
      }

      if (data) {
        const players = data.map((p) => ({
          ...p,
          selected_card: (p.selected_card as CardType) || null,
          inventory: (p.inventory as any as ShopItem[]) || [],
          completed_missions: (p.completed_missions as any as string[]) || [],
        }));
        setAllPlayers(players);

        // Проверяем, был ли удален текущий игрок
        if (player && !isAdmin) {
          const updatedPlayer = players.find((p) => p.id === player.id);
          if (!updatedPlayer) {
            // Игрок был удален админом
            toast({
              title: "Вы были исключены с игры",
              description: "Администратор удалил вас из игры",
              variant: "destructive",
              duration: 5000,
            });
            localStorage.removeItem("eco_player_id");
            localStorage.removeItem("eco_session_id");
            setPlayer(null);
            setGameSession(null);
            setGameCode(null);
            window.location.href = "/";
            return;
          }
          setPlayer(updatedPlayer);
        }
      }
    };

    loadPlayers();

    const channel = supabase
      .channel(`players-changes-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `session_id=eq.${gameSession.id}`,
        },
        (payload) => {
          // Если это DELETE и это текущий игрок - немедленно выбрасываем
          if (
            payload.eventType === "DELETE" &&
            player &&
            !isAdmin &&
            payload.old.id === player.id
          ) {
            toast({
              title: "Вы были исключены с игры",
              description: "Администратор удалил вас из игры",
              variant: "destructive",
              duration: 5000,
            });
            localStorage.removeItem("eco_player_id");
            localStorage.removeItem("eco_session_id");
            setPlayer(null);
            setGameSession(null);
            setGameCode(null);
            setTimeout(() => {
              window.location.href = "/";
            }, 100);
            return;
          }
          loadPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id, player?.id, isAdmin]);

  // Подписка на изменения сессии
  useEffect(() => {
    if (!gameSession?.id) return;

    const channel = supabase
      .channel(`session-changes-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `id=eq.${gameSession.id}`,
        },
        (payload) => setGameSession(payload.new as GameSession)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Таймер
  useEffect(() => {
    if (!gameSession || !gameSession.started_at) {
      setTimeRemaining(null);
      return;
    }

    // Если игра на паузе, сохраняем текущее время и не обновляем
    if (gameSession.status === "paused") {
      if (gameSession.timer_duration) {
        setTimeRemaining(gameSession.timer_duration);
      }
      return;
    }

    // Таймер работает только если статус 'active'
    if (gameSession.status !== "active") {
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
            .from("game_sessions")
            .update({ status: "finished" })
            .eq("id", gameSession.id)
            .then();
        }
      } else {
        setTimeRemaining(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [
    gameSession?.status,
    gameSession?.started_at,
    gameSession?.timer_duration,
    isAdmin,
  ]);

  const updateMoney = useCallback(
    async (amount: number) => {
      if (!player) return;

      const newMoney = Math.max(0, player.money + amount);

      // Обновляем локальное состояние немедленно
      setPlayer((prev) => (prev ? { ...prev, money: newMoney } : null));

      // Немедленно обновляем в БД для критических операций (покупки, миссии)
      if (Math.abs(amount) > 10) {
        await supabase
          .from("players")
          .update({ money: newMoney })
          .eq("id", player.id);
      }
    },
    [player?.id]
  );

  // Батчинг обновлений денег в БД для мелких начислений (пассивный доход)
  useEffect(() => {
    if (!player || !gameSession || gameSession.status !== "active") return;

    const interval = setInterval(async () => {
      await supabase
        .from("players")
        .update({ money: player.money })
        .eq("id", player.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [player?.id, player?.money, gameSession?.status]);

  const selectCard = async (card: CardType) => {
    if (!player) return;

    await supabase
      .from("players")
      .update({ selected_card: card })
      .eq("id", player.id);
  };

  const purchaseItem = async (item: ShopItem) => {
    if (!player || !gameSession) {
      toast({
        title: "Ошибка",
        description: "Игра еще не началась",
        variant: "destructive",
      });
      return;
    }

    if (gameSession.status !== "active") {
      toast({
        title: "Ошибка",
        description:
          gameSession.status === "paused"
            ? "Игра на паузе. Дождитесь возобновления."
            : "Игра еще не началась или уже завершена",
        variant: "destructive",
      });
      return;
    }

    // Получаем свежие данные игрока из состояния
    const currentPlayer = player;

    // Проверка уровня дома для дорогих предметов
    if (item.basePrice >= 1500 && currentPlayer.house_level < 3) {
      toast({
        title: "Требуется уровень дома",
        description: "Для покупки этого предмета нужен уровень дома 3 или выше",
        variant: "destructive",
      });
      return;
    }

    const existingItem = currentPlayer.inventory.find((i) => i.id === item.id);

    let updatedInventory: ShopItem[];
    let price: number;
    let newLevel: number;
    let houseIncrease: number;
    let oxygenIncrease = 0;

    if (existingItem) {
      newLevel = existingItem.level + 1;
      price = Math.floor(item.basePrice * Math.pow(1.5, newLevel - 1));
      updatedInventory = currentPlayer.inventory.map((i) =>
        i.id === item.id ? { ...i, level: newLevel } : i
      );
    } else {
      newLevel = 1;
      price = item.basePrice;
      updatedInventory = [...currentPlayer.inventory, { ...item, level: 1 }];
    }

    if (currentPlayer.money < price) {
      toast({
        title: "Недостаточно средств",
        description: `Нужно еще $${price - currentPlayer.money}`,
        variant: "destructive",
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
    if (item.category === "greenery") {
      oxygenIncrease = item.tier * 2;
    }

    const newHouseLevel = Math.min(
      25,
      currentPlayer.house_level + houseIncrease
    );
    const newMoney = currentPlayer.money - price;
    const newOxygen = currentPlayer.oxygen + oxygenIncrease;

    // Оптимистичное обновление
    const updatedPlayer = {
      ...currentPlayer,
      money: newMoney,
      house_level: newHouseLevel,
      oxygen: newOxygen,
      inventory: updatedInventory,
    };
    setPlayer(updatedPlayer);

    // Транзакционное обновление в БД
    try {
      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: newMoney,
          house_level: newHouseLevel,
          oxygen: newOxygen,
          inventory: updatedInventory as any,
        })
        .eq("id", currentPlayer.id);

      if (updateError) throw updateError;

      // История покупок без ожидания
      supabase
        .from("purchase_history")
        .insert({
          player_id: currentPlayer.id,
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          tier: item.tier,
          level: newLevel,
          price: price,
        })
        .then();

      toast({
        title: "Покупка успешна!",
        description: `${item.name} (Уровень ${newLevel})`,
      });
      // Проверка на клад
      if (gameSession.treasure_items?.includes(item.id)) {
        const alreadyClaimed = currentPlayer.claimed_treasures?.includes(
          item.id
        );

        if (!alreadyClaimed) {
          const treasureBonus = 5000;
          const newMoneyWithTreasure = newMoney + treasureBonus;
          const updatedClaimedTreasures = [
            ...(currentPlayer.claimed_treasures || []),
            item.id,
          ];

          // Обновляем локальное состояние
          setPlayer((prev) =>
            prev
              ? {
                  ...prev,
                  money: newMoneyWithTreasure,
                  claimed_treasures: updatedClaimedTreasures,
                }
              : null
          );

          // Обновляем в БД
          await supabase
            .from("players")
            .update({
              money: newMoneyWithTreasure,
              claimed_treasures: updatedClaimedTreasures,
            })
            .eq("id", currentPlayer.id);

          toast({
            title: "🎁 Найден клад!",
            description: `+$${treasureBonus.toLocaleString()} бонус!`,
          });
        }
      }
    } catch (error) {
      // Откат при ошибке - возвращаем предыдущее состояние
      setPlayer(currentPlayer);
      toast({
        title: "Ошибка покупки",
        description: "Не удалось выполнить покупку. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  const endGame = async () => {
    if (!gameSession || !isAdmin) return;

    await supabase
      .from("game_sessions")
      .update({ status: "finished" })
      .eq("id", gameSession.id);

    toast({
      title: "Игра завершена!",
      description: "Все результаты сохранены",
    });
  };

  const claimMissionReward = async (missionId: string, reward: number) => {
    if (!player || !gameSession) return;

    // Проверка статуса игры
    if (gameSession.status !== "active") {
      toast({
        title: "Ошибка",
        description:
          gameSession.status === "paused"
            ? "Игра на паузе. Дождитесь возобновления."
            : "Игра еще не началась или уже завершена",
        variant: "destructive",
      });
      return;
    }

    // Проверка что миссия не выполнена
    if (player.completed_missions.includes(missionId)) {
      toast({
        title: "Ошибка",
        description: "Миссия уже выполнена",
        variant: "destructive",
      });
      return;
    }

    const updatedMissions = [...player.completed_missions, missionId];
    const newMoney = player.money + reward;

    // Оптимистичное обновление
    setPlayer((prev) =>
      prev
        ? {
            ...prev,
            completed_missions: updatedMissions,
            money: newMoney,
          }
        : null
    );

    try {
      const { error } = await supabase
        .from("players")
        .update({
          completed_missions: updatedMissions as any,
          money: newMoney,
        })
        .eq("id", player.id);

      if (error) throw error;

      toast({
        title: "Миссия выполнена!",
        description: `Получено: $${reward.toLocaleString()}`,
      });
    } catch (error) {
      // Откат при ошибке
      setPlayer(player);
      toast({
        title: "Ошибка",
        description: "Не удалось получить награду. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  const removePlayer = useCallback(async () => {
    if (!player) return;

    await supabase.from("players").delete().eq("id", player.id);

    localStorage.removeItem("eco_player_id");
    localStorage.removeItem("eco_session_id");

    setPlayer(null);
  }, [player]);

  const removePlayerById = useCallback(
    async (playerId: string) => {
      if (!isAdmin) return;

      // Удаляем игрока (история покупок удалится каскадно)
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (!error) {
        toast({
          title: "Игрок удален",
          description: "Игрок был исключен из игры",
        });
      } else {
        console.error("Error removing player:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить игрока",
          variant: "destructive",
        });
      }
    },
    [isAdmin]
  );

  const logoutAdmin = () => {
    localStorage.removeItem("eco_session_id");
    localStorage.removeItem("eco_is_admin");
    setIsAdmin(false);
    setGameSession(null);
    setGameCode(null);
  };

  const startGame = async (duration: number) => {
    if (!gameSession || !isAdmin) return;

    // Генерируем 4 случайных клада из всех предметов
    const allItems = [
      ...shopItems.energy,
      ...shopItems.water,
      ...shopItems.greenery,
    ];
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const treasureItems = shuffled.slice(0, 4).map((item) => item.id);

    await supabase
      .from("game_sessions")
      .update({
        status: "active",
        started_at: new Date().toISOString(),
        timer_duration: duration * 60,
        treasure_items: treasureItems,
      })
      .eq("id", gameSession.id);

    toast({
      title: "Игра началась!",
      description: `Таймер: ${duration} минут`,
    });
  };

  const pauseGame = async () => {
    if (!gameSession || !isAdmin || timeRemaining === null) return;

    const newStatus = gameSession.status === "paused" ? "active" : "paused";

    // Оптимистично обновляем локальное состояние
    setGameSession((prev) =>
      prev
        ? { ...prev, status: newStatus, timer_duration: timeRemaining }
        : null
    );

    if (newStatus === "paused") {
      // При паузе сохраняем текущее оставшееся время
      await supabase
        .from("game_sessions")
        .update({
          status: "paused",
          timer_duration: timeRemaining,
        })
        .eq("id", gameSession.id);

      toast({
        title: "Игра на паузе",
        description: "Все таймеры остановлены",
      });
    } else {
      // При возобновлении устанавливаем новое started_at
      await supabase
        .from("game_sessions")
        .update({
          status: "active",
          started_at: new Date().toISOString(),
          timer_duration: timeRemaining,
        })
        .eq("id", gameSession.id);

      toast({
        title: "Игра возобновлена",
        description: "Игра продолжается",
      });
    }
  };

  const restartGame = async () => {
    if (!gameSession || !isAdmin) return;

    // Получаем всех игроков этой сессии
    const { data: sessionPlayers } = await supabase
      .from("players")
      .select("id")
      .eq("session_id", gameSession.id);

    // Удаляем историю покупок для всех игроков
    if (sessionPlayers && sessionPlayers.length > 0) {
      const playerIds = sessionPlayers.map((p) => p.id);
      await supabase
        .from("purchase_history")
        .delete()
        .in("player_id", playerIds);
    }

    // Сбрасываем всех игроков к начальным значениям
    const initialBalance = gameSession.initial_balance || 20000;
    await supabase
      .from("players")
      .update({
        money: initialBalance,
        house_level: 1,
        selected_card: null,
        inventory: [],
        oxygen: 0,
        completed_missions: [],
      })
      .eq("session_id", gameSession.id);

    // Сбрасываем сессию
    await supabase
      .from("game_sessions")
      .update({
        status: "waiting",
        started_at: null,
        timer_duration: 1800,
      })
      .eq("id", gameSession.id);

    toast({
      title: "Игра перезапущена!",
      description: "Все игроки сброшены. Можно начать заново.",
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
        endGame,
        pauseGame,
        restartGame,
        claimMissionReward,
        removePlayer,
        removePlayerById,
        logoutAdmin,
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
