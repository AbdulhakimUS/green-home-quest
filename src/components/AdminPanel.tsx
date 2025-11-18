import { Users, TrendingUp, Coins, Play, Clock, History, Trophy, LogOut, Pause, PlayIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PurchaseHistory } from "./PurchaseHistory";
import { Leaderboard } from "./Leaderboard";

// Extend the game session type to include pause status
type ExtendedStatus = 'waiting' | 'active' | 'finished' | 'paused';

export const AdminPanel = () => {
  const { allPlayers, gameSession, startGame, endGame, pauseGame, timeRemaining, logoutAdmin } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [timerMinutes, setTimerMinutes] = useState("30");
  const [showHistory, setShowHistory] = useState(false);

  const sessionStatus = gameSession?.status as ExtendedStatus;

  const handleStartGame = () => {
    const minutes = parseInt(timerMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректное время",
        variant: "destructive"
      });
      return;
    }
    startGame(minutes);
  };

  const handleCopyCode = () => {
    if (gameSession?.code) {
      const fullUrl = `${window.location.origin}/?code=${gameSession.code}`;
      navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Ссылка скопирована!",
        description: "Полная ссылка на комнату скопирована",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 space-y-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">Админ Панель</h1>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={logoutAdmin}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Назад
                </Button>
                {sessionStatus === 'active' && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={endGame}
                      className="gap-2"
                    >
                      Завершить
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={pauseGame}
                      className="gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Пауза
                    </Button>
                  </>
                )}
                {sessionStatus === 'paused' && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={endGame}
                      className="gap-2"
                    >
                      Завершить
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={pauseGame}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <PlayIcon className="w-4 h-4" />
                      Возобновить
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p 
              className="text-lg sm:text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={handleCopyCode}
              title="Нажмите, чтобы скопировать"
            >
              Код игры: <span className="font-mono font-bold text-primary text-xl sm:text-2xl">{gameSession?.code}</span>
            </p>
            {gameSession && (
              <div className="inline-block px-4 py-2 rounded-full border-2" style={{
                borderColor: sessionStatus === 'waiting' ? 'hsl(var(--warning))' :
                  sessionStatus === 'active' ? 'hsl(var(--success))' : 
                  sessionStatus === 'paused' ? 'hsl(var(--info))' : 'hsl(var(--muted-foreground))',
                backgroundColor: sessionStatus === 'waiting' ? 'hsl(var(--warning) / 0.1)' :
                  sessionStatus === 'active' ? 'hsl(var(--success) / 0.1)' : 
                  sessionStatus === 'paused' ? 'hsl(var(--info) / 0.1)' : 'hsl(var(--muted) / 0.1)'
              }}>
                <span className="font-semibold">
                  {sessionStatus === 'waiting' && "Ожидание"}
                  {sessionStatus === 'active' && `Игра идет: ${timeRemaining ? formatTime(timeRemaining) : ''}`}
                  {sessionStatus === 'paused' && "Пауза"}
                  {sessionStatus === 'finished' && "Игра завершена"}
                </span>
              </div>
            )}
          </div>

          {gameSession?.status === 'waiting' && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Запуск игры
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Время игры (минуты)</label>
                    <Input
                      type="number"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(e.target.value)}
                      min="1"
                      placeholder="30"
                    />
                  </div>
                  <Button onClick={handleStartGame} size="lg" className="mt-6">
                    <Play className="w-4 h-4 mr-2" />
                    Начать игру
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}


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
                          Ур. {player.house_level.toFixed(2)}
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

          <Leaderboard />
        </div>
      </div>

      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Информация об игроке</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="overflow-x-auto">
              <div className="space-y-4 min-w-[400px]">
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="text-2xl font-bold mb-2">{selectedPlayer.nickname}</h3>
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
                    <p className="text-2xl font-bold">{selectedPlayer.house_level.toFixed(2)}/25</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => setShowHistory(true)} 
                className="w-full"
                variant="outline"
              >
                <History className="w-4 h-4 mr-2" />
                История покупок
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Инвентарь</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlayer.inventory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Пусто</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlayer.inventory.map((item: any, idx: number) => (
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
                    {selectedPlayer.selected_card
                      ? selectedPlayer.selected_card === "energy"
                        ? "⚡ Энергия"
                        : selectedPlayer.selected_card === "water"
                        ? "💧 Вода"
                        : "🌿 Зелень"
                      : "Не выбрана"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedPlayer && (
        <PurchaseHistory
          playerId={selectedPlayer.id}
          open={showHistory}
          onOpenChange={setShowHistory}
        />
      )}
    </>
  );
};
