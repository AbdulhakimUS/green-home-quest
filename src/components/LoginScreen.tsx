import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/types/game";
import { toast } from "sonner";
import { Home, Leaf } from "lucide-react";

export const LoginScreen = () => {
  const [gameCode, setGameCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const { setPlayer, setIsAdmin, setGameCode: setGlobalGameCode, addPlayer } = useGame();

  const handlePlayerJoin = () => {
    if (!gameCode.trim() || !nickname.trim()) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      nickname: nickname.trim(),
      money: 5000,
      houseLevel: 1,
      selectedCard: null,
      inventory: []
    };

    setPlayer(newPlayer);
    setGlobalGameCode(gameCode);
    addPlayer(newPlayer);
    toast.success(`Добро пожаловать, ${nickname}!`);
  };

  const handleAdminLogin = () => {
    if (adminLogin === "eco-home" && adminPassword === "Shkola74") {
      setIsAdmin(true);
      const adminCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      setGlobalGameCode(adminCode);
      toast.success(`Игра создана! Код: ${adminCode}`);
    } else {
      toast.error("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-12 h-12 text-primary" />
            <Leaf className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Эко Дом</h1>
          <p className="text-muted-foreground">Создайте самый экологичный дом!</p>
        </div>

        {!showAdminLogin ? (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Присоединиться к игре</CardTitle>
              <CardDescription>Введите код игры и выберите никнейм</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Код игры"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="text-center text-lg font-semibold"
              />
              <Input
                placeholder="Ваш никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button onClick={handlePlayerJoin} className="w-full" size="lg">
                Начать игру
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAdminLogin(true)}
                className="w-full text-sm"
              >
                Создать игру (админ)
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 shadow-lg border-primary">
            <CardHeader>
              <CardTitle>Админ панель</CardTitle>
              <CardDescription>Войдите для создания новой игры</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Логин"
                value={adminLogin}
                onChange={(e) => setAdminLogin(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Пароль"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <Button onClick={handleAdminLogin} className="w-full" size="lg">
                Создать игру
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAdminLogin(false)}
                className="w-full"
              >
                Назад
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
