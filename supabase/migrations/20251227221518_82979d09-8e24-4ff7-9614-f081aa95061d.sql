-- Create case_studies table
CREATE TABLE public.case_studies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  overview text NOT NULL DEFAULT '',
  data_sources text NOT NULL DEFAULT '',
  tools_used text[] NOT NULL DEFAULT '{}',
  analytical_approach text NOT NULL DEFAULT '',
  key_insights text[] NOT NULL DEFAULT '{}',
  recommendations text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view case studies"
ON public.case_studies
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage case studies"
ON public.case_studies
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();