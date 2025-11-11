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

  if (!player?.selectedCard) {
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

  const items = shopItems[player.selectedCard];

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
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <ShoppingBag className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Магазин</h2>
          <p className="text-muted-foreground">
            Категория: {player.selectedCard === "energy" ? "Энергия" : player.selectedCard === "water" ? "Вода" : "Зелень"}
          </p>
        </div>

        <div className="grid gap-4">
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
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {item.name}
                        {level > 0 && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
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
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Эффективность: ⭐ {item.efficiency}/10
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Экология: 🌿 {item.ecology}/10
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(item);
                      }}
                      disabled={!canAfford}
                      className="min-w-[100px]"
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
