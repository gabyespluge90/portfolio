import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CaseStudy {
  id: string;
  project_id: string;
  overview: string;
  data_sources: string;
  tools_used: string[];
  analytical_approach: string;
  key_insights: string[];
  recommendations: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

export const useCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseStudies = async () => {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCaseStudies(data as CaseStudy[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  return { caseStudies, loading, refetch: fetchCaseStudies };
};

export const useCaseStudyByProject = (projectId: string | undefined) => {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (!error && data) {
        setCaseStudy(data as CaseStudy);
      }
      setLoading(false);
    };

    fetchCaseStudy();
  }, [projectId]);

  return { caseStudy, loading };
};
