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
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Información Personal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título profesional</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_image">Foto de perfil</Label>
          <div className="flex items-center gap-4">
            {formData.profile_image_url && (
              <div className="relative">
                <img 
                  src={formData.profile_image_url} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover border border-border"
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
            <div className="flex-1 flex gap-2">
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
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
              </Button>
            </div>
          </div>
          <Input
            id="profile_image_url"
            value={formData.profile_image_url}
            onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
            placeholder="O pega una URL directamente..."
            className="mt-2"
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_text">Texto de About</Label>
          <Textarea
            id="about_text"
            value={formData.about_text}
            onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
            placeholder="Describe tu experiencia y especialidades..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_text">Texto de Contacto</Label>
          <Textarea
            id="contact_text"
            value={formData.contact_text}
            onChange={(e) => setFormData({ ...formData, contact_text: e.target.value })}
            placeholder="Mensaje para la sección de contacto..."
            rows={2}
          />
        </div>
        
        <Button type="submit" disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  );
};
