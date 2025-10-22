import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { SiWhatsapp } from 'react-icons/si';
import { CreditCard, Banknote, Smartphone, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { checkoutSchema, type CheckoutData } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: whatsappNumber } = useQuery<string>({
    queryKey: ['/api/settings/whatsapp'],
  });

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      city: '',
      observation: '',
      paymentMethod: undefined,
    },
  });

  const onSubmit = (data: CheckoutData) => {
    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione itens ao carrinho antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }

    const paymentLabels = {
      debit: 'Débito',
      credit: 'Crédito',
      cash: 'Dinheiro',
      pix: 'PIX',
    };

    let message = `*Nova Comanda - Pedido*\n\n`;
    message += `*Cliente:* ${data.name}\n`;
    message += `*Cidade:* ${data.city}\n`;
    message += `*Pagamento:* ${paymentLabels[data.paymentMethod]}\n\n`;
    message += `*Itens do Pedido:*\n`;
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. ${item.title}\n`;
      message += `   Quantidade: ${item.quantity}x\n`;
      message += `   Valor: R$ ${parseFloat(item.monthlyPrice).toFixed(2)}/mês\n`;
    });

    message += `\n*Total: R$ ${totalPrice.toFixed(2)}*`;

    if (data.observation) {
      message += `\n\n*Observações:*\n${data.observation}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = whatsappNumber || '5511999999999';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    clearCart();
    setLocation('/');
    
    toast({
      title: 'Pedido enviado!',
      description: 'Seu pedido foi enviado pelo WhatsApp.',
    });
  };

  const paymentMethods = [
    { value: 'debit', label: 'Débito', icon: CreditCard },
    { value: 'credit', label: 'Crédito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'cash', label: 'Dinheiro', icon: DollarSign },
  ] as const;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
          <Button onClick={() => setLocation('/')} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.publicationId} className="flex gap-3" data-testid={`checkout-item-${item.publicationId}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x R$ {parseFloat(item.monthlyPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-checkout-total">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Digite seu nome"
                    data-testid="input-checkout-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="Digite sua cidade"
                    data-testid="input-checkout-city"
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observation">Observações (opcional)</Label>
                  <Textarea
                    id="observation"
                    {...form.register('observation')}
                    placeholder="Alguma alteração ou observação sobre o projeto?"
                    rows={3}
                    data-testid="textarea-checkout-observation"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Forma de Pagamento</Label>
                  <RadioGroup
                    onValueChange={(value) => form.setValue('paymentMethod', value as any)}
                    data-testid="radio-payment-method"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map(({ value, label, icon: Icon }) => (
                        <Label
                          key={value}
                          htmlFor={value}
                          className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover-elevate transition-colors"
                          data-testid={`label-payment-${value}`}
                        >
                          <RadioGroupItem value={value} id={value} />
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                  {form.formState.errors.paymentMethod && (
                    <p className="text-sm text-destructive">{form.formState.errors.paymentMethod.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  size="lg"
                  data-testid="button-submit-checkout"
                >
                  <SiWhatsapp className="w-5 h-5" />
                  Enviar Pedido pelo WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
