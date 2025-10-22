import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { PublicationCard } from "@/components/PublicationCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CustomProjectDialog } from "@/components/CustomProjectDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Publication } from "@shared/schema";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [customProjectOpen, setCustomProjectOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);

  const { data: publicationsRaw, isLoading } = useQuery<Publication[]>({
    queryKey: ["/api/publications"],
  });

  const publications =
    publicationsRaw?.map((p) => ({
      ...p,
      imageUrl: p.image_url,
      monthlyPrice: p.monthly_price,
    })) || [];

  const { data: siteSettingsRaw } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings/site"],
  });

  const siteSettings = siteSettingsRaw
    ? {
        title: siteSettingsRaw.title || siteSettingsRaw.site_title,
        heroImage: siteSettingsRaw.heroImage || siteSettingsRaw.hero_image,
      }
    : {};

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
                <h1
                  className="text-3xl md:text-4xl font-bold mb-2"
                  data-testid="text-hero-title"
                >
                  {siteSettings.title || "Meu Portfólio"}
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
        ) : publications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication) => (
              <div
                key={publication.id}
                onClick={() => setSelectedPublication(publication)}
                className="cursor-pointer"
              >
                <PublicationCard publication={publication} />
              </div>
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
      <CustomProjectDialog
        open={customProjectOpen}
        onOpenChange={setCustomProjectOpen}
      />

      {/* Dialog para detalhes da publicação */}
      <Dialog
        open={!!selectedPublication}
        onOpenChange={() => setSelectedPublication(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedPublication && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPublication.title}</DialogTitle>
                <DialogDescription>Detalhes do projeto</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedPublication.imageUrl}
                  alt={selectedPublication.title}
                  className="w-full h-64 object-cover rounded-md"
                />
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedPublication.description}
                </p>
                <p className="text-lg font-semibold">
                  R$ {parseFloat(selectedPublication.monthlyPrice).toFixed(2)}
                  /mês
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setCartOpen(true)}>
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
