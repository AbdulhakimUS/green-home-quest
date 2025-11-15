import { useState } from "react";
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

const GameContent = () => {
  const { player, isAdmin, setPlayer, setIsAdmin, setGameSession } = useGame();
  const [activeTab, setActiveTab] = useState("home");

  const handleLogin = (playerData: any, session: any, admin: boolean) => {
    setIsAdmin(admin);
    setGameSession(session);
    if (playerData) {
      setPlayer(playerData);
    }
  };

  if (!player && !isAdmin) {
    return (
      <>
        <WelcomeModal />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 pt-24 pb-20 px-4 lg:pl-72 lg:pt-24 lg:pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "cards" && <CardsTab />}
          {activeTab === "shop" && <ShopTab />}
          {activeTab === "missions" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Миссии</h2>
                <p className="text-muted-foreground">Выполняйте задания и получайте награды</p>
              </div>
              <MissionsPanel />
            </>
          )}
        </div>
      </main>
      
      <Footer />
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
