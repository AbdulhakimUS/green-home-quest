import { Building2, Zap, Droplets, Trees, Wind, Star } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { MissionsPanel } from "./MissionsPanel";
import { EventsPanel } from "./EventsPanel";
import { Badge } from "@/components/ui/badge";
import { formatLevel } from "@/lib/formatters";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INVENTORY_LIMIT = 5;

export const HomeTab = () => {
  const { player, getInventoryCount } = useGame();
  const { t } = useLanguage();
  
  const isStage2 = (player?.house_level || 0) > 25;
  const maxLevel = 50;
  const displayLevel = player ? formatLevel(player.house_level) : "1";

  const energyItems = useMemo(() => player?.inventory.filter(i => i.category === "energy") || [], [player?.inventory]);
  const waterItems = useMemo(() => player?.inventory.filter(i => i.category === "water") || [], [player?.inventory]);
  const greeneryItems = useMemo(() => player?.inventory.filter(i => i.category === "greenery") || [], [player?.inventory]);

  const getIntensity = useMemo(() => (items: any[]) => {
    if (items.length === 0) return 0;
    const totalEfficiency = items.reduce((sum, item) => sum + item.efficiency * item.level, 0);
    return Math.min(100, totalEfficiency * 5);
  }, []);

  const energyIntensity = useMemo(() => getIntensity(energyItems), [energyItems, getIntensity]);
  const waterIntensity = useMemo(() => getIntensity(waterItems), [waterItems, getIntensity]);

  const totalEnergy = useMemo(() => energyItems.reduce((sum, i) => sum + i.efficiency * i.level, 0), [energyItems]);
  const totalWater = useMemo(() => waterItems.reduce((sum, i) => sum + i.efficiency * i.level, 0), [waterItems]);

  const stage2Bg = "from-amber-900/20 via-orange-800/10 to-yellow-900/20";
  const stage1Bg = "from-sky-200 to-success/20";

  return (
    <>
      <EventsPanel />
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          {isStage2 && <Star className="w-6 h-6 mx-auto text-yellow-500 animate-pulse" />}
          <Building2 className={`w-16 h-16 mx-auto ${isStage2 ? 'text-yellow-600' : 'text-primary'}`} />
          <h2 className="text-2xl font-bold">{isStage2 ? t("home.titleStage2") : t("home.title")}</h2>
          <p className="text-muted-foreground">{t("home.level")} {displayLevel}/{maxLevel}</p>
          {isStage2 && <Badge variant="default" className="bg-gradient-to-r from-yellow-600 to-orange-600">{t("nav.stage2")}</Badge>}
        </div>

        {/* House visualization */}
        <div className={`relative aspect-[4/3] bg-gradient-to-b ${isStage2 ? stage2Bg : stage1Bg} rounded-2xl border-2 ${isStage2 ? 'border-yellow-600/50' : 'border-border'} overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-success/40 to-transparent" />
          
          <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10">
            <div 
              className={`${isStage2 ? 'w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 border-yellow-600' : 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-primary'} bg-card border-2 sm:border-4 rounded-lg shadow-2xl flex items-center justify-center relative`}
              style={{
                boxShadow: energyIntensity > 0 ? `0 0 ${energyIntensity/2}px rgba(234, 179, 8, ${energyIntensity/100})` : undefined
              }}
            >
              <Building2 className={`${isStage2 ? 'w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 text-yellow-600' : 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary'}`} />
              
              {/* HUD */}
              <div className={`absolute -top-9 sm:-top-11 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-3 bg-card/90 backdrop-blur-sm px-4 sm:px-5 py-1.5 rounded-full border sm:border-2 ${isStage2 ? 'border-yellow-600' : 'border-primary'} min-w-[170px] sm:min-w-[200px]`}>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="text-[10px] sm:text-xs font-semibold">{totalEnergy.toFixed(0)}</span>
                </div>
                <div className="w-px h-3 sm:h-4 bg-border" />
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                  <span className="text-[10px] sm:text-xs font-semibold">O₂ {Math.round(player?.oxygen || 0)}</span>
                </div>
                <div className="w-px h-3 sm:h-4 bg-border" />
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-[10px] sm:text-xs font-semibold">{totalWater.toFixed(0)}</span>
                </div>
              </div>
              
              {/* Windows */}
              <div className="absolute top-1.5 sm:top-2 md:top-4 left-1.5 sm:left-2 md:left-4 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-background rounded-sm border border-border">
                {energyIntensity > 0 && <div className="w-full h-full bg-yellow-400 rounded-sm animate-pulse" style={{ opacity: energyIntensity / 100 }} />}
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-background rounded-sm border border-border">
                {energyIntensity > 0 && <div className="w-full h-full bg-yellow-400 rounded-sm animate-pulse" style={{ opacity: energyIntensity / 100 }} />}
              </div>
            </div>
          </div>

          {/* Items around house */}
          {energyItems.slice(0, 4).map((item, index) => (
            <div key={`energy-${item.id}-${index}`} className="absolute z-5" style={{ bottom: `${30 + index * 12}%`, left: `${15 + index * 8}%` }}>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full border-2 border-primary flex items-center justify-center hover-scale">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full whitespace-nowrap">{t("home.itemLevel")}{item.level}</span>
              </div>
            </div>
          ))}

          {waterItems.slice(0, 4).map((item, index) => (
            <div key={`water-${item.id}-${index}`} className="absolute z-5" style={{ bottom: `${30 + index * 12}%`, right: `${15 + index * 8}%` }}>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center hover-scale">
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full whitespace-nowrap">{t("home.itemLevel")}{item.level}</span>
              </div>
            </div>
          ))}

          {greeneryItems.slice(0, 6).map((item, index) => (
            <div key={`greenery-${item.id}-${index}`} className="absolute bottom-[5%] z-5" style={{ left: `${15 + index * 12}%` }}>
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-success/30 rounded-full border-2 border-success flex items-center justify-center hover-scale">
                  <Trees className="w-5 h-5 text-success" />
                </div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-success text-white px-2 py-1 rounded-full whitespace-nowrap">{t("home.itemLevel")}{item.level}</span>
              </div>
            </div>
          ))}

          {/* Indicators */}
          {waterIntensity > 0 && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
              <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-border">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div className="space-y-0.5">
                  <div className="text-[10px] font-medium">{t("home.waterPressure")}</div>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${waterIntensity}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {energyIntensity > 0 && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
              <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-border">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div className="space-y-0.5">
                  <div className="text-[10px] font-medium">{t("home.electricity")}</div>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${energyIntensity}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {player?.inventory.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
              <div className="bg-card/95 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-center">
                <p className="text-muted-foreground text-xs sm:text-sm">{t("home.buyItems")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Inventory counters with limit */}
        <div className="space-y-3 sm:space-y-4">
          {[
            { icon: Zap, label: t("category.energy"), items: energyItems, color: "text-yellow-500", cat: "energy" as const },
            { icon: Wind, label: t("category.oxygen"), items: null, color: "text-info", cat: null },
            { icon: Droplets, label: t("category.water"), items: waterItems, color: "text-blue-500", cat: "water" as const },
          ].map(({ icon: Icon, label, items, color, cat }) => {
            const count = items ? items.length : null;
            const isFull = count !== null && count >= INVENTORY_LIMIT;
            
            return (
              <div key={label} className={`bg-card border ${isFull ? 'border-destructive' : 'border-border'} rounded-lg p-3 sm:p-4`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="text-xs sm:text-sm font-semibold">{label}</div>
                      {count !== null && (
                        <Badge variant={isFull ? "destructive" : "outline"} className="text-[10px]">
                          {count}/{INVENTORY_LIMIT}
                        </Badge>
                      )}
                    </div>
                    <Progress 
                      value={count !== null ? (count / INVENTORY_LIMIT) * 100 : Math.min((player?.oxygen || 0), 100)} 
                      className="h-1.5 sm:h-2 mt-1" 
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-bold">
                    {count !== null ? count : Math.round(player?.oxygen || 0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pending rewards */}
        {player?.pending_rewards && player.pending_rewards.length > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-sm font-semibold text-warning mb-2">{t("home.pendingRewards")} ({player.pending_rewards.length})</p>
            <p className="text-xs text-muted-foreground">{t("home.pendingRewardsDesc")}</p>
          </div>
        )}

        <MissionsPanel />
      </div>
    </>
  );
};
