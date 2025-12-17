import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Leaf } from "lucide-react";
import { GameRulesDialog } from "@/components/GameRulesDialog";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginScreenProps {
  onLogin: (player: any, session: any, isAdmin: boolean) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminChoice, setAdminChoice] = useState<"create" | "join" | null>(
    null
  );
  const [joinCode, setJoinCode] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState("20000");

  // Автоматически вставляем код из URL параметра и автовозврат после F5
  useEffect(() => {
    // Автоочистка старых данных (>3 часов)
    const cleanOldData = () => {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const threeHours = 3 * 60 * 60 * 1000;

      keys.forEach((key) => {
        if (
          key.startsWith("game_") ||
          key.startsWith("player_") ||
          key === "current_session"
        ) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
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
    const savedSession = localStorage.getItem("current_session");
    if (savedSession) {
      try {
        const {
          code,
          nickname: savedNickname,
          timestamp,
        } = JSON.parse(savedSession);
        const now = Date.now();
        const threeHours = 3 * 60 * 60 * 1000;

        if (code && savedNickname && now - timestamp < threeHours) {
          setGameCode(code);
          setNickname(savedNickname);
        } else {
          localStorage.removeItem("current_session");
        }
      } catch (e) {
        localStorage.removeItem("current_session");
      }
    }

    // Автовставка кода из URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("code");
    if (codeFromUrl && /^\d{6}$/.test(codeFromUrl)) {
      setGameCode(codeFromUrl);
    }
  }, []);

  const handlePlayerLogin = async () => {
    if (!gameCode || !nickname) {
      toast({
        title: t("error.title"),
        description: t("error.fillFields"),
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{6}$/.test(gameCode)) {
      toast({
        title: t("error.title"),
        description: t("error.codeFormat"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("code", gameCode)
      .single();

    if (sessionError || !session) {
      toast({
        title: t("error.title"),
        description: t("error.gameNotFound"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Проверяем статус игры - если игра уже началась, новые игроки не могут присоединиться
    if (session.status === "active" || session.status === "paused") {
      toast({
        title: t("error.title"),
        description: t("error.gameStarted"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data: existingPlayer } = await supabase
      .from("players")
      .select("*")
      .eq("session_id", session.id)
      .eq("nickname", nickname)
      .single();

    if (existingPlayer) {
      toast({
        title: t("error.title"),
        description: t("error.nicknameTaken"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    console.log("🎮 Creating player for session:", session.id);
    const { data: newPlayer, error: playerError } = await supabase
      .from("players")
      .insert({
        session_id: session.id,
        nickname,
        money: session.initial_balance || 20000,
        house_level: 1,
        selected_card: null,
        inventory: [],
        oxygen: 0,
        completed_missions: [],
        claimed_treasures: [],
        claimed_item_rewards: [],
        all_treasures_claimed: false,
      })
      .select()
      .single();

    if (playerError || !newPlayer) {
      console.error("❌ Error creating player:", playerError);
      toast({
        title: t("error.title"),
        description: t("error.createPlayer"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (newPlayer) {
      console.log("✅ Player created successfully");
      // Сохраняем в localStorage для восстановления
      localStorage.setItem("eco_player_id", newPlayer.id);
      localStorage.setItem("eco_session_id", session.id);
      localStorage.setItem(
        "current_session",
        JSON.stringify({
          code: gameCode,
          nickname,
          timestamp: Date.now(),
        })
      );

      toast({
        title: t("success.title"),
        description: `${t("success.welcome")}, ${nickname}!`,
      });
      onLogin(newPlayer, session, false);
    }
  };

  const handleAdminLogin = async () => {
    if (adminLogin !== "eco-home" || adminPassword !== "Shkola74") {
      toast({
        title: t("error.title"),
        description: t("error.wrongCredentials"),
        variant: "destructive",
      });
      return;
    }

    setAdminAuthenticated(true);
    toast({
      title: t("success.title"),
      description: t("success.welcomeAdmin"),
    });
  };

  const handleCreateRoom = async () => {
    const balance = parseInt(initialBalance);
    if (isNaN(balance) || balance <= 0) {
      toast({
        title: t("error.title"),
        description: t("error.invalidBalance"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    console.log("🎲 Generating game code...");
    const { data: codeData } = await supabase.rpc("generate_game_code");
    const newGameCode = codeData as string;
    console.log("✅ Generated code:", newGameCode);

    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        code: newGameCode,
        status: "waiting",
        timer_duration: 1800,
        initial_balance: balance,
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error("❌ Error creating session:", sessionError);
      toast({
        title: t("error.title"),
        description: t("error.createGame"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    console.log("✅ Session created:", session);
    // Сохраняем для админа
    localStorage.setItem("eco_session_id", session.id);
    localStorage.setItem("eco_is_admin", "true");

    setLoading(false);
    toast({
      title: t("success.gameCreated"),
      description: `${t("success.gameCode")}: ${newGameCode}`,
    });
    onLogin(null, session, true);
  };

  const handleJoinRoom = async () => {
    if (!joinCode || !/^\d{6}$/.test(joinCode)) {
      toast({
        title: t("error.title"),
        description: t("error.invalidCode"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("code", joinCode)
      .single();

    if (sessionError || !session) {
      toast({
        title: t("error.title"),
        description: t("error.gameNotFound"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    console.log("✅ Joined session:", session);
    // Сохраняем для админа
    localStorage.setItem("eco_session_id", session.id);
    localStorage.setItem("eco_is_admin", "true");

    setLoading(false);
    toast({
      title: t("success.title"),
      description: `${t("success.joinedGame")} ${joinCode}`,
    });
    onLogin(null, session, true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-3 sm:p-4">
      {/* Кнопки помощи и языка в углу */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSelector />
        <GameRulesDialog variant="login" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 animate-fade-in">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <Home className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {t("app.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("app.subtitle")}
          </p>
        </div>

        {!isAdmin ? (
          <Card className="border-2 shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                {t("login.join")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("login.joinDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <Input
                placeholder={t("login.code")}
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="text-center text-base sm:text-lg font-semibold"
                maxLength={6}
              />
              <Input
                placeholder={t("login.nickname")}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-sm sm:text-base"
              />
              <Button
                onClick={handlePlayerLogin}
                className="w-full text-sm sm:text-base"
                size="lg"
                disabled={loading}
              >
                {loading ? t("login.loading") : t("login.start")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAdmin(true)}
                className="w-full text-xs sm:text-sm"
              >
                {t("login.createAdmin")}
              </Button>
            </CardContent>
          </Card>
        ) : !adminAuthenticated ? (
          <Card className="border-2 shadow-lg border-primary">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                {t("login.adminTitle")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("login.adminDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <Input
                placeholder={t("login.login")}
                value={adminLogin}
                onChange={(e) => setAdminLogin(e.target.value)}
                className="text-sm sm:text-base"
              />
              <Input
                type="password"
                placeholder={t("login.password")}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="text-sm sm:text-base"
              />
              <Button
                onClick={handleAdminLogin}
                className="w-full text-sm sm:text-base"
                size="lg"
                disabled={loading}
              >
                {t("login.enter")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAdmin(false)}
                className="w-full text-xs sm:text-sm"
              >
                {t("login.back")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 shadow-lg border-primary">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                {t("login.gameControl")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("login.selectAction")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              {!adminChoice ? (
                <>
                  <Button
                    onClick={() => setAdminChoice("create")}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                  >
                    {t("login.createRoom")}
                  </Button>
                  <Button
                    onClick={() => setAdminChoice("join")}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                    variant="outline"
                  >
                    {t("login.joinExisting")}
                  </Button>
                </>
              ) : adminChoice === "create" ? (
                <>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    {t("login.createRoomDesc")}
                  </p>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground">
                      {t("login.initialBalance")}
                    </label>
                    <Input
                      type="number"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      min="1000"
                      placeholder="20000"
                      className="mt-1 text-center text-base sm:text-lg font-semibold"
                    />
                  </div>
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? t("login.creating") : t("login.createRoom")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setAdminChoice(null)}
                    className="w-full text-xs sm:text-sm"
                  >
                    {t("login.back")}
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    placeholder={t("login.roomCode")}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="text-center text-base sm:text-lg font-semibold"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleJoinRoom}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? t("login.joining") : t("login.joinRoom")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setAdminChoice(null)}
                    className="w-full text-xs sm:text-sm"
                  >
                    {t("login.back")}
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
