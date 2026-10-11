import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  BadgeDollarSign,
  Palette,
  Eye,
  BarChart3,
  ShieldCheck,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronRight,
  Store,
  RefreshCw,
  X
} from 'lucide-react';
import { DemoArchetype } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    currentSection,
    setCurrentSection,
    isDemoMode,
    setIsDemoMode,
    activePreset,
    switchPreset,
    resetDemoData,
    orders,
    products,
    currentUser,
    switchUserRole,
    setIsPublicSiteOpen,
    config,
    logout
  } = useStore();

  const pendingOrdersCount = orders.filter((o) =>
    ['Nuevo', 'Pendiente de confirmación', 'Confirmado', 'En preparación'].includes(o.status)
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categorías', icon: Layers },
    { id: 'inventory', label: 'Inventario', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} bajo` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold' },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'sales', label: 'Ventas', icon: BadgeDollarSign },
    { id: 'customization', label: 'Personalización de la tienda', icon: Palette },
    { id: 'appearance', label: 'Apariencia del sitio web', icon: Eye },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'users', label: 'Usuarios y permisos', icon: ShieldCheck },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleSelectSection = (id: string) => {
    setCurrentSection(id);
    onCloseMobile();
  };

  const handleOpenPublicSite = () => {
    setIsPublicSiteOpen(true);
    onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-neutral-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-base tracking-tight">Webora</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Admin</span>
              </div>
              <p className="text-[11px] text-neutral-500 truncate max-w-[140px] font-medium leading-none">
                {config.name}
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 lg:hidden rounded-md hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode switcher bar (discreet & high utility for sales reps) */}
        <div className="px-3.5 py-3 bg-neutral-50/70 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-neutral-600 tracking-wide">
                MODO DEMOSTRACIÓN
              </span>
            </div>
            <button
              onClick={resetDemoData}
              title="Restaurar datos demo originales"
              className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 hover:text-indigo-600 hover:bg-white px-1.5 py-0.5 rounded border border-neutral-200 transition-colors"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Restaurar
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-neutral-200">
            <Store className="w-3.5 h-3.5 text-neutral-400 ml-1 shrink-0" />
            <select
              value={activePreset}
              onChange={(e) => switchPreset(e.target.value as DemoArchetype)}
              className="w-full text-xs font-medium text-neutral-800 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer py-0.5"
            >
              <option value="bistro">🍕 Menú Bistró & Parrilla</option>
              <option value="fashion">👗 Catálogo Ropa & Moda</option>
              <option value="cafe">☕ Cafetería & Panadería</option>
              <option value="barber">💈 Barbería & Cuidado</option>
            </select>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <div className="px-2 pb-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Menú Principal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-neutral-800 text-white'
                        : item.badgeColor || 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-2 pb-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Acceso Rápido
          </div>

          {/* Section 13: Ver sitio publicado */}
          <button
            onClick={handleOpenPublicSite}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-100 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ExternalLink className="w-4 h-4 shrink-0 text-indigo-600" />
              <span className="font-semibold truncate">13. Ver sitio publicado</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Section 14: Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-red-700 hover:bg-red-50/80 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LogOut className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-red-600 transition-colors" />
              <span className="truncate">14. Cerrar sesión</span>
            </div>
            <span className="text-[10px] text-neutral-400 group-hover:text-red-600">Salir</span>
          </button>
        </nav>

        {/* User profile footer */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-neutral-500 capitalize">
                  {currentUser.role === 'admin' ? 'Administrador' : 'Empleado'}
                </p>
              </div>
            </div>

            <button
              onClick={() => switchUserRole(currentUser.role === 'admin' ? 'employee' : 'admin')}
              title="Alternar rol para demostración de permisos"
              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors whitespace-nowrap"
            >
              {currentUser.role === 'admin' ? 'Ver como Cajero' : 'Ver como Admin'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
