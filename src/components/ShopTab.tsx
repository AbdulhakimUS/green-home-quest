import { ShoppingBag, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { shopItems } from "@/data/shopItems";
import { ShopItem } from "@/types/game";
import { toast } from "sonner";
import { ItemDetailsDialog } from "./ItemDetailsDialog";
import { useState } from "react";

export const ShopTab = () => {
  const { player, purchaseItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  if (!player?.selected_card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <AlertCircle className="w-16 h-16 text-warning" />
        <h2 className="text-2xl font-bold">Выберите карту</h2>
        <p className="text-muted-foreground text-center">
          Для доступа к магазину сначала выберите карту в разделе "Карты"
        </p>
      </div>
    );
  }

  const items = shopItems[player.selected_card];

  const handlePurchase = (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    
    const currentLevel = existingItem ? existingItem.level : 0;
    const cost = Math.floor(item.basePrice * Math.pow(1.3, currentLevel));

    if (player.money < cost) {
      toast.error("Недостаточно средств!");
      return;
    }

    purchaseItem(item);
    toast.success(`${item.name} ${currentLevel > 0 ? `улучшен до уровня ${currentLevel + 1}` : "куплен"}!`);
  };

  const getCost = (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    const currentLevel = existingItem ? existingItem.level : 0;
    return Math.floor(item.basePrice * Math.pow(1.3, currentLevel));
  };

  const getLevel = (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    return existingItem ? existingItem.level : 0;
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Магазин</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Категория: {player.selected_card === "energy" ? "Энергия" : player.selected_card === "water" ? "Вода" : "Зелень"}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {items.map((item) => {
            const cost = getCost(item);
            const level = getLevel(item);
            const canAfford = player.money >= cost;

            return (
              <Card 
                key={item.id} 
                className={`hover-scale cursor-pointer ${!canAfford ? "opacity-60" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader className="p-3 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
                        {item.name}
                        {level > 0 && (
                          <span className="text-[10px] sm:text-xs bg-primary text-primary-foreground px-2 py-0.5 sm:py-1 rounded-full">
                            Ур. {level}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Эффективность: ⭐ {Math.min(10, Math.round(item.efficiency * (1 + level * 0.2)))}/10
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Экология: 🌿 {item.ecology}/10
                      </div>
                      <div className="text-xs sm:text-sm text-primary font-semibold">
                        💰 {(item.profitPerSecond * (level > 0 ? Math.pow(1.5, level - 1) * level : 1)).toFixed(1).replace('.', ',')}$/сек
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(item);
                      }}
                      disabled={!canAfford}
                      className="min-w-[100px] text-xs sm:text-sm w-full sm:w-auto"
                      size="sm"
                    >
                      {level > 0 ? "Улучшить" : "Купить"} {cost}$
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentLevel={selectedItem ? getLevel(selectedItem) : 0}
      />
    </>
  );
};
