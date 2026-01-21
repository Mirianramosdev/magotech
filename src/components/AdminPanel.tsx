import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { ProductManagement, ProductWithStock } from './ProductManagement';
import { OrderManagement, Order } from './OrderManagement';
import { CustomerManagement } from './CustomerManagement';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Customer } from './CustomerAuth';
import { useAPI } from '../hooks/useAPI';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  products: ProductWithStock[];
  onUpdateProducts: () => void;
  orders: Order[];
  onUpdateOrders: () => void;
  customers: Customer[];
  onUpdateCustomers: () => void;
}

export function AdminPanel({ 
  onLogout, 
  products, 
  onUpdateProducts, 
  orders, 
  onUpdateOrders,
  customers,
  onUpdateCustomers 
}: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  const api = useAPI();
  const productsAPI = api.useProducts();
  const customersAPI = api.useCustomers();
  const ordersAPI = api.useOrders();

  const addProduct = async (productData: Omit<ProductWithStock, 'id'>) => {
    try {
      await productsAPI.addProduct(productData);
      onUpdateProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Erro ao adicionar produto');
    }
  };

  const updateProduct = async (id: number, productData: Partial<ProductWithStock>) => {
    try {
      await productsAPI.updateProduct(id, productData);
      onUpdateProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productsAPI.deleteProduct(id);
      onUpdateProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Erro ao excluir produto');
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      await ordersAPI.updateOrder(orderId, { status });
      onUpdateOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      await customersAPI.addCustomer(customerData);
      onUpdateCustomers();
    } catch (error) {
      console.error('Failed to add customer:', error);
      alert('Erro ao adicionar cliente');
    }
  };

  const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
    try {
      await customersAPI.updateCustomer(id, customerData);
      onUpdateCustomers();
    } catch (error) {
      console.error('Failed to update customer:', error);
      alert('Erro ao atualizar cliente');
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await customersAPI.deleteCustomer(id);
      onUpdateCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Erro ao excluir cliente');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard products={products} orders={orders} customers={customers} />;
      case 'products':
        return (
          <ProductManagement
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        );
      case 'inventory':
        return (
          <ProductManagement
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        );
      case 'orders':
        return (
          <OrderManagement
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            orders={orders}
            onAddCustomer={addCustomer}
            onUpdateCustomer={updateCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        );
      case 'analytics':
        return (
          <Reports 
            products={products}
            orders={orders}
            customers={customers}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard products={products} orders={orders} customers={customers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-black">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64" aria-describedby={undefined}>
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={onLogout}
            isMobile={true}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <img 
              src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
              alt="MAGOTECH Logo" 
              className="h-8 w-auto"
            />
            
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}