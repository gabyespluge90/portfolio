import { Database, BarChart3, Table, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const technologies = [
  { name: "SQL", icon: Database },
  { name: "Looker Studio", icon: BarChart3 },
  { name: "Google Sheets", icon: Table },
  { name: "Data Analysis", icon: TrendingUp },
];

export const TechStack = () => {
  const { t } = useLanguage();
  
  return (
    <section id="tech-stack" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t('tech.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <tech.icon className="h-8 w-8 text-primary" />
              <span className="font-medium text-sm text-center">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
