import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { PublicationCard } from '@/components/PublicationCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CustomProjectDialog } from '@/components/CustomProjectDialog';
import type { Publication } from '@shared/schema';

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [customProjectOpen, setCustomProjectOpen] = useState(false);

  const { data: publications, isLoading } = useQuery<Publication[]>({
    queryKey: ['/api/publications'],
  });

  const { data: siteSettings } = useQuery<{ title?: string; heroImage?: string }>({
    queryKey: ['/api/settings/site'],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onCustomProjectOpen={() => setCustomProjectOpen(true)}
      />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {siteSettings?.heroImage && (
          <div className="relative overflow-hidden rounded-lg mb-8 h-64 md:h-80">
            <img
              src={siteSettings.heroImage}
              alt="Portfolio Hero"
              className="w-full h-full object-cover"
              data-testid="img-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-hero-title">
                  {siteSettings.title || 'Meu Portfólio'}
                </h1>
                <p className="text-lg text-white/90">
                  Projetos e sistemas desenvolvidos com qualidade
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Publications Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : publications && publications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhum projeto disponível no momento
            </p>
          </div>
        )}
      </main>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <CustomProjectDialog open={customProjectOpen} onOpenChange={setCustomProjectOpen} />
    </div>
  );
}
