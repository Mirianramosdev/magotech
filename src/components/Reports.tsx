import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
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

interface ReportsProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
}

export function Reports({ products, orders, customers }: ReportsProps) {
  // Cálculos de métricas
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItemsSold = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  // Análise de vendas por categoria
  const salesByCategory = () => {
    const categorySales: Record<string, { revenue: number; quantity: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const category = product.category;
          if (!categorySales[category]) {
            categorySales[category] = { revenue: 0, quantity: 0 };
          }
          categorySales[category].revenue += item.price * item.quantity;
          categorySales[category].quantity += item.quantity;
        }
      });
    });
    return Object.entries(categorySales)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Top produtos mais vendidos
  const topProducts = () => {
    const productSales: Record<number, { 
      name: string; 
      quantity: number; 
      revenue: number;
      category: string;
    }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!productSales[item.id]) {
          productSales[item.id] = { 
            name: item.name, 
            quantity: 0, 
            revenue: 0,
            category: product?.category || 'Outros'
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Top clientes
  const topCustomers = () => {
    return customers
      .filter(c => c.totalSpent > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  };

  // Análise de status de pedidos
  const ordersByStatus = () => {
    const statusCount = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };
    return statusCount;
  };

  // Análise de formas de pagamento
  const paymentMethods = () => {
    const methods = {
      whatsapp: orders.filter(o => o.paymentMethod === 'whatsapp').length,
      store: orders.filter(o => o.paymentMethod === 'store').length
    };
    const total = methods.whatsapp + methods.store;
    return {
      whatsapp: { count: methods.whatsapp, percentage: total > 0 ? (methods.whatsapp / total) * 100 : 0 },
      store: { count: methods.store, percentage: total > 0 ? (methods.store / total) * 100 : 0 }
    };
  };

  // Taxa de conversão
  const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;

  // Produtos com estoque baixo
  const lowStockProducts = products.filter(p => (p as any).stock < 5);

  // Exportar relatório
  const exportReport = () => {
    const reportData = {
      data_geracao: new Date().toLocaleString('pt-BR'),
      metricas_gerais: {
        receita_total: totalRevenue,
        pedidos_totais: totalOrders,
        clientes_totais: totalCustomers,
        clientes_ativos: activeCustomers,
        ticket_medio: averageTicket,
        itens_vendidos: totalItemsSold,
        taxa_conversao: conversionRate
      },
      vendas_por_categoria: salesByCategory(),
      top_produtos: topProducts(),
      top_clientes: topCustomers(),
      status_pedidos: ordersByStatus(),
      formas_pagamento: paymentMethods(),
      estoque_baixo: lowStockProducts
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-magotech-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categoryData = salesByCategory();
  const topProductsData = topProducts();
  const topCustomersData = topCustomers();
  const statusData = ordersByStatus();
  const paymentData = paymentMethods();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Relatórios e Análises</h1>
          <p className="text-gray-600">Análise detalhada do desempenho do seu negócio</p>
        </div>
        <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalOrders} pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCustomers} clientes ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Vendidos</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de unidades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análises */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
        </TabsList>

        {/* Tab: Vendas */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Receita gerada por categoria de produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-500">{item.quantity} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          R$ {item.revenue.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                  {categoryData.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Nenhuma venda registrada</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Formas de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
                <CardDescription>Preferência dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{paymentData.whatsapp.count} pedidos</span>
                        <Badge variant="outline">{paymentData.whatsapp.percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${paymentData.whatsapp.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Loja</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{paymentData.store.count} pedidos</span>
                        <Badge variant="outline">{paymentData.store.percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${paymentData.store.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total de Pedidos</span>
                      <span className="font-bold">{totalOrders}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Produtos */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
              <CardDescription>Produtos com melhor desempenho de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProductsData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          <span className="text-sm text-gray-500">{product.quantity} vendidos</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R$ {product.revenue.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((product.revenue / totalRevenue) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                ))}
                {topProductsData.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum produto vendido ainda</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Clientes</CardTitle>
              <CardDescription>Clientes com maior valor de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCustomersData.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-800 rounded-full font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">{customer.email}</span>
                          <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R$ {customer.totalSpent.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer.totalOrders} pedidos
                      </p>
                    </div>
                  </div>
                ))}
                {topCustomersData.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum cliente com compras ainda</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Pedidos */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status dos Pedidos</CardTitle>
              <CardDescription>Distribuição atual dos pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-800">Pendente</span>
                    <Badge className="bg-yellow-500 text-white">{statusData.pending}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{statusData.pending}</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {totalOrders > 0 ? ((statusData.pending / totalOrders) * 100).toFixed(1) : 0}% do total
                  </p>
                </div>

                <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Confirmado</span>
                    <Badge className="bg-blue-500 text-white">{statusData.confirmed}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{statusData.confirmed}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {totalOrders > 0 ? ((statusData.confirmed / totalOrders) * 100).toFixed(1) : 0}% do total
                  </p>
                </div>

                <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-orange-800">Enviado</span>
                    <Badge className="bg-orange-500 text-white">{statusData.shipped}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{statusData.shipped}</p>
                  <p className="text-sm text-orange-700 mt-1">
                    {totalOrders > 0 ? ((statusData.shipped / totalOrders) * 100).toFixed(1) : 0}% do total
                  </p>
                </div>

                <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Entregue</span>
                    <Badge className="bg-green-500 text-white">{statusData.delivered}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{statusData.delivered}</p>
                  <p className="text-sm text-green-700 mt-1">
                    {totalOrders > 0 ? ((statusData.delivered / totalOrders) * 100).toFixed(1) : 0}% do total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Estoque */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
              <CardDescription>Produtos que precisam de reabastecimento (menos de 5 unidades)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-900">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{product.category}</Badge>
                        <span className="text-sm text-orange-700">
                          R$ {product.price.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-lg">
                      {(product as any).stock || 0} un.
                    </Badge>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Estoque saudável!</p>
                    <p className="text-sm text-gray-500 mt-1">Todos os produtos com estoque adequado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
