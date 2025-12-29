import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useContactMessages } from '@/hooks/useContactMessages';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AdminMessages = () => {
  const { messages, loading, refetch } = useContactMessages();
  const { toast } = useToast();

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);

    if (!error) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el mensaje',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Eliminado',
        description: 'El mensaje fue eliminado',
      });
      refetch();
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Mensajes ({messages.length})
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {unreadCount} sin leer
            </span>
          )}
        </h2>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-card border rounded-lg p-4 ${
              message.is_read ? 'border-border' : 'border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{message.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({message.email})
                  </span>
                  {!message.is_read && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Nuevo
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(message.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRead(message.id, message.is_read)}
                  title={message.is_read ? 'Marcar como no leído' : 'Marcar como leído'}
                >
                  {message.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(message.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No hay mensajes de contacto.
          </p>
        )}
      </div>
    </div>
  );
};
