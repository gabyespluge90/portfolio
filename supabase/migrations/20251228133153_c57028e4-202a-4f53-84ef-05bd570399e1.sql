-- Add about and contact text fields to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN about_text text NOT NULL DEFAULT 'I specialize in translating complex datasets into clear, actionable insights that empower stakeholders to make confident decisions. With hands-on experience in SQL, dashboard development, and reporting automation, I deliver data solutions that directly contribute to operational efficiency and revenue growth.';

ALTER TABLE public.site_settings 
ADD COLUMN contact_text text NOT NULL DEFAULT 'Currently exploring BI Analyst opportunities — let''s discuss how I can add value to your team.';