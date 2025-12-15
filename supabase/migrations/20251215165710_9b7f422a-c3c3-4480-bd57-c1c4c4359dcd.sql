-- Create user_designs table for storing AI-generated concepts
CREATE TABLE public.user_designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  flow_type TEXT NOT NULL DEFAULT 'engagement', -- 'engagement' or 'general'
  
  -- Form inputs stored for regeneration
  form_inputs JSONB NOT NULL DEFAULT '{}',
  
  -- AI-generated spec sheet
  spec_sheet JSONB,
  
  -- Multi-angle images (base64 or URLs)
  hero_image_url TEXT,
  side_image_url TEXT,
  top_image_url TEXT,
  
  -- Inspiration images uploaded by user
  inspiration_image_urls TEXT[] DEFAULT '{}',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft', -- draft, saved, submitted_for_cad
  cad_submitted_at TIMESTAMP WITH TIME ZONE,
  custom_inquiry_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_designs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own designs"
ON public.user_designs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own designs"
ON public.user_designs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
ON public.user_designs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
ON public.user_designs
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_designs_updated_at
BEFORE UPDATE ON public.user_designs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for user lookups
CREATE INDEX idx_user_designs_user_id ON public.user_designs(user_id);
CREATE INDEX idx_user_designs_status ON public.user_designs(status);