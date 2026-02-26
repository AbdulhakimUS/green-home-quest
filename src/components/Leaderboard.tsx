import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const Leaderboard = () => {
  const { allPlayers, isAdmin } = useGame();
  const { t } = useLanguage();

  if (!isAdmin) return null;

  const sortedPlayers = [...allPlayers].sort((a, b) => {
    const scoreA = a.house_level + a.inventory.reduce((sum, item) => sum + item.level, 0) + a.money / 1000;
    const scoreB = b.house_level + b.inventory.reduce((sum, item) => sum + item.level, 0) + b.money / 1000;
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
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
          {t("leaderboard.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const medal = getMedal(index);
            const score = Math.round(player.house_level + player.inventory.reduce((sum, item) => sum + item.level, 0) + player.money / 1000);
            return (
              <div key={player.id} className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border ${index < 3 ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-sm sm:text-base md:text-lg font-bold w-6 sm:w-8 text-muted-foreground flex-shrink-0">#{index + 1}</span>
                  {medal && <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{medal}</span>}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs sm:text-sm md:text-base truncate">{player.nickname}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t("leaderboard.houseLevel")}: {Math.round(player.house_level * 10) / 10}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary text-sm sm:text-base">{score}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{t("leaderboard.points")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
