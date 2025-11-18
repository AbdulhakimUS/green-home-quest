import { useState, useEffect } from "react";
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
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminChoice, setAdminChoice] = useState<'create' | 'join' | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Автоматически вставляем код из URL параметра и автовозврат после F5
  useEffect(() => {
    // Автоочистка старых данных (>3 часов)
    const cleanOldData = () => {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const threeHours = 3 * 60 * 60 * 1000;
      
      keys.forEach(key => {
        if (key.startsWith('game_') || key.startsWith('player_') || key === 'current_session') {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.timestamp && now - data.timestamp > threeHours) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });
    };
    cleanOldData();

    // Автовозврат в комнату после перезагрузки
    const savedSession = localStorage.getItem('current_session');
    if (savedSession) {
      try {
        const { code, nickname: savedNickname, timestamp } = JSON.parse(savedSession);
        const now = Date.now();
        const threeHours = 3 * 60 * 60 * 1000;
        
        if (code && savedNickname && now - timestamp < threeHours) {
          setGameCode(code);
          setNickname(savedNickname);
        } else {
          localStorage.removeItem('current_session');
        }
      } catch (e) {
        localStorage.removeItem('current_session');
      }
    }

    // Автовставка кода из URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl && /^\d{6}$/.test(codeFromUrl)) {
      setGameCode(codeFromUrl);
    }
  }, []);

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

    // Проверяем статус игры - если игра уже началась, новые игроки не могут присоединиться
    if (session.status === 'active' || session.status === 'paused') {
      toast({
        title: "Ошибка",
        description: "Игра уже началась. Присоединиться нельзя.",
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

    console.log('🎮 Creating player for session:', session.id);
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
      console.error('❌ Error creating player:', playerError);
      toast({
        title: "Ошибка",
        description: "Не удалось создать игрока",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (newPlayer) {
      console.log('✅ Player created successfully');
      // Сохраняем в localStorage для восстановления
      localStorage.setItem('eco_player_id', newPlayer.id);
      localStorage.setItem('eco_session_id', session.id);
      localStorage.setItem('current_session', JSON.stringify({
        code: gameCode,
        nickname,
        timestamp: Date.now()
      }));
      
      toast({
        title: "Успешно!",
        description: `Добро пожаловать, ${nickname}!`,
      });
      onLogin(newPlayer, session, false);
    }
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

    setAdminAuthenticated(true);
    toast({
      title: "Успешно!",
      description: "Добро пожаловать, администратор",
    });
  };

  const handleCreateRoom = async () => {
    setLoading(true);

    console.log('🎲 Generating game code...');
    const { data: codeData } = await supabase.rpc('generate_game_code');
    const newGameCode = codeData as string;
    console.log('✅ Generated code:', newGameCode);

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
      console.error('❌ Error creating session:', sessionError);
      toast({
        title: "Ошибка",
        description: "Не удалось создать игру",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    console.log('✅ Session created:', session);
    // Сохраняем для админа
    localStorage.setItem('eco_session_id', session.id);
    localStorage.setItem('eco_is_admin', 'true');
    
    setLoading(false);
    toast({
      title: "Игра создана!",
      description: `Код игры: ${newGameCode}`,
    });
    onLogin(null, session, true);
  };

  const handleJoinRoom = async () => {
    if (!joinCode || !/^\d{6}$/.test(joinCode)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный 6-значный код",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('code', joinCode)
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

    console.log('✅ Joined session:', session);
    // Сохраняем для админа
    localStorage.setItem('eco_session_id', session.id);
    localStorage.setItem('eco_is_admin', 'true');
    
    setLoading(false);
    toast({
      title: "Успешно!",
      description: `Присоединились к игре ${joinCode}`,
    });
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
        ) : !adminAuthenticated ? (
          <Card className="border-2 shadow-lg border-primary">
            <CardHeader>
              <CardTitle>Вход администратора</CardTitle>
              <CardDescription>Войдите для управления игрой</CardDescription>
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
                Войти
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
        ) : (
          <Card className="border-2 shadow-lg border-primary">
            <CardHeader>
              <CardTitle>Управление игрой</CardTitle>
              <CardDescription>Выберите действие</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!adminChoice ? (
                <>
                  <Button 
                    onClick={() => setAdminChoice('create')} 
                    className="w-full" 
                    size="lg"
                  >
                    Создать новую комнату
                  </Button>
                  <Button 
                    onClick={() => setAdminChoice('join')} 
                    className="w-full" 
                    size="lg"
                    variant="outline"
                  >
                    Присоединиться к существующей
                  </Button>
                </>
              ) : adminChoice === 'create' ? (
                <>
                  <p className="text-sm text-muted-foreground text-center">
                    Создать новую игровую комнату
                  </p>
                  <Button 
                    onClick={handleCreateRoom} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Создание..." : "Создать комнату"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setAdminChoice(null)}
                    className="w-full"
                  >
                    Назад
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    placeholder="Код комнаты (6 цифр)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="text-center text-lg font-semibold"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleJoinRoom} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Подключение..." : "Присоединиться"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setAdminChoice(null)}
                    className="w-full"
                  >
                    Назад
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
