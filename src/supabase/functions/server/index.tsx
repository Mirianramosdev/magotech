import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store.tsx';
import { logger } from 'hono/logger';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.figma.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('*', logger(console.log));
// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Products endpoints
import type { Context } from 'hono';

app.get('/make-server-c3c9c739/products', async (c: Context) => {
  try {
    const products = await kv.get('products') || [];
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.post('/make-server-c3c9c739/products', async (c: Context) => {
  try {
    const body = await c.req.json();
    const products = await kv.get('products') || [];
    const newProduct = {
      ...body,
      id: Math.max(...products.map((p: any) => p.id), 0) + 1
    };
    const updatedProducts = [...products, newProduct];
    await kv.set('products', updatedProducts);
    return c.json({ product: newProduct });
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

app.put('/make-server-c3c9c739/products/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const products = await kv.get('products') || [];
    const updatedProducts = products.map((p: any) => 
      p.id === id ? { ...p, ...body } : p
    );
    await kv.set('products', updatedProducts);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

app.delete('/make-server-c3c9c739/products/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const products = await kv.get('products') || [];
    const updatedProducts = products.filter((p: any) => p.id !== id);
    await kv.set('products', updatedProducts);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Customers endpoints
app.get('/make-server-c3c9c739/customers', async (c: Context) => {
  try {
    const customers = await kv.get('customers') || [];
    return c.json({ customers });
  } catch (error) {
    console.log('Error fetching customers:', error);
    return c.json({ error: 'Failed to fetch customers' }, 500);
  }
});

app.post('/make-server-c3c9c739/customers', async (c: Context) => {
  try {
    const body = await c.req.json();
    const customers = await kv.get('customers') || [];
    const newCustomer = {
      ...body,
      id: Math.max(...customers.map((c: any) => c.id), 0) + 1,
      registrationDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      status: 'active'
    };
    const updatedCustomers = [...customers, newCustomer];
    await kv.set('customers', updatedCustomers);
    return c.json({ customer: newCustomer });
  } catch (error) {
    console.log('Error creating customer:', error);
    return c.json({ error: 'Failed to create customer' }, 500);
  }
});

app.put('/make-server-c3c9c739/customers/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const customers = await kv.get('customers') || [];
    const updatedCustomers = customers.map((customer: any) => 
      customer.id === id ? { ...customer, ...body } : customer
    );
    await kv.set('customers', updatedCustomers);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating customer:', error);
    return c.json({ error: 'Failed to update customer' }, 500);
  }
});

app.delete('/make-server-c3c9c739/customers/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const customers = await kv.get('customers') || [];
    const updatedCustomers = customers.filter((c: any) => c.id !== id);
    await kv.set('customers', updatedCustomers);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting customer:', error);
    return c.json({ error: 'Failed to delete customer' }, 500);
  }
});

// Customer authentication
app.post('/make-server-c3c9c739/auth/login', async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const customers = await kv.get('customers') || [];
    const customer = customers.find((c: any) => c.email === email);
    
    if (customer && password === 'cliente123') {
      const updatedCustomer = {
        ...customer,
        lastLogin: new Date().toISOString()
      };
      
      // Update customer in database
      const updatedCustomers = customers.map((c: any) => 
        c.id === customer.id ? updatedCustomer : c
      );
      await kv.set('customers', updatedCustomers);
      
      return c.json({ customer: updatedCustomer });
    } else {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
  } catch (error) {
    console.log('Error during login:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Orders endpoints
app.get('/make-server-c3c9c739/orders', async (c: Context) => {
  try {
    const orders = await kv.get('orders') || [];
    return c.json({ orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

app.post('/make-server-c3c9c739/orders', async (c: Context) => {
  try {
    const body = await c.req.json();
    const orders = await kv.get('orders') || [];
    const newOrder = {
      ...body,
      id: Math.max(...orders.map((o: any) => o.id), 1000) + 1,
      status: 'pending',
      date: new Date().toLocaleDateString('pt-BR')
    };
    const updatedOrders = [...orders, newOrder];
    await kv.set('orders', updatedOrders);
    
    // Update customer statistics if customer exists
    if (body.customerEmail) {
      const customers = await kv.get('customers') || [];
      const updatedCustomers = customers.map((customer: any) => {
        if (customer.email === body.customerEmail) {
          return {
            ...customer,
            totalOrders: customer.totalOrders + 1,
            totalSpent: customer.totalSpent + body.total
          };
        }
        return customer;
      });
      await kv.set('customers', updatedCustomers);
    }
    
    return c.json({ order: newOrder });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

app.put('/make-server-c3c9c739/orders/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const orders = await kv.get('orders') || [];
    const updatedOrders = orders.map((o: any) => 
      o.id === id ? { ...o, ...body } : o
    );
    await kv.set('orders', updatedOrders);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating order:', error);
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// Cart endpoints (per customer)
app.get('/make-server-c3c9c739/cart/:customerEmail', async (c: Context) => {
  try {
    const customerEmail = c.req.param('customerEmail');
    const cartKey = `cart_${customerEmail}`;
    const cart = await kv.get(cartKey) || [];
    return c.json({ cart });
  } catch (error) {
    console.log('Error fetching cart:', error);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

app.post('/make-server-c3c9c739/cart/:customerEmail', async (c: Context) => {
  try {
    const customerEmail = c.req.param('customerEmail');
    const body = await c.req.json();
    const cartKey = `cart_${customerEmail}`;
    await kv.set(cartKey, body.cart);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error saving cart:', error);
    return c.json({ error: 'Failed to save cart' }, 500);
  }
});

app.delete('/make-server-c3c9c739/cart/:customerEmail', async (c: Context) => {
  try {
    const customerEmail = c.req.param('customerEmail');
    const cartKey = `cart_${customerEmail}`;
    await kv.del(cartKey);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error clearing cart:', error);
    return c.json({ error: 'Failed to clear cart' }, 500);
  }
});

// Initialize database with default data
app.post('/make-server-c3c9c739/init', async (c: Context) => {
  try {
    // Check if data already exists
    const existingProducts = await kv.get('products');
    if (existingProducts && existingProducts.length > 0) {
      return c.json({ message: 'Database already initialized' });
    }

    // Default products
    const defaultProducts = [
      {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        price: 8999,
        originalPrice: 9999,
        image: "https://images.unsplash.com/photo-1600034587986-b0b531d62950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMGJsYWNrfGVufDF8fHx8MTc1ODAyNzA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Smartphones",
        rating: 4.8,
        reviews: 245,
        isNew: true,
        isOnSale: true,
        stock: 15,
        description: "O iPhone mais avançado com chip A17 Pro e sistema de câmeras Pro"
      },
      {
        id: 2,
        name: "MacBook Pro M3 14\" 512GB",
        price: 12999,
        originalPrice: 14999,
        image: "https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1vZGVybnxlbnwxfHx8fDE3NTgwMTY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Laptops",
        rating: 4.9,
        reviews: 189,
        isOnSale: true,
        stock: 8,
        description: "MacBook Pro com chip M3 para performance profissional"
      },
      {
        id: 3,
        name: "AirPods Pro (3ª Geração)",
        price: 1999,
        originalPrice: 2299,
        image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NTc5OTQ0NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Acessórios",
        rating: 4.7,
        reviews: 456,
        isOnSale: true,
        stock: 25,
        description: "Fones de ouvido sem fio com cancelamento ativo de ruído"
      },
      {
        id: 4,
        name: "Setup Gamer Completo RGB",
        price: 5999,
        image: "https://images.unsplash.com/photo-1629102981237-c44ffad32775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU3OTQ3OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Gaming",
        rating: 4.6,
        reviews: 78,
        isNew: true,
        stock: 3,
        description: "Setup gamer completo com iluminação RGB personalizada"
      },
      {
        id: 5,
        name: "iPad Pro 12.9\" M2 1TB",
        price: 7999,
        originalPrice: 8999,
        image: "https://images.unsplash.com/photo-1610664840481-10b7b43c9283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzU3OTE5MDUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Tablets",
        rating: 4.8,
        reviews: 134,
        isOnSale: true,
        stock: 12,
        description: "iPad Pro com chip M2 e tela Liquid Retina XDR"
      },
      {
        id: 6,
        name: "Apple Watch Ultra 2",
        price: 4999,
        image: "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTc5NzE1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        category: "Acessórios",
        rating: 4.9,
        reviews: 298,
        isNew: true,
        stock: 18,
        description: "Smartwatch premium para aventureiros e atletas"
      }
    ];

    // Default customers
    const defaultCustomers = [
      {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        phone: "+5511999998888",
        address: "Rua das Flores, 123 - São Paulo, SP",
        birthDate: "1985-03-15",
        registrationDate: "2023-01-15T00:00:00Z",
        totalOrders: 3,
        totalSpent: 25997,
        status: "active"
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "+5511888889999",
        address: "Av. Paulista, 456 - São Paulo, SP",
        birthDate: "1992-08-22",
        registrationDate: "2023-02-20T00:00:00Z",
        totalOrders: 2,
        totalSpent: 15998,
        status: "active"
      },
      {
        id: 3,
        name: "Carlos Lima",
        email: "carlos@email.com",
        phone: "+5511777776666",
        address: "Rua dos Gamers, 789 - Rio de Janeiro, RJ",
        birthDate: "1988-12-10",
        registrationDate: "2023-03-10T00:00:00Z",
        totalOrders: 1,
        totalSpent: 10998,
        status: "active"
      }
    ];

    // Default orders
    const defaultOrders = [
      {
        id: 1001,
        customerName: "João Silva",
        customerPhone: "+5511999998888",
        customerEmail: "joao@email.com",
        items: [
          { id: 1, name: "iPhone 15 Pro Max 256GB", price: 8999, quantity: 1, image: defaultProducts[0].image },
          { id: 3, name: "AirPods Pro (3ª Geração)", price: 1999, quantity: 1, image: defaultProducts[2].image }
        ],
        total: 10998,
        status: "pending",
        date: "15/01/2024",
        shippingAddress: "Rua das Flores, 123 - São Paulo, SP",
        paymentMethod: "whatsapp",
        notes: "Cliente solicitou entrega rápida"
      },
      {
        id: 1002,
        customerName: "Maria Santos",
        customerPhone: "+5511888889999",
        customerEmail: "maria@email.com",
        items: [
          { id: 2, name: "MacBook Pro M3 14\" 512GB", price: 12999, quantity: 1, image: defaultProducts[1].image }
        ],
        total: 12999,
        status: "confirmed",
        date: "14/01/2024",
        shippingAddress: "Av. Paulista, 456 - São Paulo, SP",
        paymentMethod: "store"
      },
      {
        id: 1003,
        customerName: "Carlos Lima",
        customerPhone: "+5511777776666",
        customerEmail: "carlos@email.com",
        items: [
          { id: 4, name: "Setup Gamer Completo RGB", price: 5999, quantity: 1, image: defaultProducts[3].image },
          { id: 6, name: "Apple Watch Ultra 2", price: 4999, quantity: 1, image: defaultProducts[5].image }
        ],
        total: 10998,
        status: "shipped",
        date: "13/01/2024",
        shippingAddress: "Rua dos Gamers, 789 - Rio de Janeiro, RJ",
        paymentMethod: "whatsapp"
      }
    ];

    await kv.set('products', defaultProducts);
    await kv.set('customers', defaultCustomers);
    await kv.set('orders', defaultOrders);

    return c.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.log('Error initializing database:', error);
    return c.json({ error: 'Failed to initialize database' }, 500);
  }
});

// @ts-ignore: Deno global is available in Deno Deploy or Deno runtime
Deno.serve(app.fetch);