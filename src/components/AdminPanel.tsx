import { Users, TrendingUp, Coins, Play, Clock, History, Trophy, LogOut, Pause, PlayIcon, Trash2, CircleDot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PurchaseHistory } from "./PurchaseHistory";
import { Leaderboard } from "./Leaderboard";
import { supabase } from "@/integrations/supabase/client";

// Extend the game session type to include pause status
type ExtendedStatus = 'waiting' | 'active' | 'finished' | 'paused';

export const AdminPanel = () => {
  const { allPlayers, gameSession, startGame, endGame, pauseGame, restartGame, timeRemaining, logoutAdmin, removePlayerById } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [timerMinutes, setTimerMinutes] = useState("30");
  const [showHistory, setShowHistory] = useState(false);
  const [removedPlayers, setRemovedPlayers] = useState<Set<string>>(new Set());
  const [initialBalance, setInitialBalance] = useState(gameSession?.initial_balance?.toString() || "20000");

  // Синхронизируем initialBalance с gameSession
  useEffect(() => {
    if (gameSession?.initial_balance) {
      setInitialBalance(gameSession.initial_balance.toString());
    }
  }, [gameSession?.initial_balance]);

  const isPlayerInactive = (player: any) => {
    if (!player.last_activity) return false;
    const lastActivity = new Date(player.last_activity).getTime();
    const now = Date.now();
    return (now - lastActivity) > 60000; // Неактивен более 1 минуты
  };

  const handleRemovePlayer = async (playerId: string, nickname: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить игрока "${nickname}"?`)) {
      await removePlayerById(playerId);
      setRemovedPlayers(prev => new Set(prev).add(playerId));
      setSelectedPlayer(null);
    }
  };

  // Разделяем игроков на активных и удалённых
  const activePlayers = allPlayers.filter(p => !removedPlayers.has(p.id));
  const deletedPlayers = allPlayers.filter(p => removedPlayers.has(p.id));

  const sessionStatus = gameSession?.status as ExtendedStatus;

  const handleStartGame = async () => {
    const minutes = parseInt(timerMinutes);
    const balance = parseInt(initialBalance);
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректное время",
        variant: "destructive"
      });
      return;
    }
    if (isNaN(balance) || balance <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректный начальный баланс",
        variant: "destructive"
      });
      return;
    }

    // Обновляем начальный баланс в сессии
    if (gameSession) {
      await supabase
        .from('game_sessions')
        .update({ initial_balance: balance })
        .eq('id', gameSession.id);
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
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Админ Панель</h1>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logoutAdmin}
                  className="gap-2"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Назад</span>
                </Button>
                {sessionStatus === 'active' && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={endGame}
                      className="gap-1 sm:gap-2"
                    >
                      <span className="text-xs sm:text-sm">Завершить</span>
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={pauseGame}
                      className="gap-1 sm:gap-2"
                    >
                      <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Пауза</span>
                    </Button>
                  </>
                )}
                {sessionStatus === 'paused' && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={endGame}
                      className="gap-1 sm:gap-2"
                    >
                      <span className="text-xs sm:text-sm">Завершить</span>
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={pauseGame}
                      className="gap-1 sm:gap-2"
                    >
                      <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Возобновить</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p 
              className="text-sm sm:text-base md:text-lg text-muted-foreground cursor-pointer hover:text-primary transition-colors px-2"
              onClick={handleCopyCode}
              title="Нажмите, чтобы скопировать"
            >
              Код игры: <span className="font-mono font-bold text-primary text-base sm:text-xl md:text-2xl">{gameSession?.code}</span>
            </p>
            {gameSession && (
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-xs sm:text-sm md:text-base" style={{
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
            <Card className="mb-4 sm:mb-6 border-primary">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Запуск игры
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <label className="text-xs sm:text-sm text-muted-foreground">Время игры (минуты)</label>
                    <Input
                      type="number"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(e.target.value)}
                      min="1"
                      placeholder="30"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs sm:text-sm text-muted-foreground">Начальный баланс ($)</label>
                    <Input
                      type="number"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      min="1000"
                      placeholder="20000"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleStartGame} size="sm" className="w-full">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Начать игру</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {gameSession?.status === 'finished' && (
            <div className="mb-4 sm:mb-6 flex justify-center">
              <Button onClick={restartGame} size="sm" variant="default" className="w-full sm:w-auto">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Начать заново</span>
              </Button>
            </div>
          )}


          <Card className="mb-4 sm:mb-5">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Участники игры
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Всего игроков: {allPlayers.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
              {allPlayers.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">Пока нет участников</p>
              ) : (
                <>
                  {/* Активные игроки */}
                  {activePlayers.map((player) => {
                    const inactive = isPlayerInactive(player);
                    return (
                    <Card
                      key={player.id}
                      className="cursor-pointer hover-scale"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <CardHeader className="p-2 sm:p-4 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <CircleDot 
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 ${inactive ? 'text-muted-foreground' : 'text-success'}`}
                              fill="currentColor"
                            />
                            <CardTitle className="text-sm sm:text-base truncate">{player.nickname}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="whitespace-nowrap">Ур. {Math.round(player.house_level * 10) / 10}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-2 sm:p-4 pt-0">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Баланс:</span>
                          <span className="font-semibold flex items-center gap-1">
                            <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                            {player.money}$
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )})}
                  
                  {/* Удалённые игроки внизу списка */}
                  {deletedPlayers.length > 0 && (
                    <>
                      <div className="border-t border-border my-3 sm:my-4 pt-3 sm:pt-4">
                        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mb-2">Удалённые игроки</p>
                      </div>
                      {deletedPlayers.map((player) => (
                        <Card
                          key={player.id}
                          className="opacity-50"
                        >
                          <CardHeader className="p-2 sm:p-4 pb-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <CircleDot 
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 text-destructive"
                                  fill="currentColor"
                                />
                                <CardTitle className="text-sm sm:text-base line-through truncate">{player.nickname}</CardTitle>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap">Ур. {Math.round(player.house_level * 10) / 10}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Баланс:</span>
                              <span className="font-semibold flex items-center gap-1">
                                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                                {player.money}$
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Leaderboard />
        </div>
      </div>

      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Информация об игроке</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="overflow-x-auto">
              <div className="space-y-3 sm:space-y-4 min-w-0">
              <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{selectedPlayer.nickname}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <Card>
                  <CardHeader className="p-2 sm:p-4 pb-2">
                    <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                      <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                      Баланс
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4 pt-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{selectedPlayer.money}$</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-2 sm:p-4 pb-2">
                    <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                      Уровень
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4 pt-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{Math.round(selectedPlayer.house_level * 10) / 10}/25</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => setShowHistory(true)} 
                className="w-full text-xs sm:text-sm"
                variant="outline"
                size="sm"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                История покупок
              </Button>

              <Button 
                onClick={() => handleRemovePlayer(selectedPlayer.id, selectedPlayer.nickname)}
                className="w-full text-xs sm:text-sm"
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Удалить игрока
              </Button>

              <Card>
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm">Инвентарь</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 pt-0">
                  {selectedPlayer.inventory.length === 0 ? (
                    <p className="text-xs sm:text-sm text-muted-foreground">Пусто</p>
                  ) : (
                    <div className="space-y-1.5 sm:space-y-2">
                      {selectedPlayer.inventory.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs sm:text-sm p-1.5 sm:p-2 bg-muted rounded"
                        >
                          <span className="truncate">{item.name}</span>
                          <span className="text-muted-foreground whitespace-nowrap ml-2">Ур. {item.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm">Выбранная карта</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 pt-0">
                  <p className="text-xs sm:text-sm">
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
