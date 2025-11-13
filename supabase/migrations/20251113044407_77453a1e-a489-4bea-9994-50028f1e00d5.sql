-- Включаем realtime для таблицы players
ALTER TABLE public.players REPLICA IDENTITY FULL;

-- Добавляем таблицу в публикацию realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- Включаем realtime для таблицы game_sessions
ALTER TABLE public.game_sessions REPLICA IDENTITY FULL;

-- Добавляем таблицу game_sessions в публикацию realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;