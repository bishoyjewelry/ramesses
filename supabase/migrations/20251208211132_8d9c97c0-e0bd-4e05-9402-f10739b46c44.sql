-- Add payment-related columns to repair_quotes
ALTER TABLE public.repair_quotes 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS payment_link_url text,
ADD COLUMN IF NOT EXISTS shopify_reference text,
ADD COLUMN IF NOT EXISTS shopify_order_id text,
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Create index for efficient lookups by shopify references
CREATE INDEX IF NOT EXISTS idx_repair_quotes_shopify_reference ON public.repair_quotes(shopify_reference) WHERE shopify_reference IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_repair_quotes_shopify_order_id ON public.repair_quotes(shopify_order_id) WHERE shopify_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_repair_quotes_payment_status ON public.repair_quotes(payment_status);