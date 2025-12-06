-- Add missing fields to repair_quotes table for tracking
ALTER TABLE public.repair_quotes 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS item_type text,
ADD COLUMN IF NOT EXISTS repair_type text,
ADD COLUMN IF NOT EXISTS quoted_price numeric,
ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create updated_at trigger for repair_quotes
DROP TRIGGER IF EXISTS update_repair_quotes_updated_at ON public.repair_quotes;
CREATE TRIGGER update_repair_quotes_updated_at
  BEFORE UPDATE ON public.repair_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies to allow users to view their own repair quotes
DROP POLICY IF EXISTS "Users can view their own repair quotes" ON public.repair_quotes;
CREATE POLICY "Users can view their own repair quotes"
  ON public.repair_quotes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Keep existing policy for anyone to submit
-- Ensure insert policy allows both guests and logged-in users
DROP POLICY IF EXISTS "Anyone can submit repair quotes" ON public.repair_quotes;
CREATE POLICY "Anyone can submit repair quotes"
  ON public.repair_quotes
  FOR INSERT
  WITH CHECK (true);