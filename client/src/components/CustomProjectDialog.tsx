import { useState } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface CustomProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomProjectDialog({ open, onOpenChange }: CustomProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const { data: whatsappNumber } = useQuery<string>({
    queryKey: ['/api/settings/whatsapp'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    const message = `*Novo Projeto Personalizado*\n\n*Nome:* ${name}\n\n*Descrição do Projeto:*\n${description}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = whatsappNumber || '5511999999999';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    setName('');
    setDescription('');
    onOpenChange(false);
    
    toast({
      title: 'Redirecionando...',
      description: 'Você será redirecionado para o WhatsApp.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-custom-project">
        <DialogHeader>
          <DialogTitle>Projeto Personalizado</DialogTitle>
          <DialogDescription>
            Descreva seu projeto e entraremos em contato pelo WhatsApp
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu Nome</Label>
            <Input
              id="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-custom-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Projeto</Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente o que você precisa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              data-testid="textarea-custom-description"
            />
          </div>
          <Button
            type="submit"
            className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
            size="lg"
            data-testid="button-custom-submit"
          >
            <SiWhatsapp className="w-5 h-5" />
            Enviar pelo WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
