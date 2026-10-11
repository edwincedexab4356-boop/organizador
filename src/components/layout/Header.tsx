import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Menu,
  ExternalLink,
  Search,
  Bell,
  Sparkles,
  Shield,
  UserCheck,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const {
    currentSection,
    config,
    currentUser,
    setIsPublicSiteOpen,
    orders,
    isDemoMode,
    activePreset,
    logout
  } = useStore();

  const sectionTitles: Record<string, string> = {
    dashboard: 'Dashboard Principal',
    products: 'Gestión de Productos',
    categories: 'Categorías del Catálogo',
    inventory: 'Control de Inventario',
    orders: 'Administración de Pedidos',
    customers: 'Directorio de Clientes',
    sales: 'Reporte Financiero de Ventas',
    customization: 'Personalización de la Tienda',
    appearance: 'Editor de Apariencia del Sitio Web',
    analytics: 'Estadísticas y Métricas',
    users: 'Usuarios y Control de Permisos',
    settings: 'Configuración General'
  };

  const currentTitle = sectionTitles[currentSection] || 'Panel de Control';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-neutral-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg lg:hidden hover:bg-neutral-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{config.name}</span>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-700 font-medium">{currentTitle}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Discreet DEMOSTRACION indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>DEMOSTRACIÓN</span>
          <span className="text-neutral-400 font-normal">·</span>
          <span className="text-neutral-500 capitalize">{activePreset}</span>
        </div>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 px-2 py-1 rounded border border-neutral-200">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-neutral-900 capitalize">
            {currentUser.role === 'admin' ? 'Admin' : 'Cajero'}
          </span>
        </div>

        {/* View live published site button */}
        <button
          onClick={() => setIsPublicSiteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver sitio publicado</span>
          <span className="sm:hidden">Ver sitio</span>
        </button>

        {/* Logout button */}
        <button
          onClick={logout}
          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
