-- Add internal_notes and admin_image_urls columns to repair_quotes
ALTER TABLE public.repair_quotes 
ADD COLUMN IF NOT EXISTS internal_notes text,
ADD COLUMN IF NOT EXISTS admin_image_urls text[] DEFAULT '{}'::text[];

-- Create storage bucket for admin repair images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('admin-repair-images', 'admin-repair-images', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for admin-repair-images bucket
CREATE POLICY "Admins can upload repair images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'admin-repair-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view repair images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'admin-repair-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete repair images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'admin-repair-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);