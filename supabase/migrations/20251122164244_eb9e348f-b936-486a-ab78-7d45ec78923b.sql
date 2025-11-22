-- Allow deleting players and their purchase history

-- Enable DELETE on players table via RLS policy
CREATE POLICY "Anyone can delete players"
ON public.players
FOR DELETE
USING (true);

-- Enable DELETE on purchase_history table via RLS policy
CREATE POLICY "Anyone can delete purchase history"
ON public.purchase_history
FOR DELETE
USING (true);

-- Ensure cascading delete from players to purchase_history
ALTER TABLE public.purchase_history
DROP CONSTRAINT IF EXISTS purchase_history_player_id_fkey;

ALTER TABLE public.purchase_history
ADD CONSTRAINT purchase_history_player_id_fkey
FOREIGN KEY (player_id)
REFERENCES public.players(id)
ON DELETE CASCADE;