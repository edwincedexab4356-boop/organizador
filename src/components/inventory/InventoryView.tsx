import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  History,
  Plus,
  Minus,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  X,
  PackageX
} from 'lucide-react';
import { InventoryMovementType } from '../../types';

export const InventoryView: React.FC = () => {
  const {
    products,
    categories,
    inventoryMovements,
    adjustInventory,
    config,
    currentUser,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out_of_stock'>('all');

  // Manual Adjustment Modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('IN');
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('Recepción de pedido de proveedor');

  // Stats
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const inventoryValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= p.minStockAlert) ||
      (stockFilter === 'out_of_stock' && p.stock === 0);
    return matchesSearch && matchesFilter;
  });

  const handleQuickAdjust = (productId: string, delta: number) => {
    const type: InventoryMovementType = delta > 0 ? 'IN' : 'OUT';
    const reason = delta > 0 ? 'Entrada rápida de inventario (+1)' : 'Salida rápida de inventario (-1)';
    adjustInventory(productId, delta, type, reason);
  };

  const handleOpenAdjustModalForProduct = (productId: string) => {
    setSelectedProductId(productId);
    setAdjustQty(5);
    setAdjustType('IN');
    setAdjustReason('Recepción de pedido de proveedor');
    setIsAdjustModalOpen(true);
  };

  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || adjustQty <= 0) return;

    const delta = adjustType === 'IN' ? adjustQty : -adjustQty;
    const success = adjustInventory(selectedProductId, delta, adjustType, adjustReason);
    if (success) {
      setIsAdjustModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Control y Gestión de Inventario
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitorea existencias, audita movimientos y ajusta entradas y salidas de mercancía.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedProductId(products[0]?.id || '');
              setIsAdjustModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Ajustar existencias</span>
          </button>
        </div>
      </div>

      {/* 4 Inventory Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Unidades en Stock</span>
            <span className="p-1.5 rounded-md bg-neutral-100 text-neutral-600">
              <Boxes className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {totalStockUnits}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Distribuidos en {products.length} productos
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Valor del Inventario</span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {config.currencySymbol}{inventoryValuation.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            A precio de venta catálogo
          </div>
        </div>

        <div
          onClick={() => {
            setActiveTab('stock');
            setStockFilter('low');
          }}
          className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Stock Bajo</span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${lowStockCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
            {lowStockCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Bajo umbral de alerta
          </div>
        </div>

        <div
          onClick={() => {
            setActiveTab('stock');
            setStockFilter('out_of_stock');
          }}
          className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs cursor-pointer hover:border-red-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Productos Agotados</span>
            <span className="p-1.5 rounded-md bg-red-50 text-red-700">
              <PackageX className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${outOfStockCount > 0 ? 'text-red-600' : 'text-neutral-900'}`}>
            {outOfStockCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Existencias en cero (0)
          </div>
        </div>
      </div>

      {/* Main Tabs: Existencias actuales vs Historial de movimientos */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Tab */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'stock'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Existencias por Producto
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'movements'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial de Movimientos ({inventoryMovements.length})</span>
            </button>
          </div>

          {activeTab === 'stock' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar producto o SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">Todos los niveles</option>
                <option value="low">Stock bajo</option>
                <option value="out_of_stock">Agotados</option>
              </select>
            </div>
          )}
        </div>

        {activeTab === 'stock' ? (
          /* Table of Stock Levels */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Producto</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold text-center">Nivel de Stock</th>
                  <th className="py-3 px-4 font-semibold text-center">Ajuste Rápido</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId);
                  const isLow = product.stock <= product.minStockAlert && product.stock > 0;
                  const isOut = product.stock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-md object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-neutral-900 truncate max-w-xs">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              Alerta mínima: {product.minStockAlert} un.
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {product.sku}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {cat?.name || 'General'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            isOut
                              ? 'bg-red-100 text-red-700'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-900'
                          }`}
                        >
                          {product.stock} un.
                          {isOut && <span className="font-normal text-[10px]">(Agotado)</span>}
                          {isLow && <span className="font-normal text-[10px]">(Bajo)</span>}
                        </span>
                      </td>

                      {/* Quick + / - adjustment buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-neutral-100 p-0.5 rounded-md border border-neutral-200">
                          <button
                            onClick={() => handleQuickAdjust(product.id, -1)}
                            disabled={product.stock <= 0}
                            className="p-1 hover:bg-white text-neutral-600 hover:text-neutral-900 rounded disabled:opacity-30 transition-colors"
                            title="Descontar 1 unidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono px-1.5 text-neutral-800 text-[11px] font-semibold">
                            ±1
                          </span>
                          <button
                            onClick={() => handleQuickAdjust(product.id, 1)}
                            className="p-1 hover:bg-white text-neutral-600 hover:text-neutral-900 rounded transition-colors"
                            title="Añadir 1 unidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjustModalForProduct(product.id)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Ajustar con motivo
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Movement History Audit Log */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Fecha y Hora</th>
                  <th className="py-3 px-4 font-semibold">Producto</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold text-center">Cantidad</th>
                  <th className="py-3 px-4 font-semibold text-center">Antes → Ahora</th>
                  <th className="py-3 px-4 font-semibold">Motivo / Justificación</th>
                  <th className="py-3 px-4 font-semibold text-right">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {inventoryMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-neutral-500 whitespace-nowrap">
                      {mov.date}
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {mov.productName}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          mov.type === 'IN'
                            ? 'bg-emerald-50 text-emerald-700'
                            : mov.type === 'SALE'
                            ? 'bg-blue-50 text-blue-700'
                            : mov.type === 'OUT'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {mov.type === 'IN' && 'ENTRADA'}
                        {mov.type === 'SALE' && 'VENTA CONFIRMADA'}
                        {mov.type === 'OUT' && 'SALIDA'}
                        {mov.type === 'ADJUST' && 'AJUSTE'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span
                        className={
                          mov.quantity > 0 ? 'text-emerald-600' : 'text-neutral-900'
                        }
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} un.
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-neutral-500">
                      {mov.previousStock} →{' '}
                      <span className="font-semibold text-neutral-900">{mov.newStock}</span>
                    </td>

                    <td className="py-3 px-4 text-neutral-700 max-w-xs truncate">
                      {mov.reason}
                    </td>

                    <td className="py-3 px-4 text-right text-neutral-500 font-medium">
                      {mov.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                Ajuste Manual de Inventario
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Seleccionar Producto *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actual: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tipo de Movimiento
                  </label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as InventoryMovementType)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  >
                    <option value="IN">Entrada (+) Reabastecimiento</option>
                    <option value="OUT">Salida (-) Merma / Daño</option>
                    <option value="ADJUST">Ajuste por conteo físico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Cantidad de Unidades
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Motivo o Justificación Obligatoria *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ej. Ingreso de factura proveedor #9941 o merma de cocina"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">Auditoría:</span> Esta operación quedará registrada a nombre de <span className="font-semibold text-neutral-900">{currentUser.name}</span> para control interno.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Aplicar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
