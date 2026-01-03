import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Hero
    'hero.title': 'Business Intelligence Analyst',
    'hero.subtitle': 'Turning raw data into strategic decisions',
    'hero.cta': 'View Portfolio',
    
    // About
    'about.title': 'About',
    'about.default': 'I specialize in translating complex datasets into clear, actionable insights that empower stakeholders to make confident decisions. With hands-on experience in SQL, dashboard development, and reporting automation, I deliver data solutions that directly contribute to operational efficiency and revenue growth.',
    
    // Tech Stack
    'tech.title': 'Tech Stack',
    
    // Projects
    'projects.title': 'Featured Projects',
    'projects.loading': 'Loading projects...',
    'projects.empty': 'No projects available yet.',
    'projects.dashboard': 'Dashboard',
    'projects.github': 'GitHub',
    'projects.caseStudy': 'View Case Study',
    'projects.caseStudySoon': 'Case Study Coming Soon',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.default': 'Currently exploring BI Analyst opportunities — let\'s discuss how I can add value to your team.',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.email': 'Email',
    'contact.copyright': '© {year} All rights reserved.',
    
    // Loading states
    'loading': 'Loading...',
    
    // Case Study
    'caseStudy.back': 'Back to Portfolio',
    'caseStudy.notFound': 'Project not found',
    'caseStudy.overview': 'Project Overview',
    'caseStudy.dataTools': 'Data & Tools',
    'caseStudy.dataSource': 'Data Source',
    'caseStudy.toolsUsed': 'Tools Used',
    'caseStudy.approach': 'Analytical Approach',
    'caseStudy.insights': 'Key Insights',
    'caseStudy.evidence': 'Visual Evidence',
    'caseStudy.recommendations': 'Business Recommendations',
    'caseStudy.defaultOverview': 'This project addresses a common business problem in the sector, where lack of data visibility hinders strategic decision-making.',
    'caseStudy.defaultDataSource': 'Synthetic data generated to simulate a realistic business scenario, including performance metrics, customer data, and historical transactions.',
    'caseStudy.defaultApproach': 'The analysis was performed following a structured methodology that includes data exploration, cleaning and validation, descriptive analysis with key metrics, and visualization through interactive dashboards.',
    'caseStudy.defaultInsight1': '20% of customers generate 80% of revenue, confirming the Pareto principle.',
    'caseStudy.defaultInsight2': 'Activity peaks concentrate on specific days of the week, suggesting optimization opportunities.',
    'caseStudy.defaultInsight3': 'There is a significant correlation between response time and customer satisfaction.',
    'caseStudy.defaultInsight4': 'Conversion rates vary considerably depending on the acquisition channel used.',
    'caseStudy.defaultRec1': 'Implement a loyalty program focused on retaining high-value customers.',
    'caseStudy.defaultRec2': 'Optimize resources based on demand according to detected activity patterns.',
    'caseStudy.defaultRec3': 'Improve response times by establishing stricter SLAs.',
    'caseStudy.defaultRec4': 'Review channel strategy by reallocating budget to best performing ones.',
    
    // Not Found
    'notFound.title': '404',
    'notFound.subtitle': 'Page not found',
    'notFound.back': 'Back to Home',
  },
  es: {
    // Hero
    'hero.title': 'Analista de Business Intelligence',
    'hero.subtitle': 'Transformando datos en decisiones estratégicas',
    'hero.cta': 'Ver Portfolio',
    
    // About
    'about.title': 'Sobre Mí',
    'about.default': 'Me especializo en traducir conjuntos de datos complejos en insights claros y accionables que permiten a los stakeholders tomar decisiones con confianza. Con experiencia práctica en SQL, desarrollo de dashboards y automatización de reportes, entrego soluciones de datos que contribuyen directamente a la eficiencia operativa y al crecimiento de ingresos.',
    
    // Tech Stack
    'tech.title': 'Stack Tecnológico',
    
    // Projects
    'projects.title': 'Proyectos Destacados',
    'projects.loading': 'Cargando proyectos...',
    'projects.empty': 'No hay proyectos disponibles aún.',
    'projects.dashboard': 'Dashboard',
    'projects.github': 'GitHub',
    'projects.caseStudy': 'Ver Case Study',
    'projects.caseStudySoon': 'Case Study Próximamente',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.default': 'Actualmente explorando oportunidades como Analista BI — hablemos sobre cómo puedo aportar valor a tu equipo.',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.email': 'Email',
    'contact.copyright': '© {year} Todos los derechos reservados.',
    
    // Loading states
    'loading': 'Cargando...',
    
    // Case Study
    'caseStudy.back': 'Volver al Portfolio',
    'caseStudy.notFound': 'Proyecto no encontrado',
    'caseStudy.overview': 'Resumen del Proyecto',
    'caseStudy.dataTools': 'Datos y Herramientas',
    'caseStudy.dataSource': 'Fuente de Datos',
    'caseStudy.toolsUsed': 'Herramientas Utilizadas',
    'caseStudy.approach': 'Enfoque Analítico',
    'caseStudy.insights': 'Hallazgos Clave',
    'caseStudy.evidence': 'Evidencia Visual',
    'caseStudy.recommendations': 'Recomendaciones de Negocio',
    'caseStudy.defaultOverview': 'Este proyecto aborda un problema de negocio común en el sector, donde la falta de visibilidad sobre los datos dificulta la toma de decisiones estratégicas.',
    'caseStudy.defaultDataSource': 'Datos sintéticos generados para simular un escenario empresarial realista, incluyendo métricas de rendimiento, datos de clientes y transacciones históricas.',
    'caseStudy.defaultApproach': 'El análisis se realizó siguiendo una metodología estructurada que incluye exploración de datos, limpieza y validación, análisis descriptivo con métricas clave, y visualización mediante dashboards interactivos.',
    'caseStudy.defaultInsight1': 'Se identificó que el 20% de los clientes generan el 80% de los ingresos, confirmando la regla de Pareto.',
    'caseStudy.defaultInsight2': 'Los picos de actividad se concentran en días específicos de la semana, sugiriendo oportunidades de optimización.',
    'caseStudy.defaultInsight3': 'Existe una correlación significativa entre el tiempo de respuesta y la satisfacción del cliente.',
    'caseStudy.defaultInsight4': 'Las tasas de conversión varían considerablemente según el canal de adquisición utilizado.',
    'caseStudy.defaultRec1': 'Implementar programa de fidelización enfocado en retener a los clientes de alto valor.',
    'caseStudy.defaultRec2': 'Optimizar recursos según demanda basándose en los patrones de actividad detectados.',
    'caseStudy.defaultRec3': 'Mejorar tiempos de respuesta estableciendo SLAs más estrictos.',
    'caseStudy.defaultRec4': 'Revisar estrategia de canales reasignando presupuesto hacia los de mejor rendimiento.',
    
    // Not Found
    'notFound.title': '404',
    'notFound.subtitle': 'Página no encontrada',
    'notFound.back': 'Volver al Inicio',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  return browserLang.startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const value = translations[language][key];
    if (!value) return key;
    return value.replace('{year}', new Date().getFullYear().toString());
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
