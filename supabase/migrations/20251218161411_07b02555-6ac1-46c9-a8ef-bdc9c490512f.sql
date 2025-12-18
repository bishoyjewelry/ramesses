-- Add missing columns for CAD queue management
ALTER TABLE public.custom_inquiries 
ADD COLUMN IF NOT EXISTS assigned_to text,
ADD COLUMN IF NOT EXISTS admin_internal_notes text,
ADD COLUMN IF NOT EXISTS admin_quote_amount numeric;

-- Create RLS policy for admins to update custom_inquiries
CREATE POLICY "Admins can update custom inquiries" 
ON public.custom_inquiries 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));