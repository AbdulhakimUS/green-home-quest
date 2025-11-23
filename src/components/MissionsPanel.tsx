import { Target, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Mission } from "@/types/game";
import { toast } from "sonner";

const missions: Mission[] = [
  {
    id: "house_5",
    title: "Начальное развитие",
    description: "Построй дом до уровня 5",
    reward: 5000,
    condition: (player) => player.house_level >= 5
  },
  {
    id: "money_50k",
    title: "Первый капитал",
    description: "Собери 50,000$",
    reward: 10000,
    condition: (player) => player.money >= 50000
  },
  {
    id: "all_categories",
    title: "Разносторонний",
    description: "Купи предметы из всех 3 категорий",
    reward: 5000,
    condition: (player) => {
      const categories = new Set(player.inventory.map(i => i.category));
      return categories.size === 3;
    }
  },
  {
    id: "house_10",
    title: "Опытный строитель",
    description: "Построй дом до уровня 10",
    reward: 10000,
    condition: (player) => player.house_level >= 10
  },
  {
    id: "house_15",
    title: "Мастер строительства",
    description: "Построй дом до уровня 15",
    reward: 15000,
    condition: (player) => player.house_level >= 15
  },
  {
    id: "items_10",
    title: "Коллекционер",
    description: "Собери 10 предметов",
    reward: 10000,
    condition: (player) => player.inventory.length >= 10
  },
  {
    id: "oxygen_50",
    title: "Дыши полной грудью",
    description: "Достигни 50 единиц кислорода",
    reward: 8000,
    condition: (player) => player.oxygen >= 50
  },
  {
    id: "money_200k",
    title: "Богач",
    description: "Собери 200,000$",
    reward: 20000,
    condition: (player) => player.money >= 200000
  },
  {
    id: "house_20",
    title: "Эксперт строительства",
    description: "Построй дом до уровня 20",
    reward: 20000,
    condition: (player) => player.house_level >= 20
  },
  {
    id: "max_level",
    title: "Максимальное развитие",
    description: "Достигни максимального уровня дома (25)",
    reward: 50000,
    condition: (player) => player.house_level >= 25
  }
];

export const MissionsPanel = () => {
  const { player, claimMissionReward, updateMoney } = useGame();

  const handleClaimReward = async (missionId: string, reward: number) => {
    if (player) {
      await updateMoney(player.money + reward);
      await claimMissionReward(missionId, reward);
      toast.success(`Награда получена! +${reward}$`);
    }
  };

  if (!player) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          Миссии
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {missions
            .sort((a, b) => {
              const aCompleted = player.completed_missions.includes(a.id);
              const bCompleted = player.completed_missions.includes(b.id);
              const aCanComplete = !aCompleted && a.condition(player);
              const bCanComplete = !bCompleted && b.condition(player);
              
              // Сначала выполняемые, потом невыполненные, потом выполненные
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
                className={`p-2.5 sm:p-3 rounded-lg border ${
                  isCompleted 
                    ? "bg-success/10 border-success/20" 
                    : canComplete
                    ? "bg-primary/10 border-primary/20"
                    : "bg-card"
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    ) : (
                      <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm">{mission.title}</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{mission.description}</p>
                    <p className="text-[10px] sm:text-xs text-primary mt-0.5 sm:mt-1">Награда: ${mission.reward.toLocaleString()}</p>
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
