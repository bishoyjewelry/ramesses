-- Add fulfillment method and logistics fields to repair_quotes
ALTER TABLE public.repair_quotes 
ADD COLUMN IF NOT EXISTS fulfillment_method text DEFAULT 'mail_in',
ADD COLUMN IF NOT EXISTS preferred_dropoff_time text,
ADD COLUMN IF NOT EXISTS pickup_window text,
ADD COLUMN IF NOT EXISTS street_address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip text,
ADD COLUMN IF NOT EXISTS logistics_notes text;

-- Add check constraint for fulfillment_method values
ALTER TABLE public.repair_quotes 
ADD CONSTRAINT repair_quotes_fulfillment_method_check 
CHECK (fulfillment_method IN ('mail_in', 'drop_off', 'courier'));