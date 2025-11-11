import { useState } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { LoginScreen } from "@/components/LoginScreen";
import { GameNavbar } from "@/components/GameNavbar";
import { HomeTab } from "@/components/HomeTab";
import { CardsTab } from "@/components/CardsTab";
import { ShopTab } from "@/components/ShopTab";
import { AdminPanel } from "@/components/AdminPanel";

const GameContent = () => {
  const { player, isAdmin } = useGame();
  const [activeTab, setActiveTab] = useState("home");

  if (!player && !isAdmin) {
    return <LoginScreen />;
  }

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-background">
      <GameNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pt-[7.5rem] pb-8 px-4 lg:pl-28 lg:pt-20">
        <div className="max-w-2xl mx-auto">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "cards" && <CardsTab />}
          {activeTab === "shop" && <ShopTab />}
        </div>
      </main>
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
