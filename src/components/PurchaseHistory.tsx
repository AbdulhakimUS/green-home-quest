import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PurchaseHistoryProps {
  playerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Purchase {
  id: string;
  item_name: string;
  category: string;
  tier: number;
  level: number;
  price: number;
  purchased_at: string;
}

export const PurchaseHistory = ({ playerId, open, onOpenChange }: PurchaseHistoryProps) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open || !playerId) return;
    const loadHistory = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('player_id', playerId)
        .order('purchased_at', { ascending: false });
      if (data) setPurchases(data);
      setLoading(false);
    };
    loadHistory();
    const channel = supabase
      .channel('purchase-history-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'purchase_history', filter: `player_id=eq.${playerId}` }, () => { loadHistory(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [open, playerId]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy': return 'text-yellow-500';
      case 'water': return 'text-blue-500';
      case 'greenery': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("history.title")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
          {loading ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">{t("history.loading")}</div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">{t("history.empty")}</div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {purchases.map((purchase, index) => (
                <div key={purchase.id} className="bg-card border border-border rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm sm:text-base truncate">{purchase.item_name}</div>
                      <div className={`text-xs sm:text-sm ${getCategoryColor(purchase.category)}`}>
                        {t(`category.${purchase.category}`)} • {t("history.level")} {purchase.level}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-base sm:text-lg">${purchase.price}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{t("history.level")} {purchase.tier}</div>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(purchase.purchased_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
