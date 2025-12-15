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

interface GameRulesDialogProps {
  variant?: "login" | "game";
}

export const GameRulesDialog = ({ variant = "login" }: GameRulesDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "login" ? (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
            title="Правила игры"
          >
            <HelpCircle className="w-5 h-5 text-primary" />
          </Button>
        ) : (
          <button
            className="fixed bottom-20 right-4 lg:bottom-4 lg:right-4 z-40 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all hover:scale-110"
            title="Правила игры"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Правила игры «Эко Дом»
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-5 text-sm">
            {/* Цель игры */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                Цель игры
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Создайте <span className="font-semibold text-foreground">максимально экологичный дом</span>, достигнув <span className="font-semibold text-foreground">25 уровня</span>.
              </p>
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 mt-2">
                <p className="font-semibold text-success">🏆 Победитель:</p>
                <p className="text-muted-foreground">
                  Выигрывает тот, кто достиг <span className="font-semibold text-foreground">максимального уровня дома</span> и сохранил <span className="font-semibold text-foreground">больше всего денег</span>!
                </p>
              </div>
            </section>

            {/* Как играть */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Home className="w-5 h-5" />
                Как играть
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Выберите карту</span> — Энергия, Вода или Зелень
                </li>
                <li>
                  <span className="font-medium text-foreground">Покупайте предметы</span> в магазине для выбранной категории
                </li>
                <li>
                  <span className="font-medium text-foreground">Повышайте уровень дома</span> — каждая покупка увеличивает уровень
                </li>
                <li>
                  <span className="font-medium text-foreground">Выполняйте миссии</span> для получения бонусных денег
                </li>
              </ol>
            </section>

            {/* Магазин */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <ShoppingCart className="w-5 h-5" />
                Магазин
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• <span className="font-medium text-foreground">30 предметов</span> в каждой категории (Энергия, Вода, Зелень)</li>
                <li>• Дорогие предметы дают <span className="font-medium text-foreground">больше уровня</span> и более экологичны</li>
                <li>• Можно улучшать предметы, покупая их повторно</li>
                <li>• Цена растёт с каждым уровнем предмета</li>
              </ul>
            </section>

            {/* Рынок */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Store className="w-5 h-5" />
                Рынок игроков
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Продавайте свои предметы другим игрокам</li>
                <li>• Максимальная цена — <span className="font-medium text-foreground">75%</span> от базовой стоимости</li>
                <li>• Комиссия рынка — <span className="font-medium text-foreground">7%</span></li>
                <li>• Максимум <span className="font-medium text-foreground">5 лотов</span> на категорию</li>
              </ul>
            </section>

            {/* Бонусы */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                Бонусы и награды
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• <span className="font-medium text-foreground">Миссии</span> — выполняйте задания за деньги</li>
                <li>• <span className="font-medium text-foreground">Клады</span> — 4 скрытых сокровища (+$5,000 каждый)</li>
                <li>• <span className="font-medium text-foreground">Бонус за все клады</span> — +$20,000</li>
                <li>• <span className="font-medium text-foreground">Награды за предметы</span> — бонусы за 50, 75, 100 предметов</li>
              </ul>
            </section>

            {/* Подсказки */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Leaf className="w-5 h-5" />
                Советы
              </h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>💡 Выбирайте более экологичные предметы — они эффективнее</li>
                <li>💡 Следите за балансом — не тратьте всё сразу</li>
                <li>💡 Выполняйте миссии для дополнительного дохода</li>
                <li>💡 Используйте рынок для выгодных сделок</li>
              </ul>
            </section>

            <div className="pt-2 border-t text-center text-xs text-muted-foreground">
              Удачи в создании экологичного дома! 🌿🏠
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
