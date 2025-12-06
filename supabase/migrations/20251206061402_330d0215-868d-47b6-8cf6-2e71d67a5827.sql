
-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enums
CREATE TYPE public.app_role AS ENUM ('customer', 'creator', 'admin');
CREATE TYPE public.creator_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE public.design_category AS ENUM ('ring', 'pendant', 'chain', 'bracelet', 'earrings', 'other');
CREATE TYPE public.design_status AS ENUM ('draft', 'pending_approval', 'published', 'archived', 'rejected');
CREATE TYPE public.metal_type AS ENUM ('14k_yellow', '14k_white', '14k_rose', '18k', 'platinum', 'silver');
CREATE TYPE public.commission_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.earning_status AS ENUM ('pending', 'ready_to_pay', 'paid');
CREATE TYPE public.application_status AS ENUM ('new', 'under_review', 'approved', 'rejected');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Creator profiles table
CREATE TABLE public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  profile_image_url TEXT,
  status creator_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Designs table
CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  main_image_url TEXT NOT NULL,
  gallery_image_urls TEXT[] DEFAULT '{}',
  category design_category NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  base_cost_estimate NUMERIC(10,2),
  allowed_metals metal_type[] DEFAULT '{}',
  stone_options JSONB,
  status design_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  commission_type commission_type NOT NULL DEFAULT 'percentage',
  commission_value NUMERIC(10,2) NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creator earnings table
CREATE TABLE public.creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  creator_profile_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT,
  sale_amount NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  status earning_status NOT NULL DEFAULT 'pending',
  period TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creator applications table
CREATE TABLE public.creator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  submitted_design_image_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  status application_status NOT NULL DEFAULT 'new',
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for creator_profiles
CREATE POLICY "Anyone can view active creator profiles" ON public.creator_profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Creators can view their own profile" ON public.creator_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Creators can update their own profile" ON public.creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.creator_profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for designs
CREATE POLICY "Anyone can view published designs" ON public.designs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can manage their own designs" ON public.designs
  FOR ALL USING (
    creator_profile_id IN (
      SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all designs" ON public.designs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for creator_earnings
CREATE POLICY "Creators can view their own earnings" ON public.creator_earnings
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all earnings" ON public.creator_earnings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for creator_applications
CREATE POLICY "Users can view their own applications" ON public.creator_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON public.creator_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" ON public.creator_applications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_creator_profiles_updated_at
  BEFORE UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_earnings_updated_at
  BEFORE UPDATE ON public.creator_earnings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_applications_updated_at
  BEFORE UPDATE ON public.creator_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_designs_creator ON public.designs(creator_profile_id);
CREATE INDEX idx_designs_status ON public.designs(status);
CREATE INDEX idx_designs_category ON public.designs(category);
CREATE INDEX idx_designs_slug ON public.designs(slug);
CREATE INDEX idx_creator_earnings_creator ON public.creator_earnings(creator_profile_id);
CREATE INDEX idx_creator_earnings_period ON public.creator_earnings(period);
CREATE INDEX idx_creator_applications_status ON public.creator_applications(status);
