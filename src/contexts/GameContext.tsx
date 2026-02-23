import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
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

const INVENTORY_LIMIT_PER_CATEGORY = 5;
const AUTOSAVE_INTERVAL = 12000; // 12 seconds

interface MarketListing {
  id: string;
  session_id: string;
  seller_id: string;
  seller_nickname: string;
  item: ShopItem;
  price: number;
  created_at: string;
  sold?: boolean; // for "sold" status display
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
  status?: string;
  pending_rewards?: ShopItem[];
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
  sellToBot: (item: ShopItem) => Promise<void>;
  approvePlayer: (playerId: string) => Promise<void>;
  denyPlayer: (playerId: string) => Promise<void>;
  blockPlayer: (playerId: string) => Promise<void>;
  updatePlayerMoney: (playerId: string, amount: number) => Promise<void>;
  updatePlayerLevel: (playerId: string, level: number) => Promise<void>;
  giveItem: (playerId: string, item: ShopItem) => Promise<void>;
  removeItem: (playerId: string, itemId: string) => Promise<void>;
  pendingPlayers: Player[];
  gameLogs: any[];
  addLog: (actionType: string, details: any, playerNickname?: string, playerId?: string) => Promise<void>;
  claimPendingReward: (index: number) => Promise<void>;
  getInventoryCount: (category: CardType) => number;
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
  const [pendingPlayers, setPendingPlayers] = useState<Player[]>([]);
  const [gameLogs, setGameLogs] = useState<any[]>([]);
  const lastSaveRef = useRef<number>(0);

  // Helper: get inventory count per category
  const getInventoryCount = useCallback((category: CardType) => {
    if (!player) return 0;
    return player.inventory.filter(i => i.category === category).length;
  }, [player]);

  // Logging helper
  const addLog = useCallback(async (actionType: string, details: any, playerNickname?: string, playerId?: string) => {
    if (!gameSession) return;
    try {
      await supabase.from("game_logs").insert({
        session_id: gameSession.id,
        player_id: playerId || player?.id || null,
        player_nickname: playerNickname || player?.nickname || null,
        action_type: actionType,
        details,
      });
    } catch (e) {
      // silent fail for logs
    }
  }, [gameSession?.id, player?.id, player?.nickname]);

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

