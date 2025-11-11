import { Home, ShoppingCart, CreditCard, Coins, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";

interface GameNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const GameNavbar = ({ activeTab, onTabChange }: GameNavbarProps) => {
  const { player } = useGame();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-50 lg:left-0 lg:top-0 lg:bottom-0 lg:right-auto lg:w-20 lg:border-r lg:border-b-0">
        <div className="flex justify-around items-center h-16 px-4 lg:flex-col lg:h-full lg:justify-start lg:gap-4 lg:py-8">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="icon"
            onClick={() => onTabChange("home")}
            className="relative group"
          >
            <Home className="w-6 h-6" />
            <span className="sr-only">Дом</span>
          </Button>
          <Button
            variant={activeTab === "shop" ? "default" : "ghost"}
            size="icon"
            onClick={() => onTabChange("shop")}
            className="relative group"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="sr-only">Магазин</span>
          </Button>
          <Button
            variant={activeTab === "cards" ? "default" : "ghost"}
            size="icon"
            onClick={() => onTabChange("cards")}
            className="relative group"
          >
            <CreditCard className="w-6 h-6" />
            <span className="sr-only">Карты</span>
          </Button>
        </div>
      </nav>

      <div className="fixed top-16 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-40 lg:top-0 lg:left-20 lg:right-0 lg:border-b">
        <div className="flex justify-between items-center h-14 px-4">
          <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold">Уровень {player?.houseLevel || 1}</span>
          </div>
          <div className="flex items-center gap-2 bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
            <Coins className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold">{player?.money || 0}$</span>
          </div>
        </div>
      </div>
    </>
  );
};
