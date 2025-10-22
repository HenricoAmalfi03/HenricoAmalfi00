import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Plus, Edit, Trash2, LogOut, Settings, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Publication } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [publicationDialog, setPublicationDialog] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    monthlyPrice: '',
  });

  const [siteSettings, setSiteSettings] = useState({
    title: '',
    heroImage: '',
    whatsappNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/admin/login');
    }
  }, [user, authLoading, setLocation]);

  const { data: publications, isLoading: publicationsLoading } = useQuery<Publication[]>({
    queryKey: ['/api/publications'],
    enabled: !!user,
  });

  const { data: settingsData } = useQuery<any>({
    queryKey: ['/api/settings/all'],
    enabled: !!user,
  });

  useEffect(() => {
    if (settingsData) {
      setSiteSettings({
        title: settingsData.siteTitle || '',
        heroImage: settingsData.heroImage || '',
        whatsappNumber: settingsData.whatsappNumber || '',
      });
    }
  }, [settingsData]);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/publications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/publications'] });
      setPublicationDialog(false);
      resetForm();
      toast({ title: 'Publicação criada com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar publicação', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest('PATCH', `/api/publications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/publications'] });
      setPublicationDialog(false);
      setEditingPublication(null);
      resetForm();
      toast({ title: 'Publicação atualizada com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar publicação', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/publications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/publications'] });
      toast({ title: 'Publicação excluída com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir publicação', variant: 'destructive' });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/all'] });
      toast({ title: 'Configurações salvas com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar configurações', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      monthlyPrice: '',
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setEditingPublication(null);
    setPublicationDialog(true);
  };

  const handleOpenEdit = (publication: Publication) => {
    setFormData({
      title: publication.title,
      description: publication.description,
      imageUrl: publication.imageUrl,
      monthlyPrice: publication.monthlyPrice,
    });
    setEditingPublication(publication);
    setPublicationDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      monthlyPrice: parseFloat(formData.monthlyPrice).toFixed(2),
    };

    if (editingPublication) {
      updateMutation.mutate({ id: editingPublication.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      siteTitle: siteSettings.title,
      heroImage: siteSettings.heroImage,
      whatsappNumber: siteSettings.whatsappNumber,
    });
  };

  const handleLogout = async () => {
    await signOut();
    setLocation('/');
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="publications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="publications" data-testid="tab-publications">Publicações</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="publications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Publicações</h2>
              <Button onClick={handleOpenCreate} data-testid="button-create-publication">
                <Plus className="w-4 h-4 mr-2" />
                Nova Publicação
              </Button>
            </div>

            {publicationsLoading ? (
              <p>Carregando...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publications?.map((pub) => (
                  <Card key={pub.id} data-testid={`admin-card-${pub.id}`}>
                    <img src={pub.imageUrl} alt={pub.title} className="w-full h-48 object-cover rounded-t-lg" />
                    <CardHeader>
                      <CardTitle className="text-lg">{pub.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{pub.description}</p>
                      <p className="font-semibold">R$ {parseFloat(pub.monthlyPrice).toFixed(2)}/mês</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(pub)}
                          data-testid={`button-edit-${pub.id}`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(pub.id)}
                          data-testid={`button-delete-${pub.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Título do Site</Label>
                  <Input
                    id="site-title"
                    value={siteSettings.title}
                    onChange={(e) => setSiteSettings({ ...siteSettings, title: e.target.value })}
                    placeholder="Meu Portfólio"
                    data-testid="input-site-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-image">URL da Imagem Hero</Label>
                  <Input
                    id="hero-image"
                    value={siteSettings.heroImage}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroImage: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    data-testid="input-hero-image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                    placeholder="5511999999999"
                    data-testid="input-whatsapp"
                  />
                  <p className="text-xs text-muted-foreground">
                    Formato: código do país + DDD + número (ex: 5511999999999)
                  </p>
                </div>
                <Button onClick={handleSaveSettings} data-testid="button-save-settings">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={publicationDialog} onOpenChange={setPublicationDialog}>
        <DialogContent className="sm:max-w-[600px]" data-testid="dialog-publication">
          <DialogHeader>
            <DialogTitle>
              {editingPublication ? 'Editar Publicação' : 'Nova Publicação'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da publicação
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pub-title">Título</Label>
              <Input
                id="pub-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                data-testid="input-pub-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-description">Descrição</Label>
              <Textarea
                id="pub-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                data-testid="textarea-pub-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-image">URL da Imagem</Label>
              <Input
                id="pub-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                required
                data-testid="input-pub-image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-price">Valor Mensal (R$)</Label>
              <Input
                id="pub-price"
                type="number"
                step="0.01"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                required
                data-testid="input-pub-price"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPublicationDialog(false)}
                data-testid="button-cancel-pub"
              >
                Cancelar
              </Button>
              <Button type="submit" data-testid="button-submit-pub">
                {editingPublication ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
