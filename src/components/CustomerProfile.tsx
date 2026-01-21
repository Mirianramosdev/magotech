import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Settings,
  LogOut,
  Edit,
  Package,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Customer } from './CustomerAuth';
import { Order } from './OrderManagement';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CustomerProfileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  onUpdateCustomer: (customerId: number, data: Partial<Customer>) => void;
  onLogout: () => void;
  customerOrders: Order[];
}

export function CustomerProfile({ 
  isOpen, 
  onOpenChange, 
  customer, 
  onUpdateCustomer,
  onLogout,
  customerOrders
}: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    birthDate: customer.birthDate || ''
  });

  const handleSaveProfile = () => {
    onUpdateCustomer(customer.id, editData);
    setIsEditing(false);
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-500', icon: Clock };
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle };
      case 'shipped':
        return { label: 'Enviado', color: 'bg-orange-500', icon: Truck };
      case 'delivered':
        return { label: 'Entregue', color: 'bg-green-500', icon: Package };
      default:
        return { label: status, color: 'bg-gray-500', icon: Clock };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Minha Conta</DialogTitle>
              <DialogDescription>
                Gerencie suas informações pessoais, acompanhe pedidos e configurações
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informações Pessoais</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded">{customer.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {customer.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {customer.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.birthDate}
                        onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Endereço</Label>
                  {isEditing ? (
                    <Input
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {customer.address}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{customer.totalOrders}</p>
                    <p className="text-sm text-gray-600">Pedidos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {customer.totalSpent.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">Total Gasto</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{customer.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                    <p className="text-sm text-gray-600">Status</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {new Date(customer.registrationDate).getFullYear()}
                    </p>
                    <p className="text-sm text-gray-600">Cliente desde</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Meus Pedidos</CardTitle>
                <p className="text-sm text-gray-600">
                  Acompanhe o status dos seus pedidos
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order) => {
                      const config = getStatusConfig(order.status);
                      const StatusIcon = config.icon;
                      
                      return (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold">Pedido #{order.id}</h4>
                                <p className="text-sm text-gray-600">{order.date}</p>
                              </div>
                              <Badge className={`${config.color} text-white`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {order.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-600">
                                      Qtd: {item.quantity} • R$ {item.price.toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{order.items.length - 2} outros itens
                                </p>
                              )}
                            </div>
                            
                            <Separator className="my-3" />
                            
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">
                                Total: R$ {order.total.toLocaleString('pt-BR')}
                              </span>
                              <Badge variant="outline">
                                {order.items.length} item(s)
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Você ainda não fez nenhum pedido</p>
                      <Button 
                        onClick={() => onOpenChange(false)}
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Começar a Comprar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notificações por Email</h4>
                      <p className="text-sm text-gray-600">
                        Receba atualizações sobre seus pedidos
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-black">Ativo</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">WhatsApp Notifications</h4>
                      <p className="text-sm text-gray-600">
                        Receba atualizações via WhatsApp
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-black">Ativo</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Newsletter</h4>
                      <p className="text-sm text-gray-600">
                        Ofertas especiais e novidades
                      </p>
                    </div>
                    <Badge variant="outline">Inativo</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Informações da Conta</Label>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Cliente desde:</p>
                        <p>{new Date(customer.registrationDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Último acesso:</p>
                        <p>{customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Precisa de ajuda? Entre em contato conosco
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://wa.me/5579998628286', '_blank')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp Suporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}