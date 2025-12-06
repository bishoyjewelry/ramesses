-- Fix 1: Add admin-only SELECT policies for form submission tables
-- This allows admins to view and process customer submissions

-- Admin can view contact submissions
CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view repair quotes
CREATE POLICY "Admins can view repair quotes" 
ON public.repair_quotes FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view custom inquiries
CREATE POLICY "Admins can view custom inquiries" 
ON public.custom_inquiries FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Make the form-uploads bucket private to prevent enumeration
UPDATE storage.buckets SET public = false WHERE id = 'form-uploads';