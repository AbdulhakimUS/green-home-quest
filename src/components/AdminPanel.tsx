import { Users, TrendingUp, Coins, Play, Clock, History, LogOut, Pause, PlayIcon, Trash2, CircleDot, Check, X, Shield, Ban, DollarSign, Package, ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PurchaseHistory } from "./PurchaseHistory";
import { Leaderboard } from "./Leaderboard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type ExtendedStatus = 'waiting' | 'active' | 'finished' | 'paused';

export const AdminPanel = () => {
  const { 
    allPlayers, gameSession, startGame, endGame, pauseGame, restartGame, 
    timeRemaining, logoutAdmin, removePlayerById, pendingPlayers,
    approvePlayer, denyPlayer, blockPlayer, updatePlayerMoney, updatePlayerLevel,
    giveItem, removeItem, gameLogs, marketListings
  } = useGame();
  
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [timerMinutes, setTimerMinutes] = useState("30");
  const [showHistory, setShowHistory] = useState(false);
  const [removedPlayers, setRemovedPlayers] = useState<Set<string>>(new Set());
  const [initialBalance, setInitialBalance] = useState(gameSession?.initial_balance?.toString() || "20000");
  const [moneyAmount, setMoneyAmount] = useState("");
  const [levelAmount, setLevelAmount] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [showMarketAdmin, setShowMarketAdmin] = useState(false);

  useEffect(() => {
    if (gameSession?.initial_balance) {
      setInitialBalance(gameSession.initial_balance.toString());
    }
  }, [gameSession?.initial_balance]);

  const isPlayerInactive = (player: any) => {
    if (!player.last_activity) return false;
    const lastActivity = new Date(player.last_activity).getTime();
    return (Date.now() - lastActivity) > 60000;
  };

  const handleRemovePlayer = async (playerId: string, nickname: string) => {
    if (window.confirm(`Удалить игрока "${nickname}"?`)) {
      await removePlayerById(playerId);
      setRemovedPlayers(prev => new Set(prev).add(playerId));
      setSelectedPlayer(null);
    }
  };

  const activePlayers = allPlayers.filter(p => !removedPlayers.has(p.id));
  const deletedPlayers = allPlayers.filter(p => removedPlayers.has(p.id));
  const sessionStatus = gameSession?.status as ExtendedStatus;

  const handleStartGame = async () => {
    const minutes = parseInt(timerMinutes);
    const balance = parseInt(initialBalance);
    if (isNaN(minutes) || minutes <= 0) {
      toast({ title: "Ошибка", description: "Введите корректное время", variant: "destructive" });
      return;
    }
    if (isNaN(balance) || balance <= 0) {
      toast({ title: "Ошибка", description: "Введите корректный баланс", variant: "destructive" });
      return;
    }

    if (gameSession) {
      await supabase.from('game_sessions').update({ initial_balance: balance }).eq('id', gameSession.id);
    }
    startGame(minutes);
  };

  const handleCopyCode = () => {
    if (gameSession?.code) {
      const fullUrl = `${window.location.origin}/?code=${gameSession.code}`;
      navigator.clipboard.writeText(fullUrl);
      toast({ title: "Ссылка скопирована!" });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStage = (level: number) => level > 25 ? 2 : 1;

  return (
    <>
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Админ Панель</h1>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button variant="outline" size="sm" onClick={logoutAdmin} className="gap-2">
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Назад</span>
                </Button>
                {sessionStatus === 'active' && (
                  <>
                    <Button variant="secondary" size="sm" onClick={endGame}><span className="text-xs sm:text-sm">Завершить</span></Button>
                    <Button variant="default" size="sm" onClick={pauseGame} className="gap-1"><Pause className="w-3 h-3" /><span className="text-xs sm:text-sm">Пауза</span></Button>
                  </>
                )}
                {sessionStatus === 'paused' && (
                  <>
                    <Button variant="secondary" size="sm" onClick={endGame}><span className="text-xs sm:text-sm">Завершить</span></Button>
                    <Button variant="default" size="sm" onClick={pauseGame} className="gap-1"><PlayIcon className="w-3 h-3" /><span className="text-xs sm:text-sm">Возобновить</span></Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={handleCopyCode}>
              Код игры: <span className="font-mono font-bold text-primary text-base sm:text-xl md:text-2xl">{gameSession?.code}</span>
            </p>
            {gameSession && (
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-xs sm:text-sm" style={{
                borderColor: sessionStatus === 'waiting' ? 'hsl(var(--warning))' : sessionStatus === 'active' ? 'hsl(var(--success))' : sessionStatus === 'paused' ? 'hsl(var(--info))' : 'hsl(var(--muted-foreground))',
                backgroundColor: sessionStatus === 'waiting' ? 'hsl(var(--warning) / 0.1)' : sessionStatus === 'active' ? 'hsl(var(--success) / 0.1)' : sessionStatus === 'paused' ? 'hsl(var(--info) / 0.1)' : 'hsl(var(--muted) / 0.1)'
              }}>
                <span className="font-semibold">
                  {sessionStatus === 'waiting' && "Ожидание"}
                  {sessionStatus === 'active' && <span className="flex items-center gap-2"><Clock className="w-4 h-4" />Осталось: {timeRemaining ? formatTime(timeRemaining) : ''}</span>}
                  {sessionStatus === 'paused' && <span className="flex items-center gap-2"><Pause className="w-4 h-4" />Пауза — {timeRemaining ? `${Math.floor(timeRemaining / 60)} мин` : ''}</span>}
                  {sessionStatus === 'finished' && "Игра завершена"}
                </span>
              </div>
            )}
          </div>

          {/* Start Game */}
          {gameSession?.status === 'waiting' && (
            <Card className="mb-4 sm:mb-6 border-primary">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Play className="w-4 h-4 sm:w-5 sm:h-5" />Запуск игры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-xs sm:text-sm text-muted-foreground">Время игры (минуты)</label>
                    <Input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} min="1" className="mt-1" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs sm:text-sm text-muted-foreground">Начальный баланс ($)</label>
                    <Input type="number" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} min="1000" className="mt-1" />
                  </div>
                </div>
                <Button onClick={handleStartGame} size="sm" className="w-full"><Play className="w-3 h-3 mr-1" />Начать игру</Button>
              </CardContent>
            </Card>
          )}

          {gameSession?.status === 'finished' && (
            <div className="mb-4 flex justify-center">
              <Button onClick={restartGame} size="sm" variant="default"><Play className="w-3 h-3 mr-1" />Начать заново</Button>
            </div>
          )}

          {/* Pending Players (Approve/Deny) */}
          {pendingPlayers.length > 0 && (
            <Card className="mb-4 border-warning">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-warning">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  Заявки на вход
                  <Badge variant="destructive">{pendingPlayers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
                {pendingPlayers.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="font-medium text-sm">{p.nickname}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => approvePlayer(p.id)} className="gap-1">
                        <Check className="w-3 h-3" />Принять
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => denyPlayer(p.id)} className="gap-1">
                        <X className="w-3 h-3" />Отклонить
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Players List */}
          <Card className="mb-4 sm:mb-5">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Users className="w-4 h-4 sm:w-5 sm:h-5" />Участники</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Онлайн: {activePlayers.filter(p => !isPlayerInactive(p)).length} | Всего: {allPlayers.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
              {allPlayers.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-sm">Пока нет участников</p>
              ) : (
                <>
                  {activePlayers.map((player) => {
                    const inactive = isPlayerInactive(player);
                    const stage = getStage(player.house_level);
                    return (
                      <Card key={player.id} className="cursor-pointer hover-scale" onClick={() => setSelectedPlayer(player)}>
                        <CardHeader className="p-2 sm:p-4 pb-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <CircleDot className={`w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 ${inactive ? 'text-muted-foreground' : 'text-success'}`} fill="currentColor" />
                              <CardTitle className="text-sm sm:text-base truncate">{player.nickname}</CardTitle>
                              <Badge variant={stage === 2 ? "default" : "outline"} className="text-[10px]">Этап {stage}</Badge>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Ур. {Math.round(player.house_level * 10) / 10}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">Баланс:</span>
                            <span className="font-semibold flex items-center gap-1">
                              <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />{player.money}$
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>Предметов: {player.inventory?.length || 0}</span>
                            <span>Миссий: {player.completed_missions?.length || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {deletedPlayers.length > 0 && (
                    <>
                      <div className="border-t my-3 pt-3">
                        <p className="text-[10px] text-muted-foreground text-center mb-2">Удалённые</p>
                      </div>
                      {deletedPlayers.map(player => (
                        <Card key={player.id} className="opacity-50">
                          <CardHeader className="p-2 sm:p-4 pb-2">
                            <div className="flex items-center gap-1.5">
                              <CircleDot className="w-2.5 h-2.5 text-destructive" fill="currentColor" />
                              <CardTitle className="text-sm line-through">{player.nickname}</CardTitle>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Admin Actions: Logs & Market */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Collapsible open={showLogs} onOpenChange={setShowLogs}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><ScrollText className="w-4 h-4" />Логи действий</div>
                      {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-3 pt-0 max-h-64 overflow-y-auto">
                    {gameLogs.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">Нет логов</p>
                    ) : (
                      <div className="space-y-1">
                        {gameLogs.slice(0, 50).map((log: any) => (
                          <div key={log.id} className="text-[10px] sm:text-xs p-1.5 bg-muted rounded flex justify-between">
                            <span><span className="font-medium">{log.player_nickname || 'Система'}</span>: {log.action_type}</span>
                            <span className="text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible open={showMarketAdmin} onOpenChange={setShowMarketAdmin}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><Package className="w-4 h-4" />Рынок ({marketListings.length})</div>
                      {showMarketAdmin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-3 pt-0 max-h-64 overflow-y-auto">
                    {marketListings.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">Нет лотов</p>
                    ) : (
                      <div className="space-y-1">
                        {marketListings.map(l => (
                          <div key={l.id} className="text-[10px] sm:text-xs p-1.5 bg-muted rounded flex justify-between">
                            <span>{l.seller_nickname}: {l.item.name}</span>
                            <span className="font-medium">${l.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          <Leaderboard />
        </div>
      </div>

      {/* Player Detail Dialog */}
      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Игрок: {selectedPlayer?.nickname}</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Card>
                  <CardContent className="p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Баланс</p>
                    <p className="text-sm font-bold">{selectedPlayer.money}$</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Уровень</p>
                    <p className="text-sm font-bold">{Math.round(selectedPlayer.house_level * 10) / 10}/50</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Этап</p>
                    <p className="text-sm font-bold">{getStage(selectedPlayer.house_level)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Controls */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Управление деньгами</p>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Сумма" value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} className="text-sm" />
                  <Button size="sm" onClick={() => { updatePlayerMoney(selectedPlayer.id, parseInt(moneyAmount) || 0); setMoneyAmount(""); }} className="gap-1">
                    <DollarSign className="w-3 h-3" />Добавить
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { updatePlayerMoney(selectedPlayer.id, -(parseInt(moneyAmount) || 0)); setMoneyAmount(""); }} className="gap-1">
                    <DollarSign className="w-3 h-3" />Забрать
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Управление уровнем</p>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Уровень (1-50)" value={levelAmount} onChange={e => setLevelAmount(e.target.value)} className="text-sm" min="1" max="50" />
                  <Button size="sm" onClick={() => { updatePlayerLevel(selectedPlayer.id, parseFloat(levelAmount) || 1); setLevelAmount(""); }}>
                    Установить
                  </Button>
                </div>
              </div>

              <Button onClick={() => setShowHistory(true)} className="w-full text-xs sm:text-sm" variant="outline" size="sm">
                <History className="w-3 h-3 mr-1" />История покупок
              </Button>

              {/* Inventory */}
              <Card>
                <CardHeader className="p-2">
                  <CardTitle className="text-xs sm:text-sm">Инвентарь ({selectedPlayer.inventory?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  {!selectedPlayer.inventory?.length ? (
                    <p className="text-xs text-muted-foreground">Пусто</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedPlayer.inventory.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-muted rounded">
                          <span className="truncate">{item.name} (Ур. {item.level})</span>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive" onClick={() => removeItem(selectedPlayer.id, item.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-2">
                  <CardTitle className="text-xs sm:text-sm">Миссии ({selectedPlayer.completed_missions?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  {!selectedPlayer.completed_missions?.length ? (
                    <p className="text-xs text-muted-foreground">Нет выполненных</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedPlayer.completed_missions.map((m: string) => (
                        <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => blockPlayer(selectedPlayer.id)} variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                  <Ban className="w-3 h-3" />Заблокировать
                </Button>
                <Button onClick={() => handleRemovePlayer(selectedPlayer.id, selectedPlayer.nickname)} variant="destructive" size="sm" className="flex-1 gap-1 text-xs">
                  <Trash2 className="w-3 h-3" />Удалить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedPlayer && (
        <PurchaseHistory playerId={selectedPlayer.id} open={showHistory} onOpenChange={setShowHistory} />
      )}
    </>
  );
};
