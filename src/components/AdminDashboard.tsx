import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Product } from './ProductCard';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
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

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
}

export function AdminDashboard({ products, orders, customers }: AdminDashboardProps) {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p as any).stock < 5).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  
  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      icon: Package,
      description: `${lowStockProducts} com estoque baixo`,
      trend: null
    },
    {
      title: "Pedidos Totais",
      value: totalOrders,
      icon: ShoppingCart,
      description: `${pendingOrders} pendentes`,
      trend: null
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      description: "Total acumulado",
      trend: null
    },
    {
      title: "Clientes Cadastrados",
      value: customers.length,
      icon: Users,
      description: `${activeCustomers} ativos`,
      trend: null
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da MAGOTECH - Dados em tempo real</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.trend && (
                  <div className="flex items-center pt-1">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{stat.trend}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#{order.id} - {order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.items.length} itens • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {order.total.toLocaleString('pt-BR')}</p>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .filter(p => (p as any).stock < 5)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <Badge variant="destructive">
                      {(product as any).stock || 0} unidades
                    </Badge>
                  </div>
                ))}
              {products.filter(p => (p as any).stock < 5).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum produto com estoque baixo
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios e Análises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vendas por Categoria */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-600">Vendas por Categoria</h4>
              <div className="space-y-2">
                {(() => {
                  const categorySales: Record<string, number> = {};
                  orders.forEach(order => {
                    order.items.forEach(item => {
                      const product = products.find(p => p.id === item.id);
                      if (product) {
                        const category = product.category;
                        categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
                      }
                    });
                  });
                  
                  return Object.entries(categorySales)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, total]) => (
                      <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium text-green-600">
                          R$ {total.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ));
                })()}
                {orders.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">Nenhum pedido ainda</p>
                )}
              </div>
            </div>

            {/* Top Produtos */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-600">Produtos Mais Vendidos</h4>
              <div className="space-y-2">
                {(() => {
                  const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
                  orders.forEach(order => {
                    order.items.forEach(item => {
                      if (!productSales[item.id]) {
                        productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
                      }
                      productSales[item.id].quantity += item.quantity;
                      productSales[item.id].revenue += item.price * item.quantity;
                    });
                  });
                  
                  return Object.values(productSales)
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.quantity} vendidos</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          R$ {product.revenue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ));
                })()}
                {orders.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">Nenhum pedido ainda</p>
                )}
              </div>
            </div>

            {/* Status dos Pedidos */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-600">Status dos Pedidos</h4>
              <div className="space-y-2">
                {(() => {
                  const statusCount = {
                    pending: orders.filter(o => o.status === 'pending').length,
                    confirmed: orders.filter(o => o.status === 'confirmed').length,
                    shipped: orders.filter(o => o.status === 'shipped').length,
                    delivered: orders.filter(o => o.status === 'delivered').length
                  };
                  
                  return [
                    { status: 'pending', label: 'Pendente', count: statusCount.pending, color: 'bg-yellow-100 text-yellow-800' },
                    { status: 'confirmed', label: 'Confirmado', count: statusCount.confirmed, color: 'bg-blue-100 text-blue-800' },
                    { status: 'shipped', label: 'Enviado', count: statusCount.shipped, color: 'bg-orange-100 text-orange-800' },
                    { status: 'delivered', label: 'Entregue', count: statusCount.delivered, color: 'bg-green-100 text-green-800' }
                  ].map(item => (
                    <div key={item.status} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.label}</span>
                      <Badge className={item.color}>{item.count}</Badge>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-sm text-gray-600 mb-3">Resumo Financeiro</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Receita Total</p>
                <p className="text-2xl font-bold text-green-800">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-800">
                  R$ {orders.length > 0 ? (totalRevenue / orders.length).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">Total de Itens Vendidos</p>
                <p className="text-2xl font-bold text-purple-800">
                  {orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-orange-800">
                  {customers.length > 0 ? ((orders.length / customers.length) * 100).toFixed(1) : '0'}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}