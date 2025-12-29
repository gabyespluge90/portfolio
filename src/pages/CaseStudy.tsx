import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, BarChart3, Lightbulb, Target } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useCaseStudyByProject } from "@/hooks/useCaseStudies";
import BackgroundPattern from "@/components/BackgroundPattern";
import { ThemeToggle } from "@/components/ThemeToggle";

const CaseStudy = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading: projectsLoading } = useProjects();
  const { caseStudy, loading: caseStudyLoading } = useCaseStudyByProject(projectId);
  
  const project = projects.find(p => p.id === projectId);
  const loading = projectsLoading || caseStudyLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <BackgroundPattern />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background relative">
        <BackgroundPattern />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-muted-foreground">Proyecto no encontrado</p>
          <Button asChild variant="outline">
            <Link to="/#portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Portfolio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Use case study data if available, otherwise use fallback placeholder content
  const overview = caseStudy?.overview || `${project.description}\n\nEste proyecto aborda un problema de negocio común en el sector, donde la falta de visibilidad sobre los datos dificulta la toma de decisiones estratégicas.`;
  const dataSources = caseStudy?.data_sources || "Datos sintéticos generados para simular un escenario empresarial realista, incluyendo métricas de rendimiento, datos de clientes y transacciones históricas.";
  const toolsUsed = caseStudy?.tools_used?.length ? caseStudy.tools_used : project.tools;
  const analyticalApproach = caseStudy?.analytical_approach || "El análisis se realizó siguiendo una metodología estructurada que incluye exploración de datos, limpieza y validación, análisis descriptivo con métricas clave, y visualización mediante dashboards interactivos.";
  const keyInsights = caseStudy?.key_insights?.length ? caseStudy.key_insights : [
    "Se identificó que el 20% de los clientes generan el 80% de los ingresos, confirmando la regla de Pareto.",
    "Los picos de actividad se concentran en días específicos de la semana, sugiriendo oportunidades de optimización.",
    "Existe una correlación significativa entre el tiempo de respuesta y la satisfacción del cliente.",
    "Las tasas de conversión varían considerablemente según el canal de adquisición utilizado."
  ];
  const recommendations = caseStudy?.recommendations?.length ? caseStudy.recommendations : [
    "Implementar programa de fidelización enfocado en retener a los clientes de alto valor.",
    "Optimizar recursos según demanda basándose en los patrones de actividad detectados.",
    "Mejorar tiempos de respuesta estableciendo SLAs más estrictos.",
    "Revisar estrategia de canales reasignando presupuesto hacia los de mejor rendimiento."
  ];
  const images = caseStudy?.images || [];

  return (
    <div className="min-h-screen relative">
      <BackgroundPattern />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/#portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Portfolio
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Project Title */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Section 1: Project Overview */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Resumen del Proyecto</h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {overview}
            </p>
          </div>
        </section>

        {/* Section 2: Data & Tools */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Datos y Herramientas</h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Fuente de Datos</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {dataSources}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Herramientas Utilizadas</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {toolsUsed.map((tool, index) => (
                    <li key={index}>• {tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Analytical Approach */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Enfoque Analítico</h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {analyticalApproach}
            </p>
          </div>
        </section>

        {/* Section 4: Key Insights */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Hallazgos Clave</h2>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <ul className="space-y-3">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 5: Visual Evidence */}
        {images.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Evidencia Visual</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {images.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={`bg-card border border-border rounded-lg overflow-hidden ${images.length === 1 || (images.length % 2 !== 0 && index === images.length - 1) ? 'md:col-span-2' : ''}`}
                >
                  <img 
                    src={imageUrl} 
                    alt={`Evidencia visual ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Business Recommendations */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Recomendaciones de Negocio</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent-foreground flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground pt-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Portfolio */}
        <div className="text-center pt-8 border-t border-border">
          <Button asChild>
            <Link to="/#portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Portfolio
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CaseStudy;
