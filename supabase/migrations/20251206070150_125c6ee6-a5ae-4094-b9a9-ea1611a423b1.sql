-- Add 'void' status to earning_status enum for refunded orders
ALTER TYPE public.earning_status ADD VALUE IF NOT EXISTS 'void';