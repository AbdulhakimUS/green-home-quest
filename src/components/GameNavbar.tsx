import { Home, ShoppingCart, CreditCard, Coins, TrendingUp, Clock, History, Target, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { PurchaseHistory } from "./PurchaseHistory";

interface GameNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExitClick?: () => void;
}

export const GameNavbar = ({ activeTab, onTabChange, onExitClick }: GameNavbarProps) => {
  const { player, timeRemaining, gameSession, currentIncome } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const [hasUnclaimedMission, setHasUnclaimedMission] = useState(false);

  // Проверяем, есть ли невыполненные миссии
  useEffect(() => {
    if (!player) return;
    
    const missions = [
      { id: "house_5", condition: (p: any) => p.house_level >= 5 },
      { id: "money_50k", condition: (p: any) => p.money >= 50000 },
      { id: "all_categories", condition: (p: any) => {
        const categories = new Set(p.inventory.map((i: any) => i.category));
        return categories.size === 3;
      }},
      { id: "house_10", condition: (p: any) => p.house_level >= 10 },
      { id: "house_15", condition: (p: any) => p.house_level >= 15 },
      { id: "items_10", condition: (p: any) => p.inventory.length >= 10 },
      { id: "oxygen_50", condition: (p: any) => p.oxygen >= 50 },
      { id: "money_200k", condition: (p: any) => p.money >= 200000 },
      { id: "house_20", condition: (p: any) => p.house_level >= 20 },
      { id: "max_level", condition: (p: any) => p.house_level >= 25 },
    ];

    const hasUnclaimed = missions.some(m => 
      !player.completed_missions.includes(m.id) && m.condition(player)
    );
    
    setHasUnclaimedMission(hasUnclaimed);
  }, [player]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const houseProgress = player ? ((player.house_level / 25) * 100) : 0;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 lg:left-0 lg:top-0 lg:bottom-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0">
        <div className="flex justify-around items-center h-16 px-4 lg:flex-col lg:h-full lg:justify-start lg:gap-4 lg:py-8">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            onClick={() => onTabChange("home")}
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start"
          >
            <Home className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">Дом</span>
          </Button>
          <Button
            variant={activeTab === "shop" ? "default" : "ghost"}
            onClick={() => onTabChange("shop")}
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start"
          >
            <ShoppingCart className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">Магазин</span>
          </Button>
          <Button
            variant={activeTab === "cards" ? "default" : "ghost"}
            onClick={() => onTabChange("cards")}
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start"
          >
            <CreditCard className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">Карты</span>
          </Button>
          <Button
            variant={activeTab === "missions" ? "default" : "ghost"}
            onClick={() => onTabChange("missions")}
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start relative"
          >
            <Target className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">Миссии</span>
            {hasUnclaimedMission && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0">
                <Gift className="w-3 h-3" />
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowHistory(true)}
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start"
          >
            <History className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">История</span>
          </Button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-40 lg:left-64">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold">
                {player && player.house_level >= 25 ? "Макс уровень" : `Уровень ${player?.house_level.toFixed(2) || 1}`}
              </span>
            </div>
            {timeRemaining !== null && gameSession?.status === 'active' && (
              <div className="flex items-center gap-2 text-warning">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold">{player?.money.toFixed(0) || 0}$</span>
              </div>
              <div className="text-xs text-success">
                Доход: {currentIncome.toFixed(1)}$/сек
              </div>
            </div>
          </div>
          {player && player.house_level < 25 && (
            <Progress value={houseProgress} className="h-2" />
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
