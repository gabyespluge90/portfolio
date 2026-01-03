import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useLanguage } from "@/hooks/useLanguage";

export const Projects = () => {
  const { projects, loading } = useProjects();
  const { caseStudies } = useCaseStudies();
  const { t } = useLanguage();
  
  const hasCaseStudy = (projectId: string) => {
    return caseStudies.some(cs => cs.project_id === projectId);
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">{t('projects.loading')}</p>
        </div>
      </section>
    );
  }

  const visibleProjects = projects.filter(p => p.is_visible);

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t('projects.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-3">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              
              {/* Case Study Button */}
              <div className="mb-3">
                {hasCaseStudy(project.id) ? (
                  <Button variant="default" size="sm" className="w-full gap-2" asChild>
                    <Link to={`/case-study/${project.id}`}>
                      <FileText className="h-4 w-4" />
                      {t('projects.caseStudy')}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="default" size="sm" className="w-full gap-2" disabled>
                    <FileText className="h-4 w-4" />
                    {t('projects.caseStudy')}
                  </Button>
                )}
              </div>
              
              {/* Existing Dashboard & GitHub buttons */}
              <div className="flex gap-3">
                {project.dashboard_url && project.dashboard_url !== '#' && (
                  <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                    <a href={project.dashboard_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      {t('projects.dashboard')}
                    </a>
                  </Button>
                )}
                {project.github_url && project.github_url !== '#' && (
                  <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      {t('projects.github')}
                    </a>
                  </Button>
                )}
                {(!project.dashboard_url || project.dashboard_url === '#') && 
                 (!project.github_url || project.github_url === '#') && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                      <ExternalLink className="h-4 w-4" />
                      {t('projects.dashboard')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                      <Github className="h-4 w-4" />
                      {t('projects.github')}
                    </Button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {visibleProjects.length === 0 && (
          <p className="text-center text-muted-foreground">
            {t('projects.empty')}
          </p>
        )}
      </div>
    </section>
  );
};
