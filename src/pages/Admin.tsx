import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, FolderKanban, Home, FileText } from 'lucide-react';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminCaseStudies } from '@/components/admin/AdminCaseStudies';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-bold truncate">Panel Admin</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1 sm:gap-2 px-2 sm:px-3">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Ver sitio</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1 sm:gap-2 px-2 sm:px-3">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="w-full flex mb-6 sm:mb-8 h-auto p-1">
            <TabsTrigger value="settings" className="flex-1 gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex-1 gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Proyectos</span>
            </TabsTrigger>
            <TabsTrigger value="case-studies" className="flex-1 gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Casos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
          
          <TabsContent value="projects">
            <AdminProjects />
          </TabsContent>
          
          <TabsContent value="case-studies">
            <AdminCaseStudies />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
