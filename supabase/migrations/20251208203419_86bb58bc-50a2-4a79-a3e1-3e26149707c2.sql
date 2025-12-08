-- Create a security definer function to link guest repairs to authenticated user
CREATE OR REPLACE FUNCTION public.link_guest_repairs(_user_id uuid, _email text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.repair_quotes
  SET user_id = _user_id
  WHERE user_id IS NULL
    AND LOWER(email) = LOWER(_email);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;