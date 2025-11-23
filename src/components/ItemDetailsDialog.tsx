import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShopItem } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import { Zap, Droplets, Leaf } from "lucide-react";

interface ItemDetailsDialogProps {
  item: ShopItem | null;
  onClose: () => void;
  currentLevel: number;
}

export const ItemDetailsDialog = ({ item, onClose, currentLevel }: ItemDetailsDialogProps) => {
  if (!item) return null;

  const getIcon = () => {
    switch (item.category) {
      case "energy":
        return <Zap className="w-16 h-16 text-warning" />;
      case "water":
        return <Droplets className="w-16 h-16 text-info" />;
      case "greenery":
        return <Leaf className="w-16 h-16 text-success" />;
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-muted rounded-2xl">
              {getIcon()}
            </div>
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl">{item.name}</DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
          {currentLevel > 0 && (
            <div className="text-center p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs sm:text-sm font-semibold">Текущий уровень: {currentLevel}</p>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium">Эффективность</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{item.efficiency}/10</span>
              </div>
              <Progress value={item.efficiency * 10} className="h-1.5 sm:h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium">Экологичность</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{item.ecology}/10</span>
              </div>
              <Progress value={item.ecology * 10} className="h-1.5 sm:h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium">Уровень предмета</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{item.tier}/6</span>
              </div>
              <Progress value={(item.tier / 6) * 100} className="h-1.5 sm:h-2" />
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong>Категория:</strong>{" "}
              {item.category === "energy" ? "Энергия" : item.category === "water" ? "Вода" : "Зелень"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              <strong>Базовая цена:</strong> {item.basePrice}$
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
