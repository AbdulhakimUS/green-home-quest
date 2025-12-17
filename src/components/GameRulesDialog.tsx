import { useState } from "react";
import { HelpCircle, Home, ShoppingCart, Leaf, Trophy, Target, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameRulesDialogProps {
  variant?: "login" | "game";
}

export const GameRulesDialog = ({ variant = "login" }: GameRulesDialogProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "login" ? (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
            title={t("rules.title")}
          >
            <HelpCircle className="w-5 h-5 text-primary" />
          </Button>
        ) : (
          <button
            className="fixed bottom-20 right-4 lg:bottom-4 lg:right-4 z-40 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all hover:scale-110"
            title={t("rules.title")}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {t("rules.title")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-5 text-sm">
            {/* Цель игры */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                {t("rules.objective")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("rules.objectiveDesc")}
              </p>
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 mt-2">
                <p className="font-semibold text-success">🏆 {t("rules.winner")}</p>
                <p className="text-muted-foreground">
                  {t("rules.winnerDesc")}
                </p>
              </div>
            </section>

            {/* Как играть */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Home className="w-5 h-5" />
                {t("rules.howToPlay")}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>{t("rules.step1")}</li>
                <li>{t("rules.step2")}</li>
                <li>{t("rules.step3")}</li>
                <li>{t("rules.step4")}</li>
              </ol>
            </section>

            {/* Магазин */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <ShoppingCart className="w-5 h-5" />
                {t("rules.shop")}
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• {t("rules.shopItems")}</li>
                <li>• {t("rules.shopExpensive")}</li>
                <li>• {t("rules.shopUpgrade")}</li>
                <li>• {t("rules.shopPrice")}</li>
              </ul>
            </section>

            {/* Рынок */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Store className="w-5 h-5" />
                {t("rules.market")}
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• {t("rules.marketSell")}</li>
                <li>• {t("rules.marketPrice")}</li>
                <li>• {t("rules.marketFee")}</li>
                <li>• {t("rules.marketLimit")}</li>
              </ul>
            </section>

            {/* Бонусы */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                {t("rules.bonuses")}
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• {t("rules.missions")}</li>
                <li>• {t("rules.treasures")}</li>
                <li>• {t("rules.allTreasures")}</li>
                <li>• {t("rules.itemRewards")}</li>
              </ul>
            </section>

            {/* Подсказки */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Leaf className="w-5 h-5" />
                {t("rules.tips")}
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>{t("rules.tip1")}</li>
                <li>{t("rules.tip2")}</li>
                <li>{t("rules.tip3")}</li>
                <li>{t("rules.tip4")}</li>
              </ul>
            </section>

            <div className="pt-2 border-t text-center text-xs text-muted-foreground">
              {t("rules.goodLuck")}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
