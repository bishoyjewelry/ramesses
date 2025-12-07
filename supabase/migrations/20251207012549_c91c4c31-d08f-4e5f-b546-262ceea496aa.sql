-- Add RLS policy for admins to update repair quotes
CREATE POLICY "Admins can update repair quotes"
ON public.repair_quotes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));