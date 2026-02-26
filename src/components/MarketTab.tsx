import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGame } from "@/contexts/GameContext";
import { CardType, ShopItem } from "@/types/game";
import { Droplet, Zap, Leaf, Store, ShoppingCart, Tag, AlertCircle, Bot } from "lucide-react";
import { formatMoney } from "@/lib/formatters";
import { useLanguage } from "@/contexts/LanguageContext";

const INVENTORY_LIMIT = 5;

export const MarketTab = () => {
  const { player, marketListings, listItemForSale, buyFromMarket, removeFromMarket, gameSession, sellToBot, getInventoryCount } = useGame();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CardType>("water");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [sellPrice, setSellPrice] = useState("");
  const [botSellDialogOpen, setBotSellDialogOpen] = useState(false);

  const categories: { id: CardType; name: string; icon: React.ReactNode }[] = [
    { id: "water", name: t("category.water"), icon: <Droplet className="h-4 w-4" /> },
    { id: "energy", name: t("category.energy"), icon: <Zap className="h-4 w-4" /> },
    { id: "greenery", name: t("category.greenery"), icon: <Leaf className="h-4 w-4" /> },
  ];

  if (!player) return null;

  if (!player.selected_card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <AlertCircle className="w-16 h-16 text-warning" />
        <h2 className="text-2xl font-bold">{t("market.selectCard")}</h2>
        <p className="text-muted-foreground text-center">{t("market.selectCardDesc")}</p>
      </div>
    );
  }

  const filteredListings = marketListings.filter(l => l.item.category === activeCategory);
  const allPlayerItems = player.inventory.filter(i => i.level > 0);
  const isStage2 = player.house_level > 25;

  const handleOpenSellDialog = (item: ShopItem) => {
    setSelectedItem(item);
    setSellPrice(Math.floor(item.basePrice * 0.75).toString());
    setSellDialogOpen(true);
  };

  const handleSell = async () => {
    if (!selectedItem) return;
    const price = parseInt(sellPrice);
    const maxPrice = Math.floor(selectedItem.basePrice * 0.75);
    if (isNaN(price) || price < 1 || price > maxPrice) return;
    await listItemForSale(selectedItem, price);
    setSellDialogOpen(false);
    setSelectedItem(null);
    setSellPrice("");
  };

  const handleSellToBot = async (item: ShopItem) => {
    await sellToBot(item);
    setBotSellDialogOpen(false);
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

  const stage1Items = allPlayerItems.filter(i => i.tier <= 3);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{t("market.title")}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{t("market.subtitle")}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map((cat) => {
          const count = getInventoryCount(cat.id);
          const isFull = count >= INVENTORY_LIMIT;
          return (
            <Button key={cat.id} variant={activeCategory === cat.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat.id)} className="gap-2">
              {cat.icon}
              <span className="hidden sm:inline">{cat.name}</span>
              <Badge variant={isFull ? "destructive" : "secondary"} className="text-[10px]">{count}/{INVENTORY_LIMIT}</Badge>
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 gap-2" variant="secondary">
              <Store className="h-4 w-4" />{t("market.sellToPlayers")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Tag className="h-5 w-5" />{t("market.listOnMarket")}</DialogTitle>
            </DialogHeader>
            {!selectedItem ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allPlayerItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">{t("market.noItems")}</p>
                  </div>
                ) : (
                  allPlayerItems.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleOpenSellDialog(item)}>
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{t("market.level")}: {item.level}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{t("market.max")}: {formatMoney(Math.floor(item.basePrice * 0.75))}</Badge>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">{getCategoryIcon(selectedItem.category)}<p className="font-medium">{selectedItem.name}</p></div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">{t("market.basePrice")}:</p><p className="text-right">{formatMoney(selectedItem.basePrice)}</p>
                      <p className="text-muted-foreground">{t("market.maxDiscount")}:</p><p className="text-right text-primary font-medium">{formatMoney(maxPrice)}</p>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("market.yourPrice")}:</label>
                  <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} max={maxPrice} min={1} />
                  {currentPrice > maxPrice && <p className="text-sm text-destructive"><AlertCircle className="h-3 w-3 inline mr-1" />{t("market.exceedsLimit")}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">{t("market.back")}</Button>
                  <Button onClick={handleSell} className="flex-1" disabled={!isPriceValid}>{t("market.listFor")} {formatMoney(currentPrice)}</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {isStage2 && stage1Items.length > 0 && (
          <Dialog open={botSellDialogOpen} onOpenChange={setBotSellDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2" variant="outline">
                <Bot className="h-4 w-4" />{t("market.sellToBot")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />{t("market.sellToBotTitle")}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">{t("market.sellToBotDesc")}</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stage1Items.map(item => (
                  <Card key={item.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleSellToBot(item)}>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{t("home.itemLevel")} {item.level}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{formatMoney(Math.floor(item.basePrice * 0.5))}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{categories.find(c => c.id === activeCategory)?.icon}</Badge>
          <span className="text-sm font-medium text-muted-foreground">{categories.find(c => c.id === activeCategory)?.name}</span>
          <Badge variant="secondary" className="ml-auto text-xs">{filteredListings.length} {t("market.lots")}</Badge>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {filteredListings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">{t("market.noLots")}</p>
              </CardContent>
            </Card>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className={`transition-all ${listing.sold ? 'opacity-50 border-destructive' : 'hover-scale'}`}>
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                        {listing.item.name}
                        <Badge variant="outline" className="text-[10px] sm:text-xs">{t("shop.tier")} {listing.item.tier}</Badge>
                        {listing.sold && <Badge variant="destructive" className="text-[10px]">{t("market.sold")}</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">{t("market.from")} {listing.seller_nickname}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>⭐ {listing.item.efficiency}/10</span>
                      <span>🌿 {listing.item.ecology}/10</span>
                    </div>
                    {listing.sold ? (
                      <Badge variant="destructive" className="text-xs">{t("market.sold")}</Badge>
                    ) : listing.seller_id === player.id ? (
                      <Button variant="destructive" size="sm" onClick={() => removeFromMarket(listing.id)} className="min-w-[100px] text-xs w-full sm:w-auto">
                        {t("market.remove")}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => buyFromMarket(listing.id)} disabled={player.money < listing.price || gameSession?.status !== "active"} className="min-w-[100px] text-xs w-full sm:w-auto">
                        {t("market.buy")} {formatMoney(listing.price)}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
