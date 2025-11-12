-- Создание таблицы игровых сессий
CREATE TABLE game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  timer_duration integer DEFAULT 1800, -- в секундах (30 минут)
  started_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы игроков
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  nickname text NOT NULL,
  money integer DEFAULT 10000,
  house_level numeric DEFAULT 1.0 CHECK (house_level >= 1.0 AND house_level <= 25.0),
  selected_card text CHECK (selected_card IN ('energy', 'water', 'greenery')),
  inventory jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, nickname)
);

-- Создание таблицы истории покупок
CREATE TABLE purchase_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  item_id text NOT NULL,
  item_name text NOT NULL,
  category text NOT NULL,
  tier integer NOT NULL,
  level integer NOT NULL,
  price integer NOT NULL,
  purchased_at timestamptz DEFAULT now()
);

-- Включение RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- Политики для game_sessions (все могут читать по коду)
CREATE POLICY "Anyone can read game sessions by code"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update game sessions"
  ON game_sessions FOR UPDATE
  USING (true);

-- Политики для players (все могут читать и создавать игроков в сессии)
CREATE POLICY "Anyone can read players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create players"
  ON players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON players FOR UPDATE
  USING (true);

-- Политики для purchase_history
CREATE POLICY "Anyone can read purchase history"
  ON purchase_history FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create purchase history"
  ON purchase_history FOR INSERT
  WITH CHECK (true);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для генерации уникального 6-значного кода
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Генерируем 6-значный числовой код
    new_code := LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    
    -- Проверяем существование кода
    SELECT EXISTS(SELECT 1 FROM game_sessions WHERE code = new_code) INTO code_exists;
    
    -- Если код уникален, возвращаем его
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;