            if (playerData && playerData.status !== 'blocked') {
              setPlayer({
                ...playerData,
                selected_card: (playerData.selected_card as CardType) || null,
                inventory: (playerData.inventory as any as ShopItem[]) || [],
                completed_missions: (playerData.completed_missions as any as string[]) || [],
                claimed_treasures: (playerData.claimed_treasures as string[]) || [],
                claimed_item_rewards: (playerData.claimed_item_rewards as number[]) || [],
                all_treasures_claimed: playerData.all_treasures_claimed || false,
                pending_rewards: (playerData.pending_rewards as any as ShopItem[]) || [],
                status: playerData.status || 'approved',
              });
            }
          }
        }
      };
      restoreSession();
    }
  }, []);

  // Autosave every 12 seconds
  useEffect(() => {
    if (!player || !gameSession || isAdmin) return;

    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastSaveRef.current < 10000) return;
      lastSaveRef.current = now;

      try {
        await supabase
          .from("players")
          .update({
            money: player.money,
            house_level: player.house_level,
            inventory: player.inventory as any,
            oxygen: player.oxygen,
            completed_missions: player.completed_missions as any,
            claimed_treasures: player.claimed_treasures as any,
            claimed_item_rewards: player.claimed_item_rewards as any,
            all_treasures_claimed: player.all_treasures_claimed,
            pending_rewards: (player.pending_rewards || []) as any,
            last_activity: new Date().toISOString(),
          })
          .eq("id", player.id);
      } catch (e) {
        // silent
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [player, gameSession, isAdmin]);

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
          pending_rewards: (p.pending_rewards as any as ShopItem[]) || [],
          status: p.status || 'approved',
        }));
        
        setAllPlayers(players.filter(p => p.status === 'approved'));
        setPendingPlayers(players.filter(p => p.status === 'pending'));

        if (player && !isAdmin) {
          const updatedPlayer = players.find((p) => p.id === player.id);
          if (!updatedPlayer || updatedPlayer.status === 'blocked') {
            toast({ title: "Вы были исключены", variant: "destructive" });
            localStorage.removeItem("eco_player_id");
            localStorage.removeItem("eco_session_id");
            setPlayer(null);
            setGameSession(null);
            window.location.href = "/";
            return;
          }
          if (updatedPlayer.status === 'pending') {
            // Still waiting for approval
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
        setMarketListings((prev) => {
          // Preserve "sold" status for items being displayed
          const soldIds = new Set(prev.filter(l => l.sold).map(l => l.id));
          return data.map((l: any) => ({
            ...l,
            item: l.item as ShopItem,
            sold: soldIds.has(l.id) ? true : false,
          }));
        });
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

  // Load game logs for admin
  useEffect(() => {
    if (!gameSession?.id || !isAdmin) return;

    const loadLogs = async () => {
      const { data } = await supabase
        .from("game_logs")
        .select("*")
        .eq("session_id", gameSession.id)
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setGameLogs(data);
    };

    loadLogs();

    const channel = supabase
      .channel(`logs-${gameSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_logs",
          filter: `session_id=eq.${gameSession.id}`,
        },
        () => loadLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameSession?.id, isAdmin]);

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
    addLog("select_card", { card }, player.nickname, player.id);
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

    // Check inventory limit (5 per category)
    const categoryItems = player.inventory.filter(i => i.category === item.category);
    const existingItem = player.inventory.find((i) => i.id === item.id);
    
    if (!existingItem && categoryItems.length >= INVENTORY_LIMIT_PER_CATEGORY) {
      toast({
        title: "Инвентарь заполнен!",
        description: `Максимум ${INVENTORY_LIMIT_PER_CATEGORY} предметов в категории. Продайте предмет на рынке.`,
        variant: "destructive",
      });
      return;
    }

    // Stage check: if player is stage 2 (level > 25), can't buy tier 1-3 items
    if (player.house_level > 25 && item.tier <= 3) {
      toast({
        title: "Предмет недоступен",
        description: "На Этапе 2 базовые предметы больше нельзя купить",
        variant: "destructive",
      });
      return;
    }

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
    const newHouseLevel = Math.min(50, player.house_level + houseIncrease);
    const newOxygen = player.oxygen + oxygenIncrease;

    // Клад
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

    // Награды за количество
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

      addLog("purchase", { item: item.name, price, level: newLevel });
        
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

  // Sell to bot (50% price) - for Stage 2 players selling Stage 1 items
  const sellToBot = async (item: ShopItem) => {
    if (!player) return;
    
    const inv = player.inventory.find(i => i.id === item.id);
    if (!inv || inv.level < 1) {
      toast({ title: "Нет предмета", variant: "destructive" });
      return;
    }

    const sellPrice = Math.floor(item.basePrice * 0.5);
    
    const updatedInv = inv.level === 1
      ? player.inventory.filter(i => i.id !== item.id)
      : player.inventory.map(i => i.id === item.id ? { ...i, level: i.level - 1 } : i);
    
    const newMoney = player.money + sellPrice;
    
    setPlayer(prev => prev ? { ...prev, inventory: updatedInv, money: newMoney } : null);

    try {
      await supabase.from("players").update({
        inventory: updatedInv as any,
        money: newMoney,
      }).eq("id", player.id);
      
      addLog("sell_to_bot", { item: item.name, price: sellPrice });
      toast({ title: "Продано боту!", description: `${item.name} за $${sellPrice.toLocaleString()}` });
    } catch {
      setPlayer(player);
      toast({ title: "Ошибка продажи", variant: "destructive" });
    }
  };

  // Claim pending reward
  const claimPendingReward = async (index: number) => {
    if (!player || !player.pending_rewards?.length) return;
    
    const reward = player.pending_rewards[index];
    if (!reward) return;

    // Check inventory limit
    const categoryItems = player.inventory.filter(i => i.category === reward.category);
    if (categoryItems.length >= INVENTORY_LIMIT_PER_CATEGORY) {
      toast({
        title: "Инвентарь заполнен!",
        description: "Освободите слот в инвентаре",
        variant: "destructive",
      });
      return;
    }

    const newPending = [...player.pending_rewards];
    newPending.splice(index, 1);
    
    const existing = player.inventory.find(i => i.id === reward.id);
    const updatedInv = existing
      ? player.inventory.map(i => i.id === reward.id ? { ...i, level: i.level + 1 } : i)
      : [...player.inventory, { ...reward, level: 1 }];

    setPlayer(prev => prev ? { ...prev, inventory: updatedInv, pending_rewards: newPending } : null);

    await supabase.from("players").update({
      inventory: updatedInv as any,
      pending_rewards: newPending as any,
    }).eq("id", player.id);

    toast({ title: "Награда получена!", description: reward.name });
  };

  // === ADMIN FUNCTIONS ===
  const approvePlayer = async (playerId: string) => {
    await supabase.from("players").update({ status: 'approved' }).eq("id", playerId);
    const p = pendingPlayers.find(p => p.id === playerId);
    if (p) addLog("approve_player", { nickname: p.nickname }, p.nickname, playerId);
    toast({ title: "Игрок одобрен" });
  };

  const denyPlayer = async (playerId: string) => {
    const p = pendingPlayers.find(p => p.id === playerId);
    if (p) addLog("deny_player", { nickname: p.nickname }, p.nickname, playerId);
    await supabase.from("players").delete().eq("id", playerId);
    toast({ title: "Заявка отклонена" });
  };

  const blockPlayer = async (playerId: string) => {
    const p = allPlayers.find(p => p.id === playerId);
    if (p) addLog("block_player", { nickname: p.nickname }, p.nickname, playerId);
    await supabase.from("players").update({ status: 'blocked' }).eq("id", playerId);
    toast({ title: "Игрок заблокирован" });
  };

  const updatePlayerMoney = async (playerId: string, amount: number) => {
    const { data: p } = await supabase.from("players").select("money, nickname").eq("id", playerId).maybeSingle();
    if (!p) return;
    const newMoney = Math.max(0, p.money + amount);
    await supabase.from("players").update({ money: newMoney }).eq("id", playerId);
    addLog("admin_money", { nickname: p.nickname, amount, newMoney }, p.nickname, playerId);
    toast({ title: `Баланс изменён: ${amount > 0 ? '+' : ''}${amount}` });
  };

  const updatePlayerLevel = async (playerId: string, level: number) => {
    const clampedLevel = Math.max(1, Math.min(50, level));
    const { data: p } = await supabase.from("players").select("nickname").eq("id", playerId).maybeSingle();
    await supabase.from("players").update({ house_level: clampedLevel }).eq("id", playerId);
    if (p) addLog("admin_level", { nickname: p.nickname, level: clampedLevel }, p.nickname, playerId);
    toast({ title: `Уровень установлен: ${clampedLevel}` });
  };

  const giveItem = async (playerId: string, item: ShopItem) => {
    const { data: p } = await supabase.from("players").select("inventory, nickname").eq("id", playerId).maybeSingle();
    if (!p) return;
    const inv = (p.inventory as any as ShopItem[]) || [];
    const existing = inv.find(i => i.id === item.id);
    const updated = existing
      ? inv.map(i => i.id === item.id ? { ...i, level: i.level + 1 } : i)
      : [...inv, { ...item, level: 1 }];
    await supabase.from("players").update({ inventory: updated as any }).eq("id", playerId);
    addLog("admin_give_item", { nickname: p.nickname, item: item.name }, p.nickname, playerId);
    toast({ title: `${item.name} выдан` });
  };

  const removeItem = async (playerId: string, itemId: string) => {
    const { data: p } = await supabase.from("players").select("inventory, nickname").eq("id", playerId).maybeSingle();
    if (!p) return;
    const inv = (p.inventory as any as ShopItem[]) || [];
    const updated = inv.filter(i => i.id !== itemId);
    await supabase.from("players").update({ inventory: updated as any }).eq("id", playerId);
    addLog("admin_remove_item", { nickname: p.nickname, itemId }, p.nickname, playerId);
    toast({ title: "Предмет удалён" });
  };

  // === РЫНОК ===
  const listItemForSale = async (item: ShopItem, price: number) => {
    if (!player || !gameSession || gameSession.status !== "active") return;

    const playerListingsInCategory = marketListings.filter(
      (l) => l.seller_id === player.id && (l.item as ShopItem).category === item.category
    );
    if (playerListingsInCategory.length >= 5) {
      toast({ title: "Максимум 5 лотов в категории", variant: "destructive" });
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
      
      if (newListing) {
        setMarketListings((prev) => [
          ...prev,
          { ...newListing, item: newListing.item as unknown as ShopItem }
        ]);
      }
      
      addLog("list_for_sale", { item: item.name, price });
      toast({ title: "Выставлено!", description: `${item.name} за $${price}` });
    } catch {
      setPlayer(player);
      toast({ title: "Ошибка выставления", variant: "destructive" });
    }
  };

  const buyFromMarket = async (listingId: string) => {
    if (!player || !gameSession) return;

    const listing = marketListings.find((l) => l.id === listingId);
    if (!listing || listing.sold) return;
    if (listing.seller_id === player.id) {
      toast({ title: "Нельзя купить свой лот", variant: "destructive" });
      return;
    }
    if (player.money < listing.price) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    // Check inventory limit
    const categoryItems = player.inventory.filter(i => i.category === listing.item.category);
    const existingItem = player.inventory.find(i => i.id === listing.item.id);
    if (!existingItem && categoryItems.length >= INVENTORY_LIMIT_PER_CATEGORY) {
      toast({
        title: "Инвентарь заполнен!",
        description: `Максимум ${INVENTORY_LIMIT_PER_CATEGORY} в категории`,
        variant: "destructive",
      });
      return;
    }

    const commission = Math.floor(listing.price * 0.07);
    const sellerEarns = listing.price - commission;

    const existing = player.inventory.find((i) => i.id === listing.item.id);
    const updatedBuyerInv = existing
      ? player.inventory.map((i) =>
          i.id === listing.item.id ? { ...i, level: i.level + 1 } : i
        )
      : [...player.inventory, { ...listing.item, level: 1 }];
    const newMoney = player.money - listing.price;

    setPlayer((prev) =>
      prev ? { ...prev, money: newMoney, inventory: updatedBuyerInv } : null
    );
    
    // Mark as sold for 5 seconds display
    setMarketListings((prev) => prev.map(l => l.id === listingId ? { ...l, sold: true } : l));
    
    // Remove after 5 seconds
    setTimeout(() => {
      setMarketListings((prev) => prev.filter(l => l.id !== listingId));
    }, 5000);

    try {
      const { error: deleteError } = await supabase
        .from("market_listings")
        .delete()
        .eq("id", listingId);
      
      if (deleteError) throw deleteError;

      await supabase
        .from("players")
        .update({ money: newMoney, inventory: updatedBuyerInv as any })
        .eq("id", player.id);

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

      addLog("buy_from_market", { item: listing.item.name, price: listing.price, seller: listing.seller_nickname });
      toast({ title: "Куплено!", description: listing.item.name });
    } catch (error) {
      setPlayer(player);
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

    const oldPlayer = player;
    const oldListings = marketListings;

    const existing = player.inventory.find((i) => i.id === listing.item.id);
    const updatedInv = existing
      ? player.inventory.map((i) =>
          i.id === listing.item.id ? { ...i, level: i.level + 1 } : i
        )
      : [...player.inventory, { ...listing.item, level: 1 }];

    setPlayer((prev) => (prev ? { ...prev, inventory: updatedInv } : null));
    setMarketListings((prev) => prev.filter((l) => l.id !== listingId));

    try {
      await supabase.from("market_listings").delete().eq("id", listingId);
      await supabase
        .from("players")
        .update({ inventory: updatedInv as any })
        .eq("id", player.id);
      toast({ title: "Лот снят", description: `${listing.item.name} вернулся в инвентарь` });
    } catch {
      setPlayer(oldPlayer);
      setMarketListings(oldListings);
      toast({ title: "Ошибка снятия лота", variant: "destructive" });
    }
  };

  const endGame = async () => {
    if (!gameSession || !isAdmin) return;
    await supabase
      .from("game_sessions")
      .update({ status: "finished" })
      .eq("id", gameSession.id);
    addLog("end_game", {});
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
      addLog("claim_mission", { missionId, reward });
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
    addLog("player_exit", { nickname: player.nickname });
    await supabase.from("players").delete().eq("id", player.id);
    localStorage.removeItem("eco_player_id");
    localStorage.removeItem("eco_session_id");
    setPlayer(null);
  }, [player]);

  const removePlayerById = useCallback(
    async (playerId: string) => {
      if (!isAdmin) return;
      const p = allPlayers.find(p => p.id === playerId);
      if (p) addLog("admin_kick", { nickname: p.nickname }, p.nickname, playerId);
      await supabase.from("players").delete().eq("id", playerId);
      toast({ title: "Игрок удален" });
    },
    [isAdmin, allPlayers]
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
    addLog("start_game", { duration });
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
      addLog("pause_game", {});
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
      addLog("resume_game", {});
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
        pending_rewards: [],
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
    addLog("restart_game", {});
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
        sellToBot,
        approvePlayer,
        denyPlayer,
        blockPlayer,
        updatePlayerMoney,
        updatePlayerLevel,
        giveItem,
        removeItem,
        pendingPlayers,
        gameLogs,
        addLog,
        claimPendingReward,
        getInventoryCount,
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
