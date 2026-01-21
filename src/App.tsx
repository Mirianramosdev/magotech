import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCard, Product } from './components/ProductCard';
import { Cart, CartItem } from './components/Cart';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { CustomerAuth, Customer } from './components/CustomerAuth';
import { CustomerProfile } from './components/CustomerProfile';
import { useAPI } from './hooks/useAPI';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Shield, Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Store states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Customer states
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);

  // API hooks
  const api = useAPI();
  const productsAPI = api.useProducts();
  const customersAPI = api.useCustomers();
  const ordersAPI = api.useOrders();
  const cartAPI = api.useCart(currentCustomer?.email);

  // Initialize database on first load
  useEffect(() => {
    const initDB = async () => {
      try {
        await api.initDatabase();
      } catch (error) {
        // Silently continue with localStorage fallback
        console.info('Using localStorage fallback');
      } finally {
        setIsInitialized(true);
      }
    };

    initDB();
  }, [api]);

  // Sync local cart with remote cart when customer logs in
  useEffect(() => {
    if (currentCustomer && cartAPI.data) {
      // If remote cart has items, use them, otherwise save local cart to remote
      if (cartAPI.data.length > 0) {
        setCartItems(cartAPI.data);
      } else if (cartItems.length > 0) {
        cartAPI.saveCart(cartItems);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCustomer, cartAPI.data]);

  // Save cart to remote when items change (only if customer is logged in)
  useEffect(() => {
    if (currentCustomer && isInitialized) {
      cartAPI.saveCart(cartItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, currentCustomer, isInitialized]);

  const categories = ['all', 'Celulares', 'Notebooks', 'Tablets', 'Gamer', 'Acessórios'];

  const filteredProducts = selectedCategory === 'all' 
    ? (productsAPI.data || [])
    : (productsAPI.data || []).filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAdminLogin = (credentials: { email: string; password: string }) => {
    // Simulação de login - em produção, isso seria uma chamada API real
    if (credentials.email === 'ceo@magotech.com.br' && credentials.password === '0052MT?@*') {
      setIsAdminAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas. Verifique seu email e senha.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('store');
  };

  const handleCustomerLogin = async (email: string, password: string) => {
    try {
      const customer = await customersAPI.loginCustomer(email, password);
      setCurrentCustomer(customer);
      
      // Reabrir o carrinho após login se houver itens
      if (cartItems.length > 0) {
        setIsCustomerAuthOpen(false);
        setTimeout(() => setIsCartOpen(true), 300);
      }
      
      return customer;
    } catch (error) {
      throw error;
    }
  };

  const handleCustomerRegister = async (customerData: Omit<Customer, 'id' | 'registrationDate' | 'totalOrders' | 'totalSpent' | 'status'> & { password: string }) => {
    try {
      await customersAPI.addCustomer(customerData);
      // Find the newly created customer and set as current
      await customersAPI.refetch();
      const newCustomer = customersAPI.data?.find(c => c.email === customerData.email);
      if (newCustomer) {
        setCurrentCustomer(newCustomer);
        
        // Reabrir o carrinho após cadastro se houver itens
        if (cartItems.length > 0) {
          setIsCustomerAuthOpen(false);
          setTimeout(() => setIsCartOpen(true), 300);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCustomerUpdate = async (customerId: number, data: Partial<Customer>) => {
    try {
      await customersAPI.updateCustomer(customerId, data);
      if (currentCustomer && currentCustomer.id === customerId) {
        setCurrentCustomer({ ...currentCustomer, ...data });
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    setIsCustomerProfileOpen(false);
  };

  const handleCustomerClick = () => {
    if (currentCustomer) {
      setIsCustomerProfileOpen(true);
    } else {
      setIsCustomerAuthOpen(true);
    }
  };

  const getCustomerOrders = useCallback(() => {
    if (!currentCustomer || !ordersAPI.data) return [];
    return ordersAPI.data.filter(order => order.customerEmail === currentCustomer.email);
  }, [currentCustomer, ordersAPI.data]);

  // Função para criar pedido quando finalizar compra
  const createOrder = async (customerInfo: any) => {
    if (cartItems.length === 0) return;
    
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newOrder = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total,
        shippingAddress: customerInfo.address,
        paymentMethod: customerInfo.paymentMethod || 'store',
        notes: customerInfo.notes || ''
      };
      
      await ordersAPI.addOrder(newOrder);
      
      // Limpar carrinho local e remoto
      setCartItems([]);
      if (currentCustomer) {
        await cartAPI.clearCart();
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Erro ao criar pedido. Tente novamente.');
    }
  };

  // Show loading screen while initializing
  if (!isInitialized || (productsAPI.loading && (!productsAPI.data || !productsAPI.data.length))) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-white">Carregando MAGOTECH...</p>
        </div>
      </div>
    );
  }

  // Admin view
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} error={loginError} />;
    }
    return (
      <AdminPanel 
        onLogout={handleAdminLogout}
        products={productsAPI.data || []}
        onUpdateProducts={() => productsAPI.refetch()}
        orders={ordersAPI.data || []}
        onUpdateOrders={() => ordersAPI.refetch()}
        customers={customersAPI.data || []}
        onUpdateCustomers={() => customersAPI.refetch()}
      />
    );
  }

  // Store view
  return (
    <div className="min-h-screen bg-gray-50">


      {/* Only show offline indicator if we actually have an error after trying backend */}
      {(productsAPI.error || customersAPI.error || ordersAPI.error) && isInitialized && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm">
            ⚡ Modo local ativo - Dados salvos no navegador
          </div>
        </div>
      )}

      <Header 
        cartItems={totalItems} 
        onCartClick={() => setIsCartOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        customer={currentCustomer}
        onCustomerClick={handleCustomerClick}
      />
      
      <HeroSection />

      {/* Products Section  */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-4xl">Nossos Produtos</h2>
              <Badge className="bg-green-500 text-black">
                {(productsAPI.data || []).length} itens
              </Badge>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore nossa seleção cuidadosamente escolhida de produtos tecnológicos 
              de última geração com a melhor qualidade e preços competitivos.
            </p>
          </div>

          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                  {category === 'all' ? 'Todos' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
              <Button 
                onClick={() => setSelectedCategory('all')}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Ver Todos os Produtos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl mb-2">GARANTIA</h3>
              <p className="text-gray-400">Todos os produtos com garantia</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black">📱</span>
              </div>
              <h3 className="text-xl mb-2">Suporte WhatsApp</h3>
              <p className="text-gray-400">Atendimento rápido pelo WhatsApp</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black">🚚</span>
              </div>
              <h3 className="text-xl mb-2">Entrega Rápida</h3>
              <p className="text-gray-400">Entregamos em toda região</p>
            </div>
          </div>
        </div>
      </section>

      <Footer onAdminClick={() => setCurrentView('admin')} />

      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        currentCustomer={currentCustomer}
        onCreateOrder={createOrder}
        orders={ordersAPI.data || []}
        onRequestLogin={() => setIsCustomerAuthOpen(true)}
      />

      <CustomerAuth
        isOpen={isCustomerAuthOpen}
        onOpenChange={setIsCustomerAuthOpen}
        onLogin={handleCustomerLogin}
        onRegister={handleCustomerRegister}
        customers={customersAPI.data || []}
      />

      {currentCustomer && (
        <CustomerProfile
          isOpen={isCustomerProfileOpen}
          onOpenChange={setIsCustomerProfileOpen}
          customer={currentCustomer}
          onUpdateCustomer={handleCustomerUpdate}
          onLogout={handleCustomerLogout}
          customerOrders={getCustomerOrders()}
        />
      )}
    </div>
  );
}