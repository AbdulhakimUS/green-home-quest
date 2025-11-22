import { Building2, Zap, Droplets, Trees, Wind, Battery, Squirrel } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { Leaderboard } from "./Leaderboard";
import { MissionsPanel } from "./MissionsPanel";
import { EventsPanel } from "./EventsPanel";

export const HomeTab = () => {
  const { player } = useGame();
  
  const displayLevel = player ? Math.round(player.house_level * 10) / 10 : 1;

  // Получаем предметы по категориям
  const energyItems = player?.inventory.filter(i => i.category === "energy") || [];
  const waterItems = player?.inventory.filter(i => i.category === "water") || [];
  const greeneryItems = player?.inventory.filter(i => i.category === "greenery") || [];

  // Вычисляем интенсивность эффектов (0-100)
  const getIntensity = (items: any[]) => {
    if (items.length === 0) return 0;
    const totalEfficiency = items.reduce((sum, item) => sum + item.efficiency * item.level, 0);
    return Math.min(100, totalEfficiency * 5);
  };

  const energyIntensity = getIntensity(energyItems);
  const waterIntensity = getIntensity(waterItems);
  const greeneryIntensity = getIntensity(greeneryItems);

  // Иконки для предметов
  const getItemIcon = (item: any) => {
    const iconMap: any = {
      "hamster": Squirrel,
      "battery": Battery,
      "wind": Wind,
      "solar": Zap,
    };
    return iconMap[item.id] || Zap;
  };

  return (
    <>
      <EventsPanel />
      <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <Building2 className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">Ваш Эко Дом</h2>
        <p className="text-muted-foreground">Уровень {displayLevel}/25</p>
      </div>

      {/* Визуализация местности с домом */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-sky-200 to-success/20 rounded-2xl border-2 border-border overflow-hidden">
        {/* Газон */}
        <div className="absolute inset-0 bg-gradient-to-t from-success/40 to-transparent" />
        
        {/* Дом в центре */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10">
          <div 
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-card border-2 sm:border-4 border-primary rounded-lg shadow-2xl flex items-center justify-center relative"
            style={{
              boxShadow: energyIntensity > 0 ? `0 0 ${energyIntensity/2}px rgba(234, 179, 8, ${energyIntensity/100})` : undefined
            }}
          >
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary" />
            
            {/* HUD дома с показателями: Энергия - Кислород - Вода */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-card/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border sm:border-2 border-primary">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                <span className="text-[10px] sm:text-xs font-semibold">{energyItems.reduce((sum, i) => sum + i.efficiency * i.level, 0).toFixed(0)}</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border" />
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold">O₂ {player?.oxygen.toFixed(0) || 0}</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border" />
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="text-[10px] sm:text-xs font-semibold">{waterItems.reduce((sum, i) => sum + i.efficiency * i.level, 0).toFixed(0)}</span>
              </div>
            </div>
            
            {/* Окна с подсветкой */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 bg-background rounded-sm border border-border">
              {energyIntensity > 0 && (
                <div 
                  className="w-full h-full bg-yellow-400 rounded-sm animate-pulse"
                  style={{ opacity: energyIntensity / 100 }}
                />
              )}
            </div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-background rounded-sm border border-border">
              {energyIntensity > 0 && (
                <div 
                  className="w-full h-full bg-yellow-400 rounded-sm animate-pulse"
                  style={{ opacity: energyIntensity / 100 }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Купленные предметы энергии слева от дома */}
        {energyItems.map((item, index) => {
          const ItemIcon = getItemIcon(item);
          // Ограничиваем позиции внутри квадратной зоны дома
          const bottomPos = Math.min(Math.max(30 + index * 12, 20), 70);
          const leftPos = Math.min(Math.max(15 + index * 8, 10), 35);
          return (
            <div
              key={`energy-${item.id}-${index}`}
              className="absolute z-5"
              style={{
                bottom: `${bottomPos}%`,
                left: `${leftPos}%`,
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full border-2 border-primary flex items-center justify-center hover-scale">
                  <ItemIcon className="w-6 h-6 text-primary" />
                </div>
                {/* Провод к дому */}
                <svg className="absolute top-1/2 left-1/2 w-20 h-20 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="200%" 
                    y2="0%" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="text-yellow-500"
                    strokeDasharray={energyIntensity > 0 ? "5,5" : undefined}
                  >
                    {energyIntensity > 0 && (
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.5s" repeatCount="indefinite" />
                    )}
                  </line>
                </svg>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full whitespace-nowrap">
                  Ур.{item.level}
                </span>
              </div>
            </div>
          );
        })}

        {/* Купленные предметы воды справа от дома */}
        {waterItems.map((item, index) => {
          const ItemIcon = Droplets;
          // Ограничиваем позиции внутри квадратной зоны дома
          const bottomPos = Math.min(Math.max(30 + index * 12, 20), 70);
          const rightPos = Math.min(Math.max(15 + index * 8, 10), 35);
          return (
            <div
              key={`water-${item.id}-${index}`}
              className="absolute z-5"
              style={{
                bottom: `${bottomPos}%`,
                right: `${rightPos}%`,
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center hover-scale">
                  <ItemIcon className="w-6 h-6 text-blue-500" />
                </div>
                {/* Труба к дому */}
                <svg className="absolute top-1/2 right-1/2 w-20 h-20 pointer-events-none" style={{ transform: 'translate(50%, -50%)' }}>
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="-100%" 
                    y2="0%" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="text-blue-500"
                  />
                </svg>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                  Ур.{item.level}
                </span>
              </div>
            </div>
          );
        })}

        {/* Купленные растения внизу */}
        {greeneryItems.map((item, index) => {
          const ItemIcon = Trees;
          // Ограничиваем позиции на газоне
          const leftPos = Math.min(Math.max(20 + index * 12, 15), 75);
          return (
            <div
              key={`greenery-${item.id}-${index}`}
              className="absolute bottom-[5%] z-5"
              style={{
                left: `${leftPos}%`,
              }}
            >
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-success/30 rounded-full border-2 border-success flex items-center justify-center hover-scale">
                  <ItemIcon className="w-5 h-5 text-success" />
                </div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-success text-white px-2 py-1 rounded-full whitespace-nowrap">
                  Ур.{item.level}
                </span>
              </div>
            </div>
          );
        })}

        {/* Индикатор воды из крана */}
        {waterIntensity > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div className="space-y-1">
                <div className="text-xs font-medium">Напор воды</div>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${waterIntensity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Индикатор электричества */}
        {energyIntensity > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div className="space-y-1">
                <div className="text-xs font-medium">Электричество</div>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${energyIntensity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Сообщение когда ничего нет */}
        {player?.inventory.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-card/95 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-dashed border-muted-foreground/30 text-center">
              <p className="text-muted-foreground text-sm">
                Купите предметы в магазине,<br />чтобы они появились здесь!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Показатели с прогресс-барами */}
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-semibold">Энергия</div>
              <Progress value={Math.min((energyItems.length / 6) * 100, 100)} className="h-1.5 sm:h-2 mt-1" />
            </div>
            <div className="text-xs sm:text-sm font-bold">{energyItems.length}/6</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-semibold">Кислород</div>
              <Progress value={Math.min((player?.oxygen || 0) / 100 * 100, 100)} className="h-1.5 sm:h-2 mt-1" />
            </div>
            <div className="text-xs sm:text-sm font-bold">{player?.oxygen || 0}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-semibold">Вода</div>
              <Progress value={Math.min((waterItems.length / 6) * 100, 100)} className="h-1.5 sm:h-2 mt-1" />
            </div>
            <div className="text-xs sm:text-sm font-bold">{waterItems.length}/6</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
