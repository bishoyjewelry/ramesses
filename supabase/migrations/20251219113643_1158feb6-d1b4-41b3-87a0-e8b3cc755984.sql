-- Fix form-uploads bucket: ensure it's private
UPDATE storage.buckets SET public = false WHERE id = 'form-uploads';

-- Drop existing policies if any to recreate with proper rules
DROP POLICY IF EXISTS "Anyone can upload form images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all form uploads" ON storage.objects;

-- Allow anyone to upload (for anonymous repair submissions)
CREATE POLICY "Anyone can upload form images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'form-uploads');

-- Allow users to view their own uploads OR admins to view all
CREATE POLICY "Users can view their own form uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'form-uploads' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);

-- Allow admins to delete/update form uploads
CREATE POLICY "Admins can manage form uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'form-uploads' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update form uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'form-uploads' 
  AND has_role(auth.uid(), 'admin')
);