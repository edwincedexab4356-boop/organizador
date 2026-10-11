import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Copy,
  ChevronRight,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  X,
  Truck,
  Plus,
  Send,
  Eye
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    products,
    config,
    updateOrderStatus,
    updateOrderPaymentStatus,
    getOrderSummaryText,
    getWhatsAppOrderUrl,
    createOrder,
    showToast
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New Order Form state
  const [newOrderCustomer, setNewOrderCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [newOrderItems, setNewOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 }
  ]);
  const [newOrderPaymentMethod, setNewOrderPaymentMethod] = useState<'Efectivo' | 'Transferencia SPEI' | 'Tarjeta' | 'WhatsApp Pay'>('Efectivo');

  const allStatuses: OrderStatus[] = [
    'Nuevo',
    'Pendiente de confirmación',
    'Confirmado',
    'En preparación',
    'Listo para entregar',
    'Enviado',
    'Entregado',
    'Cancelado'
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopySummary = (order: Order) => {
    const text = getOrderSummaryText(order);
    navigator.clipboard.writeText(text);
    showToast('Resumen del pedido copiado al portapapeles', 'success');
  };

  const handleOpenWhatsApp = (order: Order) => {
    const url = getWhatsAppOrderUrl(order);
    window.open(url, '_blank');
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderCustomer.name || !newOrderCustomer.phone) {
      showToast('Por favor ingresa nombre y teléfono del cliente', 'error');
      return;
    }

    const items = newOrderItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod?.name || 'Producto',
        price: prod?.price || 100,
        quantity: item.quantity
      };
    });

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const deliveryFee = newOrderCustomer.address ? 45 : 0;
    const total = subtotal + deliveryFee;

    const created = createOrder({
      customer: newOrderCustomer,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: newOrderPaymentMethod,
      paymentStatus: 'Pendiente',
      status: 'Nuevo'
    });

    setIsNewOrderModalOpen(false);
    setSelectedOrder(created);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Gestión y Seguimiento de Pedidos
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Control de comandas, estados de entrega y confirmación por WhatsApp en un solo clic.
          </p>
        </div>

        <button
          onClick={() => {
            setNewOrderCustomer({ name: '', phone: '+52 ', email: '', address: '', notes: '' });
            setNewOrderItems([{ productId: products[0]?.id || '', quantity: 1 }]);
            setIsNewOrderModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar pedido manual</span>
        </button>
      </div>

      {/* Status Tabs and Search */}
      <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por # pedido, nombre de cliente o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </div>
        </div>

        {/* Scrollable Status pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Todos ({orders.length})
          </button>
          {allStatuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Pedido / Fecha</th>
                <th className="py-3 px-4 font-semibold">Cliente</th>
                <th className="py-3 px-4 font-semibold">Productos</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Pago</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50/70 transition-colors group cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-neutral-900">
                      #{order.orderNumber}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {order.createdAt.substring(0, 16).replace('T', ' ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-900">
                      {order.customer.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {order.customer.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-neutral-800 line-clamp-1 max-w-xs">
                      {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {order.customer.address ? 'Envío a domicilio' : 'Para recoger / En mesa'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-neutral-900 text-sm">
                      {config.currencySymbol}{order.total.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          order.paymentStatus === 'Pagado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded ${
                        order.status === 'Entregado'
                          ? 'bg-neutral-100 text-neutral-700'
                          : order.status === 'En preparación'
                          ? 'bg-blue-50 text-blue-700'
                          : order.status === 'Listo para entregar'
                          ? 'bg-purple-50 text-purple-700'
                          : order.status === 'Confirmado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'Cancelado'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCopySummary(order)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                        title="Copiar resumen del pedido"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenWhatsApp(order)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        title="Abrir chat en WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md"
                        title="Ver detalles"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    Detalle del Pedido #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedOrder.status === 'Entregado'
                        ? 'bg-neutral-100 text-neutral-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Registrado el {selectedOrder.createdAt.replace('T', ' ').substring(0, 16)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Change Status Control Stepper */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Cambiar estado del pedido:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {allStatuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg text-center transition-all ${
                        selectedOrder.status === st
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">
                    Datos del Cliente
                  </div>
                  <div className="font-semibold text-neutral-900 text-sm">
                    {selectedOrder.customer.name}
                  </div>
                  <div className="text-xs text-neutral-600 font-mono">
                    {selectedOrder.customer.phone}
                  </div>
                  {selectedOrder.customer.email && (
                    <div className="text-xs text-neutral-500">
                      {selectedOrder.customer.email}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">
                    Entrega y Notas
                  </div>
                  <div className="text-xs text-neutral-800 font-medium">
                    {selectedOrder.customer.address || 'Recoger en establecimiento / Consumo local'}
                  </div>
                  {selectedOrder.customer.notes && (
                    <div className="text-xs text-amber-700 bg-amber-50 p-1.5 rounded mt-1">
                      Nota: {selectedOrder.customer.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items List */}
              <div>
                <div className="text-xs font-bold text-neutral-700 mb-2">
                  Productos Ordenados ({selectedOrder.items.length})
                </div>
                <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 w-5">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-neutral-800">
                          {item.productName}
                        </span>
                      </div>
                      <div className="font-mono font-semibold text-neutral-900">
                        {config.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-neutral-50 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>Subtotal</span>
                      <span className="font-mono">{config.currencySymbol}{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Costo de envío</span>
                      <span className="font-mono">{config.currencySymbol}{selectedOrder.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-neutral-200">
                      <span>Total</span>
                      <span className="font-mono">{config.currencySymbol}{selectedOrder.total.toLocaleString()} {config.currency}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status controls */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <span className="text-xs font-semibold text-neutral-800">Estado de Cobro:</span>
                  <div className="text-xs text-neutral-500">
                    Método: {selectedOrder.paymentMethod}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateOrderPaymentStatus(selectedOrder.id, 'Pagado');
                      setSelectedOrder({ ...selectedOrder, paymentStatus: 'Pagado' });
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      selectedOrder.paymentStatus === 'Pagado'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border text-neutral-700'
                    }`}
                  >
                    Marcar Pagado ✓
                  </button>
                  <button
                    onClick={() => {
                      updateOrderPaymentStatus(selectedOrder.id, 'Pendiente');
                      setSelectedOrder({ ...selectedOrder, paymentStatus: 'Pendiente' });
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      selectedOrder.paymentStatus === 'Pendiente'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border text-neutral-700'
                    }`}
                  >
                    Pendiente
                  </button>
                </div>
              </div>

              {/* Timeline History */}
              <div>
                <div className="text-xs font-bold text-neutral-700 mb-2">
                  Historial de Estado del Pedido
                </div>
                <div className="space-y-2 text-xs">
                  {selectedOrder.timeline.map((evt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-neutral-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-neutral-900">{evt.status}</span>
                        {evt.note && <span className="text-neutral-500"> — {evt.note}</span>}
                        <div className="text-[10px] text-neutral-400">
                          {evt.timestamp.replace('T', ' ').substring(0, 16)} · {evt.user || 'Sistema'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopySummary(selectedOrder)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar resumen de pedido
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenWhatsApp(selectedOrder)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp del cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                Registrar Pedido Manual
              </h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderCustomer.name}
                    onChange={(e) => setNewOrderCustomer({ ...newOrderCustomer, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teléfono celular *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderCustomer.phone}
                    onChange={(e) => setNewOrderCustomer({ ...newOrderCustomer, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dirección de entrega (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Dejar vacío si es para recoger o mesa"
                  value={newOrderCustomer.address}
                  onChange={(e) => setNewOrderCustomer({ ...newOrderCustomer, address: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Seleccionar Producto y Cantidad
                </label>
                {newOrderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const copy = [...newOrderItems];
                        copy[idx].productId = e.target.value;
                        setNewOrderItems(copy);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${p.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const copy = [...newOrderItems];
                        copy[idx].quantity = Math.max(1, Number(e.target.value));
                        setNewOrderItems(copy);
                      }}
                      className="w-16 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg text-center font-mono"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Método de Pago
                </label>
                <select
                  value={newOrderPaymentMethod}
                  onChange={(e) => setNewOrderPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg"
                >
                  <option value="Efectivo">Efectivo contra entrega</option>
                  <option value="Transferencia SPEI">Transferencia Bancaria / SPEI</option>
                  <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                  <option value="WhatsApp Pay">WhatsApp Pay / Enlace de pago</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
