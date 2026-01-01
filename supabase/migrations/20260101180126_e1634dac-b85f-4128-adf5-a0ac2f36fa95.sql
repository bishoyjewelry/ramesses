-- Add revision support to user_designs
ALTER TABLE public.user_designs 
ADD COLUMN IF NOT EXISTS revision_notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS revision_requested_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS revision_contact_preference text DEFAULT NULL;

-- Add admin RLS policies for user_designs so admin can see all designs
CREATE POLICY "Admins can view all user designs" 
ON public.user_designs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all user designs" 
ON public.user_designs 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));