import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCaseStudies, CaseStudy } from '@/hooks/useCaseStudies';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Pencil, Trash2, Save, X, FileText, Upload, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AdminCaseStudies = () => {
  const { caseStudies, loading, refetch } = useCaseStudies();
  const { projects } = useProjects();
  const { toast } = useToast();
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    project_id: '',
    overview: '',
    data_sources: '',
    tools_used: '',
    analytical_approach: '',
    key_insights: '',
    recommendations: '',
    images: '',
  });

  const resetForm = () => {
    setFormData({
      project_id: '',
      overview: '',
      data_sources: '',
      tools_used: '',
      analytical_approach: '',
      key_insights: '',
      recommendations: '',
      images: '',
    });
    setEditingCaseStudy(null);
    setUploadedImages([]);
  };

  const openEditDialog = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setFormData({
      project_id: caseStudy.project_id,
      overview: caseStudy.overview,
      data_sources: caseStudy.data_sources,
      tools_used: caseStudy.tools_used.join('\n'),
      analytical_approach: caseStudy.analytical_approach,
      key_insights: caseStudy.key_insights.join('\n'),
      recommendations: caseStudy.recommendations.join('\n'),
      images: caseStudy.images.join('\n'),
    });
    setUploadedImages(caseStudy.images);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `case-study-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('case-study-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast({
          title: 'Error',
          description: `No se pudo subir ${file.name}`,
          variant: 'destructive',
        });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('case-study-images')
          .getPublicUrl(fileName);
        newImages.push(publicUrl);
      }
    }

    if (newImages.length > 0) {
      const allImages = [...uploadedImages, ...newImages];
      setUploadedImages(allImages);
      setFormData(prev => ({ ...prev, images: allImages.join('\n') }));
      toast({
        title: 'Imágenes subidas',
        description: `${newImages.length} imagen(es) subida(s) correctamente`,
      });
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages.join('\n') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const caseStudyData = {
      project_id: formData.project_id,
      overview: formData.overview,
      data_sources: formData.data_sources,
      tools_used: formData.tools_used.split('\n').map(t => t.trim()).filter(Boolean),
      analytical_approach: formData.analytical_approach,
      key_insights: formData.key_insights.split('\n').map(t => t.trim()).filter(Boolean),
      recommendations: formData.recommendations.split('\n').map(t => t.trim()).filter(Boolean),
      images: uploadedImages,
    };

    let error;
    
    if (editingCaseStudy) {
      const result = await supabase
        .from('case_studies')
        .update(caseStudyData)
        .eq('id', editingCaseStudy.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('case_studies')
        .insert(caseStudyData);
      error = result.error;
    }

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el caso de estudio',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Guardado',
        description: editingCaseStudy ? 'Caso de estudio actualizado' : 'Caso de estudio creado',
      });
      refetch();
      setIsDialogOpen(false);
      resetForm();
    }
    
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este caso de estudio?')) return;

    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el caso de estudio',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Eliminado',
        description: 'El caso de estudio fue eliminado',
      });
      refetch();
    }
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Proyecto no encontrado';
  };

  // Filter projects that don't have a case study yet (except the one being edited)
  const availableProjects = projects.filter(project => {
    if (editingCaseStudy && editingCaseStudy.project_id === project.id) return true;
    return !caseStudies.some(cs => cs.project_id === project.id);
  });

  if (loading) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Casos de Estudio ({caseStudies.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="gap-2" disabled={availableProjects.length === 0}>
              <Plus className="h-4 w-4" />
              Nuevo caso de estudio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCaseStudy ? 'Editar caso de estudio' : 'Nuevo caso de estudio'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project_id">Proyecto</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overview">Resumen del Proyecto</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Descripción del problema de negocio y contexto..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data_sources">Fuentes de Datos</Label>
                <Textarea
                  id="data_sources"
                  value={formData.data_sources}
                  onChange={(e) => setFormData({ ...formData, data_sources: e.target.value })}
                  placeholder="Descripción de las fuentes de datos utilizadas..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tools_used">Herramientas Utilizadas (una por línea)</Label>
                <Textarea
                  id="tools_used"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                  placeholder="SQL&#10;Google Sheets&#10;Looker Studio"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="analytical_approach">Enfoque Analítico</Label>
                <Textarea
                  id="analytical_approach"
                  value={formData.analytical_approach}
                  onChange={(e) => setFormData({ ...formData, analytical_approach: e.target.value })}
                  placeholder="Descripción del enfoque y metodología utilizada..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key_insights">Hallazgos Clave (uno por línea)</Label>
                <Textarea
                  id="key_insights"
                  value={formData.key_insights}
                  onChange={(e) => setFormData({ ...formData, key_insights: e.target.value })}
                  placeholder="El 20% de los clientes genera el 80% de los ingresos&#10;Los picos de actividad se concentran en días específicos"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recomendaciones (una por línea)</Label>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Implementar programa de fidelización&#10;Optimizar recursos según demanda"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imágenes del Caso de Estudio</Label>
                
                {/* Image previews */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Imagen ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-md border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload button */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Subir imágenes'}
                  </Button>
                  {uploadedImages.length > 0 && (
                    <span className="text-sm text-muted-foreground self-center">
                      <Image className="h-4 w-4 inline mr-1" />
                      {uploadedImages.length} imagen(es)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving || !formData.project_id}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {caseStudies.map((caseStudy) => (
          <div
            key={caseStudy.id}
            className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-medium">{getProjectTitle(caseStudy.project_id)}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {caseStudy.overview || 'Sin resumen'}
              </p>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span>{caseStudy.key_insights.length} hallazgos</span>
                <span>•</span>
                <span>{caseStudy.recommendations.length} recomendaciones</span>
                <span>•</span>
                <span>{caseStudy.images.length} imágenes</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(caseStudy)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(caseStudy.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {caseStudies.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No hay casos de estudio. Crea el primero para un proyecto existente.
          </p>
        )}
      </div>
    </div>
  );
};
