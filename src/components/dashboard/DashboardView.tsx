import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Layers,
  CheckCircle2,
  Boxes,
  FileText
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    config,
    orders,
    products,
    inventoryMovements,
    setCurrentSection,
    setIsPublicSiteOpen,
    activePreset,
    switchPreset
  } = useStore();

  const [chartRange, setChartRange] = useState<'7d' | '30d' | '12m'>('7d');

  // KPI calculations
  const todayStr = '2026-03-12';
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todaySalesCount = todayOrders.length;
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === 'Pagado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const monthOrders = orders.filter((o) => o.createdAt.includes('2026-03'));
  const monthSalesCount = monthOrders.length;
  const monthRevenue = monthOrders
    .filter((o) => o.paymentStatus === 'Pagado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrders = orders.filter((o) =>
    ['Nuevo', 'Pendiente de confirmación', 'Confirmado', 'En preparación'].includes(o.status)
  );

  const publishedProducts = products.filter((p) => p.isPublished);
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Sales Chart Data Mocking based on real orders + realistic curve for the range
  const chartDataSets = {
    '7d': [
      { label: 'Vie 06', sales: 2400, orders: 4 },
      { label: 'Sáb 07', sales: 4800, orders: 8 },
      { label: 'Dom 08', sales: 5200, orders: 9 },
      { label: 'Lun 09', sales: 1900, orders: 3 },
      { label: 'Mar 10', sales: 3100, orders: 5 },
      { label: 'Mié 11', sales: 4200, orders: 7 },
      { label: 'Hoy 12', sales: todayRevenue > 0 ? todayRevenue : 3800, orders: todaySalesCount > 0 ? todaySalesCount : 6 }
    ],
    '30d': [
      { label: 'Sem 1', sales: 18400, orders: 32 },
      { label: 'Sem 2', sales: 24600, orders: 45 },
      { label: 'Sem 3', sales: 29800, orders: 54 },
      { label: 'Sem 4', sales: 21900, orders: 41 }
    ],
    '12m': [
      { label: 'Ene', sales: 64000, orders: 120 },
      { label: 'Feb', sales: 78000, orders: 145 },
      { label: 'Mar', sales: 94000, orders: 180 },
      { label: 'Abr', sales: 88000, orders: 160 },
      { label: 'May', sales: 102000, orders: 195 },
      { label: 'Jun', sales: 115000, orders: 210 }
    ]
  };

  const activeChartData = chartDataSets[chartRange];
  const maxSales = Math.max(...activeChartData.map((d) => d.sales)) * 1.15;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome banner required by prompt */}
      <div className="bg-white border border-neutral-200/90 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Plataforma SaaS Webora v2.8</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Bienvenido al centro de administración
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Controla tu negocio desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentSection('products')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo producto
            </button>
            <button
              onClick={() => setIsPublicSiteOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Previsualizar tienda
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Indicator Cards (Ventas de hoy, Ventas del mes, Pedidos pendientes, Productos publicados, Poco inventario, Ingresos del mes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Ventas de hoy */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ventas de hoy</span>
            <span className="p-1.5 rounded-md bg-neutral-100 text-neutral-600">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              {todaySalesCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{config.currencySymbol}{todayRevenue.toLocaleString()} pagados</span>
            </div>
          </div>
        </div>

        {/* 2. Ventas del mes */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ventas del mes</span>
            <span className="p-1.5 rounded-md bg-neutral-100 text-neutral-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              {monthSalesCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-1">
              <span>+18.4% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* 3. Pedidos pendientes */}
        <div
          onClick={() => setCurrentSection('orders')}
          className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-indigo-300 transition-colors group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium group-hover:text-indigo-600 transition-colors">
              Pedidos pendientes
            </span>
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600 tabular-nums">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Requieren atención
            </div>
          </div>
        </div>

        {/* 4. Productos publicados */}
        <div
          onClick={() => setCurrentSection('products')}
          className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-neutral-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Productos publicados</span>
            <span className="p-1.5 rounded-md bg-neutral-100 text-neutral-600">
              <Package className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              {publishedProducts.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              De {products.length} productos totales
            </div>
          </div>
        </div>

        {/* 5. Poco inventario */}
        <div
          onClick={() => setCurrentSection('inventory')}
          className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Stock bajo / Alerta</span>
            <span className={`p-1.5 rounded-md ${lowStockProducts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold tabular-nums ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
              {lowStockProducts.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Necesitan reabastecimiento
            </div>
          </div>
        </div>

        {/* 6. Ingresos del mes */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ingresos del mes</span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">
              {config.currencySymbol}{monthRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Confirmados y pagados
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Chart + Quick Demo Selector & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart with 7d / 30d / 12m filters */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Evolución de Ventas e Ingresos
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Datos actualizados automáticamente en tiempo real
              </p>
            </div>

            {/* Segmented filter controls */}
            <div className="inline-flex p-1 bg-neutral-100 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setChartRange('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  chartRange === '7d'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Últimos 7 días
              </button>
              <button
                onClick={() => setChartRange('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  chartRange === '30d'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                30 días
              </button>
              <button
                onClick={() => setChartRange('12m')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  chartRange === '12m'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                12 meses
              </button>
            </div>
          </div>

          {/* Chart Graphic (Interactive SVG Bar/Area Visualization) */}
          <div className="space-y-4">
            <div className="h-56 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-neutral-100">
              {activeChartData.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.sales / maxSales) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                      {config.currencySymbol}{item.sales.toLocaleString()} · {item.orders} pedidos
                    </div>

                    <div className="w-full max-w-[42px] bg-neutral-100 rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full transition-all duration-500 rounded-t-md ${
                          idx === activeChartData.length - 1
                            ? 'bg-indigo-600'
                            : 'bg-neutral-800 hover:bg-neutral-700'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 truncate max-w-[50px]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-neutral-800" />
                  <span>Histórico</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                  <span>Periodo actual</span>
                </div>
              </div>
              <span className="tabular-nums font-medium text-neutral-700">
                Total periodo: {config.currencySymbol}
                {activeChartData.reduce((acc, d) => acc + d.sales, 0).toLocaleString()} {config.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Archetype Switcher & Sales Pitch Helper */}
        <div className="bg-neutral-900 text-white rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                Demostración Comercial
              </span>
              <span className="text-xs text-neutral-400">Webora B2B</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">
              Adapta la Demo al Cliente
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Cambia instantáneamente la tienda para mostrarle al potencial cliente cómo se vería su rubro específico en acción:
            </p>

            <div className="space-y-2">
              {[
                { id: 'bistro', label: 'Bistró & Restaurante', desc: 'Menú digital, comanda a cocina, pedidos en mesa' },
                { id: 'fashion', label: 'Tienda de Ropa & Moda', desc: 'Tallas, colores, stock por variante, catálogo' },
                { id: 'cafe', label: 'Cafetería & Panadería', desc: 'Opciones de leche, tostado, pedidos para llevar' },
                { id: 'barber', label: 'Barbería & Cuidado', desc: 'Agenda de servicios, productos de grooming' }
              ].map((archetype) => (
                <button
                  key={archetype.id}
                  onClick={() => switchPreset(archetype.id as any)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    activePreset === archetype.id
                      ? 'bg-neutral-800 border-indigo-500 text-white'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>{archetype.label}</span>
                    {activePreset === archetype.id && (
                      <span className="text-[10px] text-indigo-400 font-normal">Activo ✓</span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {archetype.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400">¿Listo para presentar?</span>
            <button
              onClick={() => setIsPublicSiteOpen(true)}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 group"
            >
              Abrir vista cliente <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section (pedidos recibidos, productos modificados, cambios en inventario) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/90 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Pedidos Recientes
              </h3>
              <p className="text-xs text-neutral-500">
                Últimos pedidos generados por clientes
              </p>
            </div>
            <button
              onClick={() => setCurrentSection('orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Ver todos ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-y border-neutral-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Pedido</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Total</th>
                  <th className="py-2.5 px-3 font-semibold">Pago</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-neutral-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-neutral-900">{order.customer.name}</div>
                      <div className="text-[11px] text-neutral-500">{order.items.length} productos</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-neutral-900">
                      {config.currencySymbol}{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${
                        order.paymentStatus === 'Pagado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {order.paymentStatus} · {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${
                        order.status === 'Entregado'
                          ? 'bg-neutral-100 text-neutral-700'
                          : order.status === 'En preparación'
                          ? 'bg-blue-50 text-blue-700'
                          : order.status === 'Pendiente de confirmación'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setCurrentSection('orders')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Activity Feed */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Actividad de Inventario
                </h3>
                <p className="text-xs text-neutral-500">
                  Movimientos y auditoría de existencias
                </p>
              </div>
              <button
                onClick={() => setCurrentSection('inventory')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Ver inventario
              </button>
            </div>

            <div className="space-y-3">
              {inventoryMovements.slice(0, 4).map((mov) => (
                <div
                  key={mov.id}
                  className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-neutral-900 truncate max-w-[170px]">
                      {mov.productName}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        mov.quantity > 0 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
                    {mov.reason}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                    <span>{mov.user}</span>
                    <span>{mov.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Control estricto de inventario</span>
            <span className="text-emerald-600 font-medium">Sin descuadres</span>
          </div>
        </div>
      </div>
    </div>
  );
};
