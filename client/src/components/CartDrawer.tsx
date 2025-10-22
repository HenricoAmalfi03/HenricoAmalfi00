import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    onOpenChange(false);
    setLocation('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col" data-testid="drawer-cart">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.publicationId}
                className="flex gap-4 p-3 rounded-lg bg-card border border-card-border"
                data-testid={`cart-item-${item.publicationId}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md"
                  data-testid={`img-cart-${item.publicationId}`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate" data-testid={`text-cart-title-${item.publicationId}`}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1" data-testid={`text-cart-price-${item.publicationId}`}>
                    R$ {parseFloat(item.monthlyPrice).toFixed(2)}/mês
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.publicationId, item.quantity - 1)}
                      data-testid={`button-decrease-${item.publicationId}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center" data-testid={`text-quantity-${item.publicationId}`}>
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.publicationId, item.quantity + 1)}
                      data-testid={`button-increase-${item.publicationId}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 ml-auto"
                      onClick={() => removeItem(item.publicationId)}
                      data-testid={`button-remove-${item.publicationId}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t pt-4">
            <div className="flex justify-between items-center w-full">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-total-price">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
              size="lg"
              onClick={handleCheckout}
              data-testid="button-checkout"
            >
              <SiWhatsapp className="w-5 h-5" />
              Finalizar Pedido
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
