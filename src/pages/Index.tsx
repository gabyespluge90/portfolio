import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { TechStack } from "@/components/portfolio/TechStack";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import BackgroundPattern from "@/components/BackgroundPattern";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { settings, loading } = useSiteSettings();
  const { t } = useLanguage();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <BackgroundPattern />
        <p className="text-muted-foreground">{t('loading')}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <BackgroundPattern />
      <Hero 
        name={settings?.name || "Your Name"} 
        profileImageUrl={settings?.profile_image_url}
      />
      <About aboutText={settings?.about_text} />
      <TechStack />
      <Projects />
      <Contact 
        linkedinUrl={settings?.linkedin_url || "#"}
        githubUrl={settings?.github_url || "#"}
        email={settings?.email || "hello@example.com"}
        contactText={settings?.contact_text}
      />
    </main>
  );
};

export default Index;
