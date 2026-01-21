-- Improve link_guest_repairs to add server-side authentication check
-- This prevents attackers from linking repairs to arbitrary users
CREATE OR REPLACE FUNCTION public.link_guest_repairs(_user_id uuid, _email text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
  calling_user_id uuid;
BEGIN
  -- Verify caller is authenticated and is the user being linked
  calling_user_id := auth.uid();
  IF calling_user_id IS NULL OR calling_user_id != _user_id THEN
    RAISE EXCEPTION 'Unauthorized: can only link own repairs';
  END IF;
  
  UPDATE public.repair_quotes
  SET user_id = _user_id
  WHERE user_id IS NULL
    AND LOWER(email) = LOWER(_email);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;