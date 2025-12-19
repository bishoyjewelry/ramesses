-- Add new columns to contact_submissions for intent-based routing
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS intent_type text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS related_repair_id uuid,
ADD COLUMN IF NOT EXISTS related_design_id uuid,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS preferred_contact text DEFAULT 'email',
ADD COLUMN IF NOT EXISTS timeline_urgency text,
ADD COLUMN IF NOT EXISTS design_link text,
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- Add index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_intent ON public.contact_submissions(intent_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);