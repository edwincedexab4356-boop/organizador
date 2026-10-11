import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  Customer,
  InventoryMovement,
  StoreConfig,
  WebsiteLayoutConfig,
  UserAccount,
  DemoArchetype,
  UserRole,
  OrderStatus,
  PaymentStatus,
  InventoryMovementType
} from '../types';
import { DEMO_PRESETS, INITIAL_USERS } from '../data/demoPresets';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Mode & Presets
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  activePreset: DemoArchetype;
  switchPreset: (preset: DemoArchetype) => void;
  resetDemoData: () => void;

  // Active Role Simulation (for permission demos)
  currentUser: UserAccount;
  switchUserRole: (role: UserRole) => void;

  // Store data
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  layout: WebsiteLayoutConfig;
  updateLayout: (newLayout: Partial<WebsiteLayoutConfig>) => void;
  saveAndPublishAppearance: (newLayout: WebsiteLayoutConfig) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  togglePublishProduct: (id: string) => void;
  toggleFeaturedProduct: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, direction: 'up' | 'down') => void;

  // Inventory
  inventoryMovements: InventoryMovement[];
  adjustInventory: (productId: string, quantityDelta: number, type: InventoryMovementType, reason: string) => boolean;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>) => Order;
  getOrderSummaryText: (order: Order) => string;
  getWhatsAppOrderUrl: (order: Order) => string;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'firstOrderDate' | 'lastOrderDate'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Users
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Navigation view
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isPublicSiteOpen: boolean;
  setIsPublicSiteOpen: (open: boolean) => void;

  // Authentication
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY_PREFIX = 'webora_store_v1_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`) === 'true';
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}mode`);
    return saved !== null ? saved === 'true' : true;
  });

  const [activePreset, setActivePreset] = useState<DemoArchetype>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}preset`) as DemoArchetype;
    return saved && DEMO_PRESETS[saved] ? saved : 'bistro';
  });

  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [isPublicSiteOpen, setIsPublicSiteOpen] = useState<boolean>(false);

  // Users & active simulated user
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);

  // Data states initialized from active preset or localStorage
  const currentPresetData = DEMO_PRESETS[activePreset];

  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}config_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.config;
  });

  const [layout, setLayout] = useState<WebsiteLayoutConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}layout_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.layout;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}categories_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.categories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}products_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.products;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.orders;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}customers_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.customers;
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}movements_${activePreset}`);
    return saved ? JSON.parse(saved) : currentPresetData.inventoryMovements;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch demo preset
  const switchPreset = (preset: DemoArchetype) => {
    if (!DEMO_PRESETS[preset]) return;
    setActivePreset(preset);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}preset`, preset);
    const data = DEMO_PRESETS[preset];
    setConfig(data.config);
    setLayout(data.layout);
    setCategories(data.categories);
    setProducts(data.products);
    setOrders(data.orders);
    setCustomers(data.customers);
    setInventoryMovements(data.inventoryMovements);
    showToast(`Plantilla cargada: ${data.config.name}`, 'info');
  };

  // Reset demo data to initial preset state
  const resetDemoData = () => {
    const data = DEMO_PRESETS[activePreset];
    setConfig(data.config);
    setLayout(data.layout);
    setCategories(data.categories);
    setProducts(data.products);
    setOrders(data.orders);
    setCustomers(data.customers);
    setInventoryMovements(data.inventoryMovements);

    localStorage.removeItem(`${STORAGE_KEY_PREFIX}config_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}layout_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}categories_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}products_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}orders_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}customers_${activePreset}`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}movements_${activePreset}`);

    showToast('Datos de demostración restablecidos a su estado original', 'success');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}mode`, String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}config_${activePreset}`, JSON.stringify(config));
  }, [config, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}layout_${activePreset}`, JSON.stringify(layout));
  }, [layout, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}categories_${activePreset}`, JSON.stringify(categories));
  }, [categories, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}products_${activePreset}`, JSON.stringify(products));
  }, [products, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}orders_${activePreset}`, JSON.stringify(orders));
  }, [orders, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}customers_${activePreset}`, JSON.stringify(customers));
  }, [customers, activePreset]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}movements_${activePreset}`, JSON.stringify(inventoryMovements));
  }, [inventoryMovements, activePreset]);

  // Role switching
  const switchUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Rol cambiado a: ${role === 'admin' ? 'Administrador' : 'Empleado / Cajero'}`, 'info');
    }
  };

  // Config & Layout
  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Ajustes de tienda guardados', 'success');
  };

  const updateLayout = (newLayout: Partial<WebsiteLayoutConfig>) => {
    setLayout((prev) => ({ ...prev, ...newLayout }));
  };

  const saveAndPublishAppearance = (newLayout: WebsiteLayoutConfig) => {
    setLayout(newLayout);
    showToast('Apariencia del sitio web publicada con éxito', 'success');
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProd: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setProducts((prev) => [newProd, ...prev]);

    // Initial inventory movement if initial stock > 0
    if (newProd.stock > 0) {
      const movement: InventoryMovement = {
        id: `mov-${Date.now()}`,
        productId: id,
        productName: newProd.name,
        type: 'IN',
        quantity: newProd.stock,
        previousStock: 0,
        newStock: newProd.stock,
        reason: 'Creación de producto e inventario inicial',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: currentUser.name
      };
      setInventoryMovements((prev) => [movement, ...prev]);
    }

    showToast(`Producto "${newProd.name}" creado exitosamente`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // If stock changed manually via product edit form
          if (typeof updates.stock === 'number' && updates.stock !== p.stock) {
            const diff = updates.stock - p.stock;
            const movement: InventoryMovement = {
              id: `mov-${Date.now()}`,
              productId: id,
              productName: updates.name || p.name,
              type: diff > 0 ? 'IN' : 'ADJUST',
              quantity: diff,
              previousStock: p.stock,
              newStock: updates.stock,
              reason: 'Ajuste manual desde edición de producto',
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              user: currentUser.name
            };
            setInventoryMovements((m) => [movement, ...m]);
          }
          return { ...p, ...updates, updatedAt: now };
        }
        return p;
      })
    );
    showToast('Producto actualizado correctamente', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Producto "${prod?.name || ''}" eliminado`, 'info');
  };

  const togglePublishProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isPublished;
          showToast(`Producto ${nextState ? 'publicado' : 'despublicado'}`, 'info');
          return { ...p, isPublished: nextState };
        }
        return p;
      })
    );
  };

  const toggleFeaturedProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      ...categoryData,
      id
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoría "${newCat.name}" agregada`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Categoría actualizada', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Categoría eliminada', 'info');
  };

  const reorderCategory = (id: string, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((cat, i) => ({ ...cat, order: i + 1 }));
    });
  };

  // Inventory adjustment
  const adjustInventory = (
    productId: string,
    quantityDelta: number,
    type: InventoryMovementType,
    reason: string
  ): boolean => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return false;

    const previousStock = prod.stock;
    const newStock = Math.max(0, previousStock + quantityDelta);

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      type,
      quantity: quantityDelta,
      previousStock,
      newStock,
      reason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: currentUser.name
    };

    setInventoryMovements((prev) => [movement, ...prev]);
    showToast(`Inventario de "${prod.name}" actualizado (${newStock} unidades)`, 'success');
    return true;
  };

  // Orders
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const now = new Date().toISOString();
    const event = {
      status: newStatus,
      timestamp: now,
      note: note || `Estado cambiado a ${newStatus}`,
      user: currentUser.name
    };

    // If order is transitioning to 'Confirmado' for the first time, discount inventory safely
    if (newStatus === 'Confirmado' && order.status !== 'Confirmado' && !order.timeline.some((t) => t.status === 'Confirmado')) {
      order.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          const deduction = Math.min(prod.stock, item.quantity);
          const newStock = Math.max(0, prod.stock - deduction);
          setProducts((prev) =>
            prev.map((p) => (p.id === item.productId ? { ...p, stock: newStock } : p))
          );
          const movement: InventoryMovement = {
            id: `mov-${Date.now()}-${item.productId}`,
            productId: item.productId,
            productName: item.productName,
            type: 'SALE',
            quantity: -deduction,
            previousStock: prod.stock,
            newStock,
            reason: `Venta confirmada en pedido #${order.orderNumber}`,
            date: now.replace('T', ' ').substring(0, 16),
            user: 'Sistema Automático'
          };
          setInventoryMovements((m) => [movement, ...m]);
        }
      });
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              updatedAt: now,
              timeline: [...o.timeline, event]
            }
          : o
      )
    );

    showToast(`Pedido #${order.orderNumber} actualizado a: ${newStatus}`, 'info');
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
    showToast(`Estado de pago actualizado a: ${paymentStatus}`, 'success');
  };

  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Order => {
    const id = `ord-${Date.now()}`;
    const orderNumber = `WEB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: orderData.status,
          timestamp: now,
          note: 'Pedido registrado en sistema',
          user: currentUser.name
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats
    const existingCust = customers.find(
      (c) => c.phone === newOrder.customer.phone || c.email === newOrder.customer.email
    );
    if (existingCust) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === existingCust.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.total,
                lastOrderDate: now.substring(0, 10)
              }
            : c
        )
      );
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: newOrder.customer.name,
        phone: newOrder.customer.phone,
        email: newOrder.customer.email,
        address: newOrder.customer.address,
        totalOrders: 1,
        totalSpent: newOrder.total,
        firstOrderDate: now.substring(0, 10),
        lastOrderDate: now.substring(0, 10),
        notes: newOrder.customer.notes
      };
      setCustomers((prev) => [newCust, ...prev]);
    }

    showToast(`Pedido #${newOrder.orderNumber} creado correctamente`, 'success');
    return newOrder;
  };

  const getOrderSummaryText = (order: Order): string => {
    const itemsList = order.items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.productName} - ${config.currencySymbol}${(i.price * i.quantity).toLocaleString()}`
      )
      .join('\n');

    return `🛍️ *PEDIDO #${order.orderNumber} - ${config.name}*
