import { Building2, Bath, Sofa, UtensilsCrossed, Bed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";

export const HomeTab = () => {
  const { player } = useGame();

  const rooms = [
    { icon: Bath, name: "Ванная", items: player?.inventory.filter(i => i.category === "water").length || 0 },
    { icon: Sofa, name: "Гостиная", items: player?.inventory.filter(i => i.category === "energy").length || 0 },
    { icon: UtensilsCrossed, name: "Кухня", items: Math.floor((player?.inventory.length || 0) / 3) },
    { icon: Bed, name: "Спальня", items: Math.floor((player?.inventory.length || 0) / 4) }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <Building2 className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">Ваш Эко Дом</h2>
        <p className="text-muted-foreground">Уровень {player?.houseLevel || 1}/10</p>
      </div>

      <div className="relative aspect-video bg-gradient-to-b from-accent/20 to-success/10 rounded-2xl border-2 border-border overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="w-48 h-48 bg-card border-4 border-primary rounded-lg shadow-2xl flex items-center justify-center">
            <Building2 className="w-20 h-20 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-12 bg-success/30 rounded-lg border border-success/50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rooms.map((room, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="pb-3">
              <room.icon className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-sm">{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{room.items} предметов</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
