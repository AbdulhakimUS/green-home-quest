-- Fix security warnings by adding search_path to functions

-- Update generate_game_code function to include search_path
CREATE OR REPLACE FUNCTION public.generate_game_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Update update_player_activity trigger function to include search_path
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