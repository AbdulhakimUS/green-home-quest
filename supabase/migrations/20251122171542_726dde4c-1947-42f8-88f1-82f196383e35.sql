-- Добавляем поле initial_balance в game_sessions для хранения начального баланса игроков
ALTER TABLE public.game_sessions 
ADD COLUMN initial_balance INTEGER DEFAULT 20000;