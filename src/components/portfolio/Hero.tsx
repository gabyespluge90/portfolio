import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import profilePhotoDefault from "@/assets/profile-photo.png";

interface HeroProps {
  name: string;
  profileImageUrl?: string | null;
}

export const Hero = ({ name, profileImageUrl }: HeroProps) => {
  const { isAdmin } = useAuth();

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        {isAdmin && (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8">
          <img
            src={profileImageUrl || profilePhotoDefault}
            alt="Profile photo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          {name}
        </h1>
        <p className="text-xl md:text-2xl text-primary font-medium mb-4">
          Business Intelligence Analyst
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Turning raw data into strategic decisions
        </p>
        <Button
          onClick={scrollToPortfolio}
          size="lg"
          className="gap-2"
        >
          View Portfolio
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};
