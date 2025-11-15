import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const WelcomeModal = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="space-y-4 text-center py-4">
          <h2 className="text-2xl font-bold text-primary">Добро пожаловать в Eco Home!</h2>
          
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Создали сайт:</p>
            <div className="space-y-2">
              <a 
                href="https://t.me/amonovvv_a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                TG: @amonovvv_a
              </a>
              <a 
                href="https://t.me/abdusatorovv_a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                TG: @abdusatorovv_a
              </a>
            </div>
            
            <p className="font-semibold pt-2">По поводу сотрудничества и создания сайта:</p>
            <a 
              href="https://t.me/amonovvv_a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              TG: @amonovvv_a
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
