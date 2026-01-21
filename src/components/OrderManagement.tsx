import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Eye, 
  Search, 
  Filter, 
  MessageCircle, 
  CheckCircle, 
  Truck, 
  Package,
  Clock
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  shippingAddress: string;
  paymentMethod: 'whatsapp' | 'store';
  notes?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: number, status: Order['status']) => void;
}

export function OrderManagement({ orders, onUpdateOrderStatus }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pendente', 
          color: 'bg-yellow-500', 
          icon: Clock,
          description: 'Aguardando confirmação'
        };
      case 'confirmed':
        return { 
          label: 'Confirmado', 
          color: 'bg-blue-500', 
          icon: CheckCircle,
          description: 'Pedido confirmado'
        };
      case 'shipped':
        return { 
          label: 'Enviado', 
          color: 'bg-orange-500', 
          icon: Truck,
          description: 'Em transporte'
        };
      case 'delivered':
        return { 
          label: 'Entregue', 
          color: 'bg-green-500', 
          icon: Package,
          description: 'Pedido entregue'
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-500', 
          icon: Clock,
          description: ''
        };
    }
  };

  const sendWhatsAppMessage = (order: Order) => {
    const message = `Olá ${order.customerName}! 

📦 *Atualização do seu pedido #${order.id}*

Status: ${getStatusConfig(order.status).label}
Total: R$ ${order.total.toLocaleString('pt-BR')}

Obrigado por escolher a MAGOTECH! 💚`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Gerenciar Pedidos</h1>
        <p className="text-gray-600">Acompanhe e gerencie todos os pedidos dos clientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter(o => o.status === status.value).length;
          const config = getStatusConfig(status.value as Order['status']);
          const Icon = config.icon;
          
          return (
            <Card key={status.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{status.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente, telefone ou ID do pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const config = getStatusConfig(order.status);
          const StatusIcon = config.icon;
          
          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                      <Badge className={`${config.color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <Badge variant="outline">
                        {order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Loja'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Cliente:</strong> {order.customerName}</p>
                        <p><strong>Telefone:</strong> {order.customerPhone}</p>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                      </div>
                      <div>
                        <p><strong>Data:</strong> {order.date}</p>
                        <p><strong>Itens:</strong> {order.items.length} produto(s)</p>
                        <p><strong>Total:</strong> R$ {order.total.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => onUpdateOrderStatus(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendWhatsAppMessage(order)}
                      className="whitespace-nowrap"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                          <DialogDescription>
                            Visualize informações completas do pedido, incluindo itens, cliente e status de entrega
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                              <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Nome:</strong> {selectedOrder.customerName}</p>
                                  <p><strong>Telefone:</strong> {selectedOrder.customerPhone}</p>
                                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                </div>
                                <div>
                                  <p><strong>Data do Pedido:</strong> {selectedOrder.date}</p>
                                  <p><strong>Método:</strong> {selectedOrder.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Loja'}</p>
                                  <p><strong>Status:</strong> <Badge className={`${config.color} text-white ml-2`}>{config.label}</Badge></p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div>
                              <h4 className="font-semibold mb-4">Itens do Pedido</h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <ImageWithFallback
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-gray-600">
                                        Quantidade: {item.quantity} • Preço: R$ {item.price.toLocaleString('pt-BR')}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      R$ {(item.price * item.quantity).toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                              <p className="text-sm">{selectedOrder.shippingAddress}</p>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-2">Observações</h4>
                                  <p className="text-sm">{selectedOrder.notes}</p>
                                </div>
                              </>
                            )}

                            <Separator />

                            {/* Total */}
                            <div className="flex justify-between items-center text-lg font-semibold">
                              <span>Total do Pedido:</span>
                              <span className="text-green-600">R$ {selectedOrder.total.toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
}