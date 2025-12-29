import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProjects, Project } from '@/hooks/useProjects';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const AdminProjects = () => {
  const { projects, loading, refetch } = useProjects();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tools: '',
    dashboard_url: '',
    github_url: '',
    display_order: 0,
    is_visible: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tools: '',
      dashboard_url: '',
      github_url: '',
      display_order: projects.length,
      is_visible: true,
    });
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tools: project.tools.join(', '),
      dashboard_url: project.dashboard_url || '',
      github_url: project.github_url || '',
      display_order: project.display_order,
      is_visible: project.is_visible,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: formData.title,
      description: formData.description,
      tools: formData.tools.split(',').map(t => t.trim()).filter(Boolean),
      dashboard_url: formData.dashboard_url || null,
      github_url: formData.github_url || null,
      display_order: formData.display_order,
      is_visible: formData.is_visible,
    };

    let error;
    
    if (editingProject) {
      const result = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('projects')
        .insert(projectData);
      error = result.error;
    }

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el proyecto',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Guardado',
        description: editingProject ? 'Proyecto actualizado' : 'Proyecto creado',
      });
      refetch();
      setIsDialogOpen(false);
      resetForm();
    }
    
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Eliminado',
        description: 'El proyecto fue eliminado',
      });
      refetch();
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Proyectos ({projects.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar proyecto' : 'Nuevo proyecto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tools">Herramientas (separadas por coma)</Label>
                <Input
                  id="tools"
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  placeholder="SQL, Google Sheets, Looker Studio"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard_url">Dashboard URL</Label>
                  <Input
                    id="dashboard_url"
                    value={formData.dashboard_url}
                    onChange={(e) => setFormData({ ...formData, dashboard_url: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Orden</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    id="is_visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                  />
                  <Label htmlFor="is_visible">Visible en el portfolio</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{project.title}</h3>
                {!project.is_visible && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Oculto</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex gap-1 mt-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No hay proyectos. Crea tu primer proyecto.
          </p>
        )}
      </div>
    </div>
  );
};
