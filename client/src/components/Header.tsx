import { ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';

interface HeaderProps {
  onCartOpen: () => void;
  onCustomProjectOpen: () => void;
}

export function Header({ onCartOpen, onCustomProjectOpen }: HeaderProps) {
  const { totalItems } = useCart();
  const [location] = useLocation();
  const isHome = location === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={onCustomProjectOpen}
          data-testid="button-custom-projects"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Projetos Personalizados</span>
          <span className="sm:hidden">Personalizar</span>
        </Button>

        <div className="flex items-center gap-2">
          {!isHome && (
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              data-testid="button-home"
            >
              Início
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartOpen}
            data-testid="button-cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                data-testid="badge-cart-count"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
