import { Zap, Droplets, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { CardType } from "@/types/game";
import { toast } from "sonner";
import { useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CardsTab = () => {
  const { selectCard, player } = useGame();
  const { t } = useLanguage();

  const cards = useMemo(() => [
    {
      type: "energy" as CardType,
      icon: Zap,
      title: t("category.energy"),
      description: t("cards.energyDesc"),
      color: "from-warning/20 to-warning/5 border-warning/30"
    },
    {
      type: "water" as CardType,
      icon: Droplets,
      title: t("category.water"),
      description: t("cards.waterDesc"),
      color: "from-info/20 to-info/5 border-info/30"
    },
    {
      type: "greenery" as CardType,
      icon: Leaf,
      title: t("category.greenery"),
      description: t("cards.greeneryDesc"),
      color: "from-success/20 to-success/5 border-success/30"
    }
  ], [t]);

  const handleCardSelect = useCallback((cardType: CardType) => {
    selectCard(cardType);
    toast.success(`${t("cards.selectedCard")}: ${cards.find(c => c.type === cardType)?.title}`);
  }, [selectCard, cards, t]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="text-center space-y-1.5 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">{t("cards.title")}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t("cards.desc")}</p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = player?.selected_card === card.type;
          
          return (
            <Card
              key={card.type}
              className={`cursor-pointer transition-all hover-scale bg-gradient-to-br ${card.color} ${
                isSelected ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => handleCardSelect(card.type)}
            >
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-2 sm:p-3 rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                      <span className="truncate">{card.title}</span>
                      {isSelected && (
                        <span className="text-[10px] sm:text-xs bg-primary text-primary-foreground px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          {t("cards.selected")}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm">{card.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
