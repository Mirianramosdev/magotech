import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c3c9c739`;

// No built-in sample data: initialize as empty arrays to ensure the admin panel uses only real data
const initialProducts: any[] = [];
const initialCustomers: any[] = [];
const initialOrders: any[] = [];

// Track if backend is available
let isBackendAvailable = true;

interface APIHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface APIHook {
  // Products
  useProducts: () => APIHookReturn<any[]> & {
    addProduct: (product: any) => Promise<void>;
    updateProduct: (id: number, product: any) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
  };
  // Customers
  useCustomers: () => APIHookReturn<any[]> & {
    addCustomer: (customer: any) => Promise<void>;
    updateCustomer: (id: number, customer: any) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
    loginCustomer: (email: string, password: string) => Promise<any>;
  };
  // Orders
  useOrders: () => APIHookReturn<any[]> & {
    addOrder: (order: any) => Promise<void>;
    updateOrder: (id: number, order: any) => Promise<void>;
  };
  // Cart
  useCart: (customerEmail?: string) => APIHookReturn<any[]> & {
    saveCart: (cart: any[]) => Promise<void>;
    clearCart: () => Promise<void>;
  };
  // Database initialization
  initDatabase: () => Promise<void>;
}

const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (isBackendAvailable) {
      console.info('Backend unavailable, switching to offline mode');
      isBackendAvailable = false;
    }
    throw error;
  }
};

// Local storage helpers
const getLocalData = (key: string, defaultValue: any = []) => {
  try {
    const stored = localStorage.getItem(`magotech_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalData = (key: string, data: any) => {
  try {
    localStorage.setItem(`magotech_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// Do NOT pre-populate localStorage with sample data. Leave storage empty so admin sees only real data.
const initLocalStorage = () => {
  const hasInitialized = localStorage.getItem('magotech_initialized');
  if (!hasInitialized) {
    // Mark as initialized but do not write any sample records
    localStorage.setItem('magotech_initialized', 'true');
  }
};

// Initialize localStorage immediately (no seeding)
initLocalStorage();

// Generic hook for data fetching with fallback
const useData = <T,>(endpoint: string, localKey: string, defaultData: T): APIHookReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try backend first
      if (isBackendAvailable) {
        const result = await makeRequest(endpoint);
        const responseData = result[Object.keys(result)[0]] as T;
        setData(responseData);
        // Save to localStorage as backup
        setLocalData(localKey, responseData);
        return;
      }
    } catch (err) {
      if (isBackendAvailable) {
        console.info('Switching to offline mode');
        isBackendAvailable = false;
      }
    }

    // Fallback to localStorage
    const localData = getLocalData(localKey, defaultData);
    setData(localData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export const useAPI = (): APIHook => {
  // Products
  const useProducts = () => {
    const { data, loading, error, refetch } = useData<any[]>('/products', 'products', initialProducts);

    const addProduct = async (product: any) => {
      try {
        if (isBackendAvailable) {
          await makeRequest('/products', {
            method: 'POST',
            body: JSON.stringify(product),
          });
        } else {
          // Local fallback
          const products = getLocalData('products', initialProducts);
          const newProduct = {
            ...product,
            id: Math.max(...products.map((p: any) => p.id), 0) + 1
          };
          setLocalData('products', [...products, newProduct]);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        isBackendAvailable = false;
        const products = getLocalData('products', initialProducts);
        const newProduct = {
          ...product,
          id: Math.max(...products.map((p: any) => p.id), 0) + 1
        };
        setLocalData('products', [...products, newProduct]);
        await refetch();
      }
    };

    const updateProduct = async (id: number, product: any) => {
      try {
        if (isBackendAvailable) {
          await makeRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
          });
        } else {
          // Local fallback
          const products = getLocalData('products', initialProducts);
          const updatedProducts = products.map((p: any) => 
            p.id === id ? { ...p, ...product } : p
          );
          setLocalData('products', updatedProducts);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        isBackendAvailable = false;
        const products = getLocalData('products', initialProducts);
        const updatedProducts = products.map((p: any) => 
          p.id === id ? { ...p, ...product } : p
        );
        setLocalData('products', updatedProducts);
        await refetch();
      }
    };

    const deleteProduct = async (id: number) => {
      try {
        if (isBackendAvailable) {
          await makeRequest(`/products/${id}`, {
            method: 'DELETE',
          });
        } else {
          // Local fallback
          const products = getLocalData('products', initialProducts);
          const updatedProducts = products.filter((p: any) => p.id !== id);
          setLocalData('products', updatedProducts);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        isBackendAvailable = false;
        const products = getLocalData('products', initialProducts);
        const updatedProducts = products.filter((p: any) => p.id !== id);
        setLocalData('products', updatedProducts);
        await refetch();
      }
    };

    return {
      data: data || [],
      loading,
      error,
      refetch,
      addProduct,
      updateProduct,
      deleteProduct
    };
  };

  // Customers
  const useCustomers = () => {
    const { data, loading, error, refetch } = useData<any[]>('/customers', 'customers', initialCustomers);

    const addCustomer = async (customerData: any) => {
      // Extract password from customer data and hash it (simple encoding)
      const { password, ...customer } = customerData;
      const hashedPassword = btoa(password); // Simple base64 encoding for demo
      
      const customerWithPassword = {
        ...customer,
        password: hashedPassword
      };

      try {
        if (isBackendAvailable) {
          await makeRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customerWithPassword),
          });
        } else {
          // Local fallback
          const customers = getLocalData('customers', initialCustomers);
          const newCustomer = {
            ...customerWithPassword,
            id: Math.max(...customers.map((c: any) => c.id), 0) + 1,
            registrationDate: new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            status: 'active'
          };
          setLocalData('customers', [...customers, newCustomer]);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        isBackendAvailable = false;
        const customers = getLocalData('customers', initialCustomers);
        const newCustomer = {
          ...customerWithPassword,
          id: Math.max(...customers.map((c: any) => c.id), 0) + 1,
          registrationDate: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0,
          status: 'active'
        };
        setLocalData('customers', [...customers, newCustomer]);
        await refetch();
      }
    };

    const updateCustomer = async (id: number, customer: any) => {
      try {
        if (isBackendAvailable) {
          await makeRequest(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customer),
          });
        } else {
          // Local fallback
          const customers = getLocalData('customers', initialCustomers);
          const updatedCustomers = customers.map((c: any) => 
            c.id === id ? { ...c, ...customer } : c
          );
          setLocalData('customers', updatedCustomers);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        const customers = getLocalData('customers', initialCustomers);
        const updatedCustomers = customers.map((c: any) => 
          c.id === id ? { ...c, ...customer } : c
        );
        setLocalData('customers', updatedCustomers);
        await refetch();
      }
    };

    const deleteCustomer = async (id: number) => {
      try {
        if (isBackendAvailable) {
          await makeRequest(`/customers/${id}`, {
            method: 'DELETE',
          });
        } else {
          // Local fallback
          const customers = getLocalData('customers', initialCustomers);
          const updatedCustomers = customers.filter((c: any) => c.id !== id);
          setLocalData('customers', updatedCustomers);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        const customers = getLocalData('customers', initialCustomers);
        const updatedCustomers = customers.filter((c: any) => c.id !== id);
        setLocalData('customers', updatedCustomers);
        await refetch();
      }
    };

    const loginCustomer = async (email: string, password: string) => {
      try {
        if (isBackendAvailable) {
          const result = await makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          await refetch(); // Refresh customer data after login
          return result.customer;
        } else {
          // Local fallback - check real password
          const customers = getLocalData('customers', initialCustomers);
          const customer = customers.find((c: any) => c.email === email);
          
          if (!customer) {
            throw new Error('Email não encontrado. Verifique se você já possui uma conta.');
          }

          // Check password - for existing customers without password, use default
          const isPasswordValid = customer.password 
            ? atob(customer.password) === password  // Decode and compare
            : password === 'cliente123'; // Fallback for existing customers
          
          if (isPasswordValid) {
            const updatedCustomer = {
              ...customer,
              lastLogin: new Date().toISOString()
            };
            
            // Update customer in local storage
            const updatedCustomers = customers.map((c: any) => 
              c.id === customer.id ? updatedCustomer : c
            );
            setLocalData('customers', updatedCustomers);
            await refetch();
            
            return updatedCustomer;
          } else {
            throw new Error('Senha incorreta. Verifique suas credenciais.');
          }
        }
      } catch (error) {
        // Fallback authentication
        const customers = getLocalData('customers', initialCustomers);
        const customer = customers.find((c: any) => c.email === email);
        
        if (!customer) {
          throw new Error('Email não encontrado. Verifique se você já possui uma conta.');
        }

        // Check password - for existing customers without password, use default
        const isPasswordValid = customer.password 
          ? atob(customer.password) === password  // Decode and compare
          : password === 'cliente123'; // Fallback for existing customers
        
        if (isPasswordValid) {
          const updatedCustomer = {
            ...customer,
            lastLogin: new Date().toISOString()
          };
          
          // Update customer in local storage
          const updatedCustomers = customers.map((c: any) => 
            c.id === customer.id ? updatedCustomer : c
          );
          setLocalData('customers', updatedCustomers);
          await refetch();
          
          return updatedCustomer;
        } else {
          throw new Error('Senha incorreta. Verifique suas credenciais.');
        }
      }
    };

    return {
      data: data || [],
      loading,
      error,
      refetch,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      loginCustomer
    };
  };

  // Orders
  const useOrders = () => {
    const { data, loading, error, refetch } = useData<any[]>('/orders', 'orders', initialOrders);

    const addOrder = async (order: any) => {
      try {
        if (isBackendAvailable) {
          await makeRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(order),
          });
        } else {
          // Local fallback
          const orders = getLocalData('orders', initialOrders);
          const newOrder = {
            ...order,
            id: Math.max(...orders.map((o: any) => o.id), 1000) + 1,
            status: 'pending',
            date: new Date().toLocaleDateString('pt-BR')
          };
          setLocalData('orders', [...orders, newOrder]);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        const orders = getLocalData('orders', initialOrders);
        const newOrder = {
          ...order,
          id: Math.max(...orders.map((o: any) => o.id), 1000) + 1,
          status: 'pending',
          date: new Date().toLocaleDateString('pt-BR')
        };
        setLocalData('orders', [...orders, newOrder]);
        await refetch();
      }
    };

    const updateOrder = async (id: number, order: any) => {
      try {
        if (isBackendAvailable) {
          await makeRequest(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(order),
          });
        } else {
          // Local fallback
          const orders = getLocalData('orders', initialOrders);
          const updatedOrders = orders.map((o: any) => 
            o.id === id ? { ...o, ...order } : o
          );
          setLocalData('orders', updatedOrders);
        }
        await refetch();
      } catch (error) {
        // If backend fails, use local storage
        const orders = getLocalData('orders', initialOrders);
        const updatedOrders = orders.map((o: any) => 
          o.id === id ? { ...o, ...order } : o
        );
        setLocalData('orders', updatedOrders);
        await refetch();
      }
    };

    return {
      data: data || [],
      loading,
      error,
      refetch,
      addOrder,
      updateOrder
    };
  };

  // Cart
  const useCart = (customerEmail?: string) => {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
      if (!customerEmail) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        if (isBackendAvailable) {
          const result = await makeRequest(`/cart/${encodeURIComponent(customerEmail)}`);
          setData(result.cart || []);
        } else {
          // Local fallback
          const cart = getLocalData(`cart_${customerEmail}`, []);
          setData(cart);
        }
      } catch (err) {
        // Silently fall back to local storage
        // Local fallback
        const cart = getLocalData(`cart_${customerEmail}`, []);
        setData(cart);
        setError(null); // Don't show error for local fallback
      } finally {
        setLoading(false);
      }
    };

    const saveCart = async (cart: any[]) => {
      if (!customerEmail) return;

      try {
        if (isBackendAvailable) {
          await makeRequest(`/cart/${encodeURIComponent(customerEmail)}`, {
            method: 'POST',
            body: JSON.stringify({ cart }),
          });
        } else {
          // Local fallback
          setLocalData(`cart_${customerEmail}`, cart);
        }
        setData(cart);
      } catch (err) {
        // Silently fall back to local storage
        // Local fallback
        setLocalData(`cart_${customerEmail}`, cart);
        setData(cart);
      }
    };

    const clearCart = async () => {
      if (!customerEmail) return;

      try {
        if (isBackendAvailable) {
          await makeRequest(`/cart/${encodeURIComponent(customerEmail)}`, {
            method: 'DELETE',
          });
        } else {
          // Local fallback
          localStorage.removeItem(`magotech_cart_${customerEmail}`);
        }
        setData([]);
      } catch (err) {
        // Silently fall back to local storage
        // Local fallback
        localStorage.removeItem(`magotech_cart_${customerEmail}`);
        setData([]);
      }
    };

    useEffect(() => {
      fetchCart();
    }, [customerEmail]);

    return {
      data: data || [],
      loading,
      error,
      refetch: fetchCart,
      saveCart,
      clearCart
    };
  };

  // Database initialization
  const initDatabase = async () => {
    try {
      if (isBackendAvailable) {
        await makeRequest('/init', {
          method: 'POST',
        });
        console.log('Backend database initialized successfully');
      } else {
        // Initialize local storage
        initLocalStorage();
        console.log('Local storage initialized successfully');
      }
    } catch (err) {
      if (isBackendAvailable) {
        console.info('Backend unavailable, running in offline mode');
        isBackendAvailable = false;
      }
      initLocalStorage();
    }
  };

  return {
    useProducts,
    useCustomers,
    useOrders,
    useCart,
    initDatabase
  };
};