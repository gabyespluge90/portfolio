import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Save, Upload, X } from 'lucide-react';

export const AdminSettings = () => {
  const { settings, loading, refetch } = useSiteSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    profile_image_url: '',
    linkedin_url: '',
    github_url: '',
    email: '',
    about_text: '',
    contact_text: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        title: settings.title || '',
        tagline: settings.tagline || '',
        profile_image_url: settings.profile_image_url || '',
        linkedin_url: settings.linkedin_url || '',
        github_url: settings.github_url || '',
        email: settings.email || '',
        about_text: settings.about_text || '',
        contact_text: settings.contact_text || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .update(formData)
      .eq('id', settings?.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Guardado',
        description: 'La configuración se guardó correctamente',
      });
      refetch();
    }
    
    setSaving(false);
  };

  if (loading) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Información Personal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">Título profesional</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tagline" className="text-sm">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_image" className="text-sm">Foto de perfil</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {formData.profile_image_url && (
              <div className="relative shrink-0">
                <img 
                  src={formData.profile_image_url} 
                  alt="Preview" 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, profile_image_url: '' })}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="w-full flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  setUploading(true);
                  const fileExt = file.name.split('.').pop();
                  const fileName = `profile-${Date.now()}.${fileExt}`;
                  
                  const { error: uploadError } = await supabase.storage
                    .from('profile-images')
                    .upload(fileName, file, { upsert: true });
                  
                  if (uploadError) {
                    toast({
                      title: 'Error',
                      description: 'No se pudo subir la imagen',
                      variant: 'destructive',
                    });
                  } else {
                    const { data: { publicUrl } } = supabase.storage
                      .from('profile-images')
                      .getPublicUrl(fileName);
                    
                    setFormData({ ...formData, profile_image_url: publicUrl });
                    toast({
                      title: 'Imagen subida',
                      description: 'Recuerda guardar los cambios',
                    });
                  }
                  setUploading(false);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2 text-xs sm:text-sm"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Subiendo...' : 'Seleccionar'}
              </Button>
            </div>
          </div>
          <Input
            id="profile_image_url"
            value={formData.profile_image_url}
            onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
            placeholder="O pega una URL directamente..."
            className="mt-2 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="text-sm">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github_url" className="text-sm">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_text" className="text-sm">Texto de About</Label>
          <Textarea
            id="about_text"
            value={formData.about_text}
            onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
            placeholder="Describe tu experiencia y especialidades..."
            rows={4}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_text" className="text-sm">Texto de Contacto</Label>
          <Textarea
            id="contact_text"
            value={formData.contact_text}
            onChange={(e) => setFormData({ ...formData, contact_text: e.target.value })}
            placeholder="Mensaje para la sección de contacto..."
            rows={2}
            className="text-sm"
          />
        </div>
        
        <Button type="submit" disabled={saving} className="gap-2 w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  );
};