👤 *Cliente:* ${order.customer.name}
📱 *Teléfono:* ${order.customer.phone}
📍 *Entrega:* ${order.customer.address || 'Para recoger en tienda'}
${order.customer.notes ? `📝 *Nota:* ${order.customer.notes}\n` : ''}
🛒 *Productos:*
${itemsList}

💰 *Subtotal:* ${config.currencySymbol}${order.subtotal.toLocaleString()}
🛵 *Envío:* ${config.currencySymbol}${order.deliveryFee.toLocaleString()}
🏷️ *TOTAL:* ${config.currencySymbol}${order.total.toLocaleString()} ${config.currency}
💳 *Método de Pago:* ${order.paymentMethod} (${order.paymentStatus})
📌 *Estado:* ${order.status}`;
  };

  const getWhatsAppOrderUrl = (order: Order): string => {
    const rawPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const summary = getOrderSummaryText(order);
    return `https://wa.me/${rawPhone || config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(summary)}`;
  };

  // Customers
  const addCustomer = (
    custData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'firstOrderDate' | 'lastOrderDate'>
  ) => {
    const id = `cust-${Date.now()}`;
    const today = new Date().toISOString().substring(0, 10);
    const newCust: Customer = {
      ...custData,
      id,
      totalOrders: 0,
      totalSpent: 0,
      firstOrderDate: today,
      lastOrderDate: today
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Cliente "${newCust.name}" registrado`, 'success');
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Datos de cliente actualizados', 'success');
  };

  // Users
  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const id = `usr-${Date.now()}`;
    const newUser: UserAccount = {
      ...userData,
      id,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Usuario "${newUser.name}" agregado`, 'success');
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    showToast('Usuario actualizado', 'success');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Usuario eliminado', 'info');
  };

  // Authentication logic
  const login = (email: string, password: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Required password: 123456789
    if (trimmedPass !== '123456789') {
      showToast('Contraseña incorrecta. Verifica tus datos de acceso.', 'error');
      return false;
    }

    if (!trimmedEmail) {
      showToast('Ingresa un correo para continuar', 'error');
      return false;
    }

    // Success: authorize session
    setIsAuthenticated(true);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, 'true');

    if (trimmedEmail.includes('cajero') || trimmedEmail.includes('empleado')) {
      switchUserRole('employee');
    } else {
      switchUserRole('admin');
    }

    showToast('Acceso concedido. Bienvenido a Webora Admin.', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth`);
    showToast('Sesión de administración cerrada', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isDemoMode,
        setIsDemoMode,
        activePreset,
        switchPreset,
        resetDemoData,
        currentUser,
        switchUserRole,
        config,
        updateConfig,
        layout,
        updateLayout,
        saveAndPublishAppearance,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublishProduct,
        toggleFeaturedProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        inventoryMovements,
        adjustInventory,
        orders,
        updateOrderStatus,
        updateOrderPaymentStatus,
        createOrder,
        getOrderSummaryText,
        getWhatsAppOrderUrl,
        customers,
        addCustomer,
        updateCustomer,
        users,
        addUser,
        updateUser,
        deleteUser,
        toasts,
        showToast,
        removeToast,
        currentSection,
        setCurrentSection,
        isPublicSiteOpen,
        setIsPublicSiteOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
