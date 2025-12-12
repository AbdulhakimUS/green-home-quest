import { Target, CheckCircle2, Circle, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { Mission, Player } from "@/types/game";
import { toast } from "sonner";
import { formatMoney } from "@/lib/formatters";

// Миссии с фиксированными целями
const missions: Mission[] = [
  {
    id: "house_5",
    title: "Начальное развитие",
    description: "Построй дом до уровня 5",
    reward: 5000,
    condition: (player: Player) => player.house_level >= 5
  },
  {
    id: "money_30k",
    title: "Первый капитал",
    description: "Накопи $30,000",
    reward: 3000,
    condition: (player: Player) => player.money >= 30000
  },
  {
    id: "all_categories",
    title: "Разносторонний",
    description: "Купи предметы из всех 3 категорий",
    reward: 5000,
    condition: (player: Player) => {
      const categories = new Set(player.inventory.map(i => i.category));
      return categories.size === 3;
    }
  },
  {
    id: "items_5",
    title: "Начинающий коллекционер",
    description: "Собери 5 разных предметов",
    reward: 3000,
    condition: (player: Player) => player.inventory.length >= 5
  },
  {
    id: "house_10",
    title: "Опытный строитель",
    description: "Построй дом до уровня 10",
    reward: 10000,
    condition: (player: Player) => player.house_level >= 10
  },
  {
    id: "oxygen_30",
    title: "Свежий воздух",
    description: "Достигни 30 единиц кислорода",
    reward: 5000,
    condition: (player: Player) => player.oxygen >= 30
  },
  {
    id: "items_10",
    title: "Коллекционер",
    description: "Собери 10 разных предметов",
    reward: 8000,
    condition: (player: Player) => player.inventory.length >= 10
  },
  {
    id: "house_15",
    title: "Мастер строительства",
    description: "Построй дом до уровня 15",
    reward: 15000,
    condition: (player: Player) => player.house_level >= 15
  },
  {
    id: "oxygen_60",
    title: "Дыши полной грудью",
    description: "Достигни 60 единиц кислорода",
    reward: 10000,
    condition: (player: Player) => player.oxygen >= 60
  },
  {
    id: "items_15",
    title: "Опытный коллекционер",
    description: "Собери 15 разных предметов",
    reward: 12000,
    condition: (player: Player) => player.inventory.length >= 15
  },
  {
    id: "house_20",
    title: "Эксперт строительства",
    description: "Построй дом до уровня 20",
    reward: 20000,
    condition: (player: Player) => player.house_level >= 20
  },
  {
    id: "max_level",
    title: "Максимальное развитие",
    description: "Достигни максимального уровня дома (25)",
    reward: 50000,
    condition: (player: Player) => player.house_level >= 25
  }
];

export const MissionsPanel = () => {
  const { player, claimMissionReward, gameSession } = useGame();

  const handleClaimReward = async (missionId: string, reward: number) => {
    if (player?.completed_missions.includes(missionId)) {
      toast.error("Миссия уже выполнена");
      return;
    }
    if (gameSession?.status !== "active") {
      toast.error("Игра не активна");
      return;
    }
    await claimMissionReward(missionId, reward);
  };

  if (!player) return null;

  const completedCount = player.completed_missions.length;
  const totalMissions = missions.length;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
            Миссии
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{totalMissions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto">
          {missions
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
              const isCompleted = player.completed_missions.includes(mission.id);
              const canComplete = !isCompleted && mission.condition(player);

              return (
                <div
                  key={mission.id}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-colors ${
                    isCompleted
                      ? "bg-success/10 border-success/20"
                      : canComplete
                      ? "bg-primary/10 border-primary/20 animate-pulse"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                      ) : canComplete ? (
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-bounce" />
                      ) : (
                        <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm">{mission.title}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{mission.description}</p>
                      <p className="text-[10px] sm:text-xs text-primary mt-0.5 sm:mt-1 font-medium">
                        Награда: {formatMoney(mission.reward)}
                      </p>
                    </div>
                    {canComplete && (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(mission.id, mission.reward)}
                        className="flex-shrink-0 text-xs"
                      >
                        Забрать
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
