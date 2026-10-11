import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Package,
  ShoppingBag,
  DollarSign,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { orders, products, categories, config, showToast } = useStore();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '12m'>('30d');

  // Top products calculations
  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, units: 0, revenue: 0 };
      }
      productSalesMap[item.productId].units += item.quantity;
      productSalesMap[item.productId].revenue += item.quantity * item.price;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
  const maxProductRevenue = topProducts[0]?.revenue || 1;

  // Category sales breakdown
  const categoryStats = categories.map((cat) => {
    const prodsInCat = products.filter((p) => p.categoryId === cat.id).map((p) => p.id);
    let catRevenue = 0;
    let catUnits = 0;
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (prodsInCat.includes(item.productId)) {
          catRevenue += item.quantity * item.price;
          catUnits += item.quantity;
        }
      });
    });
    return {
      name: cat.name,
      revenue: catRevenue,
      units: catUnits
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Orders by Status
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const csvRows = [
      ['Numero de Pedido', 'Cliente', 'Telefono', 'Fecha', 'Total', 'Metodo de Pago', 'Estado de Pago', 'Estado'],
      ...orders.map((o) => [
        `#${o.orderNumber}`,
        `"${o.customer.name}"`,
        `"${o.customer.phone}"`,
        o.createdAt.substring(0, 16),
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.status
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ventas_${config.slug}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Reporte CSV descargado con éxito', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Estadísticas y Reportes Analíticos
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Métricas de rendimiento, productos más vendidos y distribución de ingresos por categoría.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range filter */}
          <div className="inline-flex p-1 bg-white border border-neutral-200 rounded-lg shadow-xs">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                dateRange === '7d' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                dateRange === '30d' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              30 Días
            </button>
            <button
              onClick={() => setDateRange('12m')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                dateRange === '12m' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              12 Meses
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Top Sellers & Categories grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Productos Más Vendidos
              </h3>
              <p className="text-xs text-neutral-500">
                Por volumen de facturación acumulada
              </p>
            </div>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-3">
            {topProducts.slice(0, 5).map((prod, idx) => {
              const percent = Math.round((prod.revenue / maxProductRevenue) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 truncate max-w-[220px]">
                      {idx + 1}. {prod.name}
                    </span>
                    <span className="font-mono font-bold text-neutral-900">
                      {config.currencySymbol}{prod.revenue.toLocaleString()} ({prod.units} un.)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Ventas por Categoría
              </h3>
              <p className="text-xs text-neutral-500">
                Distribución de demanda por sección
              </p>
            </div>
            <Layers className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-900">{cat.name}</div>
                  <div className="text-[11px] text-neutral-500">{cat.units} unidades vendidas</div>
                </div>
                <div className="font-mono font-bold text-neutral-900 text-sm">
                  {config.currencySymbol}{cat.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders by Status & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status Progress */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 mb-3">
            Desglose de Pedidos por Estado
          </h3>
          <div className="space-y-2.5">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percent = Math.round((count / orders.length) * 100);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700">{status}</span>
                    <span className="font-mono text-neutral-500">
                      {count} pedidos ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-neutral-800 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Evolution & Health */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Rotación y Salud del Inventario
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Balance entre existencias disponibles y velocidad de agotamiento
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] text-neutral-500">Tasa de Ruptura de Stock</span>
                <div className="font-bold text-neutral-900 text-base mt-0.5">
                  {products.length > 0
                    ? Math.round((products.filter((p) => p.stock === 0).length / products.length) * 100)
                    : 0}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] text-neutral-500">Días promedio de inventario</span>
                <div className="font-bold text-neutral-900 text-base mt-0.5">
                  18.4 días
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900">
            <span className="font-bold">Recomendación comercial:</span> Reabastece los productos de la categoría estrella antes del fin de semana para maximizar el margen de venta.
          </div>
        </div>
      </div>
    </div>
  );
};
