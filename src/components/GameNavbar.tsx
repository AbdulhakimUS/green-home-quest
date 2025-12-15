import {
  Home,
  ShoppingCart,
  CreditCard,
  Coins,
  TrendingUp,
  Clock,
  History,
  Target,
  Gift,
  LogOut,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { PurchaseHistory } from "./PurchaseHistory";
import { formatLevel, formatMoney } from "@/lib/formatters";

interface GameNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExitClick?: () => void;
}

export const GameNavbar = ({
  activeTab,
  onTabChange,
  onExitClick,
}: GameNavbarProps) => {
  const { player, timeRemaining, gameSession } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const [hasUnclaimedMission, setHasUnclaimedMission] = useState(false);

  // Проверяем, есть ли невыполненные миссии
  useEffect(() => {
    if (!player) return;

    const missions = [
      { id: "house_5", condition: (p: any) => p.house_level >= 5 },
      { id: "money_50k", condition: (p: any) => p.money >= 50000 },
      {
        id: "all_categories",
        condition: (p: any) => {
          const categories = new Set(p.inventory.map((i: any) => i.category));
          return categories.size === 3;
        },
      },
      { id: "house_10", condition: (p: any) => p.house_level >= 10 },
      { id: "house_15", condition: (p: any) => p.house_level >= 15 },
      { id: "items_10", condition: (p: any) => p.inventory.length >= 10 },
      { id: "oxygen_50", condition: (p: any) => p.oxygen >= 50 },
      { id: "money_200k", condition: (p: any) => p.money >= 200000 },
      { id: "house_20", condition: (p: any) => p.house_level >= 20 },
      { id: "max_level", condition: (p: any) => p.house_level >= 25 },
    ];

    const hasUnclaimed = missions.some(
      (m) => !player.completed_missions.includes(m.id) && m.condition(player)
    );

    setHasUnclaimedMission(hasUnclaimed);
  }, [player]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const houseProgress = player ? (player.house_level / 25) * 100 : 0;
  const displayLevel = player ? formatLevel(player.house_level) : "0";

  return (
    <>
      {/* Кнопка выхода для мобильных - сверху слева, только на вкладке "Дом" */}
      {onExitClick && activeTab === "home" && (
        <Button
          variant="destructive"
          onClick={onExitClick}
          className="fixed top-24 left-4 z-50 w-12 h-12 rounded-full p-0 flex items-center justify-center lg:hidden shadow-lg"
          title="Выйти из комнаты"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 lg:left-0 lg:top-0 lg:bottom-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0 safe-area-bottom">
        <div className="flex justify-around items-center h-14 px-1 lg:flex-col lg:h-full lg:justify-start lg:gap-4 lg:py-8">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            onClick={() => onTabChange("home")}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4"
          >
            <Home className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">Дом</span>
          </Button>
          <Button
            variant={activeTab === "shop" ? "default" : "ghost"}
            onClick={() => onTabChange("shop")}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4"
          >
            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">Магазин</span>
          </Button>
          <Button
            variant={activeTab === "cards" ? "default" : "ghost"}
            onClick={() => onTabChange("cards")}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4"
          >
            <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">Карты</span>
          </Button>
          <Button
            variant={activeTab === "market" ? "default" : "ghost"}
            onClick={() => onTabChange("market")}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4"
          >
            <Store className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">Рынок</span>
          </Button>
          <Button
            variant={activeTab === "missions" ? "default" : "ghost"}
            onClick={() => onTabChange("missions")}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4 relative"
          >
            <Target className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">Миссии</span>
            {hasUnclaimedMission && (
              <Badge
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center p-0"
              >
                <Gift className="w-2.5 h-2.5" />
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowHistory(true)}
            className="flex-col h-auto py-1.5 px-2 min-w-0 lg:w-full lg:flex-row lg:justify-start lg:py-2 lg:px-4"
          >
            <History className="w-5 h-5 lg:w-6 lg:h-6 lg:mr-2" />
            <span className="text-[10px] mt-0.5 lg:text-sm lg:mt-0">История</span>
          </Button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-40 lg:left-64">
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="flex justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
              <span className="text-sm sm:text-base font-semibold truncate">
                {player && player.house_level >= 25
                  ? "Макс"
                  : `Ур. ${displayLevel}`}
              </span>
            </div>
            {timeRemaining !== null && gameSession?.status === "active" && (
              <div className="flex items-center gap-2 text-warning px-2 py-1 bg-warning/10 rounded-md">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <div className="flex flex-col items-end gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold truncate">
                  {formatMoney(player?.money || 0)}$
                </span>
              </div>
            </div>
          </div>
          {player && player.house_level < 25 && (
            <Progress value={houseProgress} className="h-2.5" />
          )}
        </div>
      </div>

      {player && (
        <PurchaseHistory
          playerId={player.id}
          open={showHistory}
          onOpenChange={setShowHistory}
        />
      )}
    </>
  );
};
