-- Add user_id column to custom_inquiries for tracking authenticated users
ALTER TABLE public.custom_inquiries 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_custom_inquiries_user_id ON public.custom_inquiries(user_id);

-- Add RLS policy for users to view their own custom inquiries
CREATE POLICY "Users can view their own custom inquiries"
ON public.custom_inquiries
FOR SELECT
USING (auth.uid() = user_id);