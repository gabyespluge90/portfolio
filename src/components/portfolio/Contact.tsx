import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";

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
  const defaultText = "Currently exploring BI Analyst opportunities — let's discuss how I can add value to your team.";
  
  return (
    <footer id="contact" className="py-24 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-8">
          {contactText || defaultText}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`mailto:${email}`} className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
        </div>
        <p className="mt-16 text-sm text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
