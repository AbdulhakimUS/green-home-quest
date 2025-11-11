import { Users, TrendingUp, Coins, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Player } from "@/types/game";

export const AdminPanel = () => {
  const { allPlayers, gameCode } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <>
      <div className="space-y-6 animate-fade-in p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Админ Панель</h1>
          <p className="text-muted-foreground">Код игры: <span className="font-mono font-bold text-primary">{gameCode}</span></p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Участники игры
            </CardTitle>
            <CardDescription>Всего игроков: {allPlayers.length}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {allPlayers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Пока нет участников</p>
            ) : (
              allPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="cursor-pointer hover-scale"
                  onClick={() => setSelectedPlayer(player)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{player.nickname}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        Ур. {player.houseLevel}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Баланс:</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Coins className="w-4 h-4 text-warning" />
                        {player.money}$
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Информация об игроке</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="text-2xl font-bold mb-2">{selectedPlayer.nickname}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedPlayer.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Coins className="w-4 h-4 text-warning" />
                      Баланс
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedPlayer.money}$</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Уровень
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedPlayer.houseLevel}/10</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Инвентарь</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlayer.inventory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Пусто</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlayer.inventory.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                        >
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">Ур. {item.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Выбранная карта</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {selectedPlayer.selectedCard
                      ? selectedPlayer.selectedCard === "energy"
                        ? "Энергия"
                        : selectedPlayer.selectedCard === "water"
                        ? "Вода"
                        : "Зелень"
                      : "Не выбрана"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
