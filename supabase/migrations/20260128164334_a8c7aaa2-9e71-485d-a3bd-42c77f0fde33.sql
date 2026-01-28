-- Create producer_submissions table for storing form submissions
CREATE TABLE public.producer_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  admin_note text,
  -- Individual columns for easy filtering
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text NOT NULL,
  categories text,
  certifications text,
  profile text,
  -- Store full payload JSON for safety
  payload jsonb NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.producer_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can INSERT (public form submission)
CREATE POLICY "Anyone can submit producer application"
ON public.producer_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can SELECT
CREATE POLICY "Admins can view all submissions"
ON public.producer_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can UPDATE (for status changes and notes)
CREATE POLICY "Admins can update submissions"
ON public.producer_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can DELETE
CREATE POLICY "Admins can delete submissions"
ON public.producer_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for common queries
CREATE INDEX idx_producer_submissions_status ON public.producer_submissions(status);
CREATE INDEX idx_producer_submissions_created_at ON public.producer_submissions(created_at DESC);
CREATE INDEX idx_producer_submissions_email ON public.producer_submissions(email);