-- Добавляем поле кислорода к игрокам
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS oxygen numeric DEFAULT 0;

-- Добавляем поле миссий к игрокам (JSONB массив выполненных миссий)
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS completed_missions jsonb DEFAULT '[]'::jsonb;

-- Добавляем поле для активных событий к сессиям игры
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS active_events jsonb DEFAULT '[]'::jsonb;

-- Добавляем поле для возможности переподключения админа
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS admin_reconnect_allowed boolean DEFAULT true;

-- Обновляем начальные деньги для новых игроков (изменяем дефолт)
ALTER TABLE public.players ALTER COLUMN money SET DEFAULT 20000;