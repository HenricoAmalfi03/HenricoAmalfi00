import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Publication } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      publicationId: publication.id,
      title: publication.title,
      imageUrl: publication.imageUrl,
      monthlyPrice: publication.monthlyPrice,
    });
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${publication.title} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-publication-${publication.id}`}>
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={publication.imageUrl}
          alt={publication.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          data-testid={`img-publication-${publication.id}`}
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight" data-testid={`text-title-${publication.id}`}>
            {publication.title}
          </h3>
          <Badge variant="secondary" className="shrink-0" data-testid={`badge-price-${publication.id}`}>
            R$ {parseFloat(publication.monthlyPrice).toFixed(2)}/mês
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${publication.id}`}>
          {publication.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2"
          onClick={handleAddToCart}
          data-testid={`button-add-cart-${publication.id}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
