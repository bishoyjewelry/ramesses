-- Create repair quote submissions table
CREATE TABLE public.repair_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT DEFAULT 'email',
  description TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Create custom jewelry inquiries table
CREATE TABLE public.custom_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  piece_type TEXT NOT NULL,
  budget_range TEXT,
  description TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Create contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.repair_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for insert (anyone can submit forms)
CREATE POLICY "Anyone can submit repair quotes" 
ON public.repair_quotes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit custom inquiries" 
ON public.custom_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for form uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('form-uploads', 'form-uploads', true);

-- Create storage policies for form uploads
CREATE POLICY "Anyone can upload form images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'form-uploads');

CREATE POLICY "Anyone can view form images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'form-uploads');