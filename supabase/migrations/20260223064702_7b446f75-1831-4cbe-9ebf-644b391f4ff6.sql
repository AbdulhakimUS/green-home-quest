
-- Add player status for approve/deny flow
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';
-- Add pending_rewards for inventory overflow
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS pending_rewards jsonb DEFAULT '[]'::jsonb;

-- Create game_logs table for admin logging
CREATE TABLE IF NOT EXISTS public.game_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  player_id uuid,
  player_nickname text,
  action_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.game_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game logs" ON public.game_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert game logs" ON public.game_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete game logs" ON public.game_logs FOR DELETE USING (true);

-- Enable realtime for game_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_logs;

-- Update validate_player_update to allow house_level up to 50 (Stage 2)
CREATE OR REPLACE FUNCTION public.validate_player_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.money < 0 THEN
    RAISE EXCEPTION 'Money cannot be negative';
  END IF;
  IF NEW.house_level > 50 THEN
    NEW.house_level := 50;
  END IF;
  IF NEW.house_level < 1 THEN
    NEW.house_level := 1;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS validate_player_update_trigger ON public.players;
CREATE TRIGGER validate_player_update_trigger
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_player_update();
