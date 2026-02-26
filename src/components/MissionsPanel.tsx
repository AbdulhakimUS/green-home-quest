import { Target, CheckCircle2, Circle, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/types/game";
import { toast } from "sonner";
import { formatMoney } from "@/lib/formatters";
import { useLanguage } from "@/contexts/LanguageContext";

interface MissionDef {
  id: string;
  reward: number;
  condition: (player: Player) => boolean;
}

const missionDefs: MissionDef[] = [
  { id: "house_3", reward: 2000, condition: (p) => p.house_level >= 3 },
  { id: "house_5", reward: 5000, condition: (p) => p.house_level >= 5 },
  { id: "house_8", reward: 7000, condition: (p) => p.house_level >= 8 },
  { id: "house_10", reward: 10000, condition: (p) => p.house_level >= 10 },
  { id: "house_15", reward: 15000, condition: (p) => p.house_level >= 15 },
  { id: "house_20", reward: 20000, condition: (p) => p.house_level >= 20 },
  { id: "max_level", reward: 50000, condition: (p) => p.house_level >= 25 },
  { id: "money_30k", reward: 3000, condition: (p) => p.money >= 30000 },
  { id: "money_75k", reward: 7000, condition: (p) => p.money >= 75000 },
  { id: "money_150k", reward: 12000, condition: (p) => p.money >= 150000 },
  { id: "items_3", reward: 2000, condition: (p) => p.inventory.length >= 3 },
  { id: "items_5", reward: 3000, condition: (p) => p.inventory.length >= 5 },
  { id: "items_10", reward: 8000, condition: (p) => p.inventory.length >= 10 },
  { id: "items_15", reward: 12000, condition: (p) => p.inventory.length >= 15 },
  { id: "items_20", reward: 18000, condition: (p) => p.inventory.length >= 20 },
  { id: "items_30", reward: 30000, condition: (p) => p.inventory.length >= 30 },
  { id: "all_categories", reward: 5000, condition: (p) => new Set(p.inventory.map(i => i.category)).size === 3 },
  { id: "energy_5", reward: 6000, condition: (p) => p.inventory.filter(i => i.category === 'energy').length >= 5 },
  { id: "water_5", reward: 6000, condition: (p) => p.inventory.filter(i => i.category === 'water').length >= 5 },
  { id: "greenery_5", reward: 6000, condition: (p) => p.inventory.filter(i => i.category === 'greenery').length >= 5 },
  { id: "energy_10", reward: 15000, condition: (p) => p.inventory.filter(i => i.category === 'energy').length >= 10 },
  { id: "water_10", reward: 15000, condition: (p) => p.inventory.filter(i => i.category === 'water').length >= 10 },
  { id: "greenery_10", reward: 15000, condition: (p) => p.inventory.filter(i => i.category === 'greenery').length >= 10 },
  { id: "oxygen_15", reward: 3000, condition: (p) => p.oxygen >= 15 },
  { id: "oxygen_30", reward: 5000, condition: (p) => p.oxygen >= 30 },
  { id: "oxygen_60", reward: 10000, condition: (p) => p.oxygen >= 60 },
  { id: "oxygen_100", reward: 20000, condition: (p) => p.oxygen >= 100 },
  { id: "oxygen_150", reward: 35000, condition: (p) => p.oxygen >= 150 },
];

export const MissionsPanel = () => {
  const { player, claimMissionReward, gameSession } = useGame();
  const { t } = useLanguage();

  const handleClaimReward = async (missionId: string, reward: number) => {
    if (player?.completed_missions.includes(missionId)) {
      toast.error(t("missions.alreadyDone"));
      return;
    }
    if (gameSession?.status !== "active") {
      toast.error(t("missions.gameNotActive"));
      return;
    }
    await claimMissionReward(missionId, reward);
  };

  if (!player) return null;

  const completedCount = player.completed_missions.length;
  const totalMissions = missionDefs.length;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
            {t("missions.title")}
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{totalMissions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto">
          {missionDefs
            .sort((a, b) => {
              const aCompleted = player.completed_missions.includes(a.id);
              const bCompleted = player.completed_missions.includes(b.id);
              const aCanComplete = !aCompleted && a.condition(player);
              const bCanComplete = !bCompleted && b.condition(player);
              if (aCanComplete && !bCanComplete) return -1;
              if (!aCanComplete && bCanComplete) return 1;
              if (aCompleted && !bCompleted) return 1;
              if (!aCompleted && bCompleted) return -1;
              return 0;
            })
            .map((mission) => {
              const isCompleted = player.completed_missions?.includes(mission.id) ?? false;
              const conditionMet = mission.condition(player);
              const canComplete = !isCompleted && conditionMet;

              return (
                <div
                  key={mission.id}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-colors ${
                    isCompleted ? "bg-success/10 border-success/20" : canComplete ? "bg-primary/10 border-primary/20" : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" /> : canComplete ? <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">{t(`mission.${mission.id}.title`)}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t(`mission.${mission.id}.desc`)}</p>
                      <p className="text-[10px] sm:text-xs text-primary mt-0.5 sm:mt-1 font-medium">
                        {t("missions.reward")}: {formatMoney(mission.reward)}
                      </p>
                    </div>
                    {canComplete && (
                      <Button size="sm" onClick={() => handleClaimReward(mission.id, mission.reward)} className="flex-shrink-0 text-xs">
                        {t("missions.claim")}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};
