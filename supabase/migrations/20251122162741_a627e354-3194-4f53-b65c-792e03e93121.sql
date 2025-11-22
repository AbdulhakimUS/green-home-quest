-- Создаем функцию для обновления last_activity при любом изменении игрока
CREATE OR REPLACE FUNCTION public.update_player_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$;

-- Создаем триггер для автоматического обновления last_activity
DROP TRIGGER IF EXISTS update_player_activity_trigger ON players;
CREATE TRIGGER update_player_activity_trigger
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_activity();

-- Создаем функцию для очистки старых данных
CREATE OR REPLACE FUNCTION public.cleanup_old_game_data()
RETURNS TABLE(deleted_sessions bigint, deleted_players bigint, deleted_history bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_history bigint;
  v_deleted_players bigint;
  v_deleted_sessions bigint;
BEGIN
  -- Удаляем историю покупок для старых игроков
  DELETE FROM purchase_history
  WHERE player_id IN (
    SELECT p.id FROM players p
    JOIN game_sessions gs ON p.session_id = gs.id
    WHERE gs.created_at < now() - interval '24 hours'
  );
  GET DIAGNOSTICS v_deleted_history = ROW_COUNT;
  
  -- Удаляем старых игроков
  DELETE FROM players
  WHERE session_id IN (
    SELECT id FROM game_sessions
    WHERE created_at < now() - interval '24 hours'
  );
  GET DIAGNOSTICS v_deleted_players = ROW_COUNT;
  
  -- Удаляем старые сессии
  DELETE FROM game_sessions
  WHERE created_at < now() - interval '24 hours';
  GET DIAGNOSTICS v_deleted_sessions = ROW_COUNT;
  
  RETURN QUERY SELECT v_deleted_sessions, v_deleted_players, v_deleted_history;
END;
$$;