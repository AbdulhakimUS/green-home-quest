import { Home, ShoppingCart, CreditCard, Coins, TrendingUp, Clock, History, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { PurchaseHistory } from "./PurchaseHistory";

interface GameNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const GameNavbar = ({ activeTab, onTabChange }: GameNavbarProps) => {
  const { player, timeRemaining, gameSession } = useGame();
  const [showHistory, setShowHistory] = useState(false);

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
            className="flex-col h-auto py-2 lg:w-full lg:flex-row lg:justify-start"
          >
            <Target className="w-6 h-6 lg:mr-2" />
            <span className="text-xs mt-1 lg:text-sm lg:mt-0">Миссии</span>
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
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold">{player?.money || 0}$</span>
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
