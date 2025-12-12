import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGame } from "@/contexts/GameContext";
import { CardType, ShopItem } from "@/types/game";
import { Droplet, Zap, Leaf, Store, ShoppingCart, Tag, AlertCircle } from "lucide-react";
import { formatMoney } from "@/lib/formatters";

const categories: { id: CardType; name: string; icon: React.ReactNode }[] = [
  { id: "water", name: "Вода", icon: <Droplet className="h-4 w-4" /> },
  { id: "energy", name: "Энергия", icon: <Zap className="h-4 w-4" /> },
  { id: "greenery", name: "Зелень", icon: <Leaf className="h-4 w-4" /> },
];

export const MarketTab = () => {
  const { player, marketListings, listItemForSale, buyFromMarket, removeFromMarket, gameSession } = useGame();
  const [activeCategory, setActiveCategory] = useState<CardType>("water");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [sellPrice, setSellPrice] = useState("");

  if (!player) return null;

  if (!player.selected_card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <AlertCircle className="w-16 h-16 text-warning" />
        <h2 className="text-2xl font-bold">Выберите карту</h2>
        <p className="text-muted-foreground text-center">
          Для доступа к рынку сначала выберите карту в разделе "Карты"
        </p>
      </div>
    );
  }

  const filteredListings = marketListings.filter(l => l.item.category === activeCategory);
  const playerItemsForCategory = player.inventory.filter(i => i.level > 0 && i.category === activeCategory);
  const allPlayerItems = player.inventory.filter(i => i.level > 0);

  const handleOpenSellDialog = (item: ShopItem) => {
    setSelectedItem(item);
    setSellPrice(Math.floor(item.basePrice * 0.75).toString());
    setSellDialogOpen(true);
  };

  const handleSell = async () => {
    if (!selectedItem) return;
    const price = parseInt(sellPrice);
    const maxPrice = Math.floor(selectedItem.basePrice * 0.75);
    
    if (isNaN(price) || price < 1) {
      return;
    }
    if (price > maxPrice) {
      return;
    }
    
    await listItemForSale(selectedItem, price);
    setSellDialogOpen(false);
    setSelectedItem(null);
    setSellPrice("");
  };

  const maxPrice = selectedItem ? Math.floor(selectedItem.basePrice * 0.75) : 0;
  const currentPrice = parseInt(sellPrice) || 0;
  const isPriceValid = currentPrice >= 1 && currentPrice <= maxPrice;

  const getCategoryIcon = (category: CardType) => {
    switch (category) {
      case "water": return <Droplet className="h-3 w-3" />;
      case "energy": return <Zap className="h-3 w-3" />;
      case "greenery": return <Leaf className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-primary" />
        <h2 className="text-xl sm:text-2xl font-bold">Рынок</h2>
        <p className="text-sm text-muted-foreground">
          Покупайте и продавайте предметы другим игрокам
        </p>
      </div>

      {/* Категории */}
      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className="gap-2"
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.name}</span>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Выставить предмет на рынок
            </DialogTitle>
          </DialogHeader>
          
          {!selectedItem ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allPlayerItems.length === 0 ? (
                <div className="text-center py-8">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Нет предметов для продажи</p>
                  <p className="text-xs text-muted-foreground mt-1">Купите предметы в магазине</p>
                </div>
              ) : (
                allPlayerItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleOpenSellDialog(item)}
                  >
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Уровень: {item.level}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Макс: {formatMoney(Math.floor(item.basePrice * 0.75))}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(selectedItem.category)}
                    <p className="font-medium">{selectedItem.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Базовая цена:</p>
                    <p className="text-right">{formatMoney(selectedItem.basePrice)}</p>
                    <p className="text-muted-foreground">Максимум (-25%):</p>
                    <p className="text-right text-primary font-medium">{formatMoney(maxPrice)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ваша цена:</label>
                <Input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  max={maxPrice}
                  min={1}
                  placeholder="Введите цену"
                />
                {currentPrice > maxPrice && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Цена превышает лимит!
                  </p>
                )}
                {currentPrice < 1 && sellPrice !== "" && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Минимальная цена: $1
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                  Назад
                </Button>
                <Button 
                  onClick={handleSell} 
                  className="flex-1"
                  disabled={!isPriceValid}
                >
                  Выставить за {formatMoney(currentPrice)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Статистика рынка */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{marketListings.length}</p>
            <p className="text-xs text-muted-foreground">Всего лотов</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{filteredListings.length}</p>
            <p className="text-xs text-muted-foreground">В категории</p>
          </CardContent>
        </Card>
      </div>

      {/* Список лотов */}
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          {categories.find(c => c.id === activeCategory)?.icon}
          {categories.find(c => c.id === activeCategory)?.name}
          <Badge variant="secondary" className="ml-auto">{filteredListings.length}</Badge>
        </h3>
        
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Нет лотов в этой категории</p>
              <p className="text-xs text-muted-foreground mt-1">Станьте первым продавцом!</p>
            </CardContent>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{listing.item.name}</p>
                    <p className="text-lg font-bold text-primary">{formatMoney(listing.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Тир {listing.item.tier}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        от {listing.seller_nickname}
                      </span>
                    </div>
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
                      disabled={player.money < listing.price || gameSession?.status !== "active"}
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

      {/* Комиссия */}
      <p className="text-xs text-center text-muted-foreground">
        Комиссия рынка: 7% с продажи
      </p>
    </div>
  );
};
