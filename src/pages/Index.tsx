import { useState, useEffect } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { LoginScreen } from "@/components/LoginScreen";
import { GameNavbar } from "@/components/GameNavbar";
import { HomeTab } from "@/components/HomeTab";
import { CardsTab } from "@/components/CardsTab";
import { ShopTab } from "@/components/ShopTab";
import { AdminPanel } from "@/components/AdminPanel";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { MissionsPanel } from "@/components/MissionsPanel";
import { MarketTab } from "@/components/MarketTab";
import { GameRulesDialog } from "@/components/GameRulesDialog";

const GameContent = () => {
  const { player, isAdmin, setPlayer, setIsAdmin, setGameSession, removePlayer } = useGame();
  const [activeTab, setActiveTab] = useState("home");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleLogin = (playerData: any, session: any, admin: boolean) => {
    setIsAdmin(admin);
    setGameSession(session);
    if (playerData) {
      setPlayer(playerData);
    }
  };

  const handlePlayerExit = async () => {
    if (player && !isAdmin) {
      await removePlayer();
      setPlayer(null);
    }
  };

  // Удаление игрока при закрытии окна/вкладки
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (player && !isAdmin) {
        removePlayer();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [player, isAdmin, removePlayer]);

  if (!player && !isAdmin) {
    return (
      <>
        <WelcomeModal />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  if (isAdmin) {
    return (
      <>
        <AdminPanel />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameNavbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onExitClick={() => setShowExitConfirm(true)}
      />
      
      <main className="flex-1 pt-28 pb-20 px-4 lg:pl-72 lg:pt-28 lg:pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "cards" && <CardsTab />}
          {activeTab === "shop" && <ShopTab />}
          {activeTab === "market" && <MarketTab />}
          {activeTab === "missions" && <MissionsPanel />}
        </div>
      </main>
      
      {/* Кнопка помощи в игре */}
      <GameRulesDialog variant="game" />
      
      <Footer />

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card p-4 sm:p-6 rounded-lg max-w-[90vw] sm:max-w-sm w-full space-y-3 sm:space-y-4 animate-scale-in">
            <h3 className="text-lg sm:text-xl font-bold">Выйти из комнаты?</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Вы точно хотите выйти из игры? Ваш прогресс будет потерян.</p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handlePlayerExit}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
