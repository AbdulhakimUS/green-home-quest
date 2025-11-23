-- Fix RLS policies to work with current non-authenticated architecture

-- Drop existing restrictive policies on game_sessions
DROP POLICY IF EXISTS "Admins can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Admins can update their own game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can read game sessions" ON public.game_sessions;

-- Create new permissive policies that work without authentication
CREATE POLICY "Anyone can create game sessions"
ON public.game_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update game sessions"
ON public.game_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can read game sessions"
ON public.game_sessions
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete game sessions"
ON public.game_sessions
FOR DELETE
TO anon, authenticated
USING (true);

-- Fix players table policies
DROP POLICY IF EXISTS "Players can insert their own record" ON public.players;
DROP POLICY IF EXISTS "Players can update only their own record" ON public.players;
DROP POLICY IF EXISTS "Players can read all players in their session" ON public.players;
DROP POLICY IF EXISTS "Admins can delete players" ON public.players;

CREATE POLICY "Anyone can insert players"
ON public.players
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update players"
ON public.players
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can read players"
ON public.players
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete players"
ON public.players
FOR DELETE
TO anon, authenticated
USING (true);

-- Fix purchase_history policies
DROP POLICY IF EXISTS "Players can insert their own purchase history" ON public.purchase_history;
DROP POLICY IF EXISTS "Players can read purchase history" ON public.purchase_history;
DROP POLICY IF EXISTS "Anyone can create purchase history" ON public.purchase_history;
DROP POLICY IF EXISTS "Anyone can read purchase history" ON public.purchase_history;
DROP POLICY IF EXISTS "Anyone can delete purchase history" ON public.purchase_history;

CREATE POLICY "Anyone can manage purchase history"
ON public.purchase_history
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Add RLS policies to user_roles (currently has none)
CREATE POLICY "Anyone can read user roles"
ON public.user_roles
FOR SELECT
TO anon, authenticated
USING (true);