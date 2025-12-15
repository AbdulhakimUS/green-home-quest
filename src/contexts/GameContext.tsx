import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { CardType, ShopItem } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { shopItems, getAllItems } from "@/data/shopItems";

const ALL_TREASURES_BONUS = 20000;
const ITEM_COUNT_REWARDS = [
  { threshold: 50, reward: 5000 },
  { threshold: 75, reward: 10000 },
  { threshold: 100, reward: 25000 },
];

interface MarketListing {
  id: string;
  session_id: string;
  seller_id: string;
  seller_nickname: string;
  item: ShopItem;
  price: number;
  created_at: string;
}

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
  claimed_treasures: string[];
  claimed_item_rewards: number[];
  all_treasures_claimed: boolean;
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
  marketListings: MarketListing[];
  listItemForSale: (item: ShopItem, price: number) => Promise<void>;
  buyFromMarket: (listingId: string) => Promise<void>;
  removeFromMarket: (listingId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);

  // Восстановление сессии
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
          .maybeSingle();

        if (sessionData) {
          setGameSession({
            ...sessionData,
            status: sessionData.status as "waiting" | "active" | "finished" | "paused",
            active_events: (sessionData.active_events as any) || [],
            treasure_items: (sessionData.treasure_items as string[]) || [],
          });
          setGameCode(sessionData.code);

          if (savedIsAdmin) {
            setIsAdmin(true);
          } else if (savedPlayerId) {
            const { data: playerData } = await supabase
              .from("players")
              .select("*")
              .eq("id", savedPlayerId)
              .maybeSingle();

            if (playerData) {
              setPlayer({
                ...playerData,
                selected_card: (playerData.selected_card as CardType) || null,
                inventory: (playerData.inventory as any as ShopItem[]) || [],
                completed_missions: (playerData.completed_missions as any as string[]) || [],
                claimed_treasures: (playerData.claimed_treasures as string[]) || [],
                claimed_item_rewards: (playerData.claimed_item_rewards as number[]) || [],
                all_treasures_claimed: playerData.all_treasures_claimed || false,
              });
            }
          }
        }
      };
      restoreSession();
    }
  }, []);

  // Подписка на игроков
  useEffect(() => {
    if (!gameSession?.id) return;

    const loadPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("session_id", gameSession.id);

      if (error) return;

      if (data) {
        const players = data.map((p) => ({
          ...p,
          selected_card: (p.selected_card as CardType) || null,
          inventory: (p.inventory as any as ShopItem[]) || [],
          completed_missions: (p.completed_missions as any as string[]) || [],
          claimed_treasures: (p.claimed_treasures as string[]) || [],
          claimed_item_rewards: (p.claimed_item_rewards as number[]) || [],
          all_treasures_claimed: p.all_treasures_claimed || false,
        }));
        setAllPlayers(players);

        if (player && !isAdmin) {
          const updatedPlayer = players.find((p) => p.id === player.id);
          if (!updatedPlayer) {
            toast({ title: "Вы были исключены", variant: "destructive" });
            localStorage.removeItem("eco_player_id");
            localStorage.removeItem("eco_session_id");
            setPlayer(null);
            setGameSession(null);
            window.location.href = "/";
            return;
          }
          setPlayer(updatedPlayer);
        }
      }
    };

    loadPlayers();

    const channel = supabase
      .channel(`players-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `session_id=eq.${gameSession.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "DELETE" &&
            player &&
            !isAdmin &&
            payload.old.id === player.id
          ) {
            toast({ title: "Вы были исключены", variant: "destructive" });
            localStorage.removeItem("eco_player_id");
            localStorage.removeItem("eco_session_id");
            setPlayer(null);
            setGameSession(null);
            window.location.href = "/";
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

  // Подписка на рынок
  useEffect(() => {
    if (!gameSession?.id) return;

    const loadMarket = async () => {
      const { data } = await supabase
        .from("market_listings")
        .select("*")
        .eq("session_id", gameSession.id);
      if (data) {
        setMarketListings(
          data.map((l: any) => ({ ...l, item: l.item as ShopItem }))
        );
      }
    };

    loadMarket();

    const channel = supabase
      .channel(`market-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_listings",
          filter: `session_id=eq.${gameSession.id}`,
        },
        () => loadMarket()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Подписка на сессию
  useEffect(() => {
    if (!gameSession?.id) return;

    const channel = supabase
      .channel(`session-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `id=eq.${gameSession.id}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setGameSession({
            ...newData,
            status: newData.status as "waiting" | "active" | "finished" | "paused",
            active_events: newData.active_events || [],
            treasure_items: (newData.treasure_items as string[]) || [],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id]);

  // Таймер
  useEffect(() => {
    if (!gameSession?.started_at) {
      setTimeRemaining(null);
      return;
    }
    if (gameSession.status === "paused") {
      setTimeRemaining(gameSession.timer_duration);
      return;
    }
    if (gameSession.status !== "active") {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor(
        (Date.now() - new Date(gameSession.started_at!).getTime()) / 1000
      );
      const remaining = gameSession.timer_duration - elapsed;
      if (remaining <= 0) {
        setTimeRemaining(0);
        if (isAdmin)
          supabase
            .from("game_sessions")
            .update({ status: "finished" })
            .eq("id", gameSession.id);
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
      setPlayer((prev) => (prev ? { ...prev, money: newMoney } : null));
      await supabase
        .from("players")
        .update({ money: newMoney })
        .eq("id", player.id);
    },
    [player?.id]
  );

  const selectCard = async (card: CardType) => {
    if (!player) return;
    await supabase
      .from("players")
      .update({ selected_card: card })
      .eq("id", player.id);
  };

  const purchaseItem = async (item: ShopItem) => {
    if (!player || !gameSession || gameSession.status !== "active") {
      toast({
        title: "Ошибка",
        description: "Игра не активна",
        variant: "destructive",
      });
      return;
    }

    const existingItem = player.inventory.find((i) => i.id === item.id);
    let updatedInventory: ShopItem[];
    let price: number;
    let newLevel: number;

    if (existingItem) {
      newLevel = existingItem.level + 1;
      price = Math.floor(item.basePrice * Math.pow(1.5, newLevel - 1));
      updatedInventory = player.inventory.map((i) =>
        i.id === item.id ? { ...i, level: newLevel } : i
      );
    } else {
      newLevel = 1;
      price = item.basePrice;
      updatedInventory = [...player.inventory, { ...item, level: 1 }];
    }

    if (player.money < price) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    let houseIncrease = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5][Math.min(item.tier - 1, 5)];
    let oxygenIncrease = item.category === "greenery" ? item.tier * 2 : 0;
    let newMoney = player.money - price;
    const newHouseLevel = Math.min(25, player.house_level + houseIncrease);
    const newOxygen = player.oxygen + oxygenIncrease;

    // Проверяем клад
    let claimedTreasures = [...(player.claimed_treasures || [])];
    let allTreasuresClaimed = player.all_treasures_claimed || false;
    
    const isTreasure = gameSession.treasure_items?.includes(item.id) && !claimedTreasures.includes(item.id);
    
    if (isTreasure) {
      newMoney += 5000;
      claimedTreasures.push(item.id);
      
      if (claimedTreasures.length >= 4 && !allTreasuresClaimed) {
        newMoney += ALL_TREASURES_BONUS;
        allTreasuresClaimed = true;
      }
    }

    // Проверяем награды за количество предметов
    let claimedItemRewards = [...(player.claimed_item_rewards || [])];
    const totalItems = updatedInventory.reduce((s, i) => s + i.level, 0);
    
    for (const { threshold, reward } of ITEM_COUNT_REWARDS) {
      if (totalItems >= threshold && !claimedItemRewards.includes(threshold)) {
        newMoney += reward;
        claimedItemRewards.push(threshold);
      }
    }

    setPlayer({
      ...player,
      money: newMoney,
      house_level: newHouseLevel,
      oxygen: newOxygen,
      inventory: updatedInventory,
      claimed_treasures: claimedTreasures,
      claimed_item_rewards: claimedItemRewards,
      all_treasures_claimed: allTreasuresClaimed,
    });

    try {
      await supabase
        .from("players")
        .update({
          money: newMoney,
          house_level: newHouseLevel,
          oxygen: newOxygen,
          inventory: updatedInventory as any,
          claimed_treasures: claimedTreasures as any,
          claimed_item_rewards: claimedItemRewards as any,
          all_treasures_claimed: allTreasuresClaimed,
        })
        .eq("id", player.id);
        
      await supabase
        .from("purchase_history")
        .insert({
          player_id: player.id,
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          tier: item.tier,
          level: newLevel,
          price,
        });
        
      toast({
        title: "Покупка успешна!",
        description: `${item.name} (Ур. ${newLevel})`,
      });

      if (isTreasure) {
        toast({ title: "🎁 Клад найден!", description: "+$5,000" });
        
        if (claimedTreasures.length >= 4 && allTreasuresClaimed) {
          toast({
            title: "🏆 Все клады найдены!",
            description: `+$${ALL_TREASURES_BONUS.toLocaleString()}`,
          });
        }
      }
      
      // Награды за количество
      for (const { threshold, reward } of ITEM_COUNT_REWARDS) {
        if (totalItems >= threshold && player.claimed_item_rewards && !player.claimed_item_rewards.includes(threshold)) {
          toast({
            title: `🎉 ${threshold} предметов!`,
            description: `+$${reward.toLocaleString()}`,
          });
        }
      }
    } catch {
      toast({ title: "Ошибка покупки", variant: "destructive" });
    }
  };

  // === РЫНОК ===
  const listItemForSale = async (item: ShopItem, price: number) => {
    if (!player || !gameSession || gameSession.status !== "active") return;

    // Проверка лимита - максимум 5 лотов от одного игрока
    const playerListings = marketListings.filter((l) => l.seller_id === player.id);
    if (playerListings.length >= 5) {
      toast({ title: "Максимум 5 лотов", description: "Удалите старые лоты для выставления новых", variant: "destructive" });
      return;
    }

    const maxPrice = Math.floor(item.basePrice * 0.75);
    if (price > maxPrice) {
      toast({ title: `Макс. цена: $${maxPrice}`, variant: "destructive" });
      return;
    }

    const inv = player.inventory.find((i) => i.id === item.id);
    if (!inv || inv.level < 1) {
      toast({ title: "Нет предмета", variant: "destructive" });
      return;
    }

    const updatedInv =
      inv.level === 1
        ? player.inventory.filter((i) => i.id !== item.id)
        : player.inventory.map((i) =>
            i.id === item.id ? { ...i, level: i.level - 1 } : i
          );

    setPlayer((prev) => (prev ? { ...prev, inventory: updatedInv } : null));

    try {
      await supabase
        .from("players")
        .update({ inventory: updatedInv as any })
        .eq("id", player.id);
      
      const itemToSave = {
        id: item.id,
        name: item.name,
        category: item.category,
        tier: item.tier,
        level: 1,
        basePrice: item.basePrice,
        efficiency: item.efficiency,
        ecology: item.ecology,
        description: item.description,
      };
      
      const { data: newListing, error } = await supabase
        .from("market_listings")
        .insert({
          session_id: gameSession.id,
          seller_id: player.id,
          seller_nickname: player.nickname,
          item: itemToSave as any,
          price,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Добавляем новый лот в локальное состояние
      if (newListing) {
        setMarketListings((prev) => [
          ...prev,
          { ...newListing, item: newListing.item as unknown as ShopItem }
        ]);
      }
      
      toast({ title: "Выставлено!", description: `${item.name} за $${price}` });
    } catch {
      setPlayer(player);
      toast({ title: "Ошибка выставления", variant: "destructive" });
    }
  };

  const buyFromMarket = async (listingId: string) => {
    if (!player || !gameSession) return;

    const listing = marketListings.find((l) => l.id === listingId);
    if (!listing) return;
    if (listing.seller_id === player.id) {
      toast({ title: "Нельзя купить свой лот", variant: "destructive" });
      return;
    }
    if (player.money < listing.price) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    const commission = Math.floor(listing.price * 0.07);
    const sellerEarns = listing.price - commission;

    // Обновляем инвентарь покупателя
    const existing = player.inventory.find((i) => i.id === listing.item.id);
    const updatedBuyerInv = existing
      ? player.inventory.map((i) =>
          i.id === listing.item.id ? { ...i, level: i.level + 1 } : i
        )
      : [...player.inventory, { ...listing.item, level: 1 }];
    const newMoney = player.money - listing.price;

    // Оптимистичное обновление UI
    setPlayer((prev) =>
      prev ? { ...prev, money: newMoney, inventory: updatedBuyerInv } : null
    );
    
    // Убираем лот из локального списка сразу
    setMarketListings((prev) => prev.filter((l) => l.id !== listingId));

    try {
      // 1. Удаляем лот с рынка ПЕРВЫМ (чтобы избежать дублирования)
      const { error: deleteError } = await supabase
        .from("market_listings")
        .delete()
        .eq("id", listingId);
      
      if (deleteError) throw deleteError;

      // 2. Обновляем покупателя
      await supabase
        .from("players")
        .update({ money: newMoney, inventory: updatedBuyerInv as any })
        .eq("id", player.id);

      // 3. Обновляем продавца (только деньги, предмет уже был удален при выставлении)
      const { data: seller } = await supabase
        .from("players")
        .select("money")
        .eq("id", listing.seller_id)
        .maybeSingle();
      
      if (seller) {
        await supabase
          .from("players")
          .update({ money: seller.money + sellerEarns })
          .eq("id", listing.seller_id);
      }

      toast({ title: "Куплено!", description: listing.item.name });
    } catch (error) {
      // Откатываем изменения при ошибке
      setPlayer(player);
      // Перезагружаем рынок
      const { data } = await supabase
        .from("market_listings")
        .select("*")
        .eq("session_id", gameSession.id);
      if (data) {
        setMarketListings(
          data.map((l: any) => ({ ...l, item: l.item as ShopItem }))
        );
      }
      toast({ title: "Ошибка покупки", variant: "destructive" });
    }
  };

  const removeFromMarket = async (listingId: string) => {
    if (!player) return;

    const listing = marketListings.find(
      (l) => l.id === listingId && l.seller_id === player.id
    );
    if (!listing) return;

    const existing = player.inventory.find((i) => i.id === listing.item.id);
    const updatedInv = existing
      ? player.inventory.map((i) =>
          i.id === listing.item.id ? { ...i, level: i.level + 1 } : i
        )
      : [...player.inventory, { ...listing.item, level: 1 }];

    setPlayer((prev) => (prev ? { ...prev, inventory: updatedInv } : null));

    try {
      await supabase
        .from("players")
        .update({ inventory: updatedInv as any })
        .eq("id", player.id);
      await supabase.from("market_listings").delete().eq("id", listingId);
      toast({ title: "Лот снят" });
    } catch {
      setPlayer(player);
    }
  };

  const endGame = async () => {
    if (!gameSession || !isAdmin) return;
    await supabase
      .from("game_sessions")
      .update({ status: "finished" })
      .eq("id", gameSession.id);
    toast({ title: "Игра завершена!" });
  };

  const claimMissionReward = async (missionId: string, reward: number) => {
    if (!player || !gameSession || gameSession.status !== "active") return;
    if (player.completed_missions.includes(missionId)) return;

    const updated = [...player.completed_missions, missionId];
    const newMoney = player.money + reward;
    setPlayer((prev) =>
      prev ? { ...prev, completed_missions: updated, money: newMoney } : null
    );

    try {
      await supabase
        .from("players")
        .update({ completed_missions: updated as any, money: newMoney })
        .eq("id", player.id);
      toast({
        title: "Миссия выполнена!",
        description: `+$${reward.toLocaleString()}`,
      });
    } catch {
      setPlayer(player);
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
      await supabase.from("players").delete().eq("id", playerId);
      toast({ title: "Игрок удален" });
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

    const allItems = getAllItems();
    const treasureItems = [...allItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((i) => i.id);

    await supabase
      .from("game_sessions")
      .update({
        status: "active",
        started_at: new Date().toISOString(),
        timer_duration: duration * 60,
        treasure_items: treasureItems as any,
      })
      .eq("id", gameSession.id);
    toast({ title: "Игра началась!", description: `${duration} минут` });
  };

  const pauseGame = async () => {
    if (!gameSession || !isAdmin || timeRemaining === null) return;

    const newStatus = gameSession.status === "paused" ? "active" : "paused";
    setGameSession((prev) => (prev ? { ...prev, status: newStatus } : null));

    if (newStatus === "paused") {
      await supabase
        .from("game_sessions")
        .update({ status: "paused", timer_duration: timeRemaining })
        .eq("id", gameSession.id);
      toast({ title: "Пауза" });
    } else {
      await supabase
        .from("game_sessions")
        .update({
          status: "active",
          started_at: new Date().toISOString(),
          timer_duration: timeRemaining,
        })
        .eq("id", gameSession.id);
      toast({ title: "Продолжаем" });
    }
  };

  const restartGame = async () => {
    if (!gameSession || !isAdmin) return;

    const { data: players } = await supabase
      .from("players")
      .select("id")
      .eq("session_id", gameSession.id);
    if (players?.length) {
      await supabase
        .from("purchase_history")
        .delete()
        .in(
          "player_id",
          players.map((p) => p.id)
        );
    }
    await supabase
      .from("market_listings")
      .delete()
      .eq("session_id", gameSession.id);

    await supabase
      .from("players")
      .update({
        money: gameSession.initial_balance || 20000,
        house_level: 1,
        selected_card: null,
        inventory: [],
        oxygen: 0,
        completed_missions: [],
        claimed_treasures: [],
        claimed_item_rewards: [],
        all_treasures_claimed: false,
      })
      .eq("session_id", gameSession.id);

    await supabase
      .from("game_sessions")
      .update({
        status: "waiting",
        started_at: null,
        timer_duration: 1800,
        treasure_items: [],
      })
      .eq("id", gameSession.id);
    toast({ title: "Перезапущено!" });
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
        marketListings,
        listItemForSale,
        buyFromMarket,
        removeFromMarket,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
