import { Trophy, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/types/game";

export const Leaderboard = () => {
  const { allPlayers, isAdmin } = useGame();

  // Показываем лидерборд только админу
  if (!isAdmin) return null;

  // Сортируем игроков по развитию дома
  const sortedPlayers = [...allPlayers].sort((a, b) => {
    // Вычисляем общее развитие: уровень дома + сумма уровней предметов + деньги/1000
    const scoreA = a.house_level + 
                   a.inventory.reduce((sum, item) => sum + item.level, 0) + 
                   a.money / 1000;
    const scoreB = b.house_level + 
                   b.inventory.reduce((sum, item) => sum + item.level, 0) + 
                   b.money / 1000;
    return scoreB - scoreA;
  });

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Таблица лидеров
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const medal = getMedal(index);
            const score = Math.round(
              player.house_level + 
              player.inventory.reduce((sum, item) => sum + item.level, 0) + 
              player.money / 1000
            );

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index < 3 ? "bg-primary/5 border-primary/20" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold w-8 text-muted-foreground">
                    #{index + 1}
                  </span>
                  {medal && <span className="text-2xl">{medal}</span>}
                  <div>
                    <p className="font-semibold">{player.nickname}</p>
                    <p className="text-xs text-muted-foreground">
                      Уровень дома: {Math.round(player.house_level * 10) / 10}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{score}</p>
                  <p className="text-xs text-muted-foreground">очков</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
