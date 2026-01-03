import { useLanguage } from "@/hooks/useLanguage";

interface AboutProps {
  aboutText?: string;
}

export const About = ({ aboutText }: AboutProps) => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('about.title')}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {aboutText || t('about.default')}
        </p>
      </div>
    </section>
  );
};
