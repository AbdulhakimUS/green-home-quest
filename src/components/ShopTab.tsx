import { ShoppingBag, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { shopItems } from "@/data/shopItems";
import { ShopItem } from "@/types/game";
import { toast } from "sonner";
import { ItemDetailsDialog } from "./ItemDetailsDialog";
import { useState } from "react";
import { formatMoney } from "@/lib/formatters";

const INVENTORY_LIMIT = 5;

export const ShopTab = () => {
  const { player, purchaseItem, gameSession, getInventoryCount } = useGame();
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
  const isStage2 = player.house_level > 25;
  const categoryCount = getInventoryCount(player.selected_card);
  const isFull = categoryCount >= INVENTORY_LIMIT;

  const handlePurchase = async (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    
    // Check inventory limit for new items
    if (!existingItem && isFull) {
      toast.error(`Инвентарь заполнен (${INVENTORY_LIMIT}/${INVENTORY_LIMIT})! Продайте предмет на рынке.`);
      return;
    }

    // Stage 2 check
    if (isStage2 && item.tier <= 3) {
      toast.error("На Этапе 2 базовые предметы недоступны");
      return;
    }
    
    const currentLevel = existingItem ? existingItem.level : 0;
    const cost = Math.floor(item.basePrice * Math.pow(1.5, currentLevel));

    if (player.money < cost) {
      toast.error("Недостаточно средств!");
      return;
    }

    await purchaseItem(item);
  };

  const getCost = (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    const currentLevel = existingItem ? existingItem.level : 0;
    return Math.floor(item.basePrice * Math.pow(1.5, currentLevel));
  };

  const getLevel = (item: ShopItem) => {
    const existingItem = player.inventory.find(
      i => i.id === item.id && i.category === item.category
    );
    return existingItem ? existingItem.level : 0;
  };

  const groupedItems = items.reduce((acc, item) => {
    const tier = item.tier;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(item);
    return acc;
  }, {} as Record<number, ShopItem[]>);

  const tierNames: Record<number, string> = {
    1: "Базовые",
    2: "Улучшенные", 
    3: "Продвинутые",
    4: "Профессиональные",
    5: "Элитные",
    6: "Легендарные"
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
          {/* Inventory counter */}
          <Badge variant={isFull ? "destructive" : "secondary"} className="text-sm">
            Инвентарь: {categoryCount}/{INVENTORY_LIMIT}
          </Badge>
          {isFull && (
            <p className="text-xs text-destructive">
              ⚠️ Инвентарь заполнен! Продайте предмет на рынке для покупки нового.
            </p>
          )}
        </div>

        {Object.entries(groupedItems).map(([tier, tierItems]) => {
          const tierNum = Number(tier);
          const isLockedStage2 = isStage2 && tierNum <= 3;

          return (
            <div key={tier} className={`space-y-3 ${isLockedStage2 ? 'opacity-40' : ''}`}>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Тир {tier}</Badge>
                <span className="text-sm font-medium text-muted-foreground">{tierNames[tierNum]}</span>
                {isLockedStage2 && <Badge variant="destructive" className="text-[10px]">Этап 1</Badge>}
              </div>
              
              <div className="grid gap-3 sm:gap-4">
              {tierItems.map((item) => {
                  const cost = getCost(item);
                  const level = getLevel(item);
                  const canAfford = player.money >= cost;
                  const isNewItem = level === 0;
                  const blocked = (isNewItem && isFull) || isLockedStage2;

                  return (
                    <Card 
                      key={item.id} 
                      className={`hover-scale cursor-pointer transition-all ${(!canAfford || blocked) ? "opacity-60" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardHeader className="p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                          <CardTitle className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                              {item.name}
                              {level > 0 && (
                                <Badge variant="default" className="text-[10px] sm:text-xs">
                                  Ур. {level}
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs line-clamp-2">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>⭐ {Math.min(10, Math.round(item.efficiency * (1 + level * 0.2)))}/10</span>
                            <span>🌿 {item.ecology}/10</span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePurchase(item);
                            }}
                            disabled={!canAfford || gameSession?.status !== "active" || blocked}
                            className="min-w-[100px] text-xs sm:text-sm w-full sm:w-auto"
                            size="sm"
                          >
                            {blocked ? "🔒" : level > 0 ? "Улучшить" : "Купить"} {formatMoney(cost)}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentLevel={selectedItem ? getLevel(selectedItem) : 0}
      />
    </>
  );
};
