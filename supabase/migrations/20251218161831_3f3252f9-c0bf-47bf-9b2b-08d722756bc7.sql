-- Add admin_quote_message column to custom_inquiries
ALTER TABLE public.custom_inquiries 
ADD COLUMN IF NOT EXISTS admin_quote_message text;

-- Create email_logs table for tracking sent emails
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email text NOT NULL,
  template text NOT NULL,
  subject text,
  related_inquiry_id uuid REFERENCES public.custom_inquiries(id) ON DELETE SET NULL,
  related_design_id uuid REFERENCES public.user_designs(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  sent_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to insert (edge functions)
CREATE POLICY "Service role can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_email_logs_inquiry ON public.email_logs(related_inquiry_id);
CREATE INDEX idx_email_logs_template ON public.email_logs(template);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at DESC);