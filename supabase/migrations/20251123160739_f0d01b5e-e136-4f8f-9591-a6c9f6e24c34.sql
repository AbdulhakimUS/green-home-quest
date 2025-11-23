-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'player');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Add user_id column to players table
ALTER TABLE public.players ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to game_sessions table for admin tracking
ALTER TABLE public.game_sessions ADD COLUMN admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop old permissive RLS policies
DROP POLICY IF EXISTS "Anyone can update players" ON public.players;
DROP POLICY IF EXISTS "Anyone can delete players" ON public.players;
DROP POLICY IF EXISTS "Anyone can create players" ON public.players;
DROP POLICY IF EXISTS "Anyone can read players" ON public.players;

DROP POLICY IF EXISTS "Anyone can update game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can read game sessions by code" ON public.game_sessions;

-- Create secure RLS policies for players
CREATE POLICY "Players can read all players in their session"
ON public.players FOR SELECT
USING (true);

CREATE POLICY "Players can insert their own record"
ON public.players FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update only their own record"
ON public.players FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete players"
ON public.players FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure RLS policies for game_sessions
CREATE POLICY "Anyone can read game sessions"
ON public.game_sessions FOR SELECT
USING (true);

CREATE POLICY "Admins can create game sessions"
ON public.game_sessions FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update their own game sessions"
ON public.game_sessions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') AND admin_user_id = auth.uid());

-- Purchase history policies remain readable by all
CREATE POLICY "Players can read purchase history"
ON public.purchase_history FOR SELECT
USING (true);

CREATE POLICY "Players can insert their own purchase history"
ON public.purchase_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.players
    WHERE players.id = purchase_history.player_id
    AND players.user_id = auth.uid()
  )
);

-- Create trigger to prevent invalid player state changes
CREATE OR REPLACE FUNCTION public.validate_player_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent negative money
  IF NEW.money < 0 THEN
    RAISE EXCEPTION 'Money cannot be negative';
  END IF;
  
  -- Prevent house level above 25
  IF NEW.house_level > 25 THEN
    NEW.house_level := 25;
  END IF;
  
  -- Prevent house level below 1
  IF NEW.house_level < 1 THEN
    NEW.house_level := 1;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_player_update_trigger
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.validate_player_update();