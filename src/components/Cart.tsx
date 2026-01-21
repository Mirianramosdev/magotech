import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Minus, Plus, Trash2, MapPin, CreditCard, Banknote, Smartphone, Truck, Store } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';
import { Customer } from './CustomerAuth';

export interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  [key: string]: any;
}

interface CartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  currentCustomer: Customer | null;
  onCreateOrder: (customerInfo: any) => void;
  orders: Order[];
  onRequestLogin: () => void;
}

export function Cart({ 
  isOpen, 
  onOpenChange, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  currentCustomer, 
  onCreateOrder,
  orders,
  onRequestLogin
}: CartProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: '',
    needsChange: false,
    changeAmount: '',
    deliveryType: '', // 'delivery' ou 'pickup'
    deliveryAddress: ''
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Populate delivery address with customer data if logged in
  useEffect(() => {
    if (currentCustomer) {
      setPaymentForm(prev => ({
        ...prev,
        deliveryAddress: currentCustomer.address
      }));
    }
  }, [currentCustomer]);

  const handleCheckout = () => {
    // Verificar se o cliente está logado antes de continuar
    if (!currentCustomer) {
      // Fechar o carrinho e abrir o dialog de login
      onOpenChange(false);
      onRequestLogin();
      return;
    }
    
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentForm.paymentMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }

    if (!paymentForm.deliveryType) {
      alert('Selecione o tipo de entrega');
      return;
    }

    if (paymentForm.deliveryType === 'delivery' && !paymentForm.deliveryAddress.trim()) {
      alert('Informe o endereço de entrega');
      return;
    }

    handleWhatsAppCheckout();
  };

  const handleWhatsAppCheckout = () => {
    // Gerar código do pedido - número crescente + letra aleatória
    const lastOrderNumber = orders.length > 0 
      ? Math.max(...orders.map(o => o.id))
      : 1000;
    const nextOrderNumber = lastOrderNumber + 1;
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const orderCode = `${nextOrderNumber}${randomLetter}`;
    
    // Data e hora atual
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const needsChange = paymentForm.needsChange ? `SIM - Troco para R$ ${paymentForm.changeAmount}` : 'NAO';
    const deliveryInfo = paymentForm.deliveryType === 'delivery' 
      ? `ENTREGA\nENDERECO: ${paymentForm.deliveryAddress}`
      : 'RETIRADA NA LOJA\nENDERECO: Av. Josias de Carvalho, Salgado, 49390-000, SE, BR';
    
    const message = `PEDIDO MAGOTECH
----------------------------------
NUMERO DO PEDIDO: ${orderCode}
DATA: ${date} - ${time}

ITENS:
${items.map(item => `- ${item.name} - ${item.quantity} un. - R$ ${item.price.toLocaleString('pt-BR')}`).join('\n')}

FORMA DE PAGAMENTO: ${paymentForm.paymentMethod.toUpperCase()}
TOTAL: R$ ${total.toLocaleString('pt-BR')}

PRECISA DE TROCO? ${needsChange}

TIPO DE ENTREGA: ${deliveryInfo}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5579999143853?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Fechar dialogs e limpar carrinho
    setIsPaymentDialogOpen(false);
    setPaymentForm({ paymentMethod: '', needsChange: false, changeAmount: '', deliveryType: '', deliveryAddress: '' });
    onOpenChange(false);
  };



  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-96 bg-white text-gray-900 border-gray-200" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Carrinho de Compras
            {itemCount > 0 && (
              <Badge className="bg-green-500 text-black">{itemCount}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="line-clamp-2 text-sm">{item.name}</h4>
                        <p className="text-green-600 mt-1">
                          R$ {item.price.toLocaleString('pt-BR')}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700 ml-auto"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total:</span>
                  <span className="text-xl text-green-600">
                    R$ {total.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <Separator />
                
                {!currentCustomer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    <p className="font-medium mb-1">👤 Login necessário</p>
                    <p className="text-xs">Faça login ou cadastre-se para finalizar seu pedido</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={() => handleCheckout()}
                  >
                    {currentCustomer ? 'Finalizar Pedido' : 'Login para Finalizar'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => onOpenChange(false)}
                  >
                    Continue Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informações de Pagamento</DialogTitle>
            <DialogDescription>
              Escolha a forma de pagamento e informe se precisa de troco
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Forma de Pagamento *</Label>
              <div className="grid grid-cols-1 gap-2">
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentForm.paymentMethod === 'PIX' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: 'PIX' })}
                >
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <span>PIX</span>
                </div>
                
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentForm.paymentMethod === 'Cartão' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: 'Cartão' })}
                >
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Cartão</span>
                </div>
                
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentForm.paymentMethod === 'Dinheiro' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: 'Dinheiro' })}
                >
                  <Banknote className="h-5 w-5 text-green-600" />
                  <span>Dinheiro</span>
                </div>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="space-y-3">
              <Label>Tipo de Entrega *</Label>
              <div className="grid grid-cols-1 gap-2">
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentForm.deliveryType === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentForm({ ...paymentForm, deliveryType: 'delivery' })}
                >
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Entrega no endereço</span>
                </div>
                
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentForm.deliveryType === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentForm({ ...paymentForm, deliveryType: 'pickup' })}
                >
                  <Store className="h-5 w-5 text-green-600" />
                  <span>Retirar na loja</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {paymentForm.deliveryType === 'delivery' && (
              <div className="space-y-3">
                <Label htmlFor="deliveryAddress">Endereço de Entrega *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="deliveryAddress"
                    value={paymentForm.deliveryAddress}
                    onChange={(e) => setPaymentForm({ ...paymentForm, deliveryAddress: e.target.value })}
                    className="pl-10 min-h-[60px]"
                    placeholder="Rua, número, bairro, cidade, CEP"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Informe o endereço completo para entrega
                </p>
              </div>
            )}

            {/* Store Address Info */}
            {paymentForm.deliveryType === 'pickup' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Retirada na loja:</strong><br />
                  Av. Josias de Carvalho<br />
                  Salgado, 49390-000, SE, BR<br />
                  Horário: Segunda a Sábado, 9h às 18h
                </p>
              </div>
            )}

            {/* Change Information */}
            {paymentForm.paymentMethod === 'Dinheiro' && (
              <div className="space-y-3">
                <Label>Troco</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="needsChange"
                      checked={paymentForm.needsChange}
                      onChange={(e) => setPaymentForm({ ...paymentForm, needsChange: e.target.checked, changeAmount: '' })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="needsChange">Preciso de troco</Label>
                  </div>
                  
                  {paymentForm.needsChange && (
                    <div className="space-y-2">
                      <Label htmlFor="changeAmount">Troco para quanto?</Label>
                      <Input
                        id="changeAmount"
                        type="number"
                        step="0.01"
                        min={total + 0.01}
                        value={paymentForm.changeAmount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, changeAmount: e.target.value })}
                        placeholder="Ex: 100.00"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Total do pedido: R$ {total.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total do Pedido:</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {total.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handlePaymentSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!paymentForm.paymentMethod}
                >
                  Enviar Pedido via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}