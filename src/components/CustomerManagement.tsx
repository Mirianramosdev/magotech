import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { Customer } from './CustomerAuth';
import { Order } from './OrderManagement';

interface CustomerManagementProps {
  customers: Customer[];
  orders: Order[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (id: number, customer: Partial<Customer>) => void;
  onDeleteCustomer: (id: number) => void;
}

export function CustomerManagement({ 
  customers, 
  orders,
  onAddCustomer, 
  onUpdateCustomer, 
  onDeleteCustomer 
}: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (customerId: number) => {
    return orders.filter(order => order.customerEmail === customers.find(c => c.id === customerId)?.email);
  };

  const CustomerForm = ({ 
    customer, 
    onSubmit, 
    onCancel 
  }: { 
    customer?: Customer; 
    onSubmit: (data: any) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      birthDate: customer?.birthDate || '',
      status: customer?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {customer ? 'Atualizar' : 'Adicionar'} Cliente
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    );
  };

  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgOrderValue = totalRevenue / Math.max(customers.reduce((sum, c) => sum + c.totalOrders, 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gerenciar Clientes</h1>
          <p className="text-gray-600">Gerencie cadastros e informações dos clientes</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para cadastrar um novo cliente no sistema
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              onSubmit={(data) => {
                onAddCustomer({
                  ...data,
                  registrationDate: new Date().toISOString(),
                  totalOrders: 0,
                  totalSpent: 0
                });
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold">R$ {avgOrderValue.toLocaleString('pt-BR')}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const customerOrders = getCustomerOrders(customer.id);
              
              return (
                <Card key={customer.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          <Badge 
                            className={customer.status === 'active' ? 'bg-green-500 text-black' : 'bg-gray-500 text-white'}
                          >
                            {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Desde {new Date(customer.registrationDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span><strong>Pedidos:</strong> {customer.totalOrders}</span>
                          <span><strong>Total Gasto:</strong> R$ {customer.totalSpent.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Cliente</DialogTitle>
                              <DialogDescription>
                                Visualize informações detalhadas do cliente e histórico de pedidos
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedCustomer && (
                              <Tabs defaultValue="info">
                                <TabsList>
                                  <TabsTrigger value="info">Informações</TabsTrigger>
                                  <TabsTrigger value="orders">Pedidos ({customerOrders.length})</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="info" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <Label>Nome:</Label>
                                      <p>{selectedCustomer.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email:</Label>
                                      <p>{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                      <Label>Telefone:</Label>
                                      <p>{selectedCustomer.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Status:</Label>
                                      <Badge className={selectedCustomer.status === 'active' ? 'bg-green-500 text-black' : 'bg-gray-500 text-white'}>
                                        {selectedCustomer.status === 'active' ? 'Ativo' : 'Inativo'}
                                      </Badge>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Endereço:</Label>
                                      <p>{selectedCustomer.address}</p>
                                    </div>
                                    {selectedCustomer.birthDate && (
                                      <div>
                                        <Label>Data de Nascimento:</Label>
                                        <p>{new Date(selectedCustomer.birthDate).toLocaleDateString('pt-BR')}</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label>Cliente desde:</Label>
                                      <p>{new Date(selectedCustomer.registrationDate).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="orders">
                                  <div className="space-y-4">
                                    {customerOrders.length > 0 ? (
                                      customerOrders.map((order) => (
                                        <Card key={order.id}>
                                          <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <p className="font-medium">Pedido #{order.id}</p>
                                                <p className="text-sm text-gray-600">{order.date}</p>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-semibold">R$ {order.total.toLocaleString('pt-BR')}</p>
                                                <Badge>{order.status}</Badge>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))
                                    ) : (
                                      <p className="text-center text-gray-500 py-4">
                                        Nenhum pedido encontrado
                                      </p>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog 
                          open={editingCustomer?.id === customer.id} 
                          onOpenChange={(open) => !open && setEditingCustomer(null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCustomer(customer)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar Cliente</DialogTitle>
                              <DialogDescription>
                                Modifique as informações do cliente e clique em atualizar para salvar
                              </DialogDescription>
                            </DialogHeader>
                            <CustomerForm
                              customer={editingCustomer || undefined}
                              onSubmit={(data) => {
                                if (editingCustomer) {
                                  onUpdateCustomer(editingCustomer.id, data);
                                  setEditingCustomer(null);
                                }
                              }}
                              onCancel={() => setEditingCustomer(null)}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente "{customer.name}"? 
                                Esta ação não pode ser desfeita e removerá todos os dados associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteCustomer(customer.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}