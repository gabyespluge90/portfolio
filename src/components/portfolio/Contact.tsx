import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ContactProps {
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
  contactText?: string;
}

export const Contact = ({
  linkedinUrl = "#",
  githubUrl = "#",
  email = "hello@example.com",
  contactText,
}: ContactProps) => {
  const { t } = useLanguage();
  
  return (
    <footer id="contact" className="py-24 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('contact.title')}</h2>
        <p className="text-muted-foreground mb-8">
          {contactText || t('contact.default')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Linkedin className="h-4 w-4" />
              {t('contact.linkedin')}
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Github className="h-4 w-4" />
              {t('contact.github')}
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`mailto:${email}`} className="gap-2">
              <Mail className="h-4 w-4" />
              {t('contact.email')}
            </a>
          </Button>
        </div>
        <p className="mt-16 text-sm text-muted-foreground">
          {t('contact.copyright')}
        </p>
      </div>
    </footer>
  );
};
