import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGame } from "@/contexts/GameContext";
import { CardType, ShopItem } from "@/types/game";
import { Droplet, Zap, Leaf, Store } from "lucide-react";
import { formatMoney } from "@/lib/formatters";

const categories: { id: CardType; name: string; icon: React.ReactNode }[] = [
  { id: "water", name: "Вода", icon: <Droplet className="h-4 w-4" /> },
  { id: "energy", name: "Энергия", icon: <Zap className="h-4 w-4" /> },
  { id: "greenery", name: "Зелень", icon: <Leaf className="h-4 w-4" /> },
];

export const MarketTab = () => {
  const { player, marketListings, listItemForSale, buyFromMarket, removeFromMarket } = useGame();
  const [activeCategory, setActiveCategory] = useState<CardType>("water");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [sellPrice, setSellPrice] = useState("");

  if (!player) return null;

  const filteredListings = marketListings.filter(l => l.item.category === activeCategory);
  const playerItems = player.inventory.filter(i => i.level > 0);

  const handleOpenSellDialog = (item: ShopItem) => {
    setSelectedItem(item);
    setSellPrice(Math.floor(item.basePrice * 0.75).toString());
    setSellDialogOpen(true);
  };

  const handleSell = async () => {
    if (!selectedItem) return;
    const price = parseInt(sellPrice);
    if (isNaN(price) || price < 1) return;
    
    await listItemForSale(selectedItem, price);
    setSellDialogOpen(false);
    setSelectedItem(null);
    setSellPrice("");
  };

  const maxPrice = selectedItem ? Math.floor(selectedItem.basePrice * 0.75) : 0;

  return (
    <div className="space-y-4">
      {/* Категории */}
      <div className="flex gap-2 justify-center">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className="gap-2"
          >
            {cat.icon}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Кнопка выставить на продажу */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2" variant="secondary">
            <Store className="h-4 w-4" />
            Выставить на продажу
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выставить предмет на рынок</DialogTitle>
          </DialogHeader>
          
          {!selectedItem ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playerItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Нет предметов для продажи</p>
              ) : (
                playerItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleOpenSellDialog(item)}
                  >
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Уровень: {item.level}</p>
                      </div>
                      <Badge variant="outline">Макс: {formatMoney(Math.floor(item.basePrice * 0.75))}</Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-sm text-muted-foreground">Базовая цена: {formatMoney(selectedItem.basePrice)}</p>
                <p className="text-sm text-primary">Максимум: {formatMoney(maxPrice)}</p>
              </div>
              <div>
                <label className="text-sm">Ваша цена:</label>
                <Input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  max={maxPrice}
                  min={1}
                />
                {parseInt(sellPrice) > maxPrice && (
                  <p className="text-sm text-destructive mt-1">Цена превышает лимит!</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                  Назад
                </Button>
                <Button 
                  onClick={handleSell} 
                  className="flex-1"
                  disabled={parseInt(sellPrice) > maxPrice || parseInt(sellPrice) < 1}
                >
                  Выставить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Список лотов */}
      <div className="space-y-2">
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Нет лотов в этой категории
            </CardContent>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{listing.item.name}</p>
                    <p className="text-lg font-bold text-primary">{formatMoney(listing.price)}</p>
                    <p className="text-xs text-muted-foreground">Продавец: {listing.seller_nickname}</p>
                  </div>
                  {listing.seller_id === player.id ? (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeFromMarket(listing.id)}
                    >
                      Убрать
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => buyFromMarket(listing.id)}
                      disabled={player.money < listing.price}
                    >
                      Купить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
