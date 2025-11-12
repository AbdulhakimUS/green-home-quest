import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LoginScreenProps {
  onLogin: (player: any, session: any, isAdmin: boolean) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlayerLogin = async () => {
    if (!gameCode || !nickname) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{6}$/.test(gameCode)) {
      toast({
        title: "Ошибка",
        description: "Код должен состоять из 6 цифр",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('code', gameCode)
      .single();

    if (sessionError || !session) {
      toast({
        title: "Ошибка",
        description: "Игра с таким кодом не найдена",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('session_id', session.id)
      .eq('nickname', nickname)
      .single();

    if (existingPlayer) {
      toast({
        title: "Ошибка",
        description: "Этот никнейм уже занят",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const { data: newPlayer, error: playerError } = await supabase
      .from('players')
      .insert({
        session_id: session.id,
        nickname,
        money: 10000,
        house_level: 1,
        selected_card: null,
        inventory: []
      })
      .select()
      .single();

    if (playerError || !newPlayer) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать игрока",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    onLogin({ ...newPlayer, inventory: [] }, session, false);
  };

  const handleAdminLogin = async () => {
    if (adminLogin !== "eco-home" || adminPassword !== "Shkola74") {
      toast({
        title: "Ошибка",
        description: "Неверный логин или пароль",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const { data: codeData } = await supabase.rpc('generate_game_code');
    const newGameCode = codeData as string;

    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        code: newGameCode,
        status: 'waiting',
        timer_duration: 1800
      })
      .select()
      .single();

    if (sessionError || !session) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать игру",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    onLogin(null, session, true);
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

        {!isAdmin ? (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Присоединиться к игре</CardTitle>
              <CardDescription>Введите 6-значный код игры и никнейм</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Код игры (6 цифр)"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="text-center text-lg font-semibold"
                maxLength={6}
              />
              <Input
                placeholder="Ваш никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button 
                onClick={handlePlayerLogin} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Начать игру"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAdmin(true)}
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
              <Button 
                onClick={handleAdminLogin} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Создание..." : "Создать игру"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAdmin(false)}
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
