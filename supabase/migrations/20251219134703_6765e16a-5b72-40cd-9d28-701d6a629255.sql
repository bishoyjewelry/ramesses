-- Add status_updated_at column for SLA tracking
ALTER TABLE public.custom_inquiries 
ADD COLUMN IF NOT EXISTS status_updated_at timestamp with time zone DEFAULT now();

-- Create a trigger to automatically update status_updated_at when status changes
CREATE OR REPLACE FUNCTION public.update_inquiry_status_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS on_inquiry_status_change ON public.custom_inquiries;
CREATE TRIGGER on_inquiry_status_change
  BEFORE UPDATE ON public.custom_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_inquiry_status_timestamp();

-- Update existing rows to have status_updated_at set to created_at if null
UPDATE public.custom_inquiries 
SET status_updated_at = created_at 
WHERE status_updated_at IS NULL;