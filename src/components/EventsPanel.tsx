import { AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { useEffect, useState } from "react";

export const EventsPanel = () => {
  const { gameSession } = useGame();
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!gameSession?.active_events) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: Record<string, number> = {};
      
      gameSession.active_events.forEach((event: any) => {
        const elapsed = (now - event.startedAt) / 1000;
        const remaining = Math.max(0, event.duration - elapsed);
        newTimeLeft[event.id] = remaining;
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameSession?.active_events]);

  if (!gameSession?.active_events || gameSession.active_events.length === 0) {
    return null;
  }

  return (
    <Card className="animate-fade-in border-destructive/50 bg-destructive/5">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          Активные события
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {gameSession.active_events.map((event: any) => {
            const remaining = timeLeft[event.id] || 0;
            const minutes = Math.floor(remaining / 60);
            const seconds = Math.floor(remaining % 60);

            return (
              <div
                key={event.id}
                className="p-2.5 sm:p-3 rounded-lg border border-destructive/30 bg-card"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-destructive text-sm sm:text-base">{event.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{event.description}</p>
                    <p className="text-[10px] sm:text-xs text-warning mt-0.5 sm:mt-1">{event.effect}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-mono bg-destructive/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
