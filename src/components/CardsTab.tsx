import { Zap, Droplets, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { CardType } from "@/types/game";
import { toast } from "sonner";
import { useMemo, useCallback } from "react";

export const CardsTab = () => {
  const { selectCard, player } = useGame();

  const cards = useMemo(() => [
    {
      type: "energy" as CardType,
      icon: Zap,
      title: "Энергия",
      description: "Солнечные панели, ветряки и другие источники энергии",
      color: "from-warning/20 to-warning/5 border-warning/30"
    },
    {
      type: "water" as CardType,
      icon: Droplets,
      title: "Вода",
      description: "Системы сбора дождевой воды и фильтрации",
      color: "from-info/20 to-info/5 border-info/30"
    },
    {
      type: "greenery" as CardType,
      icon: Leaf,
      title: "Зелень",
      description: "Деревья, кусты и растения для экологии",
      color: "from-success/20 to-success/5 border-success/30"
    }
  ], []);

  const handleCardSelect = useCallback((cardType: CardType) => {
    selectCard(cardType);
    toast.success(`Выбрана карта: ${cards.find(c => c.type === cardType)?.title}`);
  }, [selectCard, cards]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Выберите категорию</h2>
        <p className="text-muted-foreground">Выберите карту для открытия магазина</p>
      </div>

      <div className="grid gap-4">
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
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      {card.title}
                      {isSelected && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          Выбрано
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">{card.description}</CardDescription>
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
