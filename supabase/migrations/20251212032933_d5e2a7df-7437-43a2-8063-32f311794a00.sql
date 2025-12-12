-- Добавляем поля для системы кладов в players
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS claimed_treasures jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS claimed_item_rewards jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS all_treasures_claimed boolean DEFAULT false;

-- Добавляем поле для кладов в game_sessions
ALTER TABLE public.game_sessions 
ADD COLUMN IF NOT EXISTS treasure_items jsonb DEFAULT '[]'::jsonb;

-- Создаем таблицу market_listings для рынка между игроками
CREATE TABLE IF NOT EXISTS public.market_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  seller_nickname text NOT NULL,
  item jsonb NOT NULL,
  price integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Включаем RLS для market_listings
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

-- Политики для market_listings
CREATE POLICY "Anyone can view market listings" 
ON public.market_listings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert market listings" 
ON public.market_listings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete market listings" 
ON public.market_listings 
FOR DELETE 
USING (true);

-- Включаем realtime для market_listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_listings